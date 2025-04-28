import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import { SitemarkIcon } from './CustomIcons';
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

const Card = styled(MuiCard)(({ theme }) => ({
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
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const ResetPasswordContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function ResetPassword(props) {
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmError, setConfirmError] = useState(false);
    const [confirmErrorMessage, setConfirmErrorMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const navigate = useNavigate();

    const email = sessionStorage.getItem('registrationEmail') || '';

    const validateInputs = (newPassword, confirmPassword) => {
        let isValid = true;

        if (!newPassword || newPassword.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (newPassword !== confirmPassword) {
            setConfirmError(true);
            setConfirmErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmError(false);
            setConfirmErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        if (!validateInputs(newPassword, confirmPassword)) {
            return;
        }

        const resetData = {
            email: email,
            newPassword: newPassword,
        };

        try {
            const response = await fetch("http://localhost:8080/reset_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resetData),
            });

            const returnMessage = await response.text();

            if (response.ok) {
                setAlertMessage("Password has been successfully reset!");
                setAlertSeverity("success");
                setAlertOpen(true);

                setTimeout(() => navigate("/signin"), 1000);
            } else {
                setAlertMessage(returnMessage || "Failed to reset password. Please try again.");
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setAlertMessage("Error connecting with server. Please try again later.");
            setAlertSeverity("error");
            setAlertOpen(true);
        }
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <ResetPasswordContainer direction="column" justifyContent="space-between"
                                    sx={{
                                        height: '100vh',
                                        overflow: 'hidden',
                                    }}
            >
                <Card variant="outlined"
                      sx={{
                          overflow: 'auto',
                          maxHeight: '90vh',
                          flexGrow: 1,
                      }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        Reset Password <SitemarkIcon />
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                        Please enter your new password below.
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="newPassword">New Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="newPassword"
                                placeholder="********"
                                type="password"
                                id="newPassword"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="confirmPassword"
                                placeholder="********"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                variant="outlined"
                                error={confirmError}
                                helperText={confirmErrorMessage}
                                color={confirmError ? 'error' : 'primary'}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Reset Password
                        </Button>
                    </Box>

                    <Typography sx={{ textAlign: 'center', mt: 2 }}>
                        Remember your password?{' '}
                        <Link
                            href="/signin/"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign in
                        </Link>
                    </Typography>

                    <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
                        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Card>
            </ResetPasswordContainer>
        </AppTheme>
    );
}