"use client";

import {useCallback, useEffect, useState} from 'react';
import {Box, Button, CircularProgress, TextField} from '@mui/material';
import {useWeb3Provider} from "@/context/web3Context";
import Typography from "@mui/material/Typography";
import {BigNumber} from "ethers";
import {TokenInfo} from "@spool.fi/spool-v2-sdk";

interface ApproveInputProps {
    smartVaultAddress: string;
    token: TokenInfo;
}

const DepositInput: React.FC<ApproveInputProps> = ({smartVaultAddress, token}) => {

    const {account, checkAllowance, approve} = useWeb3Provider();

    const [amount, setAmount] = useState('');
    const [allowance, setAllowance] = useState<string>('0');
    const [loading, setLoading] = useState(false);

    const fetchAllowance = useCallback(async () => {
        try {
            setLoading(true);
            if (account) {
                const allowance = await checkAllowance(token.address, account);
                setAllowance(allowance);
            }
        } finally {
            setLoading(false);
        }
    }, [account, checkAllowance, token.address]);

    useEffect(() => {
        fetchAllowance();
    }, [fetchAllowance]);

    const handleApprove = async () => {
        console.log(`Approving amount: ${amount}`);
        try {
            setLoading(true);
            await approve(token.address, BigNumber.from(amount).mul(BigNumber.from(10).pow(token.decimals)).toString());
            await fetchAllowance();
        }
        catch (err) {
            console.error('Failed to approve:', err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                label="Approve Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
            />
            <Typography variant="caption">Approved amount to deposit into this vault: {allowance?.toString()}</Typography>
            {loading ? (
                <Button disabled>
                    <CircularProgress />
                </Button>
            ):(
            <Button disabled={!account || !amount} variant="contained" color="warning" onClick={handleApprove}>
                Approve
            </Button>
            )}
        </Box>
    );
};

export default DepositInput;