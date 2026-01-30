import React, { useState } from 'react';
import { CreditCard, HelpCircle, AlertTriangle, CheckCircle, ExternalLink, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { InfoLabel } from '../ui/InfoLabel';

export const MercadoPagoSettings = ({ selectedNode, updateProperty, selectedId }) => {
    const [showGuide, setShowGuide] = useState(false);

    // Default values if not present
    const mpConfig = selectedNode.mercadoPago || {
        publicKey: '',
        accessToken: ''
    };

    const handleChange = (key, value) => {
        updateProperty(selectedId, 'mercadoPago', { ...mpConfig, [key]: value });
    };

    // Basic validation
    const isPublicKeyValid = mpConfig.publicKey?.length > 10; // Simple check
    const isTokenValid = mpConfig.accessToken?.length > 20;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-border">
                <CreditCard size={16} className="text-blue-500" />
                <span className="text-sm font-bold text-text">Configuración Mercado Pago</span>
            </div>

            {/* Credentials Section */}
            <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <InfoLabel label="Modo Sandbox (Pruebas)" tooltip="Usa credenciales de prueba para simular pagos sin dinero real." />
                    </div>
                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                        Para probar tu integración sin usar dinero real, asegúrate de usar las credenciales de <strong>"Sandbox"</strong> o <strong>"Prueba"</strong>.
                    </p>
                </div>

                {/* Public Key */}
                <div>
                    <label className="text-xs font-semibold text-text mb-1 block flex justify-between">
                        Public Key
                        {mpConfig.publicKey && (
                            isPublicKeyValid
                                ? <CheckCircle size={12} className="text-green-500" />
                                : <AlertTriangle size={12} className="text-yellow-500" title="Parece muy corta" />
                        )}
                    </label>
                    <input
                        type="text"
                        value={mpConfig.publicKey}
                        onChange={(e) => handleChange('publicKey', e.target.value)}
                        placeholder="TEST-..."
                        className="w-full p-2 text-xs border border-border rounded bg-surface-highlight text-text font-mono"
                    />
                    <p className="text-[9px] text-text-muted mt-1">Clave pública para identificar tu cuenta.</p>
                </div>

                {/* Access Token */}
                <div>
                    <label className="text-xs font-semibold text-text mb-1 block flex justify-between">
                        Access Token
                        {mpConfig.accessToken && (
                            isTokenValid
                                ? <CheckCircle size={12} className="text-green-500" />
                                : <AlertTriangle size={12} className="text-yellow-500" title="Parece muy corto" />
                        )}
                    </label>
                    <input
                        type="password"
                        value={mpConfig.accessToken}
                        onChange={(e) => handleChange('accessToken', e.target.value)}
                        placeholder="APP_USR-..."
                        className="w-full p-2 text-xs border border-border rounded bg-surface-highlight text-text font-mono"
                    />
                    <p className="text-[9px] text-text-muted mt-1">Token secreto para procesar pagos seguros.</p>
                </div>
            </div>

            {/* Help Guide Accordion */}
            <div className="border border-border rounded-lg overflow-hidden">
                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="w-full p-3 bg-surface hover:bg-surface-highlight flex items-center justify-between transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <HelpCircle size={14} className="text-secondary" />
                        <span className="text-xs font-bold text-text underline decoration-dotted">
                            ¿Cómo obtener mis credenciales?
                        </span>
                    </div>
                    {showGuide ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {showGuide && (
                    <div className="p-4 bg-surface-highlight/30 text-xs text-text-muted space-y-3 border-t border-border">
                        <ol className="list-decimal list-outside pl-4 space-y-2">
                            <li>
                                Accede al <a href="https://www.mercadopago.com/developers/panel" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                                    Panel de Desarrolladores <ExternalLink size={10} />
                                </a>.
                            </li>
                            <li>
                                Crea una nueva <strong>Aplicación</strong> o selecciona una existente.
                            </li>
                            <li>
                                Ve a la sección <strong>"Credenciales"</strong> en el menú lateral.
                            </li>
                            <li>
                                Selecciona <strong>"Credenciales de prueba"</strong> para desarrollo o <strong>"Credenciales de producción"</strong> para ventas reales.
                            </li>
                            <li>
                                Copia la <strong>Public Key</strong> y el <strong>Access Token</strong> y pégalos arriba.
                            </li>
                        </ol>

                        <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-600 dark:text-yellow-500">
                            <strong>Nota:</strong> No compartas tu Access Token con nadie. Es como la contraseña de tu cuenta bancaria.
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-border">
                <InfoLabel label="Preferencias de Pago" tooltip="Define comportamiento post-compra." />
                <div className="flex gap-2 mt-2">
                    <button className="flex-1 py-1 px-2 text-[10px] border border-primary bg-primary/10 text-primary rounded font-medium">
                        Checkout Pro
                    </button>
                    <button className="flex-1 py-1 px-2 text-[10px] border border-border bg-surface text-text-muted rounded opacity-50 cursor-not-allowed" title="Próximamente">
                        API Transparente
                    </button>
                </div>
            </div>

        </div>
    );
};
