"use client";

import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

interface ErrorProps {
    error: Error;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
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
            <Typography variant="h4" component="h1">Error: {error.message}</Typography>
        </Box>
    )
}

export default Error;