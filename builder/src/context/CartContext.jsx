import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const item = window.localStorage.getItem('cartItems');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error(error);
        }
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) =>
            prevItems.reduce((acc, item) => {
                if (item.id === id) {
                    if (item.quantity > 1) {
                        acc.push({ ...item, quantity: item.quantity - 1 });
                    }
                    // If quantity is 1, it's removed (not pushed to acc)
                } else {
                    acc.push(item);
                }
                return acc;
            }, [])
        );
    };

    // Helper to completely remove an item regardless of quantity
    const deleteItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS', // Or USD depending on user pref, defaulting to ARS or USD symbol
        }).format(amount);
    };

    // Keep getCartTotal for backward compatibility
    const getCartTotal = () => cartTotal;

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            deleteItem,
            clearCart,
            getCartTotal, // Deprecated?
            getCartCount,
            cartTotal,
            formatCurrency
        }}>
            {children}
        </CartContext.Provider>
    );
};
