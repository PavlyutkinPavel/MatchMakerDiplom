import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import AppAppBar from "../blog/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";

// Стилизованные компоненты, аналогично вашему стилю
const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '90%',
        maxWidth: '800px',
    },
    ...theme.applyStyles?.('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
    '&:before': {
        display: 'none', // Убираем линию перед аккордеоном
    },
    boxShadow: 'hsla(220, 30%, 5%, 0.03) 0px 3px 8px 0px',
    overflow: 'hidden',
    ...theme.applyStyles?.('dark', {
        boxShadow: 'hsla(220, 30%, 5%, 0.2) 0px 3px 8px 0px',
    }),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(30, 41, 59, 0.2)'
        : 'rgba(240, 249, 255, 0.8)',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(30, 41, 59, 0.4)'
            : 'rgba(224, 242, 254, 0.9)',
    },
    transition: 'background-color 0.2s ease',
}));

const FaqContainer = styled(Box)(({ theme }) => ({
    backgroundImage: theme.palette.mode === 'dark'
        ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
        : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    padding: theme.spacing(2),
    minHeight: '100%',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

// Компонент FAQ для MatchMaker
export default function MatchMakerFAQ() {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    // Данные FAQ
    const faqItems = [
        {
            id: 'panel1',
            question: 'How do I register for the tournament?',
            answer: 'To register for the tournament, you need to create an account on our website, select the tournament you are interested in in the Upcoming Events section and click the Register button. After that, follow the instructions to fill in the necessary information about your team or about yourself, depending on the format of the tournament.'
        },
        {
            id: 'panel2',
            question: 'What tournament formats are available on the platform?',
            answer: 'Various formats are available on our platform: round-robin system, Olympic single-elimination system, Swiss system, group stage + playoffs. We support both team and individual competitions in various sports.'
        },
        {
            id: 'panel3',
            question: 'Is it possible to cancel registration for the tournament?',
            answer: 'Yes, you can cancel your registration before the deadline specified in the tournament description. To do this, go to the "My tournaments" section in your personal account and select the "Cancel registration" option. In some cases, a cancellation fee may be charged, especially if the deadline is already close.'
        },
        {
            id: 'panel4',
            question: 'How do I create my own tournament on the platform?',
            answer: 'To create your own tournament, log in to your account, go to the "Organizer" section and click the "Create Tournament" button. Fill in all the necessary fields: name, sport, format, dates, rules, etc. After moderation, your tournament will be published on the platform.'
        },
        {
            id: 'panel5',
            question: 'How is the payment for participation in tournaments carried out?',
            answer: 'We support various payment methods: bank cards, electronic wallets, bank transfer. When registering for a paid tournament, you will be redirected to a secure payment page. All transactions are encrypted and processed in accordance with international security standards.'
        },
        {
            id: 'panel6',
            question: 'Is it possible to receive notifications about the start of the tournament?',
            answer: 'Yes, you can set up notifications in your profile. We can send tournament start reminders via email, SMS, or via push notifications in the mobile app. Notifications are usually sent a day and an hour before the start of the competition.'
        },
    ];

    return (
        <AppTheme>
            <AppAppBar />
            <FaqContainer sx={{margin: 5}}>
                <CssBaseline enableColorScheme />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <StyledCard variant="outlined">
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.75rem, 5vw, 2.15rem)',
                                    fontWeight: 600,
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                Frequently Asked Questions
                            </Typography>
                            <Divider sx={{ width: '80px', height: '3px', mx: 'auto', mb: 2, bgcolor: 'black' }} />
                            <Typography variant="subtitle1" color="text.secondary">
                                Everything you need to know about the MatchMaker platform for organizing sports events
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            {faqItems.map((item) => (
                                <StyledAccordion
                                    key={item.id}
                                    expanded={expanded === item.id}
                                    onChange={handleChange(item.id)}
                                >
                                    <StyledAccordionSummary
                                        expandIcon={<ExpandMoreIcon color="primary" />}
                                        aria-controls={`${item.id}-content`}
                                        id={`${item.id}-header`}
                                    >
                                        <Typography sx={{ fontWeight: 500, color: 'text.primary' }}>
                                            {item.question}
                                        </Typography>
                                    </StyledAccordionSummary>
                                    <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'background.paper' }}>
                                        <Typography color="text.secondary">
                                            {item.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </StyledAccordion>
                            ))}
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                mt: 4,
                                p: 3,
                                borderRadius: 2,
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                textAlign: 'center',
                                opacity: 0.9,
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 1, color: 'primary.dark' }}>
                                Do you have any other questions?
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'primary.dark' }}>
                                Contact our support team at: support@matchmaker.com
                            </Typography>
                        </Paper>
                    </StyledCard>
                </Container>
            </FaqContainer>
        </AppTheme>
    );
}