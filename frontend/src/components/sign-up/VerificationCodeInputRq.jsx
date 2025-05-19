import React, { useRef, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CssBaseline,
    FormControl,
    FormLabel,
    Typography,
    Stack,
    TextField,
    styled,
    Snackbar,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SitemarkIcon } from './components/CustomIcons'; // Assuming you have this from your registration page

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
        width: '450px',
    },
    ...theme.applyStyles?.('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const VerificationContainer = styled(Stack)(({ theme }) => ({
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
        ...theme.applyStyles?.('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const DigitInput = styled(TextField)(({ theme }) => ({
    width: '3rem',
    height: '3.5rem',
    '& .MuiInputBase-input': {
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: theme.spacing(1),
    },
    '& .MuiOutlinedInput-root': {
        height: '100%',
    },
}));

const VerificationCodeInputRq = () => {
    const [values, setValues] = useState(Array(6).fill(''));
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [isLoading, setIsLoading] = useState(false);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (index, event) => {
        const val = event.target.value.replace(/\D/g, '');
        if (val === '' && index > 0) {
            const newValues = [...values];
            newValues[index] = '';
            setValues(newValues);
            return;
        }

        if (val) {
            const newValues = [...values];
            newValues[index] = val[0];
            setValues(newValues);

            // Move to next input if available
            if (index + 1 < 6) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace') {
            if (values[index] === '') {
                // If current input is empty and backspace is pressed, move to previous input
                if (index > 0) {
                    const newValues = [...values];
                    newValues[index - 1] = '';
                    setValues(newValues);
                    inputsRef.current[index - 1].focus();
                }
            } else {
                const newValues = [...values];
                newValues[index] = '';
                setValues(newValues);
            }
        } else if (event.key === 'ArrowLeft' && index > 0) {
            inputsRef.current[index - 1].focus();
        } else if (event.key === 'ArrowRight' && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);

        if (pastedData) {
            const newValues = [...values];
            for (let i = 0; i < pastedData.length; i++) {
                if (i < 6) {
                    newValues[i] = pastedData[i];
                }
            }
            setValues(newValues);

            const nextEmptyIndex = newValues.findIndex(val => val === '');
            if (nextEmptyIndex !== -1) {
                inputsRef.current[nextEmptyIndex].focus();
            } else {
                inputsRef.current[5].focus();
            }
        }
    };

    const handleSubmit = async () => {
        const verificationCode = values.join('');
        const isRedirectRequired = sessionStorage.getItem("needRedirect");

        if (verificationCode.length !== 6) {
            setAlertMessage("Please enter all 6 digits");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
        }

        setIsLoading(true);

        const verifyData = {
            verificationCode: verificationCode,
            isRedirectRequired: isRedirectRequired
        };

        try {
            const response = await fetch("http://localhost:8080/verification_rq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verifyData),
            });

            let returnMessage;
            try {
                const textResponse = await response.text();
                returnMessage = textResponse || (response.ok
                    ? "Verification successful!"
                    : "Verification failed. Please try again.");
            } catch (e) {
                returnMessage = response.ok
                    ? "Verification successful!"
                    : "Verification failed. Please try again.";
            }

            if (response.ok) {
                setAlertMessage(returnMessage);
                setAlertSeverity("success");
                setAlertOpen(true);

                setTimeout(() => {
                    navigate("/reset_password");
                }, 1500);
            }else if(response.status === 302){
                setAlertMessage(returnMessage);
                setAlertSeverity("success");
                setAlertOpen(true);

                sessionStorage.removeItem("needRedirect");

                setTimeout(() => {
                    navigate("/reset_password");
                }, 1500);
            } else {
                setAlertMessage(returnMessage);
                setAlertSeverity("error");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error during verification:", error);
            setAlertMessage("Connection error. Please try again later.");
            setAlertSeverity("error");
            setAlertOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);

        try {
            setAlertMessage("Requesting new verification code...");
            setAlertSeverity("info");
            setAlertOpen(true);

            const email = localStorage.getItem('registrationEmail') || sessionStorage.getItem('registrationEmail');

            if (!email) {
                throw new Error("Email not found. Please try to register again.");
            }

            const response = await fetch("http://localhost:8080/resend_code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            console.log(response.status)

            let returnMessage;
            try {
                const textResponse = await response.text();
                returnMessage = textResponse || (response.ok
                    ? "New verification code sent to your email"
                    : "Failed to resend verification code");
            } catch (e) {
                returnMessage = response.ok
                    ? "New verification code sent to your email"
                    : "Failed to resend verification code";
            }

            setAlertMessage(returnMessage);
            setAlertSeverity(response.ok ? "success" : "error");
            setAlertOpen(true);
        } catch (error) {
            console.error("Error resending code:", error);
            setAlertMessage(error.message || "Failed to resend verification code");
            setAlertSeverity("error");
            setAlertOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VerificationContainer direction="column" justifyContent="space-between" sx={{ height: '100vh', overflow: 'hidden' }}>
            <StyledCard variant="outlined" sx={{ overflow: 'auto', maxHeight: '90vh', flexGrow: 1 }}>
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
                    Verification <SitemarkIcon />
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Please enter the 6-digit verification code sent to your email
                </Typography>

                <FormControl sx={{ mb: 3 }}>
                    <FormLabel htmlFor="verification-code">Verification Code</FormLabel>
                    <Box display="flex" gap={1} justifyContent="space-between" mt={1} onPaste={handlePaste}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <DigitInput
                                key={index}
                                inputRef={(el) => (inputsRef.current[index] = el)}
                                inputProps={{
                                    maxLength: 1,
                                    inputMode: 'numeric',
                                    'aria-label': `Digit ${index + 1} of verification code`,
                                }}
                                value={values[index]}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                variant="outlined"
                                autoFocus={index === 0}
                                disabled={isLoading}
                            />
                        ))}
                    </Box>
                </FormControl>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={values.some(val => val === '') || isLoading}
                >
                    {isLoading ? "Verifying..." : "Verify Account"}
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                    Didn't receive a code? <Button
                    variant="text"
                    sx={{ p: 0, minWidth: 'auto' }}
                    onClick={handleResendCode}
                    disabled={isLoading}
                >
                    Resend
                </Button>
                </Typography>
            </StyledCard>

            <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
                <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </VerificationContainer>
    );
};

export default VerificationCodeInputRq;