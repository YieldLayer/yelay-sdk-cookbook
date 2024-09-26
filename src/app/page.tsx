"use client";

import Container from '@mui/material/Container';
import SmartVaultCard from "@/components/SmartVaultCard";
import {Grid} from "@mui/material";
import {useYelaySDK} from "@/context/YelaySDKContext";
import {useEffect, useState} from "react";
import {VaultInfo} from "@spool.fi/spool-v2-sdk";
import Error from "@/components/Error";
import Loading from "@/components/Loading";

const Home = () => {

    const yelaySDK = useYelaySDK();

    const [smartVaults, setSmartVaults] = useState<VaultInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchSmartVaults = async () => {
            try {
                setLoading(true);
                const response = await yelaySDK.views.general.listVaults({limit: 10, offset: 0});
                setSmartVaults(response);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchSmartVaults();
    }, [yelaySDK]);

    if (loading) {
        return <Loading/>
    }

    if (error) {
        return <Error error={error}/>
    }

    return (
        <Container maxWidth="lg">

                <Grid
                    container spacing={{xs: 2, md: 3}}
                >
                    {smartVaults.map((smartVault, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index}>
                            <SmartVaultCard key={smartVault.address} name={smartVault.name} link={smartVault.address}/>
                        </Grid>
                    ))}
                </Grid>
        </Container>
    );
}

export default Home;