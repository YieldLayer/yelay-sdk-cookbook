"use client";

import {useWeb3Provider} from "@/context/web3Context";
import {Button,Box, Typography} from "@mui/material";

const connectWalletButton = () => {

    const {account, connectWallet, disconnectWallet} = useWeb3Provider();
    return (
        <>
            {account ? (
                <Box display='flex' gap={2}>
                    <Typography variant='caption' alignSelf='center'>{account.slice(0, 5)}...${account.slice(-3)}</Typography>
                    <Button variant='contained' color='secondary' sx={{color: '#fff'}} onClick={disconnectWallet}>Disconnect</Button>
                </Box>
            ) : (
                <Button variant='contained' color='secondary' sx={{color: '#fff'}} onClick={connectWallet}>Connect</Button>
            )}
        </>
    )
}

export default connectWalletButton;