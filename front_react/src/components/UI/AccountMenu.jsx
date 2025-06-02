import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import useApplicationStore from 'store/useApplicationStore';

export default function AccountMenu({ username = 'User', avatar_url = '' }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const logOut = useApplicationStore((state) => state.auth.logOut);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        setAnchorEl(null);
        setTimeout(() => navigate("/profile"), 1000);
    };

    const handleContacts = () => {
        setAnchorEl(null);
        setTimeout(() => navigate("/contacts"), 1000);
    }

    const handleLogout = () => {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem('userId');
        logOut()
        setAnchorEl(null);
        navigate('/');
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', mr: 1 }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{
                            p: 0,         // Убираем padding
                            m: 0,         // Убираем margin (если нужно)
                            borderRadius: '50%', // Делаем кнопку круглой
                            overflow: 'hidden',  // Обрезаем углы
                            '&:hover': {
                                backgroundColor: 'transparent', // Убираем фон при наведении
                            },
                            '& .MuiTouchRipple-root': { // Отключаем анимацию ripple-эффекта (опционально)
                                display: 'none',
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                // Если нужно, можно добавить border (опционально)
                                border: '1px solid transparent',
                            }}
                            src={avatar_url || undefined}
                        >
                            {!avatar_url && username[0]?.toUpperCase()}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleProfile}>
                    <Avatar /> Profile
                </MenuItem>
                <MenuItem onClick={handleContacts}>
                    <Avatar /> Contacts
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}