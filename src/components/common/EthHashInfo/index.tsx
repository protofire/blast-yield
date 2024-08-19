import classnames from 'classnames'
import type { ReactNode, ReactElement, SyntheticEvent } from 'react'
import { isAddress } from 'ethers'
import { useTheme } from '@mui/material/styles'
import { Box, SvgIcon, Tooltip } from '@mui/material'
import AddressBookIcon from '@/public/images/sidebar/address-book.svg'
import useMediaQuery from '@mui/material/useMediaQuery'
import { shortenAddress } from '@/utils/formatters'
import css from './styles.module.css'
import CopyAddressButton from "../CopyAddressButton"

export type EthHashInfoProps = {
  address: string
  chainId?: string
  name?: string | null
  showAvatar?: boolean
  onlyName?: boolean
  showCopyButton?: boolean
  prefix?: string
  showPrefix?: boolean
  copyPrefix?: boolean
  shortAddress?: boolean
  copyAddress?: boolean
  customAvatar?: string
  hasExplorer?: boolean
  avatarSize?: number
  children?: ReactNode
  trusted?: boolean
  isAddressBookName?: boolean
}

const SrcEthHashInfo = ({
  address,
  prefix = '',
  copyPrefix = true,
  showPrefix = true,
  shortAddress = true,
  copyAddress = true,
  onlyName = false,
  name,
  showCopyButton,
  children,
  trusted = true,
  isAddressBookName = false,
}: EthHashInfoProps): ReactElement => {
  const shouldPrefix = isAddress(address)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const shouldCopyPrefix = shouldPrefix && copyPrefix

  const addressElement = (
    <>
      {showPrefix && shouldPrefix && prefix && <b>{prefix}:</b>}
      <span>{shortAddress || isMobile ? shortenAddress(address) : address}</span>
    </>
  )

  return (
    <div className={css.container}>
      <Box overflow="hidden" className={onlyName ? css.inline : undefined}>
        {name && (
          <Box title={name} display="flex" alignItems="center" gap={0.5}>
            <Box overflow="hidden" textOverflow="ellipsis">
              {name}
            </Box>

            {isAddressBookName && (
              <Tooltip title="From your address book" placement="top">
                <span style={{ lineHeight: 0 }}>
                  <SvgIcon component={AddressBookIcon} inheritViewBox color="border" fontSize="small" />
                </span>
              </Tooltip>
            )}
          </Box>
        )}

        <div className={classnames(css.addressContainer, { [css.inline]: onlyName })}>
          {(!onlyName || !name) && (
            <Box fontWeight="inherit" fontSize="inherit" overflow="hidden" textOverflow="ellipsis">
              {copyAddress ? (
                <CopyAddressButton prefix={prefix} address={address} copyPrefix={shouldCopyPrefix} trusted={trusted}>
                  {addressElement}
                </CopyAddressButton>
              ) : (
                addressElement
              )}
            </Box>
          )}

          {showCopyButton && (
            <CopyAddressButton prefix={prefix} address={address} copyPrefix={shouldCopyPrefix} trusted={trusted} />
          )}

          {children}
        </div>
      </Box>
    </div>
  )
}

export default SrcEthHashInfo