"use client";

import {useEffect, useState} from 'react';
import {Box, Button, CircularProgress} from '@mui/material';
import {useWeb3Provider} from "@/context/web3Context";
import {useYelaySDK} from "@/context/YelaySDKContext";
import Typography from "@mui/material/Typography";

interface ClaimInputProps {
    smartVaultAddress: string;
}

const ClaimInput: React.FC<ClaimInputProps> = ({smartVaultAddress}) => {

    const {account} = useWeb3Provider();
    const yelaySDK = useYelaySDK();

    const [loading, setLoading] = useState(false);
    const [hasClaimable, setHasClaimable] = useState<boolean>(false);


    useEffect(() => {
        const fetchClaimable = async () => {
            const balanceBreakdown = await yelaySDK.views.userInfo.getUserBalanceBreakdown({
                userAddress: account?.toLowerCase() || "0x0",
                vaultAddress: smartVaultAddress
            })
            setHasClaimable(!!balanceBreakdown.claimableWNFTs.length)
        }

        fetchClaimable()
    }, []);

    const handleClaim = async () => {
        console.log(`Claiming...`);
        try {
            setLoading(true);
            if (!account) {
                throw new Error("No account")
            }
            const balanceBreakdown = await yelaySDK.views.userInfo.getUserBalanceBreakdown({
                userAddress: account.toLowerCase(),
                vaultAddress: smartVaultAddress
            })
            const claimableWNFTs = balanceBreakdown.claimableWNFTs
            const tx = await yelaySDK.mutations.withdraw.claimWithdrawal(
                smartVaultAddress,
                claimableWNFTs.map(wNFT => wNFT.nftId),
                claimableWNFTs.map(_ => 1000000),
                account
            )
            await tx.wait()
        }
        catch (err) {
            console.error('Failed to claim withdrawal:', err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="caption">Available to claim: {hasClaimable ? 'yes' : 'no'}</Typography>
            <Box display='flex' flexDirection='column' gap={2}>
                {loading ? (
                    <Button fullWidth disabled>
                        <CircularProgress/>
                    </Button>
                ) : (
                    <Button fullWidth disabled={!account || !hasClaimable} variant="contained"
                            color="primary" onClick={handleClaim}>
                        Claim
                    </Button>)}
            </Box>
        </Box>
    );
};

export default ClaimInput;