import * as React from 'react';
import PropTypes from 'prop-types';
import logo from "../../../assets/img/logo.png";
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import CrudRoutes from "./CrudRoutes";
import EventManagementComponent from "./EventManagementComponent"; // Import the new component

import {
    DataSourceCache,
} from '@toolpad/core/Crud';
import { useDemoRouter } from '@toolpad/core/internal';
import {
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    BarChart as BarChartIcon,
    MoreHoriz as MoreHorizIcon,
    SportsSoccer as SportsSoccerIcon,
    Home as HomeIcon
} from "@mui/icons-material";
import ChecklistIcon from '@mui/icons-material/Checklist';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Filter2Icon from '@mui/icons-material/Filter2';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../shared-theme/AppTheme";
import {useNavigate} from "react-router-dom";

const routes = {
    basic: "/basic",
    twoside: "/twoside",
    table: "/table",
    playoff: "/playoff",
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

const notesCache = new DataSourceCache();

function TournamentEventsManagementCrudAdvanced(props) {
    const { window } = props;

    const demoWindow = window !== undefined ? window() : undefined;

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const router = useDemoRouter(routes.basic); // Set default route to basic

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

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppProvider
                navigation={[
                    {
                        kind: 'header', title: 'Basic Events',
                    },
                    {
                        segment: 'basic', title: 'Basic Event', icon: <PersonAddAlt1Icon />, pattern: 'notes{/:noteId}*',
                    },
                    {
                        segment: 'twoside', title: 'Two side Event', icon: <Filter2Icon />,
                    },

                    {
                        kind: 'divider',
                    },
                    {
                        kind: 'header', title: 'Tournaments',
                    },
                    {
                        segment: 'table', title: 'Table Tournament', icon: <BackupTableIcon />,
                    },
                    {
                        segment: 'playoff', title: 'PlayOff Tournament', icon: <EmojiEventsIcon />, pattern: 'notes{/:noteId}*',
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
                    homeUrl: routes.basic, // Changed default route to basic
                }}
            >
                <DashboardLayout>
                    <PageContainer>
                        {/* Render the EventManagementComponent */}
                        <EventManagementComponent />
                    </PageContainer>
                </DashboardLayout>
            </AppProvider>
        </AppTheme>
    );
}

TournamentEventsManagementCrudAdvanced.propTypes = {
    window: PropTypes.func,
};

export default TournamentEventsManagementCrudAdvanced;