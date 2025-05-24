import { Backdrop, LinearProgress, Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import useApplicationStore from 'store/useApplicationStore';

const GlobalLoader = () => {
    const { global, modules } = useApplicationStore(state => state.loader);
    
    // Проверяем активность любого лоадера
    const isLoading = global.isLoading || Object.values(modules).some(m => m.isLoading);
    
    // Получаем текст активного лоадера
    const loadingText = global.isLoading 
        ? global.text 
        : Object.values(modules).find(m => m.isLoading)?.text || 'Loading...';

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.modal + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}
            open={isLoading}
        >
            <Box
                width="320px"
                textAlign="center"
                p={3}
                borderRadius={2}
                bgcolor="background.paper"
                boxShadow={4}
            >
                <EmojiEventsIcon sx={{ fontSize: 70, color: '#000' }} />
                <Typography variant="h6" mt={2} color="text.primary">
                    {loadingText}
                </Typography>
                <LinearProgress
                    sx={{
                        mt: 3,
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#1976d2',
                        },
                    }}
                />
            </Box>
        </Backdrop>
    );
};

export default GlobalLoader;