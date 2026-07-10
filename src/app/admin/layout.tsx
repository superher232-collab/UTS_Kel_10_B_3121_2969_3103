"use client";

import React, { ReactNode, Suspense } from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import NavigationMenu from '@/components/navigation/NavigationMenu';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg-void)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Unified Topbar Megamenu */}
        <Suspense fallback={<div style={{ height: '74px', background: 'rgba(10, 4, 20, 0.95)', borderBottom: '1px solid rgba(168, 85, 247, 0.4)' }} />}>
          <NavigationMenu />
        </Suspense>

        {/* Unified admin main container */}
        <main style={{ flex: 1, padding: '24px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
