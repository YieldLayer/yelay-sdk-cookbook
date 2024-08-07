"use client";

import React, {useEffect, useState} from 'react';
import {TextField, Button, Grid, CircularProgress} from '@mui/material';
import {useSpoolSDK} from "@/context/SpoolSDKContext";
import Box from "@mui/material/Box";

interface AddRewardInputProps {
    smarVaultAddress: string;
}

const AddRewardInput: React.FC<AddRewardInputProps> = ({smarVaultAddress}) => {

    const SpoolSDK = useSpoolSDK();

    const [tokenAddress, setTokenAddress] = useState<string>('');
    const [endTimestamp, setEndTimestamp] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);

    /*useEffect(() => {
        const isOwner = async () => {
            const vaultOwner = await SpoolSDK.views.vaultInfo.getVaultOwner({vaultAddress:smarVaultAddress});
            const owner = vaultInfo.
            console.log('isOwner:', isOwner);
        }
    }, []);*/

    const handleAddReward = async () => {
        try {
            setLoading(true);
            const endTimeInSeconds = Math.floor(new Date(endTimestamp).getTime() / 1000);
            await SpoolSDK.mutations.rewards.addRewardToken(smarVaultAddress, tokenAddress, endTimeInSeconds, amount)
        } catch (error) {
            console.error('Error adding reward:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                fullWidth
                label="Token Address"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />
            <TextField
                fullWidth
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="End Timestamp"
                    type="datetime-local"
                    value={endTimestamp}
                    onChange={(e) => setEndTimestamp(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            {loading ? (
                <Button variant="contained" disabled fullWidth>
                    <CircularProgress size={25}/>
                </Button>
            ) : (
                <Button variant="contained" fullWidth onClick={handleAddReward}>
                    Add Reward
                </Button>
            )}
        </Box>
    );
};

export default AddRewardInput;
