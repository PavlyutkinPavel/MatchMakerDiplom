import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Paper,
    Typography,
    useTheme,
    Modal,
    Backdrop,
    Fade,
    Stack,
    TextField,
    CircularProgress,
    LinearProgress,
    Chip,
    Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import PaymentIcon from "@mui/icons-material/Payment";
import GoogleIcon from "@mui/icons-material/Google";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

const initialCourses = [
    {
        title: "Курс по оптимизации бизнес процессов",
        price: "120 000₽",
        description: "Изучи основы оптимизации бизнеса.",
        instructor: "Мария Белова",
        popularity: "Популярный",
        progress: 80,
        paid: false,
    },
    {
        title: "Управление финансами",
        price: "350 000₽",
        description: "Погрузись в управление финансами и инвестиции.",
        instructor: "Иван Сидоров",
        popularity: "Новый",
        progress: 30,
        paid: false,
    },
    {
        title: "Банковское дело",
        price: "280 000₽",
        description: "Освой искусство коммуникации с банками и кредитными организациями.",
        instructor: "Алексей Ковалев",
        popularity: "Хит продаж",
        progress: 65,
        paid: false,
    },
];

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    padding: theme.spacing(2),
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0px 8px 16px rgba(0,0,0,0.1)",
    },
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(3),
}));

const SubscriptionInfoPage = () => {
    const theme = useTheme();
    const [courses, setCourses] = useState(initialCourses);
    const [open, setOpen] = useState(false);
    const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardHolder, setCardHolder] = useState("");

    const handleOpenPayment = (index) => {
        setSelectedCourseIndex(index);
        setOpen(true);
        setCardNumber("");
        setPaymentMethod(null);
        setIsPaying(false);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCourseIndex(null);
    };

    const handleMockPayment = (method) => {
        if (cardNumber.replace(/\s/g, "").length !== 16) {
            alert("Введите корректный номер карты");
            return;
        }

        setIsPaying(true);
        setPaymentMethod(method);

        setTimeout(() => {
            const updatedCourses = [...courses];
            updatedCourses[selectedCourseIndex].paid = true;
            setCourses(updatedCourses);
            handleClose();
        }, 3000);
    };

    const getChipColor = (label) => {
        switch (label) {
            case "Популярный":
                return "success";
            case "Новый":
                return "info";
            case "Хит продаж":
                return "warning";
            default:
                return "default";
        }
    };

    return (
        <>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Доступные курсы
            </Typography>

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    background: theme.palette.background.paper,
                    mb: 5,
                }}
            >
                <Stack spacing={3}>
                    {courses.map((course, index) => (
                        <StyledCard key={index}>
                            <Box flex={1}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                    <SchoolIcon color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        {course.title}
                                    </Typography>
                                </Stack>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {course.description}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                        {course.instructor[0]}
                                    </Avatar>
                                    <Typography variant="body2">{course.instructor}</Typography>
                                </Stack>

                                <Chip
                                    label={course.popularity}
                                    size="small"
                                    color={getChipColor(course.popularity)}
                                    icon={
                                        course.popularity === "Популярный" ? (
                                            <TrendingUpIcon />
                                        ) : course.popularity === "Новый" ? (
                                            <NewReleasesIcon />
                                        ) : (
                                            <AccountBalanceWalletIcon />
                                        )
                                    }
                                    sx={{ mb: 1 }}
                                />

                                <Typography variant="caption" color="text.secondary">
                                    Прогресс изучения:
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={course.progress}
                                    sx={{ height: 8, borderRadius: 5, mb: 1 }}
                                />

                                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                                    {course.price}
                                </Typography>
                            </Box>

                            <Box>
                                {course.paid ? (
                                    <Typography color="success.main" fontWeight="bold">
                                        Оплачено ✅
                                    </Typography>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleOpenPayment(index)}
                                        sx={{ mt: 2 }}
                                    >
                                        Купить
                                    </Button>
                                )}
                            </Box>
                        </StyledCard>
                    ))}
                </Stack>
            </Paper>

            {/* Модалка оплаты */}
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 420,
                            bgcolor: "background.paper",
                            borderRadius: 4,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        {selectedCourseIndex !== null && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Оплата курса:
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                    {courses[selectedCourseIndex].title}
                                </Typography>

                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Номер карты"
                                        placeholder="0000 0000 0000 0000"
                                        variant="outlined"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                            let formatted = val.match(/.{1,4}/g)?.join(" ") || "";
                                            setCardNumber(formatted);
                                        }}
                                        error={cardNumber.replace(/\s/g, "").length !== 16}
                                        helperText={
                                            cardNumber.replace(/\s/g, "").length !== 16
                                                ? "Введите 16-значный номер карты"
                                                : " "
                                        }
                                    />

                                    <Box display="flex" gap={2}>
                                        <TextField
                                            label="Срок действия (MM/YY)"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                if (val.length >= 3) {
                                                    val = `${val.slice(0, 2)}/${val.slice(2)}`;
                                                }
                                                setExpiry(val);
                                            }}
                                            error={!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)}
                                            helperText={
                                                !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) ? "Формат MM/YY" : " "
                                            }
                                            fullWidth
                                        />

                                        <TextField
                                            label="CVV"
                                            placeholder="***"
                                            type="password"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                            error={cvv.length !== 3}
                                            helperText={cvv.length !== 3 ? "3 цифры" : " "}
                                            fullWidth
                                        />
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label="Имя владельца"
                                        placeholder="IVAN IVANOV"
                                        value={cardHolder}
                                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                                        error={cardHolder.length < 2}
                                        helperText={cardHolder.length < 2 ? "Введите имя" : " "}
                                    />

                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<PaymentIcon />}
                                            onClick={() => handleMockPayment("card")}
                                            disabled={isPaying}
                                        >
                                            Оплатить картой
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            startIcon={<GoogleIcon />}
                                            onClick={() => handleMockPayment("google")}
                                            disabled={isPaying}
                                        >
                                            Google Pay
                                        </Button>
                                    </Stack>

                                    {isPaying && (
                                        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                            <CircularProgress />
                                        </Box>
                                    )}
                                </Stack>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default SubscriptionInfoPage;
