import { useContext, useEffect } from 'react'
import { Typography, Divider } from '@mui/material'
import type { ReactElement } from 'react'

// import SignOrExecuteForm from '@/components/tx/SignOrExecuteForm'
import { SafeTxContext } from '../../SafeTxProvider'

import commonCss from '@/components/tx-flow/common/styles.module.css'
import type { YieldModeChangeProps } from '.'
// import { createTx } from '@/services/tx/tx-sender'
import { YIELD_LABELS } from '@/config/yieldTokens'
import { encodeChangeYieldMode } from "@/utils/yield"

export const ReviewYieldModeChange = ({ params }: { params: YieldModeChangeProps }): ReactElement => {
  const { setSafeTx, setSafeTxError } = useContext(SafeTxContext)
  const { newMode, token } = params
  // const dispatch = useAppDispatch()
  // const yieldTokens = useAppSelector(selectYieldTokens)

  const onFormSubmit = () => {
    // const idx = yieldTokens.data.items.findIndex((item) => item.tokenInfo.address === params.token.address)

    // if (idx !== -1) {
    //   let items = [...yieldTokens.data.items]
    //   items[idx] = { ...items[idx], mode: params.newMode }
    //   dispatch(
    //     setYieldData({
    //       data: { ...yieldTokens.data, items },
    //       loading: false,
    //     }),
    //   )
    // }
  }

  useEffect(() => {
    const txData = encodeChangeYieldMode(newMode, token)

    // createTx(txData).then(setSafeTx).catch(setSafeTxError)
  }, [newMode, setSafeTx, setSafeTxError, token])

  return (
    // <SignOrExecuteForm onSubmit={onFormSubmit}>
    //   <Typography color="text.primary" display="flex" alignItems="center">
    //     {`Selected Yield: ${YIELD_LABELS[params.newMode]}`}
    //   </Typography>
    //   <Typography color="text.secondary" mb={2} display="flex" alignItems="center">
    //     {`Token: ${params.token.name}`}
    //   </Typography>
    //   <Divider className={commonCss.nestedDivider} />
    // </SignOrExecuteForm>
    <div>figure out later</div>
  )
}