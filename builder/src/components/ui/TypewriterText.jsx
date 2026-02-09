import React, { useState, useEffect } from 'react';

const TypewriterText = ({
    words = ["Diseño", "Código", "Futuro"],
    typingSpeed = 150,
    deletingSpeed = 50,
    pauseTime = 2000,
    loop = true,
    cursorColor = "currentColor",
    cursorThickness = "2px",
    cursorStyle = "solid", // solid, dashed, etc.
    className = "",
    style = {}
}) => {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer;

        const handleType = () => {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                // Deleting
                setText(currentWord.substring(0, text.length - 1));

                // Finished deleting?
                if (text.length === 0) {
                    // Move to next word
                    const nextIndex = (wordIndex + 1) % words.length;

                    // Check loop condition
                    if (!loop && nextIndex === 0 && wordIndex === words.length - 1) {
                        return; // Stop
                    }

                    setIsDeleting(false);
                    setWordIndex(nextIndex);
                    // Small pause before typing next word? Usually immediate or small default.
                    // The typingSpeed will apply to the first letter.
                }
            } else {
                // Typing
                setText(currentWord.substring(0, text.length + 1));

                // Finished typing?
                if (text === currentWord) {
                    // Check if we should stop if not looping and it's the last word?
                    // Typically pause happens, then delete, UNLESS it's the last word and no loop.
                    if (!loop && wordIndex === words.length - 1) {
                        return; // Stop at full word
                    }

                    // Pause before deleting
                    timer = setTimeout(() => setIsDeleting(true), pauseTime);
                    return;
                }
            }
        };

        const speed = isDeleting ? deletingSpeed : typingSpeed;

        // If we handled the pause above (timer set), we don't set another timeout here instantly.
        // We only set timeout if not pausing.
        // If text === currentWord and !isDeleting, we just entered this state in the previous render cycle logic... 
        // Wait, 'text' update triggers effect.
        // If text === currentWord, we set timeout for setIsDeleting(true).

        if (text === words[wordIndex] && !isDeleting) {
            // We just finished typing. Pause is handled in logic above? 
            // No, doing it here is cleaner.
            if (!loop && wordIndex === words.length - 1) return;
            timer = setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (text === '' && isDeleting) {
            // Just finished deleting. 
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
            // Logic handled in state update consequence?
            // Actually, cleaner to do state updates here.
        } else {
            timer = setTimeout(handleType, speed);
        }

        return () => clearTimeout(timer);
    }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime, loop]);

    return (
        <span className={className} style={{ ...style, display: 'inline-flex', alignItems: 'center' }}>
            <span>{text}</span>
            <span
                style={{
                    display: "inline-block",
                    width: cursorThickness,
                    height: "1em", // Match text height
                    backgroundColor: cursorColor,
                    marginLeft: "2px",
                    borderLeft: `${cursorThickness} ${cursorStyle} ${cursorColor}`,
                    backgroundColor: 'transparent',
                    animation: "blink 1s step-end infinite"
                }}
            />
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </span>
    );
};

export default TypewriterText;
