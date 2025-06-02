import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Container,
    Paper,
    Stack
} from '@mui/material';
import {
    Event as EventIcon,
    LocationOn as LocationIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    TableChart as TableIcon,
    Sports as SportsIcon,
    CalendarToday as CalendarIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';

import event from 'store/modules/event';
import useApplicationStore from "../../../../../store/useApplicationStore";

const EventsSchedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('ALL');
    const [sortBy, setSortBy] = useState('date');

    const store = useApplicationStore();
    const userId = sessionStorage.getItem("userId")

    // Загрузка событий
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await store.event.fetchAllByCreator(userId);
            console.log('Fetched events:', response); // Для отладки
            setEvents(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err.message || 'Ошибка загрузки событий');
        } finally {
            setLoading(false);
        }
    };

    // Функция для получения цвета чипа по типу события
    const getEventTypeColor = (eventType) => {
        const colors = {
            'TABLE': 'primary',
            'SINGLE': 'success',
            'TWO_TEAMS': 'warning'
        };
        return colors[eventType] || 'default';
    };

    // Функция для получения иконки по типу события
    const getEventTypeIcon = (eventType) => {
        const icons = {
            'TABLE': <TableIcon />,
            'SINGLE': <PersonIcon />,
            'TWO_TEAMS': <GroupIcon />
        };
        return icons[eventType] || <EventIcon />;
    };

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            dayOfWeek: date.toLocaleDateString('ru-RU', { weekday: 'long' })
        };
    };

    // Фильтрация и сортировка событий
    const filteredAndSortedEvents = (events || [])
        .filter(event => filterType === 'ALL' || event.eventType === filterType)
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(a.eventDate) - new Date(b.eventDate);
            } else if (sortBy === 'name') {
                return a.eventName.localeCompare(b.eventName);
            }
            return 0;
        });


    // Группировка событий по дате
    const groupedEvents = filteredAndSortedEvents.reduce((groups, event) => {
        const dateKey = new Date(event.eventDate).toDateString();
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(event);
        return groups;
    }, {});

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Загрузка событий...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Заголовок */}
            <Box mb={4}>
                <Typography variant="h3" component="h1" gutterBottom sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Расписание событий
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Просматривайте свои спортивные события
                </Typography>
            </Box>

            {/* Фильтры */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <FilterIcon color="primary" />
                        <Typography variant="h6">Фильтры:</Typography>
                    </Box>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Тип события</InputLabel>
                        <Select
                            value={filterType}
                            label="Тип события"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value="ALL">Все события</MenuItem>
                            <MenuItem value="TABLE">Турнирная таблица</MenuItem>
                            <MenuItem value="SINGLE">Одиночные</MenuItem>
                            <MenuItem value="TWO_TEAMS">Две команды</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Сортировка</InputLabel>
                        <Select
                            value={sortBy}
                            label="Сортировка"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="date">По дате</MenuItem>
                            <MenuItem value="name">По названию</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>

            {/* События по дням */}
            {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => {
                const firstEvent = dayEvents[0];
                const formattedDate = formatDate(firstEvent.eventDate);

                return (
                    <Box key={dateKey} mb={4}>
                        {/* Заголовок дня */}
                        <Paper
                            elevation={1}
                            sx={{
                                p: 2,
                                mb: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: 2
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <CalendarIcon />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {formattedDate.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {formattedDate.dayOfWeek}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={`${dayEvents.length} событий`}
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white'
                                    }}
                                />
                            </Stack>
                        </Paper>

                        {/* События дня */}
                        <Grid container spacing={3}>
                            {dayEvents.map((event) => {
                                const eventTime = formatDate(event.eventDate);

                                return (
                                    <Grid item xs={12} md={6} lg={4} key={event.id}>
                                        <Card
                                            elevation={3}
                                            sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                {/* Заголовок события */}
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                    <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                                                        {event.eventName}
                                                    </Typography>
                                                    <Avatar sx={{
                                                        bgcolor: getEventTypeColor(event.eventType) === 'error' ? '#f44336' :
                                                            getEventTypeColor(event.eventType) === 'primary' ? '#2196f3' :
                                                                getEventTypeColor(event.eventType) === 'success' ? '#4caf50' : '#ff9800',
                                                        width: 32,
                                                        height: 32
                                                    }}>
                                                        {getEventTypeIcon(event.eventType)}
                                                    </Avatar>
                                                </Stack>

                                                {/* Тип события */}
                                                <Box mb={2}>
                                                    <Chip
                                                        label={event.eventType.replace('_', ' ')}
                                                        color={getEventTypeColor(event.eventType)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                {/* Детали события */}
                                                <Stack spacing={1.5}>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <EventIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {eventTime.time}
                                                        </Typography>
                                                    </Box>

                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <LocationIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {event.eventLocation}
                                                        </Typography>
                                                    </Box>

                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <SportsIcon fontSize="small" color="action" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {event.sportType}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                {/* Дополнительная информация */}
                                                <Box mt={2} pt={2} borderTop="1px solid" borderColor="divider">
                                                    <Typography variant="caption" color="text.secondary">
                                                        Создано: {new Date(event.createdAt).toLocaleDateString('ru-RU')}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                );
            })}

            {/* Пустое состояние */}
            {filteredAndSortedEvents.length === 0 && (
                <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom color="text.secondary">
                        События не найдены
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {filterType === 'ALL'
                            ? 'У вас пока нет запланированных событий'
                            : `Нет событий типа "${filterType}"`
                        }
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default EventsSchedule;