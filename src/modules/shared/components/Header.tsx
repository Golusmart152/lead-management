import React from 'react';
import { Menu, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { auth } from '../../../firebase/config';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { ThemeToggle } from '../../../components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface HeaderProps {
    onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrawerToggle }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

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

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 lg:px-6 min-w-0">
                {/* Mobile Menu Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-4 flex-shrink-0"
                    onClick={onDrawerToggle}
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Logo/Brand */}
                <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
                    <h1 className="text-lg lg:text-xl font-semibold text-foreground hidden sm:block">
                        CRM Dashboard
                    </h1>
                </div>

                {/* Spacer */}
                <div className="flex-1 min-w-0" />
                
                {/* Theme Toggle */}
                <div className="mr-4 flex-shrink-0">
                    <ThemeToggle />
                </div>

                {/* User Menu */}
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
                                <div className="flex flex-col space-y-1 min-w-0">
                                    <p className="text-sm font-medium leading-none truncate">
                                        {user.displayName || 'User'}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
};

export default Header;
