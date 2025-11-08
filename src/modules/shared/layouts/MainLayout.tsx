import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleSidebarCollapse}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col main-content-area relative z-10 w-full min-w-0">
        <Header onDrawerToggle={handleDrawerToggle} />

        {/* Main Content */}
        <main className="flex-1 p-16 lg:p-20 overflow-auto min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto w-full space-y-20">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
