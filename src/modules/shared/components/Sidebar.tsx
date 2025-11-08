import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    UserCheck,
    BarChart3,
    Settings,
    HelpCircle,
    Building2,
    FileText,
    Menu
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Sheet, SheetContent } from '../../../components/ui/sheet';
import { useAuth } from '../../../hooks/useAuth';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Customers',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Products',
        href: '/products',
        icon: ShoppingBag,
    },
    {
        title: 'Employees',
        href: '/employees',
        icon: Building2,
    },
    {
        title: 'Leads',
        href: '/leads',
        icon: UserCheck,
    },
];

const secondaryNavItems: NavItem[] = [
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        title: 'Support',
        href: '/support',
        icon: HelpCircle,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Logs',
        href: '/admin/logs',
        icon: FileText,
    },
];

interface SidebarContentProps {
    onItemClick?: () => void;
    className?: string;
}

const SidebarContent: React.FC<SidebarContentProps & { isCollapsed?: boolean }> = ({ onItemClick, className, isCollapsed = false }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const NavItem: React.FC<{ item: NavItem }> = ({ item }) => {
        const isActive = location.pathname === item.href ||
                         (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

        return (
            <Link
                to={item.href}
                onClick={onItemClick}
                className={cn(
                    "flex items-center gap-3 px-4 py-5 rounded-lg text-lg text-[#aeb2c4] transition-all hover:bg-[#1b2135] hover:text-[#e8eaf3] min-w-0",
                    isActive && "bg-gradient-to-b from-[#24325a] to-[#1c2746] text-white border border-[#2a3a69] shadow-[inset_0_0_0_1px_rgba(42,58,105,0.4)]",
                    isCollapsed && "justify-center px-2 py-5"
                )}
            >
                <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-7 w-7" : "h-6 w-6")} />
                {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}
                {item.badge && !isCollapsed && (
                    <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground flex-shrink-0">
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    };

    const NavGroup: React.FC<{ title: string; items: NavItem[]; isCollapsed?: boolean }> = ({ title, items, isCollapsed = false }) => (
        <div className="space-y-12">
            {!isCollapsed && <h4 className="text-sm font-semibold uppercase tracking-wider text-[#7f869b] mx-4 mb-8 tracking-[0.08em]">
                {title}
            </h4>}
            <div className={cn("space-y-20", isCollapsed ? "flex flex-col items-center" : "")}>
                {items.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}
            </div>
        </div>
    );

    return (
        <div className={cn("flex flex-col h-full overflow-auto", className)}>
            {/* Sidebar Header */}
            <div className="flex h-16 items-center px-4 border-b border-[#24263d] bg-gradient-to-b from-[#1a2134] to-[#14161f]">
                {!isCollapsed && <span className="text-white font-semibold">Workspace</span>}
                <button
                    onClick={onItemClick}
                    className={cn(
                        "p-2 rounded-lg hover:bg-[#1b2135] transition-all duration-200 hover:scale-105",
                        isCollapsed ? "" : "ml-auto"
                    )}
                    aria-label="Toggle sidebar"
                >
                    <Menu className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-3 py-8 space-y-16 overflow-auto">
                <NavGroup title="General" items={mainNavItems} isCollapsed={isCollapsed} />
                <NavGroup title="Secondary" items={secondaryNavItems} isCollapsed={isCollapsed} />
                <NavGroup title="Admin" items={adminNavItems} isCollapsed={isCollapsed} />
            </div>

            {/* Footer */}
            {user && (
                <div className="px-4 py-4 border-t border-[#24263d] bg-[#151926]">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#1e2540] border border-[#2a3258]"></div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="text-sm text-white truncate">{user.displayName || user.email?.split('@')[0] || 'User'}</div>
                                <div className="text-xs text-[#9aa0b3] truncate">{user.email}</div>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button
                                onClick={logout}
                                className="text-xs px-2.5 py-1 rounded-md border border-[#2a3258] text-[#bfc6dc] hover:bg-[#1b2135] transition-colors"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Desktop Sidebar
const DesktopSidebar: React.FC<{ isCollapsed?: boolean; onToggleCollapse?: () => void }> = ({ isCollapsed = false, onToggleCollapse }) => {
    return (
        <div className={`hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:self-start lg:h-screen lg:z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:w-[100px]' : 'lg:w-[270px]'}`}>
            <div className="flex flex-col flex-1 h-full bg-[rgba(19,24,36,0.94)] border-r border-[#24263d] shadow-[6px_0_28px_rgba(11,13,19,0.1)] backdrop-blur-[3px]">
                <SidebarContent isCollapsed={isCollapsed} onItemClick={onToggleCollapse} />
            </div>
        </div>
    );
};

// Mobile Sidebar
const MobileSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[270px] p-0">
                <SidebarContent onItemClick={onClose} />
            </SheetContent>
        </Sheet>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) => {
    return (
        <>
            <DesktopSidebar isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
            <MobileSidebar isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default Sidebar;
