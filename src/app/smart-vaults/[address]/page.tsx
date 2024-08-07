"use client";

import {useEffect, useState} from "react";
import {useSpoolSDK} from "@/context/SpoolSDKContext";
import {VaultInfo} from "@spool.fi/spool-v2-sdk";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip} from "@mui/material";
import PaidIcon from '@mui/icons-material/Paid';
import DepositInput from "@/components/DepositInput";
import ApproveInput from "@/components/ApproveInput";
import WithdrawInput from "@/components/WithdrawInput";
import UserBalanceBreakdown from "@/components/UserBalanceBreakdown";
import ClaimInput from "@/components/ClaimInput";
import AddRewardInput from "@/components/AddRewardInput";

const SmartVaultDetailPage = ({params}: { params: { address: string } }) => {

    const spoolSDK = useSpoolSDK()

    const [smartVault, setSmartVault] = useState<VaultInfo | null>(null);
    const [smartVaultTVR, setSmartVaultTVR] = useState<string>('0');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSmartVaultDetails = async () => {
            try {
                setLoading(true);
                const [vaultDetails, vaultTVR] = await Promise.all([
                    spoolSDK.views.vaultInfo.getVaultDetails({vaultAddress: params.address}),
                    spoolSDK.views.vaultInfo.getVaultsTVRInUSD({vaultAddresses: params.address})
                ]);
                setSmartVault(vaultDetails);
                setSmartVaultTVR(vaultTVR[params.address].toFixed(2));
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchSmartVaultDetails();
    }, [spoolSDK, params.address]);

    if (loading || !smartVault) {
        return <Loading/>
    }

    if (error) {
        return <Error error={error}/>
    }

    return (
        <Container maxWidth="lg">
            <Box display='flex' flexDirection='column' gap={2} sx={{pb: 4}}>
                <Typography variant='h2'>{smartVault.name}</Typography>
            </Box>
            <Grid container spacing={{xs: 2, md: 3}}>
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Vault Info</Typography>
                        <Typography variant='h5'>Address</Typography>
                        <Typography variant='body1'>{smartVault.address}</Typography>
                        <Divider/>
                        <Typography variant='h5'>Assets</Typography>
                        <List>
                            {smartVault.assetGroup.tokens.map((token, index) => (
                                <ListItem key={index} disablePadding>
                                    <Tooltip title={token.symbol}>
                                        <ListItemIcon>
                                            <PaidIcon/>
                                        </ListItemIcon>
                                    </Tooltip>
                                    <ListItemText primary={token.name}/>
                                </ListItem>
                            ))}
                        </List>
                        <Divider/>
                        <Typography variant='h5'>TVR</Typography>
                        <Typography variant='body1'>$ {smartVaultTVR}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Balance Breakdown</Typography>
                        <UserBalanceBreakdown smartVaultAddress={params.address}/>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Approve</Typography>
                        <ApproveInput smartVaultAddress={params.address} token={smartVault.assetGroup.tokens[0]}/>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Deposit</Typography>
                        <DepositInput smartVaultAddress={params.address} token={smartVault.assetGroup.tokens[0]}/>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Withdraw</Typography>
                        <WithdrawInput smartVaultAddress={params.address} token={smartVault.assetGroup.tokens[0]}/>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Claim</Typography>
                        <ClaimInput smartVaultAddress={params.address} token={smartVault.assetGroup.tokens[0]}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SmartVaultDetailPage;