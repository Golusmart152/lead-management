/**
 * Dark Theme Demo Page
 * Demonstrates all components with the new design system
 */
import React, { useState } from 'react';
import BackgroundEffects from './BackgroundEffects';
import Header from './Header-Updated';
import SignInCard from './SignInCard';
import PopupDialog from './PopupDialog';
import { Button } from './ui/button';

const DarkThemeDemo: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

const handleSignIn = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsDialogOpen(true);
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <BackgroundEffects>
            {/* Header */}
            <Header onDrawerToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* Main Content */}
            <main className="min-h-screen flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-6xl space-y-12">
                    
                    {/* Section 1: Sign In Card */}
                    <section className="text-center">
                        <h1 className="ds-text-title mb-4">
                            Dark Theme Design System
                        </h1>
                        <p className="ds-text-muted mb-8 max-w-2xl mx-auto">
                            A complete, production-ready dark theme design system with glass morphism effects,
                            animated gradient blobs, and consistent visual language across all components.
                        </p>
                        
                        <SignInCard 
                            onSubmit={handleSignIn}
                            isLoading={isLoading}
                        />
                    </section>

                    {/* Section 2: Component Showcase */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Button Examples */}
                        <div className="ds-glass-card">
                            <h3 className="ds-text-subtitle mb-4">Buttons</h3>
                            <div className="space-y-3">
                                <Button className="ds-btn ds-btn-primary w-full">
                                    Primary Button
                                </Button>
                                <Button variant="secondary" className="ds-btn ds-btn-secondary w-full">
                                    Secondary Button
                                </Button>
                                <Button variant="outline" className="ds-btn ds-btn-outline w-full">
                                    Outline Button
                                </Button>
                                <Button variant="ghost" className="ds-btn ds-btn-ghost w-full">
                                    Ghost Button
                                </Button>
                            </div>
                        </div>

                        {/* Badge Examples */}
                        <div className="ds-glass-card">
                            <h3 className="ds-text-subtitle mb-4">Badges</h3>
                            <div className="space-y-2">
                                <span className="ds-badge ds-badge-primary">Primary</span>
                                <span className="ds-badge ds-badge-success">Success</span>
                                <span className="ds-badge ds-badge-warning">Warning</span>
                                <span className="ds-badge ds-badge-error">Error</span>
                            </div>
                        </div>

                        {/* Form Elements */}
                        <div className="ds-glass-card">
                            <h3 className="ds-text-subtitle mb-4">Form Elements</h3>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Text input" 
                                    className="ds-input"
                                />
                                <select className="ds-input ds-select" title="Select an option">
                                    <option value="">Select option</option>
                                    <option value="option1">Option 1</option>
                                    <option value="option2">Option 2</option>
                                </select>
                                <textarea 
                                    placeholder="Textarea" 
                                    className="ds-input ds-textarea"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="ds-glass-card">
                            <h3 className="ds-text-subtitle mb-4">Cards</h3>
                            <p className="ds-text-muted text-sm">
                                Glass morphism cards with subtle borders and backdrop blur effects.
                            </p>
                            <div className="mt-4">
                                <span className="ds-badge ds-badge-secondary">Glass Card</span>
                            </div>
                        </div>

                        {/* Status Colors */}
                        <div className="ds-glass-card">
                            <h3 className="ds-text-subtitle mb-4">Status Colors</h3>
                            <div className="space-y-2">
                                <div className="ds-flex ds-items-center ds-gap-2">
                                    <div className="w-3 h-3 rounded-full ds-bg-success"></div>
                                    <span className="ds-text-sm">Success</span>
                                </div>
                                <div className="ds-flex ds-items-center ds-gap-2">
                                    <div className="w-3 h-3 rounded-full ds-bg-warning"></div>
                                    <span className="ds-text-sm">Warning</span>
                                </div>
                                <div className="ds-flex ds-items-center ds-gap-2">
                                    <div className="w-3 h-3 rounded-full ds-bg-error"></div>
                                    <span className="ds-text-sm">Error</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Elements */}
                        <div className="ds-glass-card">
                            <h3 className="ds-text-subtitle mb-4">Interactive</h3>
                            <div className="space-y-3">
                                <Button 
                                    onClick={() => setIsDialogOpen(true)}
                                    className="ds-btn ds-btn-primary w-full"
                                >
                                    Open Dialog
                                </Button>
                                <div className="ds-skeleton h-4 w-full"></div>
                                <div className="ds-spinner mx-auto"></div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Features */}
                    <section className="ds-glass-card">
                        <h2 className="ds-text-subtitle mb-6">Design System Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="ds-text-body font-semibold mb-2">🎨 Visual Design</h4>
                                <ul className="ds-text-muted text-sm space-y-1">
                                    <li>• Dark gradient background with animated blobs</li>
                                    <li>• Grid overlay and radial glow effects</li>
                                    <li>• Glass morphism surfaces and cards</li>
                                    <li>• Consistent spacing and typography</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="ds-text-body font-semibold mb-2">🔧 Technical Features</h4>
                                <ul className="ds-text-muted text-sm space-y-1">
                                    <li>• CSS variables for easy customization</li>
                                    <li>• Radix UI primitive integration</li>
                                    <li>• Responsive design breakpoints</li>
                                    <li>• Safari compatibility with fallbacks</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Popup Dialog */}
            <PopupDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Welcome to Dark Theme!"
                description="Your dark theme design system is now active and ready to use."
                type="success"
                actions={{
                    primary: {
                        label: "Get Started",
                        onClick: () => setIsDialogOpen(false),
                    },
                    secondary: {
                        label: "Learn More",
                        onClick: () => setIsDialogOpen(false),
                    },
                }}
            />
        </BackgroundEffects>
    );
};

export default DarkThemeDemo;