"use client";

import Container from '@mui/material/Container';
import {Box, Grid} from "@mui/material";
import {useYelaySDK} from "@/context/YelaySDKContext";
import {useEffect, useState} from "react";
import {UserVaults} from "@spool.fi/spool-v2-sdk";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import {useWeb3Provider} from "@/context/web3Context";
import NoVaults from "@/components/NoVaults";
import AddRewardInput from "@/components/AddRewardInput";
import Typography from "@mui/material/Typography";
import UsersWithRewards from "@/components/UsersWithRewards";
import RewardConfigurations from "@/components/RewardConfigurations";

const RewardsPage = () => {

    const yelaySDK = useYelaySDK();
    const {account} = useWeb3Provider();

    const [ownedSmartVaults, setOwnedSmartVaults] = useState<UserVaults[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchOwnedSmartVaults = async () => {
            if (account) {
                try {
                    setLoading(true);
                    const response = await yelaySDK.views.userInfo.getUserVaults({userAddresses: [account]});
                    setOwnedSmartVaults(response[account].filter(vault => vault.smartVault.owner === account));
                } catch (err) {
                    setError(err as Error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOwnedSmartVaults();
    }, [yelaySDK, account]);

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <Error error={error}/>
    }
    if (ownedSmartVaults.length === 0) {
        return <NoVaults
            message={`Only smart vaults that ${account?.slice(0, 5)}...${account?.slice(-3)} is the owner and has made a deposit into, are shown here`}/>
    }

    return (
        <Container maxWidth="lg">

            <Grid
                container spacing={{xs: 2, md: 3}}
            >
                <Grid item xs={12} md={6}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Add Reward</Typography>
                        <AddRewardInput ownedSmartVaults={ownedSmartVaults}/>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Reward Configurations</Typography>
                        <RewardConfigurations ownedSmartVaults={ownedSmartVaults}/>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box display='flex' flexDirection='column' flexGrow={1} gap={2} sx={{boxShadow: 1, p: 2}}>
                        <Typography variant='h4'>Users with rewards</Typography>
                        <UsersWithRewards ownedSmartVaults={ownedSmartVaults}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default RewardsPage;