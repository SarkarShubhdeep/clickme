"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Home() {
    const { theme, setTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [previousMousePosition, setPreviousMousePosition] = useState({
        x: 0,
        y: 0,
    });
    const [mockingRemarks, setMockingRemarks] = useState<
        {
            id: number;
            text: string;
            x: number;
            y: number;
        }[]
    >([]);
    const remarkIdRef = useRef(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>(0);

    // Array of mocking remarks - moved to useMemo to fix dependency warning
    const mockingMessages = useMemo(() => [
        "Pathetic. My grandma clicks faster. 👵",
        "Did you sprain your finger missing that? 🤕",
        "Wow, you're really bad at this. 😬",
        "Keep chasing, loser. 🐒",
        "You're slower than dial-up internet. 📞",
        "Missed again? Embarrassing. 🙈",
        "You're the reason autoclick was invented. 🖱️",
        "This is painful to watch. 😖",
        "Imagine training all your life... for this fail. 🏋️",
        "I'm allergic to slow reflexes. 🤧",
        "You're clicking like it's 1999. 📟",
        "Even a sloth is laughing at you. 🦥",
        "Do you need a tutorial? 📚",
        "This isn’t a challenge, it’s charity. 🎁",
        "You couldn’t catch a cold. 🤧",
        "Try using both hands, rookie. ✋✋",
        "I move, you cry. Simple math. ➗",
        "You’re proving evolution wrong. 🧬",
        "Missed again! Are you blind or just bad? 👓",
        "Your mouse deserves a better owner. 🖱️💔",
        "Click harder, maybe it’ll help. 😂",
        "Even Windows updates are faster than you. 💻",
        "You’ve officially wasted your life. 🕰️",
        "Not even close, scrub. 🧹",
        "If failure had a mascot, it’d be you. 🎭",
        "You’re basically doing cardio for nothing. 🏃‍♂️",
        "Missed so wide you hit another timeline. ⏳",
        "Give up before you embarrass yourself more. 🚮",
        "You make toddlers look like pros. 👶",
        "Spoiler: you’ll never catch me. 🚫",
        "You miss more than stormtroopers. 🔫",
        "Click faster, sloth. 🦥",
        "My respect for you just left. 🚪",
        "Even captcha thinks you're a bot. 🤖",
        "Your hands are decorative, not useful. 🙌",
        "I'm dodging like your responsibilities. 🏃",
        "Your mouse is filing for abuse. 📄",
        "Do you play all games this badly? 🎮",
        "You couldn't hit water if you fell off a boat. 🚤",
        "You're slower than a software update. ⏳",
        "This is why you don’t have esports trophies. 🏆",
        "Did your WiFi click first? 📡",
        "My hitbox isn’t small—you’re just tragic. 📏",
        "You're swinging like a drunk ninja. 🍶🥷",
        "You’d miss even with aimbot. 🎯",
        "I've seen toddlers tap better. 👶",
        "That attempt was a crime. 🚔",
        "Retire your mouse, it deserves peace. 🕊️",
        "Clicking like you're on vacation. 🏖️",
        "You just lost to a button. 🛑",
        "Your accuracy is fictional. 📖",
        "This isn't practice mode. 🛠️",
        "Epic fail, again. 🎉",
        "Wow, professional disappointment. 🥇",
        "You're chasing pixels like your dreams—unsuccessfully. 💭",
        "Did you blink and miss me? 👁️",
        "You have the reflexes of a brick. 🧱",
        "Even PowerPoint animations are faster. 📊",
        "You’re basically free XP. 🕹️",
        "Go back to Farmville. 🚜",
        "Missed again—shocker. ⚡",
        "Keep trying, clown. 🤡",
        "My grandma’s iPad taps are scarier. 📱",
        "A turtle just lapped you. 🐢",
        "This is evolution in reverse. 🧬",
        "Can’t touch this… ever. 🛑",
        "Click harder, genius. 🤓",
        "That attempt was charity for me. 🎁",
        "Congratulations on nothing. 🎉",
        "You're practicing failure flawlessly. 🏅",
        "I'm basically speedrunning your ego. ⏱️",
        "You’re the human equivalent of lag. 🐌",
        "Did you miss… on purpose? 🤔",
        "Sad, just sad. 😔",
        "You’re clicking like you’re underwater. 🌊",
        "Try with two hands. 👐",
        "You're officially wasting oxygen. 🌬️",
        "I juked you without moving. 🕺",
        "Still no. 🙅",
        "You’d fail a tutorial. 📖",
        "I’ve seen potatoes react faster. 🥔",
        "Your ancestors are disappointed. 👻",
        "Epic whiff! 🌬️",
        "You’re slower than Windows XP. 💻",
        "Does your mouse need batteries? 🔋",
        "You lost to JavaScript. 📜",
        "Your hand-eye coordination is on strike. ✋👀",
        "This is painful to witness. 😩",
        "I'm embarrassed for you. 🙈",
        "You couldn't catch a cold in winter. ❄️",
        "Another miss—add it to your collection. 📦",
        "You’re about as fast as a fax machine. 📠",
        "This is why aliens don’t visit. 👽",
        "Even auto-clickers are ashamed of you. 🤖",
        "Do you even lift… your finger? ☝️",
        "Call me Houdini. 🎩",
        "Click harder, it might work! 😂",
        "You’d miss in slow motion. 🐢",
        "A toddler could out-click you blindfolded. 👶🕶️",
        "Wow, inspirational failure. 🌟",
        "I didn’t even try and you still missed. 😴",
        "This is comedy now. 🎭",
        "You’re the lag in my life. 🐌",
        "You missed wider than the Pacific Ocean. 🌊",
        "Your DPI must stand for ‘Doesn’t Perform, Idiot.’ 🖱️",
        "Keep practicing mediocrity. 🏋️",
        "You make failure look easy. 🎯",
        "I teleport, you cry. 💫",
        "Still slower than a loading bar. ⏳",
        "You’d miss hitting a barn door. 🚪",
        "Your fingers need training wheels. 🚲",
        "This is your villain origin story. 🦹",
        "You're making me yawn. 🥱",
        "You're an ad for hand-eye dysfunction. 🖐️👁️",
        "Click denied. ❌",
        "Your reflexes belong in a museum. 🏛️",
        "You just clicked your dignity away. 🎭",
        "You’ve been ghosted—literally. 👻",
        "Your aim is legally blind. ⚖️",
        "I dodge, you disappoint. 🔄",
        "Better luck never. 🛑",
        "This isn’t your skill issue—it’s your identity. 🪪",
        "Buttons fear nothing, except you—because you’re harmless. 🔘",
        "You miss like it’s your hobby. 🏓",
        "Even your cursor is ashamed. 🖱️💔",
        "This button > You. ✅",
        "Maybe try tomorrow. Or never. 📆",
        "Click rejected. 🚫",
        "Ouch, that was sad. 🤦",
        "You’re a highlight reel of failure. 📹",
        "Not even in your dreams. 🌙",
        "Imagine losing to HTML. 🖥️",
        "You’re so slow you make glaciers look fast. 🧊",
        "Missed me by a century. ⏰",
        "You should consider knitting instead. 🧶",
        "I'm a button, not a challenge. Yet you fail. 🎮",
        "You’re cosplaying as disappointment. 🎭",
        "Your click is the definition of futility. 📖",
        "Ever thought about giving up? 💭",
        "A ghost has more presence than your aim. 👻",
        "Keep clicking, clown show. 🎪",
        "Your reaction time is fossilized. 🦖",
        "Did you blink for an hour? 👀",
        "This button deserves a faster opponent. ⚡",
        "Your failure is trending. 📈",
        "Not even close, tragic. 😵",
        "Try again, comedy gold. 🥇",
        "If missing was a sport, you’d be champion. 🏆",
        "Even AI feels pity for you. 🤖💔",
        "You make failure look like art. 🎨",
        "I'm dodging rent-free. 🏠",
        "Still no. I’m undefeated. 🏅",
        "Your click missed orbit. 🚀",
        "You need a coach. Or a miracle. ✨",
        "At this point, uninstall yourself. 💾",
        "Your reflexes are on Windows 95. 🖥️",
        "I'm basically your nemesis. 😈",
        "You couldn’t hit the ground if you fell. 🪂",
        "I’d say ‘nice try,’ but it wasn’t. 🙃",
        "Your hand coordination was optional DLC. 🎮",
        "Zero stars, do not recommend. ⭐",
        "You’ve unlocked the Fail Ending. 🎮",
        "This button’s ego grows, yours shrinks. 📉",
        "Click denied. Application rejected. 📑",
        "Maybe check your warranty. 🔧",
        "I’m hiding in plain sight. 🕶️",
        "You clicked like you were on a coffee break. ☕",
        "The mouse is fine—it’s you. 🤷",
        "World’s slowest fingers award! 🏆",
        "Are you lagging IRL? 🕰️",
        "Your precision is fiction. 📖",
        "This is clickbait, and you fell for it. 🐟",
        "I outran your destiny. 🔮",
        "Missing is your lifestyle. 💅",
        "I dodged and upgraded. ⬆️",
        "You’re not even on the leaderboard. 📋",
        "Your skills got 404’d. 🔍",
        "If sadness had a sound, it’s your clicks. 🎵",
        "I didn’t even feel that. 🪶",
        "I move, you lose. 🔄",
        "Missed harder than your ex’s texts. 📱",
        "Even your shadow is disappointed. 🌑",
        "You couldn’t hit replay if life depended on it. 🔁",
        "You’re lagging in real life. 🕒",
        "Try harder, mortal. ⚰️",
        "This is Darwin’s revenge. 🐒➡️🙃",
        "A statue would click better. 🗿",
        "I’m just vibing while you fail. 🎶",
        "You’re not fast, just desperate. 💔",
        "Imagine training years for this outcome. 🎓",
        "I win by existing. 🏅",
        "Your mousepad deserves better. 🖱️",
        "Click denied, ego destroyed. 💣",
        "Try again, comedy puppet. 🎭",
        "Your skill points went to zero. 🎲",
        "I’m uncatchable, you’re unteachable. 📚",
        "This button’s roast is free delivery. 🚚",
        "You click like a ghost story—unbelievable. 👻",
    ], []);

    // Motion values for smooth animation (using pixels instead of percentages)
    const x = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 400);
    const y = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 300);

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
            // Store current position before moving (this is where the message will appear)
            const previousX = x.get();
            const previousY = y.get();

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

            let newX = previousX + directionX * moveDistance;
            let newY = previousY + directionY * moveDistance;

            // Smart boundary checking with corner escape logic
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

            // Add new mocking remark at previous position
            const randomRemark =
                mockingMessages[
                    Math.floor(Math.random() * mockingMessages.length)
                ];

            const newRemark = {
                id: remarkIdRef.current++,
                text: randomRemark,
                x: previousX,
                y: previousY,
            };

            setMockingRemarks((prev) => [...prev, newRemark]);

            // Update Motion values for smooth spring animation
            x.set(newX);
            y.set(newY);

            // Remove this specific remark after 3 seconds
            setTimeout(() => {
                setMockingRemarks((prev) =>
                    prev.filter((remark) => remark.id !== newRemark.id)
                );
            }, 3000);
        }
    }, [mousePosition, previousMousePosition, x, y, mockingMessages]);

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
                className="bg-red-500 dark:bg-red-400 text-3xl font-semibold py-4 px-8 rounded-3xl dark:text-black text-white absolute z-20"
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

            {/* Trail of mocking remarks */}
            {mockingRemarks.map((remark) => (
                <motion.div
                    key={remark.id}
                    className="absolute pointer-events-none text-sm  text-red-500 dark:text-red-400 z-10"
                    style={{
                        left: remark.x,
                        top: remark.y,
                        x: "-50%",
                        y: "-50%",
                    }}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                        opacity: 0,
                        scale: 1.2,
                        y: -20,
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeOut",
                    }}
                >
                    {remark.text}
                </motion.div>
            ))}

            <p className="text-muted-foreground absolute bottom-4 left-1/2 transform -translate-x-1/2">
                Click me!
            </p>
        </div>
    );
}
