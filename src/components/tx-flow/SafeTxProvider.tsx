import { createContext, useState, useEffect } from 'react'
import type { Dispatch, ReactNode, SetStateAction, ReactElement } from 'react'
import type { SafeTransaction } from '@safe-global/safe-core-sdk-types'
import type { EIP712TypedData } from '@safe-global/safe-gateway-typescript-sdk'

export const SafeTxContext = createContext<{
  safeTx?: SafeTransaction
  setSafeTx: Dispatch<SetStateAction<SafeTransaction | undefined>>

  safeMessage?: EIP712TypedData
  setSafeMessage: Dispatch<SetStateAction<EIP712TypedData | undefined>>

  safeTxError?: Error
  setSafeTxError: Dispatch<SetStateAction<Error | undefined>>
}>({
  setSafeTx: () => {},
  setSafeMessage: () => {},
  setSafeTxError: () => {},
})

const SafeTxProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [safeTx, setSafeTx] = useState<SafeTransaction>()
  const [safeMessage, setSafeMessage] = useState<EIP712TypedData>()
  const [safeTxError, setSafeTxError] = useState<Error>()

  // Signed txs cannot be updated
  const isSigned = safeTx && safeTx.signatures.size > 0

  // Update the tx when the nonce or safeTxGas change
  useEffect(() => {
    if (isSigned || !safeTx?.data) return

    // TODO: migrate and use safe app sdk
    // createTx({ ...safeTx.data, safeTxGas: String(finalSafeTxGas) }, finalNonce)
    //   .then(setSafeTx)
    //   .catch(setSafeTxError)
  }, [isSigned, safeTx?.data])

  // Log errors
  useEffect(() => {
    safeTxError && console.error(safeTxError)
  }, [safeTxError])

  return (
    <SafeTxContext.Provider
      value={{
        safeTx,
        safeTxError,
        setSafeTx,
        setSafeTxError,
        safeMessage,
        setSafeMessage,
      }}
    >
      {children}
    </SafeTxContext.Provider>
  )
}

export default SafeTxProvider