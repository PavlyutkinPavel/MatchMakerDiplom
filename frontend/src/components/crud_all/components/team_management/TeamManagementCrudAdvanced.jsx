import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import CrudRoutes from "./CrudRoutes";

import {
    DataSourceCache,
} from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';
import {
    IconButton,
    Menu,
    MenuItem,
    Chip, Typography, Grid, Box, Container,
} from "@mui/material";
import {
    BarChart as BarChartIcon,
    Person as PersonIcon,
    Message as MessageIcon,
    Map as MapIcon,
    MoreHoriz as MoreHorizIcon,
    SportsSoccer as SportsSoccerIcon,
    Home as HomeIcon
} from "@mui/icons-material";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../shared-theme/AppTheme";
import {useNavigate} from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import TeamManagementModern from "./TeamManagementModern";
import {motion} from "framer-motion";
import Avatar from "@mui/material/Avatar";
import FriendsList from "./components/FriendList";
import {TeamEvents} from "./components/TeamEvents";
import Chat from "./components/Chat";
import Emails from "./components/Emails";
import ParticipantsManager from "./components/ParticipantsManager";
import SportsStatistics from "./components/SportsStatistics";

const routes = {
    team: "/team",
    planning: "/planning",
    map: "/map",
    events: "/events",
    message: "/message",
    emails: "/emails",
    chat:"chat",
    members: "/members",
    dashboard: "/dashboard",
    orders: "/orders",
    statistics: "/statistics",
    teams: "/teams",
    friends: "/friends",
};

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

let notesStore = [
    { id: 1, title: 'Training session', text: 'Try new formation.' },
    { id: 2, title: 'Personal Goal', text: 'Finish running marathon in 15 minutes' },
];

export const notesDataSource = {
    fields: [
        { field: 'id', headerName: 'ID' },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'text', headerName: 'Text', flex: 1 },
    ],
    getMany: ({ paginationModel, filterModel, sortModel }) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let processedNotes = [...notesStore];

                // Apply filters (demo only)
                if (filterModel?.items?.length) {
                    filterModel.items.forEach(({ field, value, operator }) => {
                        if (!field || value == null) {
                            return;
                        }

                        processedNotes = processedNotes.filter((note) => {
                            const noteValue = note[field];

                            switch (operator) {
                                case 'contains':
                                    return String(noteValue)
                                        .toLowerCase()
                                        .includes(String(value).toLowerCase());
                                case 'equals':
                                    return noteValue === value;
                                case 'startsWith':
                                    return String(noteValue)
                                        .toLowerCase()
                                        .startsWith(String(value).toLowerCase());
                                case 'endsWith':
                                    return String(noteValue)
                                        .toLowerCase()
                                        .endsWith(String(value).toLowerCase());
                                case '>':
                                    return noteValue > value;
                                case '<':
                                    return noteValue < value;
                                default:
                                    return true;
                            }
                        });
                    });
                }

                // Apply sorting
                if (sortModel?.length) {
                    processedNotes.sort((a, b) => {
                        for (const { field, sort } of sortModel) {
                            if (a[field] < b[field]) {
                                return sort === 'asc' ? -1 : 1;
                            }
                            if (a[field] > b[field]) {
                                return sort === 'asc' ? 1 : -1;
                            }
                        }
                        return 0;
                    });
                }

                // Apply pagination
                const start = paginationModel.page * paginationModel.pageSize;
                const end = start + paginationModel.pageSize;
                const paginatedNotes = processedNotes.slice(start, end);

                resolve({
                    items: paginatedNotes,
                    itemCount: processedNotes.length,
                });
            }, 750);
        });
    },
    getOne: (noteId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const noteToShow = notesStore.find((note) => note.id === Number(noteId));

                if (noteToShow) {
                    resolve(noteToShow);
                } else {
                    reject(new Error('Note not found'));
                }
            }, 750);
        });
    },
    createOne: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newNote = { id: notesStore.length + 1, ...data };

                notesStore = [...notesStore, newNote];

                resolve(newNote);
            }, 750);
        });
    },
    updateOne: (noteId, data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let updatedNote = null;

                notesStore = notesStore.map((note) => {
                    if (note.id === Number(noteId)) {
                        updatedNote = { ...note, ...data };
                        return updatedNote;
                    }
                    return note;
                });

                if (updatedNote) {
                    resolve(updatedNote);
                } else {
                    reject(new Error('Note not found'));
                }
            }, 750);
        });
    },
    deleteOne: (noteId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                notesStore = notesStore.filter((note) => note.id !== Number(noteId));

                resolve();
            }, 750);
        });
    },
    validate: (formValues) => {
        let issues = [];

        if (!formValues.title) {
            issues = [...issues, { message: 'Title is required', path: ['title'] }];
        }
        if (formValues.title && formValues.title.length < 3) {
            issues = [
                ...issues,
                {
                    message: 'Title must be at least 3 characters long',
                    path: ['title'],
                },
            ];
        }
        if (!formValues.text) {
            issues = [...issues, { message: 'Text is required', path: ['text'] }];
        }

        return { issues };
    },
};




const notesCache = new DataSourceCache();

function TeamManagementCrudAdvanced(props) {
    const { window } = props;

    const demoWindow = window !== undefined ? window() : undefined;

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const router = useDemoRouter(routes.team);

    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);

    const isPopoverOpen = Boolean(popoverAnchorEl);
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined;

    const handlePopoverButtonClick = (event) => {
        event.stopPropagation();
        setPopoverAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = (event) => {
        event.stopPropagation();
        setPopoverAnchorEl(null);
    };

    const [popoverChatAnchorEl, setPopoverChatAnchorEl] = React.useState(null);

    const isPopoverChatOpen = Boolean(popoverChatAnchorEl);
    const popoverChatId = isPopoverChatOpen ? 'simple-popover' : undefined;

    const handleChatPopoverButtonClick = (event) => {
        event.stopPropagation();
        setPopoverChatAnchorEl(event.currentTarget);
    };

    const handleChatPopoverClose = (event) => {
        event.stopPropagation();
        setPopoverChatAnchorEl(null);
    };

    const popoverMenuAction = (
        <React.Fragment>
            <IconButton aria-describedby={popoverId} onClick={handlePopoverButtonClick}>
                <MoreHorizIcon/>
            </IconButton>
            <Menu
                id={popoverId}
                open={isPopoverOpen}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                disableAutoFocus
                disableAutoFocusItem
            >
                <MenuItem onClick={handlePopoverClose}>New message</MenuItem>
                <MenuItem onClick={handlePopoverClose}>Mark all as read</MenuItem>
            </Menu>
        </React.Fragment>
    );

    const steps = [
        'Create or join a team',
        'Manage team members',
        'Invite players and manage events',
        'Chat, compete and track results',
    ];

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppProvider
                navigation={[
                    {
                        kind: 'header', title: 'Main features',
                    },
                    {
                        segment: 'teams', title: 'Team', icon: <SportsSoccerIcon />,
                    },
                    {
                        segment: 'members', title: 'Members', icon: <EmojiPeopleIcon />, pattern: 'dashboard{/:noteId}*',
                    },
                    {
                        segment: 'friends', title: 'Friends', icon: <PersonIcon />, action: <Chip label={3} color="primary" size="small" />,
                    },
                    {
                        segment: 'emails', title: 'Emails', icon: <EmailIcon />
                    },
                    {
                        segment: 'chat', title: 'Chat', icon: <MessageIcon />,
                    },
                    {
                        segment: 'events', title: 'Team Events', icon: <FitnessCenterIcon />,
                    },
                    {
                        segment: 'map', title: 'Events Map', icon: <MapIcon />,
                    },
                    {
                        kind: 'divider',
                    },
                    {
                        kind: 'header', title: 'Analytics & Tools',
                    },
                    {
                        segment: 'planning', title: 'Planning', icon: <ChecklistIcon />, pattern: 'notes{/:noteId}*',
                    },
                    {
                        segment: 'statistics', title: 'Statistics', icon: <BarChartIcon />,
                    },
                ]
                }
                router={router}
                theme={demoTheme}
                window={demoWindow}
                branding={{
                    logo: (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <IconButton onClick={handleGoHome} color="primary">
                                <HomeIcon />
                            </IconButton>
                        </div>
                    ),
                    title: 'Team management',
                    homeUrl: routes.team,
                }}
            >
                <DashboardLayout>
                    {router.pathname === "/team" && (
                        <Container sx={{py: 8}}>
                            <motion.div
                                initial={{opacity: 0, y: 30}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 0.8}}
                                viewport={{once: true}}
                            >
                                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                                    How It Works
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" paragraph>
                                    Organizing and joining teams is easier than ever
                                </Typography>
                                <Grid container spacing={4} justifyContent="center" sx={{mt: 4}}>
                                    {steps.map((label, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <motion.div
                                                initial={{opacity: 0, y: 30}}
                                                whileInView={{opacity: 1, y: 0}}
                                                viewport={{once: true}}
                                                transition={{delay: index * 0.2, duration: 0.6}}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 4,
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 3,
                                                        textAlign: 'center',
                                                        height: '200px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            width: 56,
                                                            height: 56,
                                                            mb: 2,
                                                            mx: 'auto',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Avatar>
                                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                                                        {label}
                                                    </Typography>
                                                </Box>

                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>

                            </motion.div>
                        </Container>
                    )}

                        {router.pathname === "/map" && (
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47931.43656890325!2d27.4904518!3d53.9006017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfbc1f7a6bd1%3A0x34ca9fbc765ba123!2sMinsk%2C%20Belarus!5e0!3m2!1sen!2s!4v1633452834502!5m2!1sen!2s"
                                style={{flex: 1, border: 0}}
                                allowFullScreen
                                loading="lazy"
                            />
                        )}
                        {router.pathname === "/planning" && (
                            <CrudRoutes
                                basePath={routes.planning}
                                entityName="Note"
                                dataSource={notesDataSource}
                                dataSourceCache={notesCache}
                            />
                        )}
                        {router.pathname === "/teams" && (
                            <TeamManagementModern/>
                        )}
                        {router.pathname === "/members" && (
                            <ParticipantsManager/>
                        )}
                        {router.pathname === "/friends" && (
                            <FriendsList/>
                        )}
                        {router.pathname === "/chat" && (
                            <Chat/>
                        )}
                        {router.pathname === "/events" && (
                            <TeamEvents/>
                        )}
                        {router.pathname === "/emails" && (
                            <Emails/>
                        )}
                        {router.pathname === "/statistics" && (
                            <SportsStatistics/>
                        )}


                </DashboardLayout>
            </AppProvider>
        </AppTheme>
    );
}

TeamManagementCrudAdvanced.propTypes = {
    window: PropTypes.func,
};

export default TeamManagementCrudAdvanced;
