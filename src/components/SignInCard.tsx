/**
 * Sign In Card Component
 * Matches the exact design from the HTML template
 */
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';

interface SignInCardProps {
    onSubmit?: (email: string, password: string) => void;
    isLoading?: boolean;
}

const SignInCard: React.FC<SignInCardProps> = ({ onSubmit, isLoading = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0 && onSubmit) {
            onSubmit(email, password);
        }
    };

    return (
        <div className="ds-card max-w-[500px] w-full">
            <h2 className="ds-text-title text-center mb-8">Sign in</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="ds-form-group">
                    <label htmlFor="email" className="ds-label">
                        Email
                    </label>
                    <div className="ds-input-with-icon">
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`ds-input ${errors.email ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        <Mail className="ds-input-icon" />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="ds-form-group">
                    <label htmlFor="password" className="ds-label">
                        Password
                    </label>
                    <div className="ds-input-with-icon">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`ds-input pr-12 ${errors.password ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        <Lock className="ds-input-icon" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                    <button
                        type="button"
                        className="ds-text-accent text-sm hover:underline transition-colors"
                        onClick={() => {
                            // Handle forgot password
                            console.log('Forgot password clicked');
                        }}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="ds-button-group">
                    <Button
                        type="button"
                        variant="secondary"
                        className="ds-btn ds-btn-secondary"
                        onClick={() => {
                            // Handle create account
                            console.log('Create account clicked');
                        }}
                        disabled={isLoading}
                    >
                        Create an account
                    </Button>
                    
                    <Button
                        type="submit"
                        className="ds-btn ds-btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SignInCard;