import { useSail } from "@saberhq/sail";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useFormik } from "formik";
import { useMemo } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";
import * as Yup from "yup";

import { useArrow } from "../../../contexts/arrow";
import { useSDK } from "../../../contexts/sdk";
import { useKeypair } from "../../../hooks/useKeypair";
import { handleException } from "../../../utils/error";
import { notify } from "../../../utils/notifications";
import { AsyncButton } from "../../common/AsyncButton";
import { AttributeList } from "../../common/AttributeList";
import { Module } from "../../common/Module";
import { MouseoverTooltip } from "../../common/MouseoverTooltip";

const IssueFormSchema = Yup.object().shape({
  sunnyPool: Yup.string().required("Required"),
  beneficiary: Yup.string()
    .required("Required")
    .test("pubkey", "Invalid public key", (str) => {
      if (!str) {
        return false;
      }
      try {
        new PublicKey(str);
        return true;
      } catch (e) {
        return false;
      }
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
});

interface IssueFormValues {
  sunnyPool: string;
  beneficiary: string;
  mintKP: string;
}

export const IssueView: React.FC = () => {
  const { handleTX } = useSail();
  const { sdkMut } = useSDK();
  const { pools } = useArrow();
  const initialMintKP = useMemo(
    () => JSON.stringify([...Keypair.generate().secretKey]),
    []
  );
  const history = useHistory();
  const formik = useFormik<IssueFormValues>({
    initialValues: {
      sunnyPool: "",
      beneficiary: "",
      mintKP: initialMintKP,
    },
    validationSchema: IssueFormSchema,
    onSubmit: async (values) => {
      try {
        invariant(sdkMut, "sdk");
        const mintKP = Keypair.fromSecretKey(
          Uint8Array.from(JSON.parse(values.mintKP))
        );
        const { initTX, newArrowTX } = await sdkMut.newArrow({
          sunnyPool: new PublicKey(values.sunnyPool),
          beneficiary: new PublicKey(values.beneficiary),
          mintKP,
        });
        const { pending, success } = await handleTX(initTX, "Setup Arrow");
        if (!success || !pending) {
          return;
        }
        await pending.wait({ commitment: "confirmed" });
        const wait = await handleTX(newArrowTX, "Issue Arrow");
        if (!wait.success || !wait.pending) {
          return;
        }
        await wait.pending.wait({ commitment: "confirmed" });

        notify({
          message: `Arrow created successfully`,
          description: mintKP.publicKey.toString(),
        });
        history.push(`/arrow/${mintKP.publicKey.toString()}`);
      } catch (e) {
        handleException(e, {
          source: "issue",
        });
      }
    },
  });

  const keypair = useKeypair(formik.values.mintKP);

  return (
    <div tw="grid gap-12 w-[780px] max-w-full mx-auto justify-between">
      <Module>
        <div tw="prose">
          <h1>Issue an Arrow</h1>
          <p>
            An <strong>Arrow</strong> is a token that represents a user staking
            liquidity on behalf of someone else. Use this page to create an
            Arrow to start redirecting yield from your users.
          </p>
          <small>
            Note: the Arrow protocol takes a 10% fee on all claimed tokens.
          </small>
        </div>
        <div tw="border rounded p-4 mt-12">
          <form tw="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
            <label>
              <span>Sunny Pool</span>
              <select
                name="sunnyPool"
                tw="block mt-1 w-full"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sunnyPool}
              >
                <option key="default" value="">
                  Select a Pool
                </option>
                {pools.map((pool) => (
                  <option
                    key={pool.pool.toString()}
                    value={pool.pool.toString()}
                  >
                    {pool.name}
                  </option>
                ))}
              </select>
              {formik.touched.sunnyPool && formik.errors.sunnyPool && (
                <div tw="text-red-500 text-sm mt-2">
                  {formik.errors.sunnyPool}
                </div>
              )}
            </label>
            <label>
              <div tw="flex items-center gap-2">
                <span>Beneficiary</span>
                <MouseoverTooltip
                  text={
                    <div tw="max-w-sm">
                      <p>
                        The beneficiary has the right to claim all of staking
                        rewards that the Arrow's underlying Sunny vault
                        receives. You probably want to set this to your DAO's
                        address.
                      </p>
                      <small>Note: this address cannot be changed later.</small>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle tw="pb-1 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <input
                name="beneficiary"
                type="text"
                tw="mt-1 w-full"
                placeholder="Enter a wallet address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.beneficiary}
              />
              {formik.touched.beneficiary && formik.errors.beneficiary && (
                <div tw="text-red-500 text-sm mt-2">
                  {formik.errors.beneficiary}
                </div>
              )}
            </label>
            <label>
              <div tw="flex items-center gap-2">
                <span>Mint Keypair JSON</span>
                <MouseoverTooltip
                  text={
                    <div tw="max-w-sm">
                      <p>
                        The JSON representation of the secret key you would like
                        to use for the Arrow. You may generate these via the
                        following command:
                      </p>
                      <code>solana-keygen grind --starts-with=MyPrefix:1</code>
                    </div>
                  }
                  placement="bottom-start"
                >
                  <FaQuestionCircle tw="pb-1 cursor-pointer" />
                </MouseoverTooltip>
              </div>
              <textarea
                name="mintKP"
                tw="mt-1 block w-full h-24"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mintKP}
              />
              {formik.touched.mintKP && formik.errors.mintKP && (
                <div tw="text-red-500 text-sm mt-2">{formik.errors.mintKP}</div>
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
