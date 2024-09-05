'use client';

import { Inter } from 'next/font/google';
import './globals.css';

import { Theme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import {
  SafeThemeProvider,
  useThemeMode,
} from '@safe-global/safe-react-components';
import SafeProvider from '@safe-global/safe-apps-react-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TxModalProvider } from "@/components/tx-flow";

const inter = Inter({ subsets: ['latin'] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { themeMode } = useThemeMode("dark");
  return (
    <html lang="en">
      <SafeThemeProvider mode={themeMode}>
        {(safeTheme: Theme) => (
          <ThemeProvider theme={safeTheme}>
            <body className={inter.className + 'p-4 m-4 h-full border-gray-200'}>
              <QueryClientProvider client={queryClient}>
                <SafeProvider
                  loader={
                    <>
                      <Typography variant="h1">Waiting for Safe...</Typography>
                      <CircularProgress color="primary" />
                    </>
                  }
                >
                  <TxModalProvider>
                    {children}
                  </TxModalProvider>
                </SafeProvider>
              </QueryClientProvider>
            </body>
          </ThemeProvider>
        )}
      </SafeThemeProvider>
    </html>
  );
}
