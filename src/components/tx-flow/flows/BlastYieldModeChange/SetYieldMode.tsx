import { useState } from 'react'
import {
  Button,
  Box,
  CardActions,
  Divider,
  Grid,
  MenuItem,
  Select,
  Typography,
  SvgIcon,
  Tooltip,
  Link,
  // Link,
} from '@mui/material'
import type { ReactElement, SyntheticEvent } from 'react'
import type { SelectChangeEvent } from '@mui/material'

// import InfoIcon from '@/public/images/notifications/info.svg'

import commonCss from '@/components/tx-flow/common/styles.module.css'
import type { YieldModeChangeProps } from '.'
import { YIELD_DESCRIPTION, YIELD_LABELS, YieldMode } from '@/config/yieldTokens'
import TxCard from "@/components/common/TxCard"

const options = [
  { value: YieldMode.VOID, label: YIELD_LABELS[YieldMode.VOID] },
  { value: YieldMode.AUTOMATIC, label: YIELD_LABELS[YieldMode.AUTOMATIC] },
  { value: YieldMode.CLAIMABLE, label: YIELD_LABELS[YieldMode.CLAIMABLE] },
]
export const SetYieldMode = ({
  params,
  onSubmit,
}: {
  params: YieldModeChangeProps
  onSubmit: (data: YieldModeChangeProps) => void
}): ReactElement => {
  // const { safe } = useSafeInfo()

  const [selectedMode, setSelectedMode] = useState<YieldMode>(params.newMode || YieldMode.VOID)

  const handleChange = (event: SelectChangeEvent<YieldMode>) => {
    setSelectedMode(event.target.value as YieldMode)
  }

  const onSubmitHandler = (e: SyntheticEvent) => {
    e.preventDefault()
    onSubmit({ ...params, newMode: selectedMode })
  }

  return (
    <TxCard>
      <form onSubmit={onSubmitHandler}>
        <Box my={3}>
          <Typography variant="h4" fontWeight={700}>
            Yield Modes
            <Tooltip
              title={'Smart contract accounts have three Yield Modes which can be changed on demand.'}
              arrow
              placement="top"
            >
              <span>
                <SvgIcon
                  // component={InfoIcon}
                  inheritViewBox
                  color="border"
                  fontSize="small"
                  sx={{
                    verticalAlign: 'middle',
                    ml: 0.5,
                  }}
                />
              </span>
            </Tooltip>
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
                <Link color="primary" target="_blank" href={'https://docs.blast.io/building/guides/eth-yield'}>
                  {`Read more`}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider className={commonCss.nestedDivider} />

        <CardActions>
          <Button data-testid="next-btn" variant="contained" type="submit">
            Next
          </Button>
        </CardActions>
      </form>
    </TxCard>
  )
}