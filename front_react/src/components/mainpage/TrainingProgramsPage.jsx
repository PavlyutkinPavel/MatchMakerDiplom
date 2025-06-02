import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    Container,
    CardContent,
    Paper,
    Typography,
    Modal,
    Backdrop,
    Fade,
    Stack,
    TextField,
    CircularProgress,
    LinearProgress,
    Chip,
    Avatar,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Tabs,
    Tab,
    IconButton,
    Divider,
    CssBaseline,
    Alert,
    Snackbar
} from "@mui/material";
import { styled } from "@mui/system";
import PaymentIcon from "@mui/icons-material/Payment";
import GoogleIcon from "@mui/icons-material/Google";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Add from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import TimerIcon from "@mui/icons-material/Timer";
import StarIcon from "@mui/icons-material/Star";
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";
import useApplicationStore from "../../store/useApplicationStore";
import user from "../../store/modules/user";
import StudentProgressManager from './StudentProgressManager'; // путь к вашему новому компоненту
import GroupIcon from "@mui/icons-material/Group"; // для иконки управления учениками

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    padding: theme.spacing(2),
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
    },
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
}));

// API базовый URL - замените на ваш реальный URL
const API_BASE_URL = 'http://localhost:8080';

// API сервис
const apiService = {
    // Получить все программы
    getAllPrograms: async () => {
        const response = await fetch(`${API_BASE_URL}/training-programs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to fetch programs');
        return await response.json();
    },

    // Получить программы тренера
    getMyPrograms: async () => {
        const response = await fetch(`${API_BASE_URL}/training-programs/my`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to fetch my programs');
        return await response.json();
    },

    // Получить купленные программы
    getPurchasedPrograms: async () => {
        const response = await fetch(`${API_BASE_URL}/training-programs/purchased`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to fetch purchased programs');
        return await response.json();
    },

    // Создать программу
    createProgram: async (programData) => {
        const response = await fetch(`${API_BASE_URL}/training-programs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
            body: JSON.stringify(programData),
        });
        if (!response.ok) throw new Error('Failed to create program');
        return await response.json();
    },

    // Обновить программу
    updateProgram: async (id, programData) => {
        const response = await fetch(`${API_BASE_URL}/training-programs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
            body: JSON.stringify(programData),
        });
        if (!response.ok) throw new Error('Failed to update program');
        return await response.json();
    },

    // Удалить программу
    deleteProgram: async (id) => {
        const response = await fetch(`${API_BASE_URL}/training-programs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to delete program');
    },

    // Купить программу
    purchaseProgram: async (id, paymentMethod) => {
        const response = await fetch(`${API_BASE_URL}/training-programs/${id}/purchase?paymentMethod=${paymentMethod}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to purchase program');
        return await response.json();
    },

    // Обновить прогресс
    updateProgress: async (id, progress) => {
        const response = await fetch(`${API_BASE_URL}/training-programs/${id}/progress?progress=${progress}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to update progress');
    },

    // Поиск программ
    searchPrograms: async (keyword) => {
        const response = await fetch(`${API_BASE_URL}/training-programs/search?keyword=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to search programs');
        return await response.json();
    }
};

export default function TrainingProgramsPage() {
    // Состояние для модального окна управления учениками
    const [studentsModalOpen, setStudentsModalOpen] = useState(false);
    const [selectedProgramForStudents, setSelectedProgramForStudents] = useState(null);
    const store = useApplicationStore();
    const [programs, setPrograms] = useState([]);
    const [myPrograms, setMyPrograms] = useState([]);
    const [purchasedPrograms, setPurchasedPrograms] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [userRole, setUserRole] = useState('USER'); // 'COACH' or 'USER'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Payment modal states
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Program creation/edit modal states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [programForm, setProgramForm] = useState({
        title: "",
        description: "",
        price: "",
        sportType: "",
        difficultyLevel: "BEGINNER",
        durationWeeks: "",
        sessionsPerWeek: "",
        content: "",
        currency: "RUB"
    });

    // Snackbar states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const role = store.user.myAuth?.inGameRole || 'USER';
        setUserRole(role);
    }, [store.user.myAuth]);

    useEffect(() => {
        loadData();
    }, [userRole]);


    const loadData = async () => {
        setLoading(true);
        try {
            const [allPrograms, purchased, myProgramsData] = await Promise.allSettled([
                apiService.getAllPrograms(),
                apiService.getPurchasedPrograms(),
                userRole === 'COACH' ? apiService.getMyPrograms() : Promise.resolve([])
            ]);

            if (allPrograms.status === 'fulfilled') {
                setPrograms(allPrograms.value);
            }
            if (purchased.status === 'fulfilled') {
                setPurchasedPrograms(purchased.value);
            }
            if (myProgramsData.status === 'fulfilled') {
                setMyPrograms(myProgramsData.value);
            }
        } catch (error) {
            showError('Ошибка загрузки данных: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const showError = (message) => {
        setSnackbar({
            open: true,
            message,
            severity: 'error'
        });
    };

    const showSuccess = (message) => {
        setSnackbar({
            open: true,
            message,
            severity: 'success'
        });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleClosePayment = () => {
        setPaymentOpen(false);
        setSelectedProgram(null);
    };

    const handleOpenPayment = (program) => {
        setSelectedProgram(program);
        setPaymentOpen(true);
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setCardHolder("");
        setIsPaying(false);
    };

    const handlePayment = async (method) => {
        if (cardNumber.replace(/\s/g, "").length !== 16) {
            showError("Введите корректный номер карты");
            return;
        }

        setIsPaying(true);

        try {
            await apiService.purchaseProgram(selectedProgram.id, method);

            const updatedPrograms = programs.map(p =>
                p.id === selectedProgram.id
                    ? {...p, isPurchased: true, userProgress: 0}
                    : p
            );
            setPrograms(updatedPrograms);

            const purchasedProgram = {...selectedProgram, isPurchased: true, userProgress: 0};
            setPurchasedPrograms(prev => [...prev, purchasedProgram]);
            console.log('test try')
            showSuccess("Программа успешно приобретена!");
        } catch (error) {
            console.log('test catch')
            setNotification({
                open: true,
                message: 'Ошибка покупки программы. Попробуйте еще раз.',
                severity: 'error'
            });
            showError('Ошибка при покупке: ' + error.message);
        } finally {
            console.log('test finally')
            setIsPaying(false);
            handleClosePayment();
        }
    };

    const handleOpenDialog = (program = null) => {
        if (program) {
            setEditingProgram(program);
            setProgramForm({
                id: program.id || "",
                title: program.title || "",
                description: program.description || "",
                price: program.price?.toString() || "",
                sportType: program.sportType || "",
                difficultyLevel: program.difficultyLevel || "BEGINNER",
                durationWeeks: program.durationWeeks?.toString() || "",
                sessionsPerWeek: program.sessionsPerWeek?.toString() || "",
                content: program.content || "",
                currency: program.currency || "RUB"
            });
        } else {
            setEditingProgram(null);
            setProgramForm({
                id: "",
                title: "",
                description: "",
                price: "",
                sportType: "",
                difficultyLevel: "BEGINNER",
                durationWeeks: "",
                sessionsPerWeek: "",
                content: "",
                currency: "RUB"
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingProgram(null);
    };

    const handleSaveProgram = async () => {
        try {
            const programData = {
                ...programForm,
                price: parseFloat(programForm.price),
                durationWeeks: parseInt(programForm.durationWeeks),
                sessionsPerWeek: parseInt(programForm.sessionsPerWeek),
            };

            let savedProgram;
            if (editingProgram) {
                savedProgram = await apiService.updateProgram(editingProgram.id, programData);
                setMyPrograms(prev => prev.map(p => p.id === editingProgram.id ? savedProgram : p));
                setPrograms(prev => prev.map(p => p.id === editingProgram.id ? savedProgram : p));
                showSuccess('Программа успешно обновлена!');
            } else {
                savedProgram = await apiService.createProgram(programData);
                setMyPrograms(prev => [...prev, savedProgram]);
                setPrograms(prev => [...prev, savedProgram]);
                showSuccess('Программа успешно создана!');
            }

            handleCloseDialog();
        } catch (error) {
            showError('Ошибка при сохранении: ' + error.message);
        }
    };

    const handleDeleteProgram = async (programId) => {
        if (window.confirm("Вы уверены, что хотите удалить эту программу?")) {
            try {
                await apiService.deleteProgram(programId);
                setMyPrograms(prev => prev.filter(p => p.id !== programId));
                setPrograms(prev => prev.filter(p => p.id !== programId));
                showSuccess('Программа успешно удалена!');
            } catch (error) {
                showError('Ошибка при удалении: ' + error.message);
            }
        }
    };

    const getDifficultyColor = (level) => {
        switch (level) {
            case "BEGINNER":
                return "success";
            case "INTERMEDIATE":
                return "warning";
            case "ADVANCED":
                return "error";
            case "EXPERT":
                return "secondary";
            default:
                return "default";
        }
    };

    const getDifficultyLabel = (level) => {
        switch (level) {
            case "BEGINNER":
                return "Начинающий";
            case "INTERMEDIATE":
                return "Средний";
            case "ADVANCED":
                return "Продвинутый";
            case "EXPERT":
                return "Эксперт";
            default:
                return level;
        }
    };

    const formatPrice = (price, currency = 'RUB') => {
        if (typeof price === 'number') {
            return `${price.toLocaleString()} ${currency === 'RUB' ? '₽' : currency}`;
        }
        return `${price} ${currency === 'RUB' ? '₽' : currency}`;
    };

    const handleOpenStudentsModal = (program) => {
        setSelectedProgramForStudents(program);
        setStudentsModalOpen(true);
    };

    const handleCloseStudentsModal = () => {
        setStudentsModalOpen(false);
        setSelectedProgramForStudents(null);
    };

    const handleProgressUpdate = (programId, studentId, newProgress) => {
        // Обновляем данные в основном компоненте при необходимости
        console.log(`Прогресс обновлен: программа ${programId}, ученик ${studentId}, прогресс ${newProgress}%`);
    };

    const renderProgramCard = (program, showActions = false) => (
        <Grid item xs={12} sm={6} md={4} key={program.id}>
            <StyledCard>
                <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <FitnessCenterIcon color="primary"/>
                        <Typography variant="h6" fontWeight="bold">
                            {program.title}
                        </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        {program.description}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1}}>
                        <Avatar sx={{width: 24, height: 24, fontSize: 12}}>
                            {program.coachName?.[0] || 'T'}
                        </Avatar>
                        <Typography variant="body2">{program.coachName}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{mb: 1}}>
                        <Chip
                            label={getDifficultyLabel(program.difficultyLevel)}
                            size="small"
                            color={getDifficultyColor(program.difficultyLevel)}
                        />
                        <Chip
                            label={program.sportType}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{mb: 1}}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <TimerIcon fontSize="small"/>
                            <Typography variant="caption">
                                {program.durationWeeks} нед.
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <SchoolIcon fontSize="small"/>
                            <Typography variant="caption">
                                {program.sessionsPerWeek}/нед
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <PersonIcon fontSize="small"/>
                            <Typography variant="caption">
                                {program.studentsCount || 0}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                        <StarIcon color="warning" fontSize="small"/>
                        <Typography variant="body2">
                            {program.rating || 0}/5
                        </Typography>
                    </Stack>

                    {program.isPurchased && program.userProgress !== undefined && (
                        <>
                            <Typography variant="caption" color="text.secondary">
                                Прогресс изучения:
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={program.userProgress}
                                sx={{height: 8, borderRadius: 5, mb: 1}}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {program.userProgress}%
                            </Typography>
                        </>
                    )}

                    <Divider sx={{my: 1}}/>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary" fontWeight="bold">
                            {formatPrice(program.price, program.currency)}
                        </Typography>

                        <Box>
                            {showActions ? (
                                    <Stack direction="row" spacing={1}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(program)}
                                            color="primary"
                                            title="Редактировать"
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenStudentsModal(program)}
                                            color="secondary"
                                            title="Управление учениками"
                                        >
                                            <GroupIcon/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteProgram(program.id)}
                                            color="error"
                                            title="Удалить"
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Stack>
                                ) : program.isPurchased ? (
                                <Typography color="success.main" fontWeight="bold">
                                    Приобретено ✅
                                </Typography>
                            ) : (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleOpenPayment(program)}
                                >
                                    Купить
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </StyledCard>
        </Grid>
    );

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container maxWidth="xl" sx={{ pt: 8, pb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        backgroundImage: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Программы тренировок
                </Typography>

                {loading && (
                    <Box display="flex" justifyContent="center" mb={3}>
                        <CircularProgress />
                    </Box>
                )}

                <Paper elevation={3} sx={{borderRadius: 4, mb: 3}}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{borderBottom: 1, borderColor: 'divider'}}
                    >
                        <Tab label="Все программы"/>
                        <Tab label="Мои покупки"/>
                        {userRole === 'COACH' && <Tab label="Мои программы"/>}
                    </Tabs>

                    <Box sx={{p: 3}}>
                        {tabValue === 0 && (
                            <Grid container spacing={3}>
                                {programs.map(program => renderProgramCard(program))}
                                {programs.length === 0 && !loading && (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="text.secondary" textAlign="center">
                                            Программы не найдены
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {tabValue === 1 && (
                            <Grid container spacing={3}>
                                {purchasedPrograms.length > 0 ? (
                                    purchasedPrograms.map(program => renderProgramCard(program))
                                ) : (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="text.secondary" textAlign="center">
                                            У вас пока нет купленных программ
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        )}

                        {tabValue === 2 && userRole === 'COACH' && (
                            <Grid container spacing={3}>
                                {myPrograms.map(program => renderProgramCard(program, true))}
                                {myPrograms.length === 0 && !loading && (
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color="text.secondary" textAlign="center">
                                            У вас пока нет созданных программ
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Box>
                </Paper>

                {/* FAB for coaches */}
                {userRole === 'COACH' && tabValue === 2 && (
                    <Fab
                        color="primary"
                        aria-label="add training program"
                        onClick={() => handleOpenDialog()}
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                            boxShadow: '0 8px 16px rgba(63, 81, 181, 0.3)',
                            '&:hover': {
                                boxShadow: '0 12px 24px rgba(63, 81, 181, 0.4)',
                            }
                        }}
                    >
                        <Add/>
                    </Fab>
                )}

                {/* Payment Modal */}
                <Modal
                    open={paymentOpen}
                    onClose={handleClosePayment}
                    closeAfterTransition
                    slots={{backdrop: Backdrop}}
                    slotProps={{backdrop: {timeout: 500}}}
                >
                    <Fade in={paymentOpen}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 450,
                                bgcolor: "background.paper",
                                borderRadius: 4,
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            {selectedProgram && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        Оплата программы тренировок
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{mb: 2}}>
                                        {selectedProgram.title}
                                    </Typography>
                                    <Typography variant="h5" color="primary" sx={{mb: 3}}>
                                        {formatPrice(selectedProgram.price, selectedProgram.currency)}
                                    </Typography>

                                    <Stack spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Номер карты"
                                            placeholder="0000 0000 0000 0000"
                                            variant="outlined"
                                            value={cardNumber}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                let formatted = val.match(/.{1,4}/g)?.join(" ") || "";
                                                setCardNumber(formatted);
                                            }}
                                            error={cardNumber.replace(/\s/g, "").length !== 16 && cardNumber.length > 0}
                                            helperText={
                                                cardNumber.replace(/\s/g, "").length !== 16 && cardNumber.length > 0
                                                    ? "Введите 16-значный номер карты"
                                                    : " "
                                            }
                                        />

                                        <Box display="flex" gap={2}>
                                            <TextField
                                                label="Срок действия (MM/YY)"
                                                placeholder="MM/YY"
                                                value={expiry}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                    if (val.length >= 3) {
                                                        val = `${val.slice(0, 2)}/${val.slice(2)}`;
                                                    }
                                                    setExpiry(val);
                                                }}
                                                error={expiry.length > 0 && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)}
                                                helperText={
                                                    expiry.length > 0 && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ? "Формат MM/YY" : " "
                                                }
                                                fullWidth
                                            />

                                            <TextField
                                                label="CVV"
                                                placeholder="***"
                                                type="password"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                                error={cvv.length > 0 && cvv.length !== 3}
                                                helperText={cvv.length > 0 && cvv.length !== 3 ? "3 цифры" : " "}
                                                fullWidth
                                            />
                                        </Box>

                                        <TextField
                                            fullWidth
                                            label="Имя владельца"
                                            placeholder="IVAN IVANOV"
                                            value={cardHolder}
                                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                            error={cardHolder.length > 0 && cardHolder.length < 2}
                                            helperText={cardHolder.length > 0 && cardHolder.length < 2 ? "Введите имя" : " "}
                                        />

                                        <Stack direction="row" spacing={2} sx={{mt: 2}} justifyContent="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<PaymentIcon/>}
                                                onClick={() => handlePayment("card")}
                                                disabled={isPaying}
                                            >
                                                Оплатить картой
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<GoogleIcon/>}
                                                onClick={() => handlePayment("google")}
                                                disabled={isPaying}
                                            >
                                                Google Pay
                                            </Button>
                                        </Stack>

                                        {isPaying && (
                                            <Box sx={{display: "flex", justifyContent: "center", mt: 3}}>
                                                <CircularProgress/>
                                            </Box>
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Box>
                    </Fade>
                </Modal>

            {/* Program Creation/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingProgram ? "Редактировать программу" : "Создать программу тренировок"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{mt: 1}}>
                        <TextField
                            fullWidth
                            label="Название программы"
                            value={programForm.title}
                            onChange={(e) => setProgramForm(prev => ({...prev, title: e.target.value}))}
                        />

                        <TextField
                            fullWidth
                            label="Описание"
                            value={programForm.description}
                            onChange={(e) => setProgramForm(prev => ({...prev, description: e.target.value}))}
                        />

                        <Box display="flex" gap={2}>
                            <TextField
                                label="Цена (₽)"
                                type="number"
                                value={programForm.price}
                                onChange={(e) => setProgramForm(prev => ({...prev, price: e.target.value}))}
                                fullWidth
                            />

                            <TextField
                                label="Вид спорта"
                                value={programForm.sportType}
                                onChange={(e) => setProgramForm(prev => ({...prev, sportType: e.target.value}))}
                                fullWidth
                            />
                        </Box>

                        <Box display="flex" gap={2}>
                            <FormControl fullWidth>
                                <InputLabel>Уровень сложности</InputLabel>
                                <Select
                                    value={programForm.difficultyLevel}
                                    label="Уровень сложности"
                                    onChange={(e) => setProgramForm(prev => ({
                                        ...prev,
                                        difficultyLevel: e.target.value
                                    }))}
                                >
                                    <MenuItem value="BEGINNER">Начинающий</MenuItem>
                                    <MenuItem value="INTERMEDIATE">Средний</MenuItem>
                                    <MenuItem value="ADVANCED">Продвинутый</MenuItem>
                                    <MenuItem value="EXPERT">Эксперт</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Длительность (недели)"
                                type="number"
                                value={programForm.durationWeeks}
                                onChange={(e) => setProgramForm(prev => ({...prev, durationWeeks: e.target.value}))}
                                fullWidth
                            />

                            <TextField
                                label="Тренировок в неделю"
                                type="number"
                                value={programForm.sessionsPerWeek}
                                onChange={(e) => setProgramForm(prev => ({...prev, sessionsPerWeek: e.target.value}))}
                                fullWidth
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Программа тренировок"
                            placeholder="Опишите подробную программу тренировок..."
                            value={programForm.content}
                            onChange={(e) => setProgramForm(prev => ({...prev, content: e.target.value}))}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSaveProgram} variant="contained">
                        {editingProgram ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
            {/* Student Progress Management Modal */}
            <StudentProgressManager
                open={studentsModalOpen}
                onClose={handleCloseStudentsModal}
                selectedProgram={selectedProgramForStudents}
                onProgressUpdate={handleProgressUpdate}
                showSnackbar={(message, severity) => setSnackbar({
                    open: true,
                    message,
                    severity
                })}
            />
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </AppTheme>
    );
}
