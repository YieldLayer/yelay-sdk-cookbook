import React, { useState } from 'react';
import {Box, Button, CircularProgress, TextField} from '@mui/material';
import {RewardConfiguration} from "@spool.fi/spool-v2-sdk";
import {useYelaySDK} from "@/context/YelaySDKContext";

interface ChangeRewardRateInputProps {
    rewardConfiguration: RewardConfiguration;
}

const ChangeRewardRateInput: React.FC<ChangeRewardRateInputProps> = ({ rewardConfiguration }) => {

    const yelaySDK = useYelaySDK();

    const [newRewardRate, setNewRewardRate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRecalculateClick = async () => {
        if (+newRewardRate > 1) {
            try {
                console.log('Recalculate reward rate...');
                setLoading(true);
                const updatedRewardConf = {
                    ...rewardConfiguration,
                    rewardRate: newRewardRate
                };
                const tx = await yelaySDK.mutations.rewards.recalculateOffchainRewards('offchain_s', updatedRewardConf)
                if (!tx.error){
                    console.log('Reward rate recalculated successfully');
                }
            } catch (error) {
                console.error('Error adding reward:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <TextField
                label="New Reward Rate"
                variant="outlined"
                size="small"
                value={newRewardRate}
                onChange={(e) => setNewRewardRate(e.target.value)}
                type="number"
            />
            {loading ? (
                <Button variant="contained" disabled fullWidth>
                    <CircularProgress size={20}/>
                </Button>
            ) : (
                <Button size='small' variant="contained" color="primary" disabled={!newRewardRate || parseInt(rewardConfiguration.endTime) <= Date.now() / 1000} onClick={handleRecalculateClick}>
                    Recalculate
                </Button>
            )}
        </Box>
    );
};

export default ChangeRewardRateInput;