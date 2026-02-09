import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const UserHeaderProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/'); // Redirect to login page (Root) immediately
    };

    if (loading) return null; // Or a small spinner

    // Dev/Fallback: If no user (e.g. dev environment), show a demo user
    const currentUser = user || {
        email: 'demo@etoolmerce.com',
        user_metadata: { full_name: 'Usuario Demo' }
    };



    // Extract Display Name
    const meta = currentUser.user_metadata || {};
    const displayName = meta.full_name || meta.name || currentUser.email?.split('@')[0] || "Creativo";
    const avatarUrl = meta.avatar_url;

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm transition-all hover:bg-surface-highlight">
            {/* Avatar or Icon */}
            {avatarUrl && !imageError ? (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-border object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center border border-border">
                    <User size={16} className="text-primary" />
                </div>
            )}

            {/* Name */}
            <div className="flex flex-col">
                <span className="text-sm font-bold text-text leading-tight">
                    Hola, {displayName}
                </span>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-border mx-1"></div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="p-1.5 rounded-full hover:bg-red-500/10 group transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut size={18} className="text-text-muted group-hover:text-red-500 transition-colors" />
            </button>
        </div>
    );
};

export default UserHeaderProfile;
