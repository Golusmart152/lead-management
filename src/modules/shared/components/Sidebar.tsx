
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    ShoppingBag as ShoppingBagIcon,
    AccountTree as AccountTreeIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    Help as HelpIcon,
    Rule as RuleIcon,
    Business as BusinessIcon
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const drawerContent = (
        <div>
            <Toolbar />
            <List>
                {
                    [
                        { text: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
                        { text: 'Customers', to: '/customers', icon: <PeopleIcon /> },
                        { text: 'Products', to: '/products', icon: <ShoppingBagIcon /> },
                        { text: 'Employees', to: '/employees', icon: <BusinessIcon /> },
                        { text: 'Leads', to: '/leads', icon: <AccountTreeIcon /> },
                    ].map((item) => (
                        <ListItem key={item.text} disablePadding component={Link} to={item.to} onClick={isMobile ? onClose : undefined}>
                            <ListItemButton selected={location.pathname.startsWith(item.to)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
            <Divider />
            <List>
                {
                    [
                        { text: 'Reports', to: '/reports', icon: <BarChartIcon /> },
                        { text: 'Settings', to: '/settings', icon: <SettingsIcon /> },
                        { text: 'Support', to: '/support', icon: <HelpIcon /> },
                        { text: 'Rules', to: '/rules', icon: <RuleIcon /> },
                    ].map((item) => (
                        <ListItem key={item.text} disablePadding component={Link} to={item.to} onClick={isMobile ? onClose : undefined}>
                            <ListItemButton selected={location.pathname.startsWith(item.to)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </div>
    );

    return (
        <Drawer
            component="nav"
            sx={{
                width: { md: drawerWidth },
                flexShrink: { md: 0 },
            }}
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? isOpen : true}
            onClose={onClose}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
        >
            {drawerContent}
        </Drawer>
    );
};

export default Sidebar;
