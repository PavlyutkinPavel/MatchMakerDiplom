import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
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
import { Link } from "react-router-dom";
import AccountMenu from "../../UI/AccountMenu";
import useApplicationStore from 'store/useApplicationStore';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
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


    const isAuthenticated = useApplicationStore((state) => state.auth.isAuthenticated);

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
            }}
            onMouseLeave={handleCloseMenu}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters onMouseLeave={handleCloseMenu}>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <Button component={Link} to="/" color="primary" sx={{ height: '50px' }}>
                            <Sitemark />
                        </Button>


                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {isAuthenticated
                                ? (<>
                                    <Button
                                        component={Link}
                                        to="/team"
                                        variant="text"
                                        color="info"
                                        size="small"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            mx: 0.5,
                                            fontWeight: 600,
                                            position: 'relative',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 4,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 0,
                                                height: 2,
                                                bgcolor: 'primary.main',
                                                transition: 'width 0.3s ease',
                                            },
                                            '&:hover:after': {
                                                width: '60%',
                                            },
                                        }}
                                    >
                                        Team management
                                    </Button>
                                    <Button component={Link} to="/tournament" variant="text" color="info" size="small"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            mx: 0.5,
                                            fontWeight: 600,
                                            position: 'relative',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:after': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 4,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 0,
                                                height: 2,
                                                bgcolor: 'primary.main',
                                                transition: 'width 0.3s ease',
                                            },
                                            '&:hover:after': {
                                                width: '60%',
                                            },
                                        }}
                                    >
                                        <strong>Tournaments</strong>
                                    </Button>
                                </>)
                                : (<>
                                </>)
                            }
                            <Button component={Link} to="/blog" variant="text" color="info" size="small"
                                sx={{
                                    px: 2,
                                    py: 1,
                                    mx: 0.5,
                                    fontWeight: 600,
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 4,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 2,
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover:after': {
                                        width: '60%',
                                    },
                                }}
                            >
                                <strong>Blog</strong>
                            </Button>
                            <Button component={Link} to="/upcoming_events" variant="text" color="info" size="small"
                                sx={{
                                    px: 2,
                                    py: 1,
                                    mx: 0.5,
                                    fontWeight: 600,
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 4,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 2,
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover:after': {
                                        width: '60%',
                                    },
                                }}
                            >
                                <strong>Upcoming events</strong>
                            </Button>
                            <Button component={Link} to="/highlights" variant="text" color="info" size="small"
                                sx={{
                                    px: 2,
                                    py: 1,
                                    mx: 0.5,
                                    fontWeight: 600,
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 4,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 2,
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover:after': {
                                        width: '60%',
                                    },
                                }}
                            >
                                <strong>Highlights</strong>
                            </Button>
                            <Button component={Link} to="/pricing" variant="text" color="info" size="small"
                                sx={{
                                    px: 2,
                                    py: 1,
                                    mx: 0.5,
                                    fontWeight: 600,
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 4,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 2,
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover:after': {
                                        width: '60%',
                                    },
                                }}
                            >
                                <strong>Pricing</strong>
                            </Button>
                            <Button component={Link} to="/faq" variant="text" color="info" size="small"
                                sx={{
                                    px: 2,
                                    py: 1,
                                    mx: 0.5,
                                    fontWeight: 600,
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 4,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 2,
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover:after': {
                                        width: '60%',
                                    },
                                }}
                            >
                                <strong>FAQ</strong>
                            </Button>
                            <Button component={Link} to="/reviews" variant="text" color="info" size="small"
                                sx={{
                                    px: 2,
                                    py: 1,
                                    mx: 0.5,
                                    fontWeight: 600,
                                    position: 'relative',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 4,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 2,
                                        bgcolor: 'primary.main',
                                        transition: 'width 0.3s ease',
                                    },
                                    '&:hover:after': {
                                        width: '60%',
                                    },
                                }}
                            >
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
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <ColorModeIconDropdown />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <ColorModeIconDropdown size="medium" />
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            transitionDuration={500}
                            PaperProps={{
                                sx: {
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: 3,
                                    px: 3,
                                    pt: 2,
                                },
                            }}
                        >

                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>Features</MenuItem>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>Testimonials</MenuItem>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>Highlights</MenuItem>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>Pricing</MenuItem>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>FAQ</MenuItem>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>Blog</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>
                                    <Button component={Link} to="/signin" color="primary" variant="text" size="small">
                                        Sign in
                                    </Button>
                                </MenuItem>
                                <MenuItem sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                    },
                                }}>
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