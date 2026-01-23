import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { CheckoutForm } from './CheckoutForm';

export const CartWidget = ({ node }) => {
    const { cartItems, getCartTotal, getCartCount, removeFromCart } = useCart();
    const [isOpen, setIsOpen] = useState(false); // Dropdown open state
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // Modal state

    const total = getCartTotal();
    const count = getCartCount();

    const toggleCart = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-50">
            {/* Cart Trigger Button */}
            <div
                onClick={toggleCart}
                className="flex items-center gap-3 cursor-pointer py-2 px-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
            >
                <div className="relative">
                    <ShoppingCart size={20} className="text-slate-700" />
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                            {count}
                        </span>
                    )}
                </div>
                <div className="flex flex-col leading-tight text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Mi Carrito</span>
                    <span className="text-sm font-bold text-slate-800">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-[120%] right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-slate-800">Tu Cesta ({count})</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-3">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                Tu carrito está vacío.
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3 items-center group">
                                    <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <ShoppingBag size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-slate-700 truncate">{item.title}</h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-slate-500">{item.quantity} x ${item.price.toFixed(2)}</span>
                                            <span className="text-xs font-bold text-indigo-600">${(item.quantity * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="pt-2 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                                <span>Total Estimado:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => { setIsOpen(false); setIsCheckoutOpen(true); }}
                                className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-colors"
                            >
                                Pagar Ahora
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md animate-in zoom-in duration-200">
                        <CheckoutForm onCancel={() => setIsCheckoutOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};
