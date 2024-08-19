// import useSafeInfo from '@/hooks/useSafeInfo'
import {
  type ComponentType,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  SvgIcon,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import type { TransactionSummary } from '@safe-global/safe-gateway-typescript-sdk';
import classnames from 'classnames';
// import { ProgressBar } from '@/components/common/ProgressBar'
import SafeTxProvider, { SafeTxContext } from '../../SafeTxProvider';
// import TxNonce from '../TxNonce'
// import TxStatusWidget from '../TxStatusWidget'
import css from './styles.module.css';
// import SafeLogo from '@/public/images/logo-no-text.svg';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
// import ChainIndicator from '@/components/common/ChainIndicator'
// import SecurityWarnings from '@/components/tx/security/SecurityWarnings'

const TxLayoutHeader = ({
  icon,
  subtitle,
}: {
  hideNonce: TxLayoutProps['hideNonce'];
  icon: TxLayoutProps['icon'];
  subtitle: TxLayoutProps['subtitle'];
}) => {
  if (!icon && !subtitle) return null;

  return (
    <Box className={css.headerInner}>
      <Box display="flex" alignItems="center">
        {icon && (
          <div className={css.icon}>
            <SvgIcon component={icon} inheritViewBox />
          </div>
        )}

        <Typography variant="h4" component="div" fontWeight="bold">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

type TxLayoutProps = {
  title: ReactNode;
  children: ReactNode;
  subtitle?: ReactNode;
  icon?: ComponentType;
  step?: number;
  txSummary?: TransactionSummary;
  onBack?: () => void;
  hideNonce?: boolean;
  hideProgress?: boolean;
  isBatch?: boolean;
  isReplacement?: boolean;
  isMessage?: boolean;
  isRecovery?: boolean;
};

const TxLayout = ({
  title,
  subtitle,
  icon,
  children,
  step = 0,
  txSummary,
  onBack,
  hideNonce = false,
  hideProgress = false,
  isBatch = false,
  isReplacement = false,
  isMessage = false,
}: TxLayoutProps): ReactElement => {
  const [statusVisible, setStatusVisible] = useState<boolean>(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.down('lg'));

  const steps = Array.isArray(children) ? children : [children];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  useEffect(() => {
    setStatusVisible(!isSmallScreen);
  }, [isSmallScreen]);

  const toggleStatus = () => {
    setStatusVisible((prev) => !prev);
  };

  return (
    <SafeTxProvider>
      <>
        {/* Header status button */}
        {/* {!isReplacement && (
          <IconButton
            className={css.statusButton}
            aria-label="Transaction status"
            size="large"
            onClick={toggleStatus}
          >
            <SafeLogo width={16} height={16} />
          </IconButton>
        )} */}

        <Container className={css.container}>
          <Grid container gap={3} justifyContent="center">
            {/* Main content */}
            <Grid item xs={12} md={7}>
              <div className={css.titleWrapper}>
                <Typography
                  data-testid="modal-title"
                  variant="h3"
                  component="div"
                  fontWeight="700"
                  className={css.title}
                >
                  {title}
                </Typography>
              </div>

              <Paper data-testid="modal-header" className={css.header}>
                {!hideProgress && (
                  <Box className={css.progressBar}>
                    {/* <ProgressBar value={progress} /> */}
                  </Box>
                )}

                <TxLayoutHeader
                  subtitle={subtitle}
                  icon={icon}
                  hideNonce={hideNonce}
                />
              </Paper>

              <div className={css.step}>
                {steps[step]}

                {onBack && step > 0 && (
                  <Button
                    data-testid="modal-back-btn"
                    variant={isDesktop ? 'text' : 'outlined'}
                    onClick={onBack}
                    className={css.backButton}
                    startIcon={<ArrowBackIcon fontSize="small" />}
                  >
                    Back
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        </Container>
      </>
    </SafeTxProvider>
  );
};

export default TxLayout;
