import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

// --- VISUAL COMPONENTS ---

const AuroraBackground = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
        <style>{`
            @keyframes blob-float-1 {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }
            @keyframes blob-float-2 {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(-30px, 50px) scale(1.1); }
                66% { transform: translate(20px, -20px) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }
            .blob {
                position: absolute;
                border-radius: 9999px;
                filter: blur(60px);
                opacity: 0.6;
                will-change: transform;
                transform: translateZ(0); /* Hardware Accel */
            }
        `}</style>

        {/* Deep Black Base */}
        <div className="absolute inset-0 bg-black" />

        {/* CSS Animated Blobs - No JS Overhead */}
        <div className="blob bg-yellow-500/20 w-[50%] h-[50%] top-[-10%] left-[-10%]"
            style={{ animation: 'blob-float-1 20s infinite alternate linear' }} />

        <div className="blob bg-amber-600/20 w-[60%] h-[60%] bottom-[-10%] right-[-10%]"
            style={{ animation: 'blob-float-2 25s infinite alternate-reverse linear' }} />

        <div className="blob bg-yellow-300/10 w-[40%] h-[40%] top-[30%] left-[30%]"
            style={{ animation: 'blob-float-1 22s infinite alternate linear' }} />

        {/* Removed Noise Filter causing lag */}
    </div>
));

const InputField = React.memo(({ icon: Icon, type, placeholder, value, onChange }) => (
    <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-yellow-400 transition-colors duration-300 pointer-events-none z-10" />
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-900/80 transition-all duration-300 shadow-inner group-focus-within:shadow-[0_0_20px_-5px_rgba(250,204,21,0.2)] group-focus-within:border-yellow-500/50"
        />
        {/* Subtle glow border generic */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-focus-within:border-yellow-500/20 pointer-events-none transition-all duration-500" />
    </div>
));

// --- MAIN PAGE ---

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const navigate = useNavigate();

    // Session Listener
    useEffect(() => {
        // Check active session immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate('/editor');
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate('/editor');
            }
        });

        // Check for errors in URL (returning from OAuth)
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error_description') || params.get('error');
        if (error) {
            setErrorMsg(decodeURIComponent(error).replace(/\+/g, ' '));
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleGoogleAuth = async () => {
        setErrorMsg('');
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Google Auth Error:", error);
            setErrorMsg(error.message);
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!email || !password || (!isLogin && !fullName)) {
            setErrorMsg("Por favor completa todos los campos.");
            return;
        }

        setIsLoading(true);
        console.log("Attempting Auth:", isLogin ? "Login" : "Register", email);

        try {
            let result;
            if (isLogin) {
                result = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
            } else {
                result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        emailRedirectTo: window.location.origin,
                    },
                });
            }

            console.log("Auth Result:", result);

            if (result.error) throw result.error;

            // Handle successful sign up but no session (requires verification)
            if (!isLogin && !result.data.session && result.data.user) {
                setErrorMsg("¡Registro exitoso! Revisa tu email para confirmar.");
                // Do NOT stop loading immediately or redirect, let them see the message
            }

        } catch (error) {
            console.error("Auth Failed:", error);
            setErrorMsg(
                error.message === "Invalid login credentials"
                    ? "Correo o contraseña incorrectos."
                    : error.message === "User already registered"
                        ? "Este correo ya está registrado. Intenta iniciar sesión."
                        : error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative font-sans overflow-hidden bg-black">
            <AuroraBackground />

            <div className="relative w-full max-w-[420px] z-10 perspective-1000">
                {/* Floating Glass Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="
                        backdrop-blur-md bg-black/60 
                        border border-white/10 
                        rounded-3xl p-8 
                        shadow-2xl
                        ring-1 ring-white/5
                        relative overflow-hidden
                    "
                    style={{
                        boxShadow: '0 0 50px -15px rgba(250, 204, 21, 0.1), 0 25px 50px -12px rgba(0,0,0,0.8)' // Yellow tint shadow
                    }}
                >
                    {/* Top Lighting Edge */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

                    {/* Header */}
                    <div className="text-center mb-8 relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black text-white mb-2 tracking-tight"
                        >
                            E-ToolMerce
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-zinc-400 font-medium"
                        >
                            {isLogin ? 'Accede a tu espacio creativo' : 'Únete a la revolución visual'}
                        </motion.p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg mb-6 overflow-hidden"
                            >
                                <div className="p-3 text-red-200 text-xs flex items-center gap-2">
                                    <AlertCircle size={14} /> {errorMsg}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className="w-full bg-zinc-900 border border-zinc-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 mb-6 hover:bg-zinc-800 hover:border-yellow-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 group"
                    >
                        {/* Google Icon */}
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" /><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.424 63.239 -14.754 63.239 Z" /><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" /><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.424 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" /></g></svg>
                        <span className="group-hover:text-white transition-colors">Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-zinc-600 text-[10px] uppercase tracking-wider font-semibold">O ingresa manualmente</span>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    {/* Forms */}
                    <div className="relative min-h-[280px]">
                        <AnimatePresence mode="wait" initial={false}>
                            {isLogin ? (
                                <motion.form
                                    key="login-form"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4 absolute inset-0"
                                    onSubmit={handleEmailAuth}
                                >
                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        placeholder="Correo Electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <InputField
                                        icon={Lock}
                                        type="password"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <a href="#" className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors font-medium">Recuperar contraseña</a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 mt-4 hover:shadow-[0_15px_30px_-5px_rgba(250,204,21,0.4)] hover:translate-y-[-1px] transition-all disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                Acceder al Editor <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="register-form"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4 absolute inset-0"
                                    onSubmit={handleEmailAuth}
                                >
                                    <InputField
                                        icon={User}
                                        type="text"
                                        placeholder="Tu Nombre"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        placeholder="Correo Electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <InputField
                                        icon={Lock}
                                        type="password"
                                        placeholder="Crea una contraseña segura"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2 mt-4 hover:shadow-[0_15px_30px_-5px_rgba(250,204,21,0.4)] hover:translate-y-[-1px] transition-all disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>
                                                Crear Cuenta Gratis <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Toggle */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <button
                            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                            className="text-zinc-500 text-sm font-medium hover:text-white transition-colors"
                        >
                            {isLogin ? "¿Nuevo aquí? " : "¿Ya tienes cuenta? "}
                            <span className={isLogin ? 'text-yellow-400' : 'text-yellow-400'}>
                                {isLogin ? "Crea una cuenta" : "Inicia sesión"}
                            </span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Credits / Decorative */}
            <div className="absolute bottom-4 left-4 text-white/5 text-[10px] font-mono pointer-events-none">
                SECURE::ACCESS_PROTOCOL::V4.2
            </div>
        </div>
    );
};
