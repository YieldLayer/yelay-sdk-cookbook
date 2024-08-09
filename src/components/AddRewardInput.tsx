"use client";

import React, {useState} from 'react';
import {TextField, Button, Grid, CircularProgress, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import {useSpoolSDK} from "@/context/SpoolSDKContext";
import Box from "@mui/material/Box";
import {UserVaults} from "@spool.fi/spool-v2-sdk";
import {parseUnits} from "ethers/lib/utils";

interface AddRewardInputProps {
    ownedSmartVaults: UserVaults[];
}

const AddRewardInput: React.FC<AddRewardInputProps> = ({ownedSmartVaults}) => {

    const SpoolSDK = useSpoolSDK();

    const [tokenName, setTokenName] = useState<string>('');
    const [endTimestamp, setEndTimestamp] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [selectedVault, setSelectedVault] = useState<string>('');

    const handleAddReward = async () => {
        const selected = ownedSmartVaults.find(vault => vault.smartVault.name === selectedVault)?.smartVault;
        const selectedAddress = selected?.address;
        if (selectedAddress) {
            try {
                console.log('Adding reward...');
                setLoading(true);
                const endTimeInSeconds = Math.floor(new Date(endTimestamp).getTime() / 1000);
                const amountInUnits = parseUnits(amount, selected?.assetGroup.tokens[0].decimals);
                await SpoolSDK.mutations.rewards.addOffChainReward('offchain_s', selectedAddress, tokenName, endTimeInSeconds, amountInUnits)
            } catch (error) {
                console.error('Error adding reward:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <FormControl fullWidth>
                <InputLabel id="vault-select-label">Select Vault</InputLabel>
                <Select
                    labelId="vault-select-label"
                    value={selectedVault}
                    onChange={(e) => setSelectedVault(e.target.value)}
                    label="Select Vault"
                >
                    {ownedSmartVaults.map((smartVault) => (
                        <MenuItem key={smartVault.smartVault.address} value={smartVault.smartVault.name}>
                            {smartVault.smartVault.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
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
                <Button variant="contained" fullWidth disabled={!selectedVault || !tokenName || !amount || !endTimestamp} onClick={handleAddReward}>
                    Add Reward
                </Button>
            )}
        </Box>
    );
};

export default AddRewardInput;
