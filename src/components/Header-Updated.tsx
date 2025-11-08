/**
 * Updated Header Component with Design System
 * Matches the HTML template design exactly
 */
import React from 'react';
import { Menu, Settings, LogOut, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase/config';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
    onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Navigation items matching the HTML template
    const navItems = [
        { label: 'Dashboard', href: '/dashboard', isActive: location.pathname === '/dashboard' },
        { label: 'Customers', href: '/customers', isActive: location.pathname.startsWith('/customers') },
        { label: 'Products', href: '/products', isActive: location.pathname.startsWith('/products') },
        { label: 'Employees', href: '/employees', isActive: location.pathname.startsWith('/employees') },
        { label: 'Leads', href: '/leads', isActive: location.pathname.startsWith('/leads') },
        { label: 'Reports', href: '/reports', isActive: location.pathname.startsWith('/reports') },
        { label: 'Settings', href: '/settings', isActive: location.pathname.startsWith('/settings') },
    ];

    const handleNavClick = (href: string) => {
        navigate(href);
    };

    return (
        <header className="ds-glass-header sticky top-0 z-50 w-full">
            <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden ds-btn ds-btn-ghost ds-btn-icon"
                    onClick={onDrawerToggle}
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Logo/Brand */}
                <div className="ds-logo text-xl font-bold">
                    CRM <span className="ds-logo-accent">Dashboard</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="ds-nav hidden md:flex">
                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`ds-nav-link ${item.isActive ? 'active' : ''}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center gap-4">
                    {/* Search Button (optional) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ds-btn ds-btn-ghost ds-btn-icon"
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* Notifications (optional) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ds-btn ds-btn-ghost ds-btn-icon"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    {/* User Menu */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ds-btn ds-btn-ghost ds-btn-icon">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage 
                                            src={user.photoURL || ''} 
                                            alt={user.displayName || user.email || ''}
                                        />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getInitials(user.displayName || user.email || 'U')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.displayName || 'User'}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSettings}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;