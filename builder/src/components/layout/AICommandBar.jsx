import React, { useState } from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { Sparkles, ArrowUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AICommandBar = () => {
    const { addElement, updateStyles, selectedId } = useEditorStore();
    const [isThinking, setIsThinking] = useState(false);
    const [status, setStatus] = useState('');

    const processCommand = async (cmd) => {
        setIsThinking(true);
        setStatus('Thinking...');

        // Simulate Network Delay (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerCmd = cmd.toLowerCase();
        let handled = false;

        const themes = {
            dark: { bg: '#09090b', text: '#f4f4f5', accent: '#6366f1', surface: '#18181b', border: '#27272a' },
            light: { bg: '#ffffff', text: '#0f172a', accent: '#4f46e5', surface: '#f8fafc', border: '#e2e8f0' },
            blue: { bg: '#eff6ff', text: '#1e3a8a', accent: '#2563eb', surface: '#dbeafe', border: '#bfdbfe' }
        };

        // Determine theme from command or default to dark/modern
        let activeTheme = themes.light; // Default
        if (lowerCmd.includes('oscuro') || lowerCmd.includes('dark')) activeTheme = themes.dark;
        if (lowerCmd.includes('azul') || lowerCmd.includes('blue')) activeTheme = themes.blue;

        try {
            // 5. Hero Premium (Floating Product) - New High End Design
            if (lowerCmd.includes('premium') || lowerCmd.includes('hero') || lowerCmd.includes('moderno') || lowerCmd.includes('sofa')) {
                setStatus('Crafting Premium Hero Section 💎...');

                // Reset Root Styles for a clean canvas
                updateStyles('root', {
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontFamily: 'Inter, sans-serif'
                });

                // Add the main hero section
                const heroSectionId = crypto.randomUUID();
                addElement('root', 'section', {
                    id: heroSectionId,
                    width: '100%',
                    minHeight: '85vh',
                    backgroundColor: '#f8fafc',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4rem',
                    position: 'relative',
                    overflow: 'hidden',
                    gap: '2rem'
                });
                await new Promise(r => setTimeout(r, 300));

                // Add Left Text Content container
                const textContainerId = crypto.randomUUID();
                addElement(heroSectionId, 'section', { // container
                    id: textContainerId,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    zIndex: '10',
                    maxWidth: '50%'
                });
                await new Promise(r => setTimeout(r, 200));

                // Add text elements to the text container
                addElement(textContainerId, 'text', {
                    content: 'Elevate Your Comfort.',
                    fontSize: '5rem',
                    fontWeight: '800',
                    lineHeight: '0.9',
                    color: '#0f172a',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.04em'
                });
                await new Promise(r => setTimeout(r, 100));

                addElement(textContainerId, 'text', {
                    content: 'Discover our new premium collection. Designed for modern living spaces.',
                    fontSize: '1.25rem',
                    color: '#64748b',
                    maxWidth: '400px'
                });
                await new Promise(r => setTimeout(r, 100));

                addElement(textContainerId, 'text', {
                    content: 'Shop Collection',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    padding: '1rem 2rem',
                    borderRadius: '9999px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '1rem'
                });
                await new Promise(r => setTimeout(r, 100));

                // Add Floating Product Image
                addElement(heroSectionId, 'image', {
                    content: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80', // Sofa image
                    width: '60%',
                    height: 'auto',
                    position: 'absolute',
                    right: '-10%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.15))',
                    // pointerEvents: 'none' // Click through to select section usually, but might need to select image? Let's leave draggable.
                    // Actually, if pointerEvents none, user cant select it. Let's remove that for builder.
                });
                await new Promise(r => setTimeout(r, 300));

                setStatus('Premium Hero Section Ready! ✨');
                handled = true;
            }
            // --- MACROS (Complex Generations) ---
            else if (lowerCmd.includes('landing') || lowerCmd.includes('inicio') || lowerCmd.includes('página') || lowerCmd.includes('page')) {

                setStatus('Designing Structure & Style 🎨...');

                // 1. Reset Root Styles
                updateStyles('root', {
                    backgroundColor: activeTheme.bg,
                    color: activeTheme.text,
                    fontFamily: 'Inter, sans-serif'
                });

                // 2. HEADER
                addElement('root', 'header', {
                    backgroundColor: activeTheme.surface,
                    borderBottom: `1px solid ${activeTheme.border}`,
                    animation: 'fadeInDown 0.8s ease-out'
                });
                await new Promise(r => setTimeout(r, 400));

                // 3. Hero Section
                addElement('root', 'hero', {
                    backgroundColor: activeTheme.surface,
                    border: `1px solid ${activeTheme.border}`,
                    color: activeTheme.text,
                    animation: 'fadeIn 1.2s ease-out',
                    animationDelay: '0.2s'
                });
                await new Promise(r => setTimeout(r, 600));

                // 4. Features Section
                addElement('root', 'section', {
                    backgroundColor: activeTheme.bg,
                    minHeight: '200px',
                    animation: 'zoomIn 1s ease-out'
                });
                await new Promise(r => setTimeout(r, 600));

                // 5. Cards
                const cardStyles = {
                    backgroundColor: activeTheme.surface,
                    border: `1px solid ${activeTheme.border}`,
                    color: activeTheme.text,
                    animation: 'slideInUp 1s ease-out'
                };

                addElement('root', 'card', { ...cardStyles, animationDelay: '0.2s' });
                addElement('root', 'card', { ...cardStyles, animationDelay: '0.4s' });

                // 6. FOOTER
                await new Promise(r => setTimeout(r, 400));
                addElement('root', 'footer', {
                    backgroundColor: activeTheme.surface,
                    borderTop: `1px solid ${activeTheme.border}`,
                    animation: 'fadeInUp 1s ease-out'
                });

                if (lowerCmd.includes('animada') || lowerCmd.includes('animated')) {
                    setStatus('Applying Advanced Animations ✨');
                } else {
                    setStatus('Page Designed Successfully ✅');
                }
                handled = true;
            }
            else if (lowerCmd.includes('producto') || lowerCmd.includes('product')) {
                setStatus('Designing Product Page...');
                addElement('root', 'product', {
                    backgroundColor: activeTheme.surface,
                    border: `1px solid ${activeTheme.border}`,
                    animation: 'fadeIn 1s'
                });
                await new Promise(r => setTimeout(r, 300));
                addElement('root', 'text', { color: activeTheme.text });
                setStatus('Product Layout Ready 🛍️');
                handled = true;
            }

            // --- STYLING COMMANDS (Standalone) ---
            else if (lowerCmd.includes('oscuro') || lowerCmd.includes('dark')) {
                updateStyles('root', { backgroundColor: themes.dark.bg, color: themes.dark.text });
                setStatus('Dark Mode Applied 🌙');
                handled = true;
            }
            else if (lowerCmd.includes('claro') || lowerCmd.includes('light') || lowerCmd.includes('blanco')) {
                updateStyles('root', { backgroundColor: themes.light.bg, color: themes.light.text });
                setStatus('Light Mode Applied ☀️');
                handled = true;
            }
            else if (lowerCmd.includes('azul') || lowerCmd.includes('blue')) {
                updateStyles('root', { backgroundColor: themes.blue.bg, color: themes.blue.text });
                setStatus('Applied Blue Theme 🔵');
                handled = true;
            }

            // ... (Simple components fallback) ...
            else if (lowerCmd.includes('héroe') || lowerCmd.includes('hero')) { addElement('root', 'hero'); handled = true; }
            else if (lowerCmd.includes('sección') || lowerCmd.includes('section')) { addElement('root', 'section'); handled = true; }
            else if (lowerCmd.includes('texto') || lowerCmd.includes('text')) { addElement('root', 'text'); handled = true; }
            else if (lowerCmd.includes('imagen') || lowerCmd.includes('image')) { addElement('root', 'image'); handled = true; }


            if (!handled) {
                setStatus("Sorry, I didn't understand that command.");
            }

        } catch (error) {
            console.error(error);
            setStatus("Error executing command.");
        } finally {
            setIsThinking(false);
            // Clear status after 3 seconds
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isThinking) {
            const cmd = e.currentTarget.value;
            if (cmd.trim()) {
                processCommand(cmd);
                e.currentTarget.value = '';
            }
        }
    };

    return (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-xl px-4 z-50 pointer-events-none" id="ai-bar">
            {/* Pointer events auto allows interaction with the bar itself, while passing through clicks outside */}
            <div className="flex flex-col items-center gap-2 pointer-events-auto">
                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg mb-2"
                        >
                            {status}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-1.5 flex items-center gap-2 ring-1 ring-black/5 relative overflow-hidden">

                    {/* Progress Bar (Fake) */}
                    {isThinking && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 z-10"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    )}

                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${isThinking ? 'bg-indigo-600 rotate-180' : 'bg-gradient-to-br from-indigo-500 to-violet-500'}`}>
                        {isThinking ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Sparkles className="w-4 h-4 text-white" />}
                    </div>
                    <input
                        type="text"
                        placeholder={isThinking ? "Thinking..." : "Ask AI: 'Generate landing page', 'Make it dark'..."}
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 h-10 px-2 text-sm disabled:opacity-50"
                        onKeyDown={handleKeyDown}
                        disabled={isThinking}
                    />
                    <button
                        className={`p-2 rounded-lg transition-colors ${isThinking ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
                        disabled={isThinking}
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>

                {!isThinking && !status && (
                    <div className="flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[10px] bg-white/50 px-2 py-1 rounded-full text-slate-500 border border-slate-200 cursor-pointer hover:bg-white hover:border-indigo-200" onClick={() => processCommand("Generate Landing Page")}>Landing Page</span>
                        <span className="text-[10px] bg-white/50 px-2 py-1 rounded-full text-slate-500 border border-slate-200 cursor-pointer hover:bg-white hover:border-indigo-200" onClick={() => processCommand("Make it Dark")}>Dark Mode</span>
                    </div>
                )}
            </div>
        </div>
    );
};
