import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useEditorStore } from '../../store/useEditorStore';
import { ShoppingBag, Check } from 'lucide-react';
import clsx from 'clsx';
// We import Renderer recursively to render the editable children (Image, Title, Price)
import { Renderer } from '../editor/Renderer';

export const ProductCard = ({ node }) => {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const { isPreviewMode } = useEditorStore();

    // Heuristic extraction of product data from children for the Cart Logic
    // This allows the user to edit the text in the builder, and we grab that value for the cart.
    const getProductData = () => {
        const imageNode = node.children.find(c => c.type === 'image');
        const titleNode = node.children.find(c => c.type === 'text'); // First text usually title
        const priceNode = node.children.filter(c => c.type === 'text')[1]; // Second text usually price

        // Parse price string to number (e.g. "$99.00" -> 99.00)
        const priceString = priceNode?.content || "0";
        const price = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;

        return {
            id: node.id,
            title: titleNode?.content || "Producto sin nombre",
            price: price,
            image: imageNode?.content || "",
        };
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        const product = getProductData();
        addToCart(product);

        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full relative group">
            {/* Render the editable structure from the builder */}
            {node.children?.map((child) => (
                <Renderer key={child.id} node={child} />
            ))}

            {/* Add to Cart Button - Injected by this Smart Component */}
            <div className={clsx(
                "mt-4",
                !isPreviewMode && "opacity-50 pointer-events-none" // Disable in Edit mode? Or let it be clickable but prevent nav?
            )}>
                <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={clsx(
                        "w-full py-2 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2",
                        isAdded
                            ? "bg-green-500 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30"
                    )}
                >
                    {isAdded ? (
                        <>
                            <Check size={18} />
                            ¡Agregado!
                        </>
                    ) : (
                        <>
                            <ShoppingBag size={18} />
                            Agregar al Carrito
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
