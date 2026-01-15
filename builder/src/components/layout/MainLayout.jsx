import React from 'react';

export const MainLayout = ({ children, leftPanel, rightPanel, toolbar }) => {
    return (
        <div className="flex h-screen w-full bg-background text-text overflow-hidden font-sans">
            {/* Sidebar */}
            {leftPanel && (
                <aside className="w-64 bg-surface border-r border-border flex flex-col z-20 shrink-0">
                    {leftPanel}
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col bg-background min-w-0">
                {toolbar && (
                    <header className="h-14 bg-surface/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-10 sticky top-0">
                        {toolbar}
                    </header>
                )}
                <div className="flex-1 relative overflow-auto">
                    {children}
                </div>
            </main>

            {/* Right Panel */}
            {rightPanel && (
                <aside className="w-72 bg-surface border-l border-border flex flex-col z-20 shrink-0">
                    {rightPanel}
                </aside>
            )}
        </div>
    );
};
