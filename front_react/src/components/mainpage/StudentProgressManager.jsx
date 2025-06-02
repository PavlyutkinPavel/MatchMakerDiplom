import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Avatar,
    Slider,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Divider
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

// API сервис для работы с учениками
const studentsApiService = {
    // Получить учеников по конкретной программе
    getProgramStudents: async (programId) => {
        const response = await fetch(`http://localhost:8080/training-programs/${programId}/students`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to fetch program students');
        return await response.json();
    },

    // Получить всех учеников тренера
    getAllMyStudents: async () => {
        const response = await fetch(`http://localhost:8080/training-programs/my/students`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to fetch all students');
        return await response.json();
    },

    // Обновить прогресс ученика - используем userId вместо id
    updateStudentProgress: async (programId, userId, progress) => {
        const response = await fetch(`http://localhost:8080/training-programs/${programId}/students/${userId}/progress?progress=${progress}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`
            },
        });
        if (!response.ok) throw new Error('Failed to update student progress');
    }
};

const StudentProgressManager = ({
                                    open,
                                    onClose,
                                    selectedProgram,
                                    onProgressUpdate,
                                    showSnackbar
                                }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState({});
    const [progressValues, setProgressValues] = useState({});

    useEffect(() => {
        if (open && selectedProgram) {
            loadStudents();
        }
    }, [open, selectedProgram]);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const studentsData = await studentsApiService.getProgramStudents(selectedProgram.id);

            // Обрабатываем как отдельные покупки, так и группированные данные
            let studentsList = [];
            if (studentsData.students && Array.isArray(studentsData.students)) {
                studentsList = studentsData.students;
            } else if (Array.isArray(studentsData)) {
                studentsList = studentsData;
            }

            setStudents(studentsList);

            // Инициализируем значения прогресса - используем userId как ключ
            const initialProgress = {};
            studentsList.forEach(student => {
                initialProgress[student.userId] = student.userProgress || 0;
            });
            setProgressValues(initialProgress);

        } catch (error) {
            showSnackbar('Ошибка загрузки учеников: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleProgressChange = (userId, newValue) => {
        setProgressValues(prev => ({
            ...prev,
            [userId]: newValue
        }));
    };

    const handleProgressSave = async (student) => {
        const userId = student.userId;
        const newProgress = progressValues[userId];

        setUpdating(prev => ({ ...prev, [userId]: true }));

        try {
            await studentsApiService.updateStudentProgress(
                selectedProgram.id,
                userId,
                newProgress
            );

            // Обновляем локальные данные
            setStudents(prev => prev.map(s => {
                return s.userId === userId ? { ...s, userProgress: newProgress } : s;
            }));

            showSnackbar('Прогресс ученика обновлен!', 'success');

            // Уведомляем родительский компонент об обновлении
            if (onProgressUpdate) {
                onProgressUpdate(selectedProgram.id, userId, newProgress);
            }

        } catch (error) {
            showSnackbar('Ошибка обновления прогресса: ' + error.message, 'error');
        } finally {
            setUpdating(prev => ({ ...prev, [userId]: false }));
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'success';
        if (progress >= 50) return 'warning';
        return 'error';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, minHeight: '60vh' }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Управление прогрессом учеников
                        </Typography>
                        {selectedProgram && (
                            <Typography variant="subtitle2" color="text.secondary">
                                Программа: {selectedProgram.title}
                            </Typography>
                        )}
                    </Box>
                    <IconButton onClick={onClose} color="inherit">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : students.length === 0 ? (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        На эту программу пока никто не записался
                    </Alert>
                ) : (
                    <Stack spacing={2}>
                        {students.map((student) => {
                            const userId = student.userId;
                            const studentName = student.userName || 'Неизвестный ученик';
                            const currentProgress = progressValues[userId] || 0;
                            const isUpdating = updating[userId];

                            return (
                                <Paper
                                    key={userId}
                                    elevation={2}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            elevation: 4,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Stack spacing={2}>
                                        {/* Информация об ученике */}
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box flex={1}>
                                                <Typography variant="h6" fontWeight="medium">
                                                    {studentName}
                                                </Typography>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Email: {student.userEmail}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Дата покупки: {formatDate(student.purchaseDate)}
                                                    </Typography>
                                                    <Chip
                                                        label={`${student.userProgress || 0}%`}
                                                        size="small"
                                                        color={getProgressColor(student.userProgress || 0)}
                                                        icon={<TrendingUpIcon />}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>

                                        <Divider />

                                        {/* Управление прогрессом */}
                                        <Box>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Прогресс изучения программы
                                                </Typography>
                                                <Typography variant="h6" color="primary" fontWeight="bold">
                                                    {currentProgress}%
                                                </Typography>
                                            </Stack>

                                            <Slider
                                                value={currentProgress}
                                                onChange={(_, newValue) => handleProgressChange(userId, newValue)}
                                                valueLabelDisplay="auto"
                                                step={5}
                                                min={0}
                                                max={100}
                                                sx={{
                                                    mb: 2,
                                                    '& .MuiSlider-thumb': {
                                                        width: 20,
                                                        height: 20,
                                                    },
                                                    '& .MuiSlider-track': {
                                                        height: 8,
                                                    },
                                                    '& .MuiSlider-rail': {
                                                        height: 8,
                                                        opacity: 0.3,
                                                    },
                                                }}
                                                color={getProgressColor(currentProgress)}
                                            />

                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="caption" color="text.secondary">
                                                    Изменить прогресс и нажать "Сохранить"
                                                </Typography>

                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={isUpdating ? <CircularProgress size={16} /> : <SaveIcon />}
                                                    onClick={() => handleProgressSave(student)}
                                                    disabled={isUpdating || currentProgress === (student.userProgress || 0)}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    {isUpdating ? 'Сохранение...' : 'Сохранить'}
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StudentProgressManager;