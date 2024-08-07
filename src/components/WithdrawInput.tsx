"use client";

import {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Switch, TextField} from '@mui/material';
import {useWeb3Provider} from "@/context/web3Context";
import {useSpoolSDK} from "@/context/SpoolSDKContext";
import Typography from "@mui/material/Typography";
import {parseUnits} from "ethers/lib/utils";
import {TokenInfo} from "@spool.fi/spool-v2-sdk";

interface WithdrawInputProps {
    smartVaultAddress: string;
    token: TokenInfo;
}

const WithdrawInput: React.FC<WithdrawInputProps> = ({smartVaultAddress, token}) => {

    const {account, latestBlock} = useWeb3Provider();
    const SpoolSDK = useSpoolSDK();

    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [withdrawable, setWithdrawable] = useState<number>(0);
    const [fastWithdraw, setFastWithdraw] = useState<boolean>(false);


    useEffect(() => {
        const fetchWithdrawable = async () => {
            const balanceBreakdown = await SpoolSDK.views.userInfo.getUserBalanceBreakdown({
                userAddress: account?.toLowerCase() || "0x0",
                vaultAddress: smartVaultAddress
            })
            setWithdrawable(balanceBreakdown.withdrawableAssets[token.address])
        }

        fetchWithdrawable()
    }, []);

    const handleWithdraw = async () => {
        console.log(`${fastWithdraw ? 'Fast' : 'Regular'} withdrawing amount: ${parseUnits(amount, token.decimals).toString()}`);
        try {
            setLoading(true);
            if (!account) {
                throw new Error("No account")
            }
            const redeemBag = await SpoolSDK.views.userInfo.getMinimumBurnRedeemBag({
                userAddress: account.toLowerCase(),
                vaultAddress: smartVaultAddress,
                assetsToWithdraw: [+amount]
            })
            if(fastWithdraw){
                const tx = await SpoolSDK.mutations.withdraw.redeemFast(redeemBag, account, await latestBlock())
                await tx.wait()
            }
            else {
                const tx = await SpoolSDK.mutations.withdraw.redeem(redeemBag, account, false)
                await tx.wait()
            }
        }
        catch (err) {
            console.error('Failed to withdraw:', err);
        }
        finally {
            setLoading(false);
        }
    };

    const handleWithdrawMax = async () => {
        console.log(`${fastWithdraw ? 'Fast' : 'Regular'} withdrawing everything (${withdrawable})`);
        try {
            setLoading(true);
            if (!account) {
                throw new Error("No account")
            }
            const redeemBag = await SpoolSDK.views.userInfo.getMaxRedeemBag({
                userAddress: account.toLowerCase(),
                vaultAddress: smartVaultAddress
            })
            if(fastWithdraw){
                const tx = await SpoolSDK.mutations.withdraw.redeemFast(redeemBag, account, await latestBlock())
                await tx.wait()
            }
            else {
                const tx = await SpoolSDK.mutations.withdraw.redeem(redeemBag, account, false)
                await tx.wait()
            }
        }
        catch (err) {
            console.error('Failed to withdraw:', err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                label="Withdraw Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
            />
            <Box display='flex'>
                <Typography variant='body1' alignSelf='center'>
                    Fast Withdraw
                </Typography>
                <Switch
                    checked={fastWithdraw}
                    onChange={()=>setFastWithdraw(!fastWithdraw)}
                />
            </Box>
            <Box display='flex' flexDirection='column' gap={2}>
                {loading ? (
                    <Button fullWidth disabled>
                        <CircularProgress/>
                    </Button>
                ) : (
                    <Button fullWidth disabled={!account || !amount || +amount > withdrawable} variant="contained"
                            color="primary" onClick={handleWithdraw}>
                        Withdraw
                    </Button>)}
                {loading ? (
                    <Button fullWidth disabled>
                        <CircularProgress/>
                    </Button>
                ) : (
                    <Button fullWidth disabled={!account || !!amount} variant="contained" color="primary"
                            onClick={handleWithdrawMax}>
                        Withdraw All
                    </Button>
                )}
            </Box>
            <Typography variant="caption">Available amount to withdraw: {withdrawable}</Typography>
        </Box>
    );
};

export default WithdrawInput;