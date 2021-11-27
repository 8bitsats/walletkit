import { useSail } from "@saberhq/sail";
import { Keypair, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useFormik } from "formik";
import { useMemo } from "react";
import { FaPlus, FaQuestionCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";
import * as Yup from "yup";

import { useSDK } from "../../../../contexts/sdk";
import { useKeypair } from "../../../../hooks/useKeypair";
import { handleException } from "../../../../utils/error";
import { notify } from "../../../../utils/notifications";
import { AsyncButton } from "../../../common/AsyncButton";
import { AttributeList } from "../../../common/AttributeList";
import { Button } from "../../../common/Button";
import { Module } from "../../../common/Module";
import { MouseoverTooltip } from "../../../common/MouseoverTooltip";

const CreateFormSchema = Yup.object().shape({
  owners: Yup.array().min(1, "Enter at least one owner"),
  threshold: Yup.number().min(1, "Must have at least one signer required"),
  maxOwners: Yup.number()
    .required()
    .test((v, valuesRaw): boolean | Yup.ValidationError => {
      const values = valuesRaw.parent as CreateFormValues;
      if (typeof v !== "number") {
        return new Yup.ValidationError("Invalid");
      }
      if (v < values.owners.length) {
        return new Yup.ValidationError(
          "Must have more max owners than the initial amount"
        );
      }
      return true;
    }),
  mintKP: Yup.string()
    .required("Required")
    .test("keypair", "Invalid keypair JSON", (str) => {
      if (!str) {
        return false;
      }
      try {
        Keypair.fromSecretKey(Uint8Array.from(JSON.parse(str)));
        return true;
      } catch (e) {
        return false;
      }
    }),
  delay: Yup.number().min(0, "Delay must be positive"),
});

interface CreateFormValues {
  owners: string[];
  nextOwner: string;
  threshold: number;
  maxOwners: number;
  baseKP: string;
  delay?: number;
}

export const MultisigCreateView: React.FC = () => {
  const { handleTX } = useSail();
  const { sdkMut } = useSDK();
  const initialBaseKP = useMemo(
    () => JSON.stringify([...Keypair.generate().secretKey]),
    []
  );
  const history = useHistory();
  const formik = useFormik<CreateFormValues>({
    initialValues: {
      owners: [],
      nextOwner: "",
      threshold: 1,
      maxOwners: 10,
      baseKP: initialBaseKP,
    },
    validationSchema: CreateFormSchema,
    onSubmit: async (values) => {
      try {
        invariant(sdkMut, "sdk");
        const baseKP = Keypair.fromSecretKey(
          Uint8Array.from(JSON.parse(values.baseKP))
        );
        const { tx, smartWalletWrapper } = await sdkMut.newSmartWallet({
          owners: values.owners.map((owner) => new PublicKey(owner)),
          threshold: new BN(values.threshold),
          numOwners: values.maxOwners,
          base: baseKP,
          delay: values.delay ? new BN(values.delay) : undefined,
        });
        const { pending, success } = await handleTX(tx, "Create Multisig");
        if (!success || !pending) {
          return;
        }
        await pending.wait({ commitment: "confirmed" });

        notify({
          message: `Wallet created successfully`,
          description: smartWalletWrapper.key.toString(),
        });
        history.push(`/multisigs/${smartWalletWrapper.key.toString()}`);
      } catch (e) {
        handleException(e, {
          source: "create-multisig",
        });
      }
    },
  });

  const keypair = useKeypair(formik.values.baseKP);

  return (
    <div tw="grid gap-12 w-full max-w-[780px] mx-auto">
      <Module>
        <div tw="prose">
          <h1>Create a Multisig</h1>
        </div>
        <div tw="border rounded p-4 mt-12">
          <form tw="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
            <label>
              <span>Owners</span>
              <div tw="flex gap-1">
                <input
                  name="nextOwner"
                  type="text"
                  tw="mt-1 w-full"
                  placeholder="Enter an address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nextOwner}
                />
                <Button tw="mt-1" variant="muted">
                  <FaPlus />
                </Button>
              </div>
              {formik.touched.owners && formik.errors.owners && (
                <div tw="text-red-500 text-sm mt-2">{formik.errors.owners}</div>
              )}
            </label>
            <label>
              <div tw="flex items-center gap-2">
                <span>Threshold</span>
                <MouseoverTooltip
                  text={
                    <div tw="max-w-sm">
                      <p>
                        The minimum number of signers required to execute a
                        transaction.
                      </p>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle tw="pb-1 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <input
                name="threshold"
                type="number"
                inputMode="numeric"
                tw="mt-1 w-full"
                placeholder="Enter an integer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.threshold}
              />
              {formik.touched.threshold && formik.errors.threshold && (
                <div tw="text-red-500 text-sm mt-2">
                  {formik.errors.threshold}
                </div>
              )}
            </label>
            <label>
              <div tw="flex items-center gap-2">
                <span>Maximum number of signers</span>
                <MouseoverTooltip
                  text={
                    <div tw="max-w-sm">
                      <p>
                        The maximum number of signers that can ever be
                        registered in this wallet.
                      </p>
                      <small>
                        Solana accounts have a fixed size, so this number must
                        be known ahead of time.
                      </small>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle tw="pb-1 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <input
                name="maxOwners"
                type="number"
                inputMode="numeric"
                tw="mt-1 w-full"
                placeholder="Enter an integer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.maxOwners}
              />
              {formik.touched.maxOwners && formik.errors.maxOwners && (
                <div tw="text-red-500 text-sm mt-2">
                  {formik.errors.maxOwners}
                </div>
              )}
            </label>
            <label>
              <div tw="flex items-center gap-2">
                <span>Base Keypair JSON</span>
                <MouseoverTooltip
                  text={
                    <div tw="max-w-sm">
                      <p>
                        The JSON secret key to use as the base for the Multisig
                        wallet. Use this to create a wallet with a deterministic
                        address across multiple chains.
                      </p>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle tw="pb-1 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <textarea
                name="baseKP"
                tw="mt-1 block w-full h-24"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.baseKP}
              />
              {formik.touched.baseKP && formik.errors.baseKP && (
                <div tw="text-red-500 text-sm mt-2">{formik.errors.baseKP}</div>
              )}
            </label>
            <label>
              <div tw="flex items-center gap-2">
                <span>Timelock Delay (optional)</span>
                <MouseoverTooltip
                  text={
                    <div tw="max-w-sm">
                      <p>
                        The minimum duration to wait between the time an
                        instruction is scheduled and the time an instruction can
                        be executed.
                      </p>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle tw="pb-1 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <input
                name="delay"
                type="number"
                inputMode="numeric"
                tw="mt-1 w-full"
                placeholder="Delay (seconds)"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.delay}
              />
              {formik.touched.delay && formik.errors.delay && (
                <div tw="text-red-500 text-sm mt-2">{formik.errors.delay}</div>
              )}
            </label>
            <div tw="rounded p-4 border w-[250px] max-w-full">
              <h3 tw="mb-4 uppercase text-secondary text-sm">Details</h3>
              <AttributeList
                attributes={{
                  Mint: keypair ? keypair.publicKey : "--",
                }}
              />
            </div>
            <div>
              <AsyncButton
                type="submit"
                size="md"
                disabled={formik.isSubmitting}
              >
                Create (there will be multiple transactions)
              </AsyncButton>
            </div>
          </form>
        </div>
      </Module>
    </div>
  );
};
