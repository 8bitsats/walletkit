import { Coder } from "@project-serum/anchor";
import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash";
import React, { useMemo } from "react";
import tw from "twin.macro";

import { useIDL } from "../../../../../hooks/useIDLs";
import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { Badge } from "../../../../common/Badge";
import { Button } from "../../../../common/Button";
import { TableCardBody } from "../../../../common/card/TableCardBody";
import { Card } from "../../../../common/governance/Card";
import {
  AddressWithContext,
  programValidator,
} from "../../../../common/program/AddressWithContext";
import { HexData } from "../../../../common/program/HexData";

interface Props {
  ix: ProposalInstruction;
  index: number;
}

export const InstructionCard: React.FC<Props> = ({ ix, index }: Props) => {
  const [expanded, setExpanded] = React.useState(false);
  const programId = ix.programId;
  const label = useProgramLabel(programId);
  const { data: idl } = useIDL(programId);

  const parsedIX = useMemo(() => {
    if (!idl?.idl) {
      return null;
    }
    const coder = new Coder(idl.idl);
    const decoded = coder.instruction.decode(Buffer.from(ix.data));
    if (!decoded) {
      return null;
    }
    const parsed = coder.instruction.format(decoded, ix.keys);
    if (parsed) {
      return { decoded, parsed };
    }
    if (idl.idl.state) {
      const methodSoap = idl.idl.state.methods.find(
        (m) => m.name === decoded.name
      );
      const parsed = new Coder({
        ...idl.idl,
        instructions: methodSoap
          ? [
              {
                ...methodSoap,
                accounts: [
                  {
                    name: `Program State`,
                    isMut: true,
                    isSigner: false,
                  },
                  ...methodSoap.accounts,
                ],
              },
            ]
          : [],
      }).instruction.format(decoded, ix.keys);
      if (!parsed) {
        return null;
      }
      return { decoded, parsed };
    }
    return null;
  }, [idl?.idl, ix]);

  const ixLabel = parsedIX
    ? `${label}: ${startCase(parsedIX.decoded.name)}`
    : `${label} Instruction`;

  return (
    <Card
      titleStyles={tw`w-full flex items-center justify-between`}
      title={
        <>
          <h3 tw="mb-0 flex items-center gap-2">
            <Badge tw="bg-teal-700 text-teal-300 font-semibold text-sm h-auto px-2">
              #{index + 1}
            </Badge>
            {ixLabel}
          </h3>

          <Button
            variant="outline"
            className={`btn btn-sm d-flex ${
              expanded ? "btn-black active" : "btn-white"
            }`}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </>
      }
    >
      <div
        tw="whitespace-nowrap overflow-x-auto"
        id={`instruction-index-${index + 1}`}
        key={index}
      >
        {expanded && (
          <TableCardBody>
            <tr>
              <td>Program</td>
              <td tw="lg:text-right">
                {programId && (
                  <AddressWithContext
                    pubkey={programId}
                    validator={programValidator}
                  />
                )}
              </td>
            </tr>
            {ix.keys.map(
              ({ pubkey: accountId, isSigner, isWritable }, index) => {
                const parsedIXAccount = parsedIX?.parsed.accounts?.[index];
                const label = parsedIXAccount?.name ?? `Account #${index + 1}`;
                return (
                  <tr key={index}>
                    <td>
                      <div tw="flex items-start flex-col">
                        {label}
                        <div tw="mt-1 text-xs">
                          {isSigner && (
                            <Badge tw="bg-primary-700 text-primary-200">
                              Signer
                            </Badge>
                          )}
                          {isWritable && (
                            <Badge tw="bg-accent-500 bg-opacity-60 text-accent-200">
                              Writable
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {accountId && <AddressWithContext pubkey={accountId} />}
                    </td>
                  </tr>
                );
              }
            )}
            <tr>
              <td>
                Instruction Data{" "}
                {!parsedIX && <span tw="text-gray-500">(Hex)</span>}
              </td>
              <td>
                {parsedIX ? (
                  <Card tw="flex flex-col items-end">
                    <TableCardBody>
                      {parsedIX.parsed.args.length === 0 ? (
                        <div>No data</div>
                      ) : (
                        parsedIX.parsed.args.map(({ name, type, data }, i) => {
                          return (
                            <tr key={i}>
                              <td tw="pr-6">
                                {name} <span tw="text-gray-500">({type})</span>
                              </td>
                              <td>{data}</td>
                            </tr>
                          );
                        })
                      )}
                    </TableCardBody>
                  </Card>
                ) : (
                  <HexData raw={Buffer.from(ix.data)} />
                )}
              </td>
            </tr>
          </TableCardBody>
        )}
      </div>
    </Card>
  );
};
