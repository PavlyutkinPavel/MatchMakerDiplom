import * as React from 'react';
import PropTypes from 'prop-types';
import logo from "../../../assets/img/logo.png";
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CrudRoutes from "./CrudRoutes";

import {
    DataSourceCache,
} from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';
import {
    IconButton,
    Menu,
    MenuItem,
    Chip,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    ShoppingCart as ShoppingCartIcon,
    BarChart as BarChartIcon,
    Description as DescriptionIcon,
    Person as PersonIcon,
    Message as MessageIcon,
    Map as MapIcon,
    CallMade as CallMadeIcon,
    CallReceived as CallReceivedIcon,
    MoreHoriz as MoreHorizIcon,
    SportsSoccer as SportsSoccerIcon,
    Home as HomeIcon
} from "@mui/icons-material";
import ChecklistIcon from '@mui/icons-material/Checklist';
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../shared-theme/AppTheme";
import {useNavigate} from "react-router-dom";
import countries from "../../../data/countries";

const routes = {
    team: "/team",
    notes: "/notes",
    map: "/map",
    message: "/message",
    dashboard: "/dashboard",
    orders: "/orders",
    reports: "/reports",
    integrations: "/integrations",
    friends: "/friends",
};

const MESSAGES_NAVIGATION = [
    {
        segment: 'sent',
        title: 'Sent',
        icon: <CallMadeIcon />,
        action: <Chip label={12} color="success" size="small" />,
    },
    {
        segment: 'received',
        title: 'Received',
        icon: <CallReceivedIcon />,
        action: <Chip label={4} color="error" size="small" />,
    },
];

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
    { id: 1, title: 'Grocery List Item', text: 'Buy more coffee.' },
    { id: 2, title: 'Personal Goal', text: 'Finish reading the book.' },
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

const API_URL = "http://localhost:8080/team";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
});

const countryNames = countries.map(country => country.name);

// Функция для получения списка городов из Oxilor Data API
async function fetchCitiesFromOxilor() {
    const apiURL = 'https://data-api.oxilor.com/rest';
    const token = 'OhJeadqJZNTjVN7obZao3Dd-SeFHk1'; // Замените на ваш токен

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await fetch(apiURL, options);
    if (!response.ok) {
        throw new Error('Ошибка при загрузке городов из Oxilor API');
    }

    const data = await response.json();
    return data.cities.map(city => city.name); // Преобразуем данные в массив названий городов
}

export const teamDataSource = {
    fields: [
        { field: 'id', headerName: 'ID', flex: 0, minWidth: 0, maxWidth: 0},
        { field: 'teamName', headerName: 'Team name', flex: 1 },
        {
            field: 'teamType',
            headerName: 'Sport Type',
            flex: 1,
            type: 'singleSelect',
            valueOptions: ['FOOTBALL', 'BASKETBALL', 'TENNIS', 'HOCKEY', 'VOLLEYBALL']
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            type: 'singleSelect',
            valueOptions: ['Active team', 'Inactive team']
        },
        {
            field: 'country',
            headerName: 'Country',
            flex: 1,
            type: 'singleSelect',
            valueOptions: countryNames
        },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'achievements', headerName: 'Achievements', flex: 1 },
        { field: 'wins', headerName: 'Wins', flex: 1 },

    ],
    getMany: async ({ paginationModel }) => {
        const { page, pageSize } = paginationModel;
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: getHeaders(),
            });
            const teams = await response.json();
            return {
                items: teams.slice(page * pageSize, (page + 1) * pageSize),
                itemCount: teams.length,
            };
        } catch (error) {
            console.error("Error fetching teams:", error);
            return { items: [], itemCount: 0 };
        }
    },
    getOne: async (teamId) => {
        try {
            const response = await fetch(`${API_URL}/${teamId}`, {
                method: "GET",
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error("Error fetching team:", error);
            throw new Error("Team not found");
        }
    },
    createOne: async (data) => {
        try {
            console.log(data)
            const response = await fetch(API_URL, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            console.log("RESP: " + response.status)
            if (response.status === 201) {
                return response.status;
            }
        } catch (error) {
            console.error("Error creating team:", error);
            throw new Error("Failed to create team");
        }
    },
    updateOne: async (teamId, data) => {
        try {
            console.log(data)
            const response = await fetch(API_URL, {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            console.log("RESP: " + response.status)
            if (response.status === 204) {
                return response.status;
            }
        } catch (error) {
            console.error("Error updating team:", error);
            throw new Error("Failed to update team");
        }
    },
    deleteOne: async (teamId) => {
        try {
            await fetch(`${API_URL}/${teamId}`, {
                method: "DELETE",
                headers: getHeaders(),
            });
        } catch (error) {
            console.error("Error deleting team:", error);
            throw new Error("Failed to delete team");
        }
    },
    validate: (formValues) => {
        let issues = [];
        if (!formValues.teamName) {
            issues.push({ message: "Team name is required", path: ["teamName"] });
        }
        if (formValues.teamName && formValues.teamName.length < 3) {
            issues.push({ message: "Team name must be at least 3 characters long", path: ["teamName"] });
        }
        if (!formValues.country) {
            issues.push({ message: "Country is required", path: ["country"] });
        }
        return { issues };
    },
};


const notesCache = new DataSourceCache();

function CrudAdvanced(props) {
    const { window } = props;

    const demoWindow = window !== undefined ? window() : undefined;

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };


    const router = useDemoRouter(routes.team);

    const demoSession = {
        user: {
            name: 'Pavel Pavlyutlin',
            email: 'pashanpmrp200431.com',
            image: 'https://avatars.githubusercontent.com/u/93840829?s=400&u=28e4d63cd91110e4b3fa12b9ac8a996917f52a1d&v=4',
        },
    };

    const [session, setSession] = React.useState(demoSession);
    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession(demoSession);
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

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

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppProvider
                navigation={[
                    {
                        kind: 'header', title: 'Main items',
                    },
                    {
                        segment: 'notes', title: 'Notes', icon: <ChecklistIcon />, pattern: 'notes{/:noteId}*',
                    },
                    {
                        segment: 'integrations', title: 'Team', icon: <SportsSoccerIcon />,
                    },
                    {
                        segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon />, pattern: 'dashboard{/:noteId}*',
                    },
                    {
                        segment: 'orders', title: 'Orders', icon: <ShoppingCartIcon />,
                    },
                    {
                        kind: 'divider',
                    },
                    {
                        kind: 'header', title: 'Analytics',
                    },
                    {
                        segment: 'reports', title: 'Reports', icon: <BarChartIcon />,
                        children: [
                            {
                                segment: 'statistics', title: 'Stats', icon: <DescriptionIcon />,
                            },
                            {
                                segment: 'table', title: 'Table', icon: <DescriptionIcon />,
                            },
                        ],
                    },
                    {
                        segment: 'friends', title: 'Friends', icon: <PersonIcon />, action: <Chip label={7} color="primary" size="small" />,
                    },
                    {
                        segment: 'messages', title: 'Messages', icon: <MessageIcon />, action: popoverMenuAction, children: MESSAGES_NAVIGATION,
                    },
                    {
                        segment: 'map', title: 'Map', icon: <MapIcon />,
                    },
                ]
                }
                router={router}
                theme={demoTheme}
                window={demoWindow}
                authentication={authentication}
                session={session}
                branding={{
                    logo: (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {/*<img src={logo} alt="MatchMaker logo" />*/}
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
                    <PageContainer>
                        {router.pathname === "/map" && (
                            <iframe
                                title="Google Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47931.43656890325!2d27.4904518!3d53.9006017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfbc1f7a6bd1%3A0x34ca9fbc765ba123!2sMinsk%2C%20Belarus!5e0!3m2!1sen!2s!4v1633452834502!5m2!1sen!2s"
                                style={{flex: 1, border: 0}}
                                allowFullScreen
                                loading="lazy"
                            />
                        )}
                        {router.pathname === "/notes" && (
                            <CrudRoutes
                                basePath={routes.notes}
                                entityName="Note"
                                dataSource={notesDataSource}
                                dataSourceCache={notesCache}
                            />
                        )}
                        {router.pathname === "/integrations" && (
                            <CrudRoutes
                                basePath={routes.integrations}
                                entityName="Team"
                                dataSource={teamDataSource}
                                dataSourceCache={notesCache}
                            />
                        )}

                    </PageContainer>
                </DashboardLayout>
            </AppProvider>
        </AppTheme>
    );
}

CrudAdvanced.propTypes = {
    window: PropTypes.func,
};

export default CrudAdvanced;
