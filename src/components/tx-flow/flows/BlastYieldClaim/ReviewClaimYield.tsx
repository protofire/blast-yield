import { useContext, useEffect } from 'react';
// import SignOrExecuteForm, { type SubmitCallback } from '@/components/tx/SignOrExecuteForm'
// import { createTx } from '@/services/tx/tx-sender'
import type { ClaimYieldParams } from '.';
import { SafeTxContext } from '../../SafeTxProvider';
import useLoadBlastYield from '@/hooks/useLoadBlastYield';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { encodeClaimYield } from '@/utils/yield';
import { EthHashInfo } from '@safe-global/safe-react-components';
import FieldsGrid from '@/components/common/FieldsGrid';
import { Box, Typography } from '@mui/material';
import TokenIcon from '@/components/common/TokenIcon';
import { formatAmountPrecise } from '@/utils/formatNumber';
import { FormProvider } from 'react-hook-form';

enum PSEUDO_APPROVAL_VALUES {
  UNLIMITED = 'Unlimited (not recommended)',
}

const ReviewClaimYield = ({
  params,
  onSubmit,
}: {
  params: ClaimYieldParams;
  onSubmit?: unknown;
}) => {
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext);
  const { data: balances } = useLoadBlastYield();
  const {
    safe: { safeAddress },
  } = useSafeAppsSDK();
  const token = balances?.items.find(
    (item) => item.tokenInfo.address === params.tokenAddress
  );

  useEffect(() => {
    if (!token) return;

    const txParams = encodeClaimYield(
      safeAddress,
      params.recipient,
      token.tokenInfo,
      params.amount
    );

    // createTx(txParams, txNonce).then(setSafeTx).catch(setSafeTxError)
  }, [
    params.amount,
    params.recipient,
    safeAddress,
    setSafeTx,
    setSafeTxError,
    token,
  ]);

  return (
    // <FormProvider onSubmit={onSubmit}>
    //   {token && (
    //     <>
    //       <FieldsGrid title="Send">
    //         <Box display="flex" alignItems="center" gap={1}>
    //           <TokenIcon
    //             logoUri={token?.tokenInfo.logoUri}
    //             tokenSymbol={token?.tokenInfo.symbol}
    //           />

    //           <Typography fontWeight="bold">
    //             {token?.tokenInfo.symbol}
    //           </Typography>

    //           {params.amount === PSEUDO_APPROVAL_VALUES.UNLIMITED ? (
    //             <Typography>{PSEUDO_APPROVAL_VALUES.UNLIMITED}</Typography>
    //           ) : (
    //             <Typography data-testid="token-amount">
    //               {formatAmountPrecise(
    //                 params.amount,
    //                 token?.tokenInfo.decimals!
    //               )}
    //             </Typography>
    //           )}
    //         </Box>
    //       </FieldsGrid>
    //     </>
    //   )}

    //   <FieldsGrid title="To">
    //     <Typography variant="body2" component="div">
    //       <EthHashInfo
    //         address={params.recipient}
    //         shortAddress={false}
    //         hasExplorer
    //         showCopyButton
    //       />
    //     </Typography>
    //   </FieldsGrid>
    // </FormProvider>
    <div>check later</div>
  );
};

export default ReviewClaimYield;
