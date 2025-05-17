import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    Button,
    Divider,
    Chip,
    Menu,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    LinearProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    SportsSoccer as SportsSoccerIcon,
    EmojiEvents as EmojiEventsIcon,
    Group as GroupIcon,
    Today as TodayIcon,
    FilterList as FilterListIcon,
    MoreVert as MoreVertIcon,
    GetApp as GetAppIcon,
    Print as PrintIcon,
    Share as ShareIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import {Person as PersonIcon} from "@mui/icons-material";

// Mock data for teams
const teamData = [
    {
        id: 1,
        name: 'Dynamo',
        logo: '🔵',
        played: 10,
        won: 7,
        drawn: 2,
        lost: 1,
        goalsFor: 22,
        goalsAgainst: 10,
        points: 23,
        form: ['W', 'W', 'D', 'W', 'L']
    },
    {
        id: 2,
        name: 'Spartak',
        logo: '🔴',
        played: 10,
        won: 6,
        drawn: 3,
        lost: 1,
        goalsFor: 18,
        goalsAgainst: 8,
        points: 21,
        form: ['W', 'D', 'W', 'D', 'W']
    },
    {
        id: 3,
        name: 'Zenit',
        logo: '⚪',
        played: 10,
        won: 6,
        drawn: 1,
        lost: 3,
        goalsFor: 20,
        goalsAgainst: 12,
        points: 19,
        form: ['L', 'W', 'W', 'W', 'D']
    },
    {
        id: 4,
        name: 'CSKA',
        logo: '🟠',
        played: 10,
        won: 5,
        drawn: 3,
        lost: 2,
        goalsFor: 14,
        goalsAgainst: 9,
        points: 18,
        form: ['D', 'W', 'W', 'L', 'W']
    },
    {
        id: 5,
        name: 'Lokomotiv',
        logo: '🟢',
        played: 10,
        won: 5,
        drawn: 2,
        lost: 3,
        goalsFor: 16,
        goalsAgainst: 11,
        points: 17,
        form: ['W', 'L', 'W', 'D', 'W']
    },
    {
        id: 6,
        name: 'Arsenal',
        logo: '🟡',
        played: 10,
        won: 4,
        drawn: 3,
        lost: 3,
        goalsFor: 14,
        goalsAgainst: 12,
        points: 15,
        form: ['D', 'W', 'L', 'W', 'D']
    },
    {
        id: 7,
        name: 'Rubin',
        logo: '🔴',
        played: 10,
        won: 4,
        drawn: 2,
        lost: 4,
        goalsFor: 12,
        goalsAgainst: 13,
        points: 14,
        form: ['L', 'W', 'D', 'W', 'L']
    },
    {
        id: 8,
        name: 'Krasnodar',
        logo: '⚫',
        played: 10,
        won: 3,
        drawn: 4,
        lost: 3,
        goalsFor: 13,
        goalsAgainst: 13,
        points: 13,
        form: ['D', 'D', 'W', 'L', 'D']
    }
];

// Mock data for players
const playerData = [
    {
        id: 1,
        name: 'Alexander Kokorin',
        team: 'Dynamo',
        position: 'Forward',
        goals: 8,
        assists: 4,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 823,
        avatar: '👤'
    },
    {
        id: 2,
        name: 'Igor Akinfeev',
        team: 'CSKA',
        position: 'Goalkeeper',
        goals: 0,
        assists: 1,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 900,
        avatar: '👤'
    },
    {
        id: 3,
        name: 'Artem Dzyuba',
        team: 'Zenit',
        position: 'Forward',
        goals: 7,
        assists: 6,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 856,
        avatar: '👤'
    },
    {
        id: 4,
        name: 'Quincy Promes',
        team: 'Spartak',
        position: 'Midfielder',
        goals: 6,
        assists: 5,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 810,
        avatar: '👤'
    },
    {
        id: 5,
        name: 'Fyodor Smolov',
        team: 'Lokomotiv',
        position: 'Forward',
        goals: 5,
        assists: 2,
        yellowCards: 2,
        redCards: 1,
        minutesPlayed: 742,
        avatar: '👤'
    },
    {
        id: 6,
        name: 'Denis Cheryshev',
        team: 'Arsenal',
        position: 'Midfielder',
        goals: 4,
        assists: 3,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 870,
        avatar: '👤'
    },
    {
        id: 7,
        name: 'Magomed Ozdoev',
        team: 'Rubin',
        position: 'Midfielder',
        goals: 3,
        assists: 4,
        yellowCards: 4,
        redCards: 0,
        minutesPlayed: 885,
        avatar: '👤'
    },
    {
        id: 8,
        name: 'Viktor Claesson',
        team: 'Krasnodar',
        position: 'Midfielder',
        goals: 4,
        assists: 2,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 854,
        avatar: '👤'
    }
];

// Mock data for matches
const matchesData = [
    {
        id: 1,
        homeTeam: 'Dynamo',
        awayTeam: 'Spartak',
        homeScore: 2,
        awayScore: 1,
        date: '2025-04-15',
        stadium: 'VTB Arena'
    },
    {
        id: 2,
        homeTeam: 'CSKA',
        awayTeam: 'Zenit',
        homeScore: 1,
        awayScore: 3,
        date: '2025-04-18',
        stadium: 'VEB Arena'
    },
    {
        id: 3,
        homeTeam: 'Lokomotiv',
        awayTeam: 'Arsenal',
        homeScore: 2,
        awayScore: 2,
        date: '2025-04-19',
        stadium: 'RZD Arena'
    },
    {
        id: 4,
        homeTeam: 'Rubin',
        awayTeam: 'Krasnodar',
        homeScore: 0,
        awayScore: 1,
        date: '2025-04-20',
        stadium: 'Kazan Arena'
    }
];

// Tournament data
const tournaments = [
    { id: 1, name: 'Premier League 2025' },
    { id: 2, name: 'Cup of Russia 2025' },
    { id: 3, name: 'Super Cup 2025' }
];

// Function to get form chip color
const getFormColor = (result) => {
    switch(result) {
        case 'W': return 'success';
        case 'D': return 'warning';
        case 'L': return 'error';
        default: return 'default';
    }
};

const TeamStatsTable = ({ data, orderBy, order, handleSort }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = React.useMemo(() => {
        if (orderBy) {
            return [...data].sort((a, b) => {
                const valueA = a[orderBy];
                const valueB = b[orderBy];

                if (order === 'asc') {
                    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else {
                    return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                }
            });
        }
        return data;
    }, [data, orderBy, order]);

    const visibleRows = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper elevation={2} sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader aria-label="team statistics table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Pos</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell
                                onClick={() => handleSort('played')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    Played
                                    {orderBy === 'played' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('won')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    W
                                    {orderBy === 'won' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('drawn')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    D
                                    {orderBy === 'drawn' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('lost')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    L
                                    {orderBy === 'lost' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('goalsFor')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    GF
                                    {orderBy === 'goalsFor' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('goalsAgainst')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    GA
                                    {orderBy === 'goalsAgainst' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('points')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    <strong>Pts</strong>
                                    {orderBy === 'points' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>Form</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((team, index) => (
                            <TableRow key={team.id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Box mr={1} fontSize="1.2rem">{team.logo}</Box>
                                        <strong>{team.name}</strong>
                                    </Box>
                                </TableCell>
                                <TableCell>{team.played}</TableCell>
                                <TableCell>{team.won}</TableCell>
                                <TableCell>{team.drawn}</TableCell>
                                <TableCell>{team.lost}</TableCell>
                                <TableCell>{team.goalsFor}</TableCell>
                                <TableCell>{team.goalsAgainst}</TableCell>
                                <TableCell><strong>{team.points}</strong></TableCell>
                                <TableCell>
                                    <Box display="flex" gap={0.5}>
                                        {team.form.map((result, idx) => (
                                            <Chip
                                                key={idx}
                                                label={result}
                                                size="small"
                                                color={getFormColor(result)}
                                                sx={{ minWidth: '28px' }}
                                            />
                                        ))}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

const PlayerStatsTable = ({ data, orderBy, order, handleSort }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = React.useMemo(() => {
        if (orderBy) {
            return [...data].sort((a, b) => {
                const valueA = a[orderBy];
                const valueB = b[orderBy];

                if (order === 'asc') {
                    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else {
                    return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
                }
            });
        }
        return data;
    }, [data, orderBy, order]);

    const visibleRows = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper elevation={2} sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader aria-label="player statistics table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Player</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell
                                onClick={() => handleSort('goals')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    <strong>Goals</strong>
                                    {orderBy === 'goals' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('assists')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    Assists
                                    {orderBy === 'assists' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('yellowCards')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    YC
                                    {orderBy === 'yellowCards' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('redCards')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    RC
                                    {orderBy === 'redCards' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell
                                onClick={() => handleSort('minutesPlayed')}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" alignItems="center">
                                    Minutes
                                    {orderBy === 'minutesPlayed' && (
                                        order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((player, index) => (
                            <TableRow key={player.id} hover>
                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar sx={{ mr: 1, width: 32, height: 32 }}>{player.avatar}</Avatar>
                                        <Typography variant="body2">{player.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{player.team}</TableCell>
                                <TableCell>{player.position}</TableCell>
                                <TableCell><strong>{player.goals}</strong></TableCell>
                                <TableCell>{player.assists}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={player.yellowCards}
                                        size="small"
                                        sx={{
                                            bgcolor: 'warning.light',
                                            color: 'warning.contrastText',
                                            minWidth: '28px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={player.redCards}
                                        size="small"
                                        sx={{
                                            bgcolor: 'error.light',
                                            color: 'error.contrastText',
                                            minWidth: '28px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{player.minutesPlayed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

const RecentMatchesTable = ({ data }) => {
    return (
        <Paper elevation={2} sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
            <TableContainer>
                <Table aria-label="recent matches table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Home</TableCell>
                            <TableCell align="center">Score</TableCell>
                            <TableCell>Away</TableCell>
                            <TableCell>Stadium</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((match) => (
                            <TableRow key={match.id} hover>
                                <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                                <TableCell>{match.homeTeam}</TableCell>
                                <TableCell align="center">
                                    <Box
                                        sx={{
                                            fontWeight: 'bold',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1,
                                            bgcolor: 'background.default',
                                            display: 'inline-block'
                                        }}
                                    >
                                        {match.homeScore} - {match.awayScore}
                                    </Box>
                                </TableCell>
                                <TableCell>{match.awayTeam}</TableCell>
                                <TableCell>{match.stadium}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

const TeamStatsSummary = ({ teams }) => {
    const topScoringTeam = [...teams].sort((a, b) => b.goalsFor - a.goalsFor)[0];
    const bestDefenseTeam = [...teams].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
    const mostWinsTeam = [...teams].sort((a, b) => b.won - a.won)[0];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Top Scoring Team
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Box fontSize="1.5rem" mr={1}>{topScoringTeam.logo}</Box>
                            <Typography variant="h6">{topScoringTeam.name}</Typography>
                        </Box>
                        <Typography variant="h3" color="primary" mt={1}>
                            {topScoringTeam.goalsFor}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            goals in {topScoringTeam.played} matches
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Best Defense
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Box fontSize="1.5rem" mr={1}>{bestDefenseTeam.logo}</Box>
                            <Typography variant="h6">{bestDefenseTeam.name}</Typography>
                        </Box>
                        <Typography variant="h3" color="secondary" mt={1}>
                            {bestDefenseTeam.goalsAgainst}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            goals conceded in {bestDefenseTeam.played} matches
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Most Wins
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Box fontSize="1.5rem" mr={1}>{mostWinsTeam.logo}</Box>
                            <Typography variant="h6">{mostWinsTeam.name}</Typography>
                        </Box>
                        <Typography variant="h3" color="success.main" mt={1}>
                            {mostWinsTeam.won}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            wins in {mostWinsTeam.played} matches
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

const PlayerStatsSummary = ({ players }) => {
    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
    const topAssister = [...players].sort((a, b) => b.assists - a.assists)[0];
    const mostMinutesPlayer = [...players].sort((a, b) => b.minutesPlayed - a.minutesPlayed)[0];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Top Scorer
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Avatar sx={{ mr: 1 }}>{topScorer.avatar}</Avatar>
                            <Box>
                                <Typography variant="h6">{topScorer.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {topScorer.team} | {topScorer.position}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h3" color="primary" mt={1}>
                            {topScorer.goals}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            goals
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Top Assister
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Avatar sx={{ mr: 1 }}>{topAssister.avatar}</Avatar>
                            <Box>
                                <Typography variant="h6">{topAssister.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {topAssister.team} | {topAssister.position}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h3" color="secondary" mt={1}>
                            {topAssister.assists}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            assists
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Most Minutes Played
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Avatar sx={{ mr: 1 }}>{mostMinutesPlayer.avatar}</Avatar>
                            <Box>
                                <Typography variant="h6">{mostMinutesPlayer.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {mostMinutesPlayer.team} | {mostMinutesPlayer.position}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h3" color="success.main" mt={1}>
                            {mostMinutesPlayer.minutesPlayed}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            minutes
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

const SportsStatistics = () => {
    const [tabValue, setTabValue] = useState(0);
    const [tournamentId, setTournamentId] = useState(1);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [teamOrderBy, setTeamOrderBy] = useState('points');
    const [teamOrder, setTeamOrder] = useState('desc');
    const [playerOrderBy, setPlayerOrderBy] = useState('goals');
    const [playerOrder, setPlayerOrder] = useState('desc');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleTournamentChange = (event) => {
        setTournamentId(event.target.value);
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleTeamSort = (property) => {
        const isAsc = teamOrderBy === property && teamOrder === 'asc';
        setTeamOrder(isAsc ? 'desc' : 'asc');
        setTeamOrderBy(property);
    };

    const handlePlayerSort = (property) => {
        const isAsc = playerOrderBy === property && playerOrder === 'asc';
        setPlayerOrder(isAsc ? 'desc' : 'asc');
        setPlayerOrderBy(property);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Box display="flex" alignItems="center">
                                <EmojiEventsIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                                <Typography variant="h4" component="h1" fontWeight="bold">
                                    Tournament Statistics
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                Comprehensive statistics and analytics for players and teams
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel id="tournament-select-label">Tournament</InputLabel>
                                    <Select
                                        labelId="tournament-select-label"
                                        id="tournament-select"
                                        value={tournamentId}
                                        onChange={handleTournamentChange}
                                        label="Tournament"
                                    >
                                        {tournaments.map((tournament) => (
                                            <MenuItem key={tournament.id} value={tournament.id}>
                                                {tournament.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <IconButton onClick={handleFilterClick} color="primary">
                                    <FilterListIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={filterAnchorEl}
                                    open={Boolean(filterAnchorEl)}
                                    onClose={handleFilterClose}
                                >
                                    <MenuItem onClick={handleFilterClose}>All Seasons</MenuItem>
                                    <MenuItem onClick={handleFilterClose}>2025 Season</MenuItem>
                                    <MenuItem onClick={handleFilterClose}>2024 Season</MenuItem>
                                </Menu>

                                <IconButton onClick={handleMenuClick}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    open={Boolean(menuAnchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleMenuClose}>
                                        <GetAppIcon fontSize="small" sx={{ mr: 1 }} />
                                        Export Data
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        <PrintIcon fontSize="small" sx={{ mr: 1 }} />
                                        Print
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose}>
                                        <ShareIcon fontSize="small" sx={{ mr: 1 }} />
                                        Share
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Paper sx={{ mb: 4 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons={isMobile ? "auto" : false}
                        aria-label="statistics tabs"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab
                            icon={<SportsSoccerIcon />}
                            label={!isMobile && "Team Statistics"}
                            iconPosition="start"
                            sx={{ minHeight: 64 }}
                        />
                        <Tab
                            icon={<PersonIcon />}
                            label={!isMobile && "Player Statistics"}
                            iconPosition="start"
                            sx={{ minHeight: 64 }}
                        />
                        <Tab
                            icon={<TodayIcon />}
                            label={!isMobile && "Recent Matches"}
                            iconPosition="start"
                            sx={{ minHeight: 64 }}
                        />
                    </Tabs>
                </Paper>

                {/* Team Statistics Tab */}
                {tabValue === 0 && (
                    <motion.div
                        key="teams"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Team Performance Overview
                            </Typography>
                            <TeamStatsSummary teams={teamData} />
                        </Box>

                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" fontWeight="bold">
                                    League Table
                                </Typography>
                                <Chip
                                    icon={<GroupIcon />}
                                    label={`${teamData.length} Teams`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
                            <TeamStatsTable
                                data={teamData}
                                orderBy={teamOrderBy}
                                order={teamOrder}
                                handleSort={handleTeamSort}
                            />
                        </Box>
                    </motion.div>
                )}

                {/* Player Statistics Tab */}
                {tabValue === 1 && (
                    <motion.div
                        key="players"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Player Highlights
                            </Typography>
                            <PlayerStatsSummary players={playerData} />
                        </Box>

                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" fontWeight="bold">
                                    Player Rankings
                                </Typography>
                                <Chip
                                    icon={<PersonIcon />}
                                    label={`${playerData.length} Players`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
                            <PlayerStatsTable
                                data={playerData}
                                orderBy={playerOrderBy}
                                order={playerOrder}
                                handleSort={handlePlayerSort}
                            />
                        </Box>
                    </motion.div>
                )}

                {/* Recent Matches Tab */}
                {tabValue === 2 && (
                    <motion.div
                        key="matches"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" fontWeight="bold">
                                    Recent Match Results
                                </Typography>
                                <Chip
                                    icon={<TodayIcon />}
                                    label={`Last ${matchesData.length} Matches`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
                            <RecentMatchesTable data={matchesData} />
                        </Box>
                    </motion.div>
                )}
            </motion.div>
        </Container>
    );
}

export default SportsStatistics;