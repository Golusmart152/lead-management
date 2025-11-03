
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Typography, AppBar } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            License Manager
          </Typography>
          <Typography sx={{ mr: 2 }}>{user?.email}</Typography>
          <Typography onClick={logout} sx={{ cursor: 'pointer' }}>Logout</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={NavLink} to="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={NavLink} to="/leads">
              <ListItemText primary="Leads" />
            </ListItem>
            <ListItem button component={NavLink} to="/my-license">
              <ListItemText primary="My License" />
            </ListItem>
            <ListItem button component={NavLink} to="/profile">
              <ListItemText primary="Profile" />
            </ListItem>
            {user?.role === 'Super Admin' && (
              <ListItem button component={NavLink} to="/admin">
                <ListItemText primary="Admin" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
