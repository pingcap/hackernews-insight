import * as React from 'react';
import '../styles/globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@src/theme';
import type { AppProps } from 'next/app';
import { RecoilRoot, useRecoilSnapshot } from 'recoil';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import GA4 from 'src/components/Layout/GoogleAnalytics';

function DebugObserver(): any {
  const snapshot = useRecoilSnapshot();
  React.useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <DebugObserver />
      <ThemeProvider theme={theme}>
        <GA4 />
        <SnackbarProvider
          maxSnack={3}
          action={(snackbarId) => (
            <Button onClick={() => closeSnackbar(snackbarId)} sx={{
              color: "#fff",
            }}>
              Dismiss
            </Button>
          )}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
