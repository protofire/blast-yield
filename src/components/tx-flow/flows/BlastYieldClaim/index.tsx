import { ZERO_ADDRESS } from '@safe-global/protocol-kit/dist/src/utils/constants';
import TxLayout from '../../common/TxLayout';
import TxCard from '@/components/common/TxCard';
import { YieldMode } from '@/config/yieldTokens';
import { FormControl, TextField, Divider, Box, Button } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import useLoadBlastYield from '@/hooks/useLoadBlastYield';
import { encodeClaimYield } from '@/utils/yield';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useContext } from 'react';
import commonCss from '@/components/tx-flow/common/styles.module.css';
import BlastYieldAmountInput, {
  YieldAmountFields,
} from '@/components/common/TokenAmount/BlastYieldAmountInput';
import { TxModalContext } from "../..";

enum Fields {
  recipient = 'recipient',
  type = 'type',
}

export const ClaimYieldFields = { ...Fields, ...YieldAmountFields };

export type ClaimYieldParams = {
  [ClaimYieldFields.recipient]: string;
  [ClaimYieldFields.tokenAddress]: string;
  [ClaimYieldFields.amount]: string;
};

type ClaimYieldFlowProps = Partial<ClaimYieldParams> & {
  txNonce?: number;
};

const defaultParams: ClaimYieldParams = {
  recipient: '',
  tokenAddress: ZERO_ADDRESS,
  amount: '',
};

enum PSEUDO_APPROVAL_VALUES {
  UNLIMITED = 'Unlimited (not recommended)',
}

const ClaimYieldFlow = ({ txNonce, ...props }: ClaimYieldFlowProps) => {
  const params = {
    ...defaultParams,
    ...props,
  };
  const { data: balances } = useLoadBlastYield();
  const { setTxFlow } = useContext(TxModalContext);
  const {
    safe: { safeAddress },
    sdk,
  } = useSafeAppsSDK();
  const token = balances?.items.find(
    (item) => item.tokenInfo.address === params.tokenAddress
  );
  const formMethods = useForm<ClaimYieldParams>({
    defaultValues: {
      [ClaimYieldFields.amount]: '0',
      [ClaimYieldFields.recipient]: safeAddress,
      [ClaimYieldFields.tokenAddress]: params.tokenAddress,
    },
    mode: 'onChange',
    delayError: 500,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    register,
  } = formMethods;

  const recipient = watch(ClaimYieldFields.recipient);
  const tokenAddress = watch(ClaimYieldFields.tokenAddress);

  const isAddressValid = !!recipient && !errors[ClaimYieldFields.recipient];

  const selectedToken = balances?.items.find(
    (item) => item.tokenInfo.address === tokenAddress
  );
  const maxAmount = selectedToken?.claimableYield;

  const submit = (data: ClaimYieldParams) => {
    if (!token) return;
    const txParams = encodeClaimYield(
      safeAddress,
      data.recipient,
      token.tokenInfo,
      data.amount
    );
    sdk.txs.send({ txs: [txParams] }).finally(() => {
      setTxFlow(undefined);
    });
  };

  return (
    <TxLayout title="Claim Blast Yield">
      <TxCard>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(submit)} className={commonCss.form}>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <TextField
                label="Recipient address"
                variant="outlined"
                error={!!errors[ClaimYieldFields.recipient]}
                helperText={errors[ClaimYieldFields.recipient]?.message}
                {...register(ClaimYieldFields.recipient, {
                  required: true,
                  pattern: {
                    value: /^0x[a-fA-F0-9]{40}$/,
                    message: 'Invalid ETH address',
                  },
                })}
              />
            </FormControl>

            <BlastYieldAmountInput
              balances={balances?.items || []}
              maxAmount={BigInt(maxAmount ?? '0')}
              selectedToken={selectedToken}
            />

            <Divider className={commonCss.nestedDivider} />

            <Box my={3}>
              <Button
                variant="contained"
                type="submit"
                disabled={
                  selectedToken?.mode !== YieldMode.CLAIMABLE ||
                  !!errors[ClaimYieldFields.amount] ||
                  !isAddressValid
                }
              >
                Submit
              </Button>
            </Box>
          </form>
        </FormProvider>
      </TxCard>
    </TxLayout>
  );
};

export default ClaimYieldFlow;
