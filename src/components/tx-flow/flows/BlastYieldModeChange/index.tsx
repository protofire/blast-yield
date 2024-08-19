import TxLayout from '@/components/tx-flow/common/TxLayout'
import useTxStepper from '../../useTxStepper'
import { ReviewYieldModeChange } from './ReviewYieldModeChange'
// import SaveAddressIcon from '@/public/images/common/save-address.svg'
import { SetYieldMode } from './SetYieldMode'
import type { YieldMode } from '@/config/yieldTokens'
import type { TokenInfo } from '@safe-global/safe-apps-sdk'

export type YieldModeChangeProps = {
  newMode: YieldMode
  token: TokenInfo
}

const YieldModeChangeFlow = (props: YieldModeChangeProps) => {
  const defaultValues: YieldModeChangeProps = {
    newMode: props.newMode,
    token: props.token,
  }

  const { data, step, nextStep, prevStep } = useTxStepper<YieldModeChangeProps>(defaultValues)

  const steps = [
    <SetYieldMode key={0} params={data} onSubmit={(formData: any) => nextStep({ ...data, ...formData })} />,
    <ReviewYieldModeChange key={1} params={data} />,
  ]

  return (
    <TxLayout
      title={step === 0 ? 'New transaction' : 'Confirm transaction'}
      subtitle="Change Yield Mode"
      // icon={SaveAddressIcon}
      step={step}
      onBack={prevStep}
    >
      {steps}
    </TxLayout>
  )
}

export default YieldModeChangeFlow