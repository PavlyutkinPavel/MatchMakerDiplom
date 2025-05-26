import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    IconButton,
    Grid,
    Divider,
    Alert,
    Chip,
    Card,
    CardContent,
} from '@mui/material';
import {
    Delete,
    SportsSoccer,
    Add,
    Flag,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import AppTheme from "../../../shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

// Mock data for demonstration
const mockTeams = [
    { id: 1, teamName: "FC Barcelona", country: "Spain", city: "Barcelona", achievements: "5 UCL titles", status: "Active", wins: "26", teamType: "FOOTBALL" },
    { id: 2, teamName: "Real Madrid", country: "Spain", city: "Madrid", achievements: "14 UCL titles", status: "Active", wins: "35", teamType: "FOOTBALL" },
    { id: 3, teamName: "Manchester United", country: "England", city: "Manchester", achievements: "3 UCL titles", status: "Active", wins: "20", teamType: "FOOTBALL" },
    { id: 4, teamName: "Bayern Munich", country: "Germany", city: "Munich", achievements: "6 UCL titles", status: "Active", wins: "32", teamType: "FOOTBALL" },
    { id: 5, teamName: "Liverpool", country: "England", city: "Liverpool", achievements: "6 UCL titles", status: "Active", wins: "19", teamType: "FOOTBALL" },
    { id: 6, teamName: "Chelsea", country: "England", city: "London", achievements: "2 UCL titles", status: "Active", wins: "6", teamType: "FOOTBALL" },
    { id: 7, teamName: "PSG", country: "France", city: "Paris", achievements: "0 UCL titles", status: "Active", wins: "10", teamType: "FOOTBALL" },
    { id: 8, teamName: "Juventus", country: "Italy", city: "Turin", achievements: "2 UCL titles", status: "Active", wins: "36", teamType: "FOOTBALL" },
    { id: 9, teamName: "AC Milan", country: "Italy", city: "Milan", achievements: "7 UCL titles", status: "Active", wins: "18", teamType: "FOOTBALL" },
    { id: 10, teamName: "Inter Milan", country: "Italy", city: "Milan", achievements: "3 UCL titles", status: "Active", wins: "19", teamType: "FOOTBALL" },
    { id: 11, teamName: "Arsenal", country: "England", city: "London", achievements: "0 UCL titles", status: "Active", wins: "13", teamType: "FOOTBALL" },
    { id: 12, teamName: "Borussia Dortmund", country: "Germany", city: "Dortmund", achievements: "1 UCL title", status: "Active", wins: "8", teamType: "FOOTBALL" },
    { id: 13, teamName: "Ajax", country: "Netherlands", city: "Amsterdam", achievements: "4 UCL titles", status: "Active", wins: "36", teamType: "FOOTBALL" },
    { id: 14, teamName: "FC Porto", country: "Portugal", city: "Porto", achievements: "2 UCL titles", status: "Active", wins: "29", teamType: "FOOTBALL" },
    { id: 15, teamName: "Atletico Madrid", country: "Spain", city: "Madrid", achievements: "0 UCL titles", status: "Active", wins: "11", teamType: "FOOTBALL" },
    { id: 16, teamName: "Marseille", country: "France", city: "Marseille", achievements: "1 UCL title", status: "Active", wins: "9", teamType: "FOOTBALL" },
];


const BracketMatchup = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '8px',
    marginBottom: '8px',
    backgroundColor: 'white',
    width: '200px',
}));

// Playoff Tournament Component
export default function PlayoffTournamentComponent() {
    const [basicEventUsers, setBasicEventUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [tableTeams, setTableTeams] = useState([]);
    const [playoffTeams, setPlayoffTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const removeTeamFromTable = (teamId) => {
        setTableTeams(tableTeams.filter(team => team.id !== teamId));
    };

    const addTeamToPlayoff = (teamId) => {
        const team = mockTeams.find(t => t.id === teamId);
        if (team && !playoffTeams.some(t => t.id === team.id)) {
            setPlayoffTeams([...playoffTeams, team]);
        }
    };

    const removeTeamFromPlayoff = (teamId) => {
        setPlayoffTeams(playoffTeams.filter(team => team.id !== teamId));
    };

    const filteredTeams = mockTeams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePlayoffBracket = () => {
        if (playoffTeams.length < 16) return null;

        // Take first 16 teams for the bracket
        const bracketTeams = playoffTeams.slice(0, 16);

        return (
            <Box sx={{display: 'flex', flexDirection: 'column', mt: 4}}>
                <Typography variant="h6" gutterBottom>Playoff Bracket</Typography>

                <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                    {/* Round of 16 */}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
                        <Typography variant="subtitle2" sx={{textAlign: 'center', mb: 1}}>Round of 16</Typography>
                        {Array.from({length: 8}).map((_, idx) => (
                            <BracketMatchup key={`r16-${idx}`}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}>
                                    <Typography variant="body2" noWrap
                                                sx={{maxWidth: '140px'}}>{bracketTeams[idx * 2]?.teamName}</Typography>
                                    <Chip label="1" size="small" color="primary" sx={{ml: 1}}/>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Typography variant="body2" noWrap
                                                sx={{maxWidth: '140px'}}>{bracketTeams[idx * 2 + 1]?.teamName}</Typography>
                                    <Chip label="0" size="small" sx={{ml: 1}}/>
                                </Box>
                            </BracketMatchup>
                        ))}
                    </Box>

                    {/* Quarter Finals */}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 12}}>
                        <Typography variant="subtitle2" sx={{textAlign: 'center', mb: 1}}>Quarter Finals</Typography>
                        {Array.from({length: 4}).map((_, idx) => (
                            <BracketMatchup key={`qf-${idx}`}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}>
                                    <Typography variant="body2" noWrap
                                                sx={{maxWidth: '140px'}}>{bracketTeams[idx * 2]?.teamName}</Typography>
                                    <Chip label="?" size="small" color="primary" sx={{ml: 1}}/>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Typography variant="body2" noWrap sx={{maxWidth: '140px'}}>TBD</Typography>
                                    <Chip label="?" size="small" sx={{ml: 1}}/>
                                </Box>
                            </BracketMatchup>
                        ))}
                    </Box>

                    {/* Semi Finals */}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 28}}>
                        <Typography variant="subtitle2" sx={{textAlign: 'center', mb: 1}}>Semi Finals</Typography>
                        {Array.from({length: 2}).map((_, idx) => (
                            <BracketMatchup key={`sf-${idx}`}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 1
                                }}>
                                    <Typography variant="body2" noWrap sx={{maxWidth: '140px'}}>TBD</Typography>
                                    <Chip label="?" size="small" color="primary" sx={{ml: 1}}/>
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Typography variant="body2" noWrap sx={{maxWidth: '140px'}}>TBD</Typography>
                                    <Chip label="?" size="small" sx={{ml: 1}}/>
                                </Box>
                            </BracketMatchup>
                        ))}
                    </Box>

                    {/* Final */}
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center'}}>
                        <Typography variant="subtitle2" sx={{textAlign: 'center', mb: 1}}>Final</Typography>
                        <BracketMatchup>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                <Typography variant="body2" noWrap sx={{maxWidth: '140px'}}>TBD</Typography>
                                <Chip label="?" size="small" color="primary" sx={{ml: 1}}/>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Typography variant="body2" noWrap sx={{maxWidth: '140px'}}>TBD</Typography>
                                <Chip label="?" size="small" sx={{ml: 1}}/>
                            </Box>
                        </BracketMatchup>

                        <Box sx={{mt: 8}}>
                            <Card sx={{bgcolor: 'primary.light', color: 'primary.contrastText'}}>
                                <CardContent>
                                    <Typography variant="h6" sx={{textAlign: 'center'}}>Champion</Typography>
                                    <Typography variant="body1" sx={{textAlign: 'center'}}>TBD</Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    };

    const renderTeamTable = () => {
        return (
            <Box sx={{width: '100%', mt: 2}}>
                <Paper sx={{width: '100%', mb: 2}}>
                    <Box sx={{p: 2}}>
                        <Typography variant="h6" gutterBottom component="div">
                            Tournament Table
                        </Typography>
                    </Box>
                    <Box sx={{p: 2}}>
                        <Grid container spacing={2} sx={{fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e0e0e0'}}>
                            <Grid item xs={1}>#</Grid>
                            <Grid item xs={4}>Team</Grid>
                            <Grid item xs={2}>Country</Grid>
                            <Grid item xs={2}>City</Grid>
                            <Grid item xs={2}>Wins</Grid>
                            <Grid item xs={1}>Actions</Grid>
                        </Grid>

                        {tableTeams.map((team, index) => (
                            <Grid container spacing={2} key={team.id}
                                  sx={{py: 1, borderBottom: '1px solid #f0f0f0', '&:hover': {bgcolor: '#f5f5f5'}}}>
                                <Grid item xs={1}>{index + 1}</Grid>
                                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
                                    <SportsSoccer sx={{mr: 1, color: 'primary.main'}}/>
                                    {team.teamName}
                                </Grid>
                                <Grid item xs={2} sx={{display: 'flex', alignItems: 'center'}}>
                                    <Flag sx={{mr: 1, fontSize: 16}}/>
                                    {team.country}
                                </Grid>
                                <Grid item xs={2}>{team.city}</Grid>
                                <Grid item xs={2}>{team.wins}</Grid>
                                <Grid item xs={1}>
                                    <IconButton size="small" onClick={() => removeTeamFromTable(team.id)} color="error">
                                        <Delete fontSize="small"/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        {tableTeams.length === 0 && (
                            <Box sx={{p: 2, textAlign: 'center'}}>
                                <Typography variant="body2" color="text.secondary">
                                    No teams added to the tournament yet
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        );
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme/>
            <Box sx={{p: 2}}>
                <Typography variant="h6" gutterBottom>
                    Playoff Tournament Setup
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{display: 'flex', mb: 2}}>
                            <TextField
                                label="Search Teams"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{mr: 1}}
                            />
                        </Box>

                        {playoffTeams.length < 16 ? (
                            <Alert severity="warning" sx={{mb: 2}}>
                                You need at least 16 teams for a playoff tournament. Currently: {playoffTeams.length}/16
                            </Alert>
                        ) : (
                            <Alert severity="success" sx={{mb: 2}}>
                                Teams added: {playoffTeams.length}
                            </Alert>
                        )}

                        {playoffTeams.length >= 16 && generatePlayoffBracket()}

                        <Box sx={{width: '100%', mt: 2}}>
                            <Paper sx={{width: '100%', mb: 2}}>
                                <Box sx={{p: 2}}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Tournament Teams
                                    </Typography>
                                </Box>
                                <Box sx={{p: 2}}>
                                    <Grid container spacing={2}
                                          sx={{fontWeight: 'bold', pb: 1, borderBottom: '1px solid #e0e0e0'}}>
                                        <Grid item xs={1}>#</Grid>
                                        <Grid item xs={4}>Team</Grid>
                                        <Grid item xs={2}>Country</Grid>
                                        <Grid item xs={2}>City</Grid>
                                        <Grid item xs={2}>Wins</Grid>
                                        <Grid item xs={1}>Actions</Grid>
                                    </Grid>

                                    {playoffTeams.map((team, index) => (
                                        <Grid container spacing={2} key={team.id} sx={{
                                            py: 1,
                                            borderBottom: '1px solid #f0f0f0',
                                            '&:hover': {bgcolor: '#f5f5f5'}
                                        }}>
                                            <Grid item xs={1}>{index + 1}</Grid>
                                            <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
                                                <SportsSoccer sx={{mr: 1, color: 'primary.main'}}/>
                                                {team.teamName}
                                            </Grid>
                                            <Grid item xs={2} sx={{display: 'flex', alignItems: 'center'}}>
                                                <Flag sx={{mr: 1, fontSize: 16}}/>
                                                {team.country}
                                            </Grid>
                                            <Grid item xs={2}>{team.city}</Grid>
                                            <Grid item xs={2}>{team.wins}</Grid>
                                            <Grid item xs={1}>
                                                <IconButton size="small" onClick={() => removeTeamFromPlayoff(team.id)}
                                                            color="error">
                                                    <Delete fontSize="small"/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}

                                    {playoffTeams.length === 0 && (
                                        <Box sx={{p: 2, textAlign: 'center'}}>
                                            <Typography variant="body2" color="text.secondary">
                                                No teams added to the tournament yet
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Box>

                        <Divider sx={{my: 2}}/>

                        <Typography variant="subtitle1" gutterBottom>
                            Available Teams
                        </Typography>

                        <Grid container spacing={2}>
                            {filteredTeams
                                .filter(team => !playoffTeams.some(t => t.id === team.id))
                                .map((team) => (
                                    <Grid item xs={12} sm={6} md={4} key={team.id}>
                                        <Paper sx={{p: 2, '&:hover': {bgcolor: '#f5f5f5'}}}>
                                            <Typography variant="subtitle2">{team.teamName}</Typography>
                                            <Typography variant="body2">{team.country}, {team.city}</Typography>
                                            <Box sx={{mt: 1, display: 'flex', justifyContent: 'flex-end'}}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<Add/>}
                                                    onClick={() => addTeamToPlayoff(team.id)}
                                                >
                                                    Add
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{p: 2}}>
                            <Typography variant="h6" gutterBottom>
                                Tournament Summary
                            </Typography>
                            <Typography variant="body2">
                                <strong>Event Type:</strong> Playoff Tournament
                            </Typography>
                            <Typography variant="body2">
                                <strong>Teams:</strong> {playoffTeams.length}/16 (minimum)
                            </Typography>

                            {playoffTeams.length < 16 ? (
                                <Alert severity="error" sx={{mt: 2}}>
                                    You need at least 16 teams to save
                                </Alert>
                            ) : null}

                            <Box sx={{mt: 2}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={playoffTeams.length < 16}
                                >
                                    Save Tournament
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </AppTheme>
    );
};
