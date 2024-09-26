import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from "next/link";
import ConnectWalletButton from "@/components/ConnectWalletButton";

const Navbar = () => {

    const navItems = [
        {
            name: 'Smart Vaults',
            link: '/'
        },
        {
            name: 'Rewards',
            link: '/rewards'
        },
    ];
    return (
            <AppBar position="fixed">
                <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Yelay Template
                        </Typography>
                    <Box display='flex' gap={1}>
                        {navItems.map((item) => (
                            <Button component={NextLink} href={item.link} key={item.link} sx={{ color: '#fff' }}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}/>
                    <Box sx={{pl: 2}}>
                        <ConnectWalletButton/>
                    </Box>
                </Toolbar>
            </AppBar>
    );
}

export default Navbar;