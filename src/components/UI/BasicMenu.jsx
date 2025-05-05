import React from 'react';
import { Box, Button, Menu, MenuItem, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BasicMenu({ title, menuId, openMenu, onOpen, onClose, menuItems = [], menuWidth = 600 }) {
    const anchorRef = React.useRef(null);
    const isOpen = openMenu === menuId;
    const closeTimeout = React.useRef(null);
    const navigate = useNavigate();

    const handleMouseEnter = (event) => {
        clearTimeout(closeTimeout.current);
        onOpen(event, menuId);
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            onClose();
        }, 1);
    };

    const handleMenuItemClick = (path) => {
        onClose();
        if (path) {
            navigate(path);
        }
    };

    return (
        <Box>
            <Button
                ref={anchorRef}
                onMouseEnter={handleMouseEnter}
            >
                <strong>{title}</strong>
            </Button>
            <Menu
                anchorEl={anchorRef.current}
                open={isOpen}
                onClose={onClose}
                MenuListProps={{
                    onMouseLeave: handleMouseLeave,
                    onMouseEnter: handleMouseEnter,
                }}
                PaperProps={{
                    sx: { width: menuWidth, padding: 1 },
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                {menuItems.length > 0 ? (
                    <Paper sx={{ width: '100%', padding: 1, textAlign: 'center' }}>
                        <Grid container spacing={1}>
                            {menuItems.map((item, index) => (
                                <Grid item xs={12 / (menuItems.length === 1 ? 1 : menuItems.length === 2 ? 2 : 3)} key={index}>
                                    <MenuItem onClick={() => handleMenuItemClick(item.path)}>{item.label}</MenuItem>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                ) : (
                    <MenuItem disabled>No items</MenuItem>
                )}
            </Menu>
        </Box>
    );
}
