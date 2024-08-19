import { type ReactElement, useContext, useEffect } from 'react'
import { type TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, CardActions, Divider, FormControl, Grid, TextField, Typography } from '@mui/material'
import TokenIcon from '@/components/common/TokenIcon'
import { ClaimYieldFields, type ClaimYieldParams } from '.'
import { formatVisualAmount } from '@/utils/formatters'
import commonCss from '@/components/tx-flow/common/styles.module.css'
import { YieldMode } from '@/config/yieldTokens'
import useLoadBlastYield from "@/hooks/useLoadBlastYield"
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk"
import TxCard from "@/components/common/TxCard"
import BlastYieldAmountInput from "@/components/common/TokenAmount/BlastYieldAmountInput"

export const AutocompleteItem = (item: { tokenInfo: TokenInfo; claimableField: string }): ReactElement => (
  <Grid container alignItems="center" gap={1}>
    <TokenIcon logoUri={item.tokenInfo.logoUri} tokenSymbol={item.tokenInfo.symbol} />

    <Grid item xs>
      <Typography variant="body2">{item.tokenInfo.name}</Typography>

      <Typography variant="caption" component="p">
        {formatVisualAmount(item.claimableField, item.tokenInfo.decimals)} {item.tokenInfo.symbol}
      </Typography>
    </Grid>
  </Grid>
)

export const CreateClaimYield = ({
  params,
  onSubmit,
}: {
  params: ClaimYieldParams
  onSubmit: (data: ClaimYieldParams) => void
  txNonce?: number
}): ReactElement => {
  const { data: balances } = useLoadBlastYield()
  const { safe } = useSafeAppsSDK()

  const formMethods = useForm<ClaimYieldParams>({
    defaultValues: {
      ...params,
      [ClaimYieldFields.tokenAddress]: params.tokenAddress,
      [ClaimYieldFields.recipient]: safe.safeAddress,
    },
    mode: 'onChange',
    delayError: 500,
  })

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = formMethods

  const recipient = watch(ClaimYieldFields.recipient)
  const tokenAddress = watch(ClaimYieldFields.tokenAddress)

  const selectedToken = balances?.items.find((item) => item.tokenInfo.address === tokenAddress)
  const maxAmount = selectedToken?.claimableYield

  // const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   formMethods.setValue(ClaimYieldFields.recipient, event.target.value)
  //   formMethods.setError(ClaimYieldFields.recipient, {
  //     message: event.target.value ? undefined : 'Recipient address is required',
  //   })
  // }

  return (
    <TxCard>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} className={commonCss.form}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <TextField
              name={ClaimYieldFields.recipient}
              label="Recipient address"
              variant="outlined"
              // onChange={handleRecipientChange}
              error={!!errors[ClaimYieldFields.recipient]}
              helperText={errors[ClaimYieldFields.recipient]?.message}
            />
          </FormControl>

          <BlastYieldAmountInput
            balances={balances?.items || []}
            maxAmount={BigInt(maxAmount ?? '0')}
            selectedToken={selectedToken}
          />

          <Divider className={commonCss.nestedDivider} />

          <CardActions>
            <Button variant="contained" type="submit" disabled={selectedToken?.mode !== YieldMode.CLAIMABLE}>
              Next
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </TxCard>
  )
}

export default CreateClaimYield