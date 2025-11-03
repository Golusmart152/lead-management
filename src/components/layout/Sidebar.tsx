
import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material';
import { Dashboard as DashboardIcon, People as PeopleIcon, VpnKey as VpnKeyIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Leads', icon: <PeopleIcon />, path: '/leads' },
  { text: 'My License', icon: <VpnKeyIcon />, path: 'my-license' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { text: 'Admin', icon: <SettingsIcon />, path: '/admin' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItemButton component={NavLink} to={item.path} key={item.text} onClick={isMobile ? onClose : undefined}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={isOpen}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
