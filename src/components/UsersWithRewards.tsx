import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {UserVaults} from "@spool.fi/spool-v2-sdk";
import {useEffect, useState} from "react";
import {useSpoolSDK} from "@/context/SpoolSDKContext";

interface UsersWithRewardsProps {
    ownedSmartVaults: UserVaults[];
}

const UsersWithRewards:React.FC<UsersWithRewardsProps> = ({ownedSmartVaults}) => {
    const [selectedVault, setSelectedVault] = useState<string>('');
    const [rewards, setRewards] = useState<any[]>([]);
    const spoolSDK = useSpoolSDK();

    useEffect(() => {
        const fetchRewards = async () => {
            if (selectedVault) {
                try {
                    const response = await spoolSDK.views.rewards.getOffChainRewards('offchain_s');
                    const filteredRewards = response.rewards.filter(reward => reward.vaultAddress === selectedVault);
                    setRewards(filteredRewards);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        fetchRewards();
    }, [selectedVault, spoolSDK]);

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel id="vault-select-label">Select Vault</InputLabel>
                <Select
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
                                <TableCell>User Address</TableCell>
                                <TableCell>Token Address</TableCell>
                                <TableCell>Rewards</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rewards.map((reward) => (
                                <TableRow key={reward.userAddress}>
                                    <TableCell>{reward.userAddress}</TableCell>
                                    <TableCell>{reward.tokenAddress}</TableCell>
                                    <TableCell>{reward.rewards}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default UsersWithRewards;