import { useEffect, useRef } from 'react';
import {motion, useAnimation, useAnimationFrame} from 'framer-motion';
import goalcelebration from "../../assets/img/goalcelebration.jpg";
import teamunity from "../../assets/img/teamunity.jpg";
import finalmatch from "../../assets/img/finalmatch.jpg";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function HighlightReel() {
    const containerRef = useRef(null);
    const x = useRef(0);
    const speed = 0.5; // px per frame

    const reelRef = useRef(null);

    const highlightImages = [
        { img: goalcelebration, title: 'Goal Celebration' },
        { img: teamunity, title: 'Team Unity' },
        { img: finalmatch, title: 'Final Match' },
    ];

    useAnimationFrame(() => {
        if (!reelRef.current) return;
        x.current -= speed;
        const container = reelRef.current;
        const scrollWidth = container.scrollWidth / 2;

        if (Math.abs(x.current) >= scrollWidth) {
            x.current = 0;
        }

        container.style.transform = `translateX(${x.current}px)`;
    });

    const duplicatedImages = [...highlightImages, ...highlightImages, ...highlightImages, ...highlightImages, ...highlightImages, ...highlightImages];

    return (
        <Container sx={{ py: 8 }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Best Moments
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" paragraph>
                Highlights from recent tournaments that inspired us all
            </Typography>

            <Box sx={{ overflow: 'hidden', mt: 6 }} ref={containerRef}>
                <Box
                    ref={reelRef}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        width: 'max-content',
                        willChange: 'transform',
                    }}
                >
                    {duplicatedImages.map((item, index) => (
                        <Box
                            key={`${item.title}-${index}`}
                            sx={{
                                position: 'relative',
                                width: 300,
                                flexShrink: 0,
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: 3,
                            }}
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    objectFit: 'cover',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    px: 2,
                                    py: 1,
                                }}
                            >
                                <Typography variant="subtitle1">{item.title}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
};