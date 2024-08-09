"use client";

import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

interface NoVaultsProps {
    message: string;
}

const NoVaults: React.FC<NoVaultsProps> = ({ message }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            <Typography variant="h4" component="h1">{message}</Typography>
        </Box>
    )
}

export default NoVaults;