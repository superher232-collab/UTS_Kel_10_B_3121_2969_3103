// src/app/admin/page.tsx
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const session = await auth()
  
  // Strict server-side role gating (BR-09)
  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div style={{
      padding: '40px',
      background: '#07020E',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '12px',
        background: 'rgba(20, 10, 36, 0.7)',
        padding: '32px',
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)'
      }}>
        <h1 style={{ fontSize: '24px', color: '#C084FC', letterSpacing: '2px', margin: '0 0 16px 0' }}>
          ADMIN COMMAND CENTER
        </h1>
        <p style={{ color: '#8B7BA8', fontSize: '14px', marginBottom: '24px' }}>
          Welcome back, {session.user.name || session.user.email}. You are logged in with role: <strong>{session.user.role}</strong>.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ border: '1px solid rgba(168, 85, 247, 0.2)', padding: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '16px' }}>Operational Statistics</h3>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#22C55E' }}>Active</span>
          </div>
          <div style={{ border: '1px solid rgba(168, 85, 247, 0.2)', padding: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '16px' }}>Complaints & Support</h3>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>0 Tickets</span>
          </div>
          <div style={{ border: '1px solid rgba(168, 85, 247, 0.2)', padding: '20px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '16px' }}>Automations</h3>
            <span style={{ fontSize: '14px', color: '#8B7BA8' }}>Auto-dispatch active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
