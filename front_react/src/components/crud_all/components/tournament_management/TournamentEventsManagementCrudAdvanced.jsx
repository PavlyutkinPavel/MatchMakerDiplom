import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import EventManagementComponent from "./EventManagementComponent";
import BasicEventComponent from "./BasicEvents";
import TwoSideEventComponent from "./TwoSideEvents";
import TableTournamentEvents from "./TableTournamentEvents";
import PlayOffTournamentEvents from "./PlayOffTournamentEvents";
import TwoTeamEventManager from './TwoTeamEventManager';

import { useDemoRouter } from '@toolpad/core/internal';
import {
    IconButton,
} from "@mui/material";
import {
    Home as HomeIcon
} from "@mui/icons-material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import Filter2Icon from '@mui/icons-material/Filter2';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../shared-theme/AppTheme";
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


function TournamentEventsManagementCrudAdvanced(props) {
    const { window } = props;

    const demoWindow = window !== undefined ? window() : undefined;

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    const router = useDemoRouter(routes.basic); // Set default route to basic

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
                branding={{
                    logo: (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {/*<img src={logo} alt="MatchMaker logo" />*/}
                            <IconButton onClick={handleGoHome} color="primary">
                                <HomeIcon />
                            </IconButton>
                        </div>
                    ),
                    title: 'Tournament management',
                    homeUrl: routes.basic,
                }}
            >
                <DashboardLayout>
                    <PageContainer>
                        {router.pathname === "/basic" && (
                            <BasicEventComponent/>
                        )}
                        {router.pathname === "/twoside" && (
                            <TwoTeamEventManager/>
                        )}
                        {router.pathname === "/table" && (
                            <TableTournamentEvents />
                        )}
                        {router.pathname === "/playoff" && (
                            <PlayOffTournamentEvents />
                        )}
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