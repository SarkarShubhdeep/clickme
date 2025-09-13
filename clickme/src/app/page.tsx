"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Home() {
    const { theme, setTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [previousMousePosition, setPreviousMousePosition] = useState({
        x: 0,
        y: 0,
    });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>(0);

    // Motion values for smooth animation (using pixels instead of percentages)
    const x = useMotionValue(window.innerWidth / 2);
    const y = useMotionValue(window.innerHeight / 2);

    // Spring animations for ultra-smooth movement
    const springX = useSpring(x, {
        stiffness: 400,
        damping: 25,
        mass: 0.5,
    });
    const springY = useSpring(y, {
        stiffness: 400,
        damping: 25,
        mass: 0.5,
    });

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPreviousMousePosition(mousePosition);
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mousePosition]);

    // Move button away from cursor with smart corner escape logic
    const moveButton = useCallback(() => {
        if (!buttonRef.current || !containerRef.current) return;

        const button = buttonRef.current;
        const container = containerRef.current;
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate button center
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        // Calculate distance from mouse to button center
        const distanceX = mousePosition.x - buttonCenterX;
        const distanceY = mousePosition.y - buttonCenterY;
        const distance = Math.sqrt(
            distanceX * distanceX + distanceY * distanceY
        );

        // Predict mouse movement direction
        const mouseDeltaX = mousePosition.x - previousMousePosition.x;
        const mouseDeltaY = mousePosition.y - previousMousePosition.y;
        const mouseSpeed = Math.sqrt(
            mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY
        );

        // Much larger detection threshold and aggressive movement
        const threshold = 300;
        if (distance < threshold) {
            // Calculate direction away from mouse
            let directionX = -distanceX / (distance || 1);
            let directionY = -distanceY / (distance || 1);

            // Add predictive movement based on mouse velocity
            if (mouseSpeed > 2) {
                const predictiveX = -mouseDeltaX / (mouseSpeed || 1);
                const predictiveY = -mouseDeltaY / (mouseSpeed || 1);
                directionX = (directionX + predictiveX * 2) / 3;
                directionY = (directionY + predictiveY * 2) / 3;
            }

            // Much faster movement - scale based on proximity
            const proximityFactor = Math.max(1, (threshold - distance) / 50);
            const moveDistance = Math.min(100, 30 * proximityFactor);

            let newX = x.get() + directionX * moveDistance;
            let newY = y.get() + directionY * moveDistance;

            // Smart boundary checking with corner escape logic
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;
            const containerWidth = containerRect.width;
            const containerHeight = containerRect.height;
            const margin = 50;

            // Check if hitting boundaries
            const hitLeftWall = newX <= margin;
            const hitRightWall = newX >= containerWidth - margin;
            const hitTopWall = newY <= margin;
            const hitBottomWall = newY >= containerHeight - margin;

            // Smart corner escape: find the most open space
            if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
                // Calculate distances to each corner from mouse
                const corners = [
                    {
                        x: containerWidth * 0.8,
                        y: containerHeight * 0.2,
                        name: "top-right",
                    },
                    {
                        x: containerWidth * 0.2,
                        y: containerHeight * 0.2,
                        name: "top-left",
                    },
                    {
                        x: containerWidth * 0.8,
                        y: containerHeight * 0.8,
                        name: "bottom-right",
                    },
                    {
                        x: containerWidth * 0.2,
                        y: containerHeight * 0.8,
                        name: "bottom-left",
                    },
                    {
                        x: containerWidth * 0.5,
                        y: containerHeight * 0.1,
                        name: "top-center",
                    },
                    {
                        x: containerWidth * 0.5,
                        y: containerHeight * 0.9,
                        name: "bottom-center",
                    },
                    {
                        x: containerWidth * 0.1,
                        y: containerHeight * 0.5,
                        name: "left-center",
                    },
                    {
                        x: containerWidth * 0.9,
                        y: containerHeight * 0.5,
                        name: "right-center",
                    },
                ];

                // Find the corner farthest from the mouse
                let bestCorner = corners[0];
                let maxDistance = 0;

                corners.forEach((corner) => {
                    const cornerDistance = Math.sqrt(
                        Math.pow(mousePosition.x - corner.x, 2) +
                            Math.pow(mousePosition.y - corner.y, 2)
                    );
                    if (cornerDistance > maxDistance) {
                        maxDistance = cornerDistance;
                        bestCorner = corner;
                    }
                });

                // Jump to the safest corner
                newX = bestCorner.x;
                newY = bestCorner.y;
            }

            // Final boundary enforcement
            newX = Math.max(margin, Math.min(containerWidth - margin, newX));
            newY = Math.max(margin, Math.min(containerHeight - margin, newY));

            // Update Motion values for smooth spring animation
            x.set(newX);
            y.set(newY);
        }
    }, [mousePosition, previousMousePosition, x, y]);

    // Use requestAnimationFrame for smooth, fast updates
    useEffect(() => {
        const animate = () => {
            moveButton();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [moveButton]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
        >
            <motion.button
                ref={buttonRef}
                className="bg-red-500 dark:bg-red-400 text-3xl font-semibold py-4 px-8 rounded-3xl dark:text-black text-white absolute"
                style={{
                    left: springX,
                    top: springY,
                    x: "-50%",
                    y: "-50%",
                }}
                onClick={() => alert("IMPOSSIBLE! You are a wizard! 🧙‍♂️✨")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                }}
            >
                <span className="text-2xl">THE</span> <br /> BUTTON
            </motion.button>
            <Button
                className="absolute top-4 right-4 bg-background text-foreground"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                size="icon"
                variant="outline"
            >
                {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            <p className="text-muted-foreground absolute bottom-4 left-1/2 transform -translate-x-1/2">
                Click me!
            </p>
        </div>
    );
}
