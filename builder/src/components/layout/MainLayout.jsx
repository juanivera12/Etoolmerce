import clsx from 'clsx';

export const MainLayout = ({ children, leftPanel, rightPanel, toolbar, isUIHidden }) => {
    return (
        <div className="flex h-screen w-full bg-background text-text overflow-hidden font-sans">
            {/* Sidebar */}
            {leftPanel && (
                <aside className={clsx("w-64 bg-surface border-r border-border flex flex-col z-20 shrink-0 ease-in-out transition-all duration-300", isUIHidden && "opacity-0 pointer-events-none")}>
                    {leftPanel}
                </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col bg-background min-w-0">
                {toolbar && (
                    <header className={clsx("h-14 bg-surface/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-10 sticky top-0 transition-opacity duration-300", isUIHidden && "opacity-0 pointer-events-none")}>
                        {toolbar}
                    </header>
                )}
                <div className="flex-1 relative overflow-auto" id="main-scroll-container">
                    {children}
                </div>
            </main>

            {/* Right Panel */}
            {rightPanel && (
                <aside className={clsx("w-72 bg-surface border-l border-border flex flex-col z-20 shrink-0 transition-opacity duration-300", isUIHidden && "opacity-0 pointer-events-none")}>
                    {rightPanel}
                </aside>
            )}
        </div>
    );
};
