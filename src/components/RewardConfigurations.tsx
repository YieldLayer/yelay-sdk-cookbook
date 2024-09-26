import React, { useState, useEffect } from 'react';
import { UserVaults } from "@spool.fi/spool-v2-sdk";
import { Box, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useYelaySDK } from "@/context/YelaySDKContext";
import {Check, Close} from "@mui/icons-material";
import ChangeRewardRateInput from "@/components/ChangeRewardRateInput";

interface RewardConfigurationsProps {
    ownedSmartVaults: UserVaults[];
}

const RewardConfigurations: React.FC<RewardConfigurationsProps> = ({ ownedSmartVaults }) => {
    const [selectedVault, setSelectedVault] = useState<string>('');
    const [configurations, setConfigurations] = useState<any[]>([]);
    const yelaySDK = useYelaySDK();

    useEffect(() => {
        const fetchConfigurations = async () => {
            if (selectedVault) {
                try {
                    const response = await yelaySDK.views.rewards.getAllRewardConfigs("offchain_s");
                    const filteredConfigurations = response.configurations.filter(config => config.vaultAddress === selectedVault);
                    setConfigurations(filteredConfigurations);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchConfigurations();
    }, [selectedVault, yelaySDK]);

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="vault-select-label">Select Vault</InputLabel>
                <Select
                    variant='outlined'
                    labelId="vault-select-label"
                    value={selectedVault}
                    onChange={(e) => setSelectedVault(e.target.value)}
                    label="Select Vault"
                >
                    {ownedSmartVaults.map((smartVault) => (
                        <MenuItem key={smartVault.smartVault.address} value={smartVault.smartVault.address}>
                            {smartVault.smartVault.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedVault && (
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Active</TableCell>
                                <TableCell>Block Number</TableCell>
                                <TableCell>Reward Rate</TableCell>
                                <TableCell>Token Address</TableCell>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell>Change Reward rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {configurations.map((config) => (
                                <TableRow key={config.blockNumber}>
                                    <TableCell>
                                        {parseInt(config.endTime) > Date.now() / 1000 ? <Check sx={{color: 'gray'}}/> : <Close sx={{color: 'gray'}}/>}
                                    </TableCell>
                                    <TableCell>{config.blockNumber}</TableCell>
                                    <TableCell>{config.rewardRate}</TableCell>
                                    <TableCell>{config.tokenAddress}</TableCell>
                                    <TableCell>{config.timestamp}</TableCell>
                                    <TableCell>{config.endTime}</TableCell>
                                    <TableCell>
                                        <ChangeRewardRateInput rewardConfiguration={config}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default RewardConfigurations;