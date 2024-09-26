import * as React from 'react';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import Navbar from "@/components/Navbar";
import {YelaySDKProvider} from "@/context/YelaySDKContext";
import {Web3Provider} from "@/context/web3Context";
import Box from "@mui/material/Box";

export default function RootLayout(props: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <AppRouterCacheProvider options={{enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Web3Provider>
                    <YelaySDKProvider>
                        <Navbar/>
                        <Box sx={{pt: 10}}>
                            {props.children}
                        </Box>
                    </YelaySDKProvider>
                </Web3Provider>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
