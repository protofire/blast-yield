import {
  SelectChangeEvent,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import type { TokenInfo } from '@safe-global/safe-apps-sdk';
import Link from 'next/link';
import { useState, useContext, SyntheticEvent } from 'react';

import TxCard from '@/components/common/TxCard';
import TxLayout from '@/components/tx-flow/common/TxLayout';
import { YIELD_DESCRIPTION, YIELD_LABELS, YieldMode } from '@/config/yieldTokens';
import { encodeChangeYieldMode } from '@/utils/yield';

import { TxModalContext } from '../..';

export type YieldModeChangeProps = {
  newMode: YieldMode;
  token: TokenInfo;
};

const options = [
  { value: YieldMode.VOID, label: YIELD_LABELS[YieldMode.VOID] },
  { value: YieldMode.AUTOMATIC, label: YIELD_LABELS[YieldMode.AUTOMATIC] },
  { value: YieldMode.CLAIMABLE, label: YIELD_LABELS[YieldMode.CLAIMABLE] },
];

const YieldModeChangeFlow = (params: YieldModeChangeProps): React.ReactElement => {
  const [selectedMode, setSelectedMode] = useState<YieldMode>(params.newMode ?? YieldMode.VOID);
  const { token } = params;
  const { sdk } = useSafeAppsSDK();
  const { setTxFlow } = useContext(TxModalContext);

  const handleChange = (event: SelectChangeEvent<YieldMode>): void => {
    setSelectedMode(event.target.value as YieldMode);
  };

  const onSubmitHandler = (e: SyntheticEvent): void => {
    e.preventDefault();
    const txData = encodeChangeYieldMode(selectedMode, token);
    sdk.txs.send({ txs: [txData] }).finally(() => {
      setTxFlow(undefined);
    });
  };
  return (
    <TxLayout title="Change Yield Mode">
      <TxCard>
        <form onSubmit={onSubmitHandler}>
          <Box my={3}>
            <Typography variant="h4" fontWeight={700}>
              Yield Modes
            </Typography>
            <Grid container direction="row" alignItems="center" gap={1} mt={2}>
              <Grid item>
                <Select value={selectedMode} onChange={handleChange} fullWidth>
                  {options.map((value, idx) => (
                    <MenuItem key={idx} value={value.value}>
                      {value.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  {YIELD_DESCRIPTION[selectedMode]}{' '}
                  <Link
                    color="primary"
                    target="_blank"
                    href={'https://docs.blast.io/building/guides/eth-yield'}
                  >
                    {`Read more`}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box my={3}>
            <Button
              disabled={params.newMode === selectedMode}
              data-testid="next-btn"
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      </TxCard>
    </TxLayout>
  );
};

export default YieldModeChangeFlow;
