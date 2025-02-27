'use client';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, Typography, Skeleton, Box, IconButton, Tooltip, Container } from '@mui/material';
import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, type ReactElement } from 'react';

import EnhancedTable, { type EnhancedTableProps } from '@/components/common/EnhancedTable';
import TokenAmount from '@/components/common/TokenAmount';
import TokenIcon from '@/components/common/TokenIcon';
import { TxModalContext } from '@/components/tx-flow';
import ClaimYieldFlow from '@/components/tx-flow/flows/BlastYieldClaim';
import YieldModeChangeFlow from '@/components/tx-flow/flows/BlastYieldModeChange';
import { YIELD_DESCRIPTION, YIELD_LABELS, YieldMode } from '@/config/yieldTokens';
import { useLoadBlastYield } from '@/hooks/useLoadBlastYield';

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  asset: {
    rawValue: '0x0',
    content: (
      <div>
        <Skeleton variant="rounded" width="26px" height="26px" />
        <Typography>
          <Skeleton width="80px" />
        </Typography>
      </div>
    ),
  },
  yieldMode: {
    rawValue: '0',
    content: (
      <Typography>
        <Skeleton width="32px" />
      </Typography>
    ),
  },
  value: {
    rawValue: '0',
    content: (
      <Typography>
        <Skeleton width="32px" />
      </Typography>
    ),
  },
  actions: {
    rawValue: '',
    sticky: true,
    content: <div></div>,
  },
};

const skeletonRows: EnhancedTableProps['rows'] = Array(3).fill({
  cells: skeletonCells,
});

const headCells: EnhancedTableProps['headCells'] = [
  {
    id: 'asset',
    label: 'Asset',
  },
  {
    id: 'yieldMode',
    label: 'Yield Mode',
  },
  {
    id: 'yield',
    label: 'Claimable Yield',
  },
  {
    id: 'actions',
    label: '',
    sticky: true,
  },
];

const ClaimButton = ({
  tokenInfo,
  mode,
  onClick,
}: {
  tokenInfo: TokenInfo;
  mode: YieldMode;
  onClick: (tokenAddress: string) => void;
}): ReactElement => {
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => onClick(tokenInfo.address)}
        disabled={mode !== YieldMode.CLAIMABLE}
      >
        {YIELD_LABELS[mode]}
      </Button>
      <Tooltip title={YIELD_DESCRIPTION[mode]}>
        <IconButton size="medium">
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

const EditYieldModeButton = ({
  tokenInfo,
  onClick,
}: {
  tokenInfo: TokenInfo;
  onClick: (tokenAddress: string) => void;
}): ReactElement => {
  return (
    <IconButton size="medium" onClick={() => onClick(tokenInfo.address)}>
      <EditOutlinedIcon fontSize="small" />
    </IconButton>
  );
};

export default function Home(): ReactElement {
  const { data: balances, isLoading: loading } = useLoadBlastYield();

  const { setTxFlow } = useContext(TxModalContext);

  const onClaimClick = (tokenAddress: string): void => {
    setTxFlow(<ClaimYieldFlow tokenAddress={tokenAddress} />);
  };

  const onChangeYieldModeClick = (token: TokenInfo, newMode: YieldMode): void => {
    setTxFlow(<YieldModeChangeFlow token={token} newMode={newMode} />);
  };

  const rows: EnhancedTableProps['rows'] = loading
    ? skeletonRows
    : (balances?.items || []).map((item) => {
        return {
          key: item.tokenInfo.address,
          cells: {
            asset: {
              rawValue: item.tokenInfo.name,
              content: (
                <div className="flex items-center space-x-3">
                  <TokenIcon logoUri={item.tokenInfo.logoUri} tokenSymbol={item.tokenInfo.symbol} />
                  <Typography>{item.tokenInfo.name}</Typography>
                </div>
              ),
            },
            yieldMode: {
              rawValue: item.mode,
              content: (
                <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                  <Typography sx={{ minWidth: '100px' }}>{YIELD_LABELS[item.mode]}</Typography>
                  <Tooltip title={YIELD_DESCRIPTION[item.mode]}>
                    <IconButton size="medium">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <EditYieldModeButton
                    tokenInfo={item.tokenInfo}
                    onClick={() => onChangeYieldModeClick(item.tokenInfo, item.mode)}
                  />
                </Box>
              ),
            },
            yield: {
              rawValue: item.claimableYield,
              content: (
                <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                  <TokenAmount
                    value={item.claimableYield}
                    decimals={item.tokenInfo.decimals}
                    tokenSymbol={item.tokenInfo.symbol}
                  />
                </Box>
              ),
            },
            actions: {
              rawValue: '',
              sticky: true,
              content: (
                <ClaimButton
                  tokenInfo={item.tokenInfo}
                  mode={item.mode}
                  onClick={() => {
                    onClaimClick(item.tokenInfo.address);
                  }}
                />
              ),
            },
          },
        };
      });

  return (
    <Container className="h-[calc(100vh-32px)] w-full">
      <Typography variant="h1" className="pb-6 text-white">
        Blast Yield
      </Typography>
      <EnhancedTable rows={rows} headCells={headCells} />
      <Box className="mt-4 text-white" display="flex" alignItems="center" justifyContent="center">
        <Link
          href="https://protofire.io/services/safe-deployment"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="body2" mr={1}>
              Supported by
            </Typography>
            <Image src="/proto-logo.svg" alt="ProtoFire Logo" width={120} height={60} />
          </Box>
        </Link>
      </Box>
    </Container>
  );
}
