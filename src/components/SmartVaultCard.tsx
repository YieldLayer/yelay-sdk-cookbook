"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/navigation";

interface SmartVaultProps {
    name: string;
    link: string;
}

const SmartVaultCard: React.FC<SmartVaultProps> = ({name, link}) => {

    const router = useRouter();

    return (
        <Box sx={{boxShadow: 1, p: 4, overflow: 'hidden', cursor: 'pointer'}} onClick={()=>router.push(`/smart-vaults/${link}`)}>
            <Typography variant='h4'>{name}</Typography>
            <Typography variant='body1'>{link}</Typography>
        </Box>
    );
}

export default SmartVaultCard;