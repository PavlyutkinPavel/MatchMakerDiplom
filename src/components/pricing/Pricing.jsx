import React from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import AppAppBar from "../blog/components/AppAppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Footer from "../blog/components/Footer";
import AppTheme from "../shared-theme/AppTheme";

const plans = [
    {
        title: "Free",
        price: "$0 USD/mo",
        oldPrice: "$5.99 USD/mo",
        description: "For small teams who want to gain free access to our fan-favorite features.",
        features: ["Schedule", "Team Chat", "Assignments", "Real-Time Game Sharing", "Invoicing", "Roster: 15 members"],
        buttonText: "Create free team",
        tag: "For beginners",
    },
    {
        title: "Premium",
        price: "$10 USD/mo",
        oldPrice: "$15.99 USD/mo",
        description: "For teams wanting to also track stats and create shareable lineups.",
        features: ["Lineups and Statistics", "Premium Support", "Roster: 40 Members", "Storage: 2 GB"],
        buttonText: "Create premium team",
        tag: "Most Popular",
    },
    {
        title: "Ultra",
        price: "$12.50 USD/mo",
        oldPrice: "$21.99 USD/mo",
        description: "For larger teams looking to monetize sponsorships and receive premium support.",
        features: ["Multiple Sponsorships", "Premium Support", "Roster: Unlimited", "Storage: Unlimited"],
        buttonText: "Create ultra team",
        tag: "Large teams",
    },
    {
        title: "For Business",
        price: "$150.00 USD/year",
        oldPrice: "$200.00 USD/year",
        description: "For organizations looking to centralize their team management and save!",
        features: ["NEW! Program Management", "Club/League-wide messaging", "Great payment processing rates", "TeamSnap Ultra for all of your teams included"],
        buttonText: "Chat with us now",
        tag: "Clubs & Leagues",
    },
];

const Pricing = () => {
    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container maxWidth="lg" component="main" sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}>
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h4" sx={{ mb: 4 }}>Choose the Right Plan for Your Team</Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {plans.map((plan, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, boxShadow: 3, borderRadius: 2 }}>
                                    {plan.tag && (
                                        <Typography
                                            sx={{
                                                backgroundColor: "#ff9800",
                                                color: "white",
                                                borderRadius: "4px",
                                                px: 1,
                                                py: 0.5,
                                                mb: 1,
                                                alignSelf: "center",
                                            }}
                                        >
                                            {plan.tag}
                                        </Typography>
                                    )}
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold" align="center">{plan.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, mb: 2 }}>
                                                {plan.description}
                                            </Typography>
                                            {plan.price && (
                                                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>{plan.price}</Typography>
                                            )}
                                            {plan.oldPrice && (
                                                <Typography variant="body2" sx={{ textDecoration: "line-through", color: "gray", textAlign: "center" }}>
                                                    {plan.oldPrice}
                                                </Typography>
                                            )}
                                            <ul style={{ textAlign: "left", paddingLeft: "20px", marginTop: "10px" }}>
                                                {plan.features.map((feature, i) => (
                                                    <li key={i}>
                                                        <Typography variant="body2">{feature}</Typography>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Box>
                                        <Button variant="contained" fullWidth sx={{ mt: 2, alignSelf: 'center' }}>
                                            {plan.buttonText}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            <Footer />
        </AppTheme>
    );
};

export default Pricing;