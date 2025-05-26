import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import useApplicationStore from 'store/useApplicationStore';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
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

export default function SignInCard() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const signIn = useApplicationStore((state) => state.auth.signIn);

    sessionStorage.setItem("needRedirect", "true");


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleForgotPassword = async () => {
        try {
            setAlertMessage("Requesting verification code...");
            setAlertSeverity("info");
            setAlertOpen(true);

            const email = sessionStorage.getItem('logInEmail');

            if (!email) {
                throw new Error("Email not found. Please enter your email.");
            }

            const response = await fetch("http://localhost:8080/resend_code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            console.log(response.status);

            let returnMessage;
            try {
                const textResponse = await response.text();
                returnMessage = textResponse || (response.ok
                    ? "Verification code sent to your email"
                    : "Failed to resend verification code");
            } catch (e) {
                returnMessage = response.ok
                    ? "Verification code sent to your email"
                    : "Failed to resend verification code";
            }

            setAlertMessage(returnMessage);
            setAlertSeverity(response.ok ? "success" : "error");
            setAlertOpen(true);

        } catch (error) {
            console.error("Error resending code:", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");


    const handleSubmit = async (event) => {
        setAlertSeverity("error");
        setTimeout(() => setAlertOpen(true), 10);
        event.preventDefault();

        const formData = new FormData(event.target);
        const authData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        sessionStorage.setItem('logInEmail', authData.email)

        try {
            const response = await fetch("http://localhost:8080/authentication", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(authData),
            });

            if (response.status === 200) {
                const { token } = await response.json();
                sessionStorage.setItem("email", authData.email)
                sessionStorage.setItem("jwt", token)
                signIn()
                setAlertMessage("Successful sign in!");
                setAlertSeverity("success");
                setAlertOpen(true);

                setTimeout(() => navigate("/"), 1500);
            } else {
                const { token } = await response.json();
                setAlertMessage(token);
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setAlertMessage("Error connection with server.");
            setAlertSeverity("error");
            setAlertOpen(true);
        }
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <Card variant="outlined">
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <SitemarkIcon />
            </Box>
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
                Sign in <SitemarkIcon />
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        error={emailError}
                        helperText={emailErrorMessage}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: 'baseline' }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>
                    <TextField
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        name="password"
                        placeholder="********"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <ForgotPassword
                    open={open}
                    handleClose={handleClose}
                    handleForgotPassword={handleForgotPassword}
                />
                <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                    Sign in
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    Don&apos;t have an account?{' '}
                    <span>
                        <Link
                            href="/signup"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Sign up
                        </Link>
                    </span>
                </Typography>
            </Box>
            {/*<Divider>or</Divider>*/}
            {/*<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Sign in with Google')}
                    startIcon={<GoogleIcon />}
                >
                    Sign in with Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => alert('Sign in with Facebook')}
                    startIcon={<FacebookIcon />}
                >
                    Sign in with Facebook
                </Button>
            </Box>*/}
            {/* Alert ����������� */}
            <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
                <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
                    <Alert
                        onClose={() => setAlertOpen(false)}
                        severity={alertSeverity}
                        sx={{
                            backgroundColor: alertSeverity === 'error' ? 'white' : (alertSeverity === 'success' ? 'white' : 'transparent'),
                            color: alertSeverity === 'error' ? 'red' : 'green',
                        }}
                    >
                        {alertMessage}
                    </Alert>
                </Snackbar>

            </Snackbar>
        </Card>
    );
}