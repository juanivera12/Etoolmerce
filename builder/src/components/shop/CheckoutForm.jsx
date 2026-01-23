import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useEditorStore } from '../../store/useEditorStore'; // To maybe redirect?

export const CheckoutForm = ({ onCancel }) => {
    const { getCartTotal, clearCart } = useCart();
    const { setActivePage } = useEditorStore(); // To redirect to Home
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const total = getCartTotal();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating Backend Payment Processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
        setSuccess(true);
        clearCart();

        // Redirect to Home after a delay
        setTimeout(() => {
            if (onCancel) onCancel();
            setActivePage('root');
        }, 3000);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Gracias por tu compra!</h2>
                <p className="text-slate-500">Tu pedido ha sido procesado correctamente.</p>
                <p className="text-sm text-slate-400 mt-4">Redirigiendo al inicio...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Finalizar Compra</h2>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500">Total a pagar</span>
                    <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Información Personal</label>
                    <input
                        required
                        name="name"
                        type="text"
                        placeholder="Nombre Completo"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                    <input
                        required
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="space-y-2 pt-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <CreditCard size={16} /> Método de Pago
                    </label>
                    <div className="relative">
                        <input
                            required
                            name="cardNumber"
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            maxLength="19"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                        />
                        <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <div className="flex gap-4">
                        <input
                            required
                            name="expiry"
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            value={formData.expiry}
                            onChange={handleChange}
                            className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center"
                        />
                        <input
                            required
                            name="cvc"
                            type="text"
                            placeholder="CVC"
                            maxLength="3"
                            value={formData.cvc}
                            onChange={handleChange}
                            className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                Pagar ${total.toFixed(2)}
                            </>
                        )}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full mt-2 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
