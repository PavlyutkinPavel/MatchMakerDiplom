import * as React from 'react';
import {alpha, styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import {Link} from "react-router-dom";
import BasicMenu from "../../UI/BasicMenu";
import AccountMenu from "../../UI/AccountMenu";
import useApplicationStore from "../../utils/store/store";

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function AppAppBar() {
    const [open, setOpen] = React.useState(false);

    const { isAuthenticated} = useApplicationStore();

    const [openMenu, setOpenMenu] = React.useState(null);

    const handleOpenMenu = (event, menuId) => {
        setOpenMenu(menuId);
    };

    const handleCloseMenu = () => {
        setOpenMenu(null);
    };


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
            onMouseLeave={handleCloseMenu}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters onMouseLeave={handleCloseMenu}>
                    <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', px: 0}}>
                        <Button component={Link} to="/" color="primary" sx={{height: '50px'}}>
                            <Sitemark/>
                        </Button>
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                            <BasicMenu
                                title="Quick start"
                                menuId="start"
                                openMenu={openMenu}
                                onOpen={handleOpenMenu}
                                onClose={handleCloseMenu}
                                menuItems={[{label: "Team management", path: '/team'}, {label: "Tournaments", path: '/tournament'}]}
                            />
                            <Button component={Link} to="/" variant="text" color="info" size="small">
                                <strong>Blog</strong>
                            </Button>
                            <Button variant="text" color="info" size="small">
                                <strong>Upcoming events</strong>
                            </Button>
                            <Button variant="text" color="info" size="small">
                                <strong>Highlights</strong>
                            </Button>
                            <Button component={Link} to="/pricing" variant="text" color="info" size="small">
                                <strong>Pricing</strong>
                            </Button>
                            <Button component={Link} to="/faq" variant="text" color="info" size="small" sx={{minWidth: 0}}>
                                <strong>FAQ</strong>
                            </Button>
                            <Button component={Link} to="/reviews" variant="text" color="info" size="small" sx={{minWidth: 0}}>
                                <strong>Reviews</strong>
                            </Button>
                        </Box>
                    </Box>

                    {isAuthenticated
                        ? (<>
                            <AccountMenu
                                username="Иван Иванов"
                                avatar_url="https://example.com/avatars/ivan.jpg"
                            />
                        </>)
                        : (<>
                            <Button component={Link} to="/signin" color="primary" size="small">
                                Sign in
                            </Button>
                            <Button component={Link} to="/signup" color="primary" variant="contained" size="small">
                                Sign up
                            </Button>
                        </>)
                    }
                    <Box
                        sx={{
                            display: {xs: 'none', md: 'flex'},
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <ColorModeIconDropdown/>
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}, gap: 1}}>
                        <ColorModeIconDropdown size="medium"/>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{p: 2, backgroundColor: 'background.default'}}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon/>
                                    </IconButton>
                                </Box>
                                <MenuItem>Features</MenuItem>
                                <MenuItem>Testimonials</MenuItem>
                                <MenuItem>Highlights</MenuItem>
                                <MenuItem>Pricing</MenuItem>
                                <MenuItem>FAQ</MenuItem>
                                <MenuItem>Blog</MenuItem>
                                <Divider sx={{my: 3}}/>
                                <MenuItem>
                                    <Button component={Link} to="/signin" color="primary" variant="text" size="small">
                                        Sign in
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button component={Link} to="/signup" color="primary" variant="contained"
                                            size="small">
                                        Sign up
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}