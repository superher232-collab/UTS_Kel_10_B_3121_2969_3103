"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CargoDashboardClient } from '@/components/cargo/CargoDashboardClient';
import { FleetManagerClient } from '@/components/admin/FleetManagerClient';
import { InteractiveMap } from '@/components/map/InteractiveMap';

interface AdminDashboardClientProps {
  initialTab: string;
  cargoProps?: {
    initialShipments: any[];
    ships: any[];
    stats: any;
    pagination: any;
  };
  fleetProps?: {
    vehicles: any[];
    pendingShipments: any[];
  };
  komandoProps: {
    totalShipments: number;
    pendingShipments: number;
    delayedCount: number;
    totalRevenue: number;
    openTicketsCount: number;
    delayedAlerts: any[];
    brokenVehiclesAlerts: any[];
    openTicketsAlerts: any[];
  };
}

export function AdminDashboardClient({ initialTab, cargoProps, fleetProps, komandoProps }: AdminDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab state synced with URL SearchParam
  const [activeTab, setActiveTab] = useState(initialTab || 'komando');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // ─────────────────────────────────────────────────────────────
  // CLIENT STATE FETCHERS FOR THE TABS
  // ─────────────────────────────────────────────────────────────
  
  // 1. ANALYTICS STATE
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  useEffect(() => {
    if (activeTab === 'analytics') {
      async function fetchAnalytics() {
        setAnalyticsLoading(true);
        setAnalyticsError('');
        try {
          const [overview, routes, vehicles] = await Promise.all([
            fetch('/api/admin/analytics/overview').then(r => r.json()),
            fetch('/api/admin/analytics/routes').then(r => r.json()),
            fetch('/api/admin/analytics/vehicles').then(r => r.json())
          ]);
          if (overview.error || routes.error || vehicles.error) throw new Error('Gagal memuat analitis');
          setAnalyticsData({ overview: overview.data, routes: routes.data, vehicles: vehicles.data });
        } catch (e: any) {
          setAnalyticsError(e.message || 'Gagal memuat sebagian data analitis');
        } finally {
          setAnalyticsLoading(false);
        }
      }
      fetchAnalytics();
    }
  }, [activeTab]);

  // 2. USERS DIRECTORY STATE
  const [users, setUsers] = useState<any[]>([]);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [usersActionSuccess, setUsersActionSuccess] = useState('');
  const [usersActionError, setUsersActionError] = useState('');
  const [activePasswordResetUserId, setActivePasswordResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  async function fetchUsers() {
    if (activeTab !== 'users') return;
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await fetch(`/api/admin/users?page=${usersPage}&search=${encodeURIComponent(usersSearch)}`).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setUsers(res.data);
      setUsersTotalPages(res.pagination.totalPages);
    } catch (e: any) {
      setUsersError(e.message || 'Gagal memuat daftar user');
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [activeTab, usersPage, usersSearch]);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    setUsersActionError('');
    setUsersActionSuccess('');
    const targetRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Ubah peran user ini menjadi ${targetRole}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole })
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setUsersActionSuccess(`Sukses mengubah role user ke ${targetRole}`);
      fetchUsers();
    } catch (err: any) {
      setUsersActionError(err.message || 'Gagal mengubah peran user');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsersActionError('');
    setUsersActionSuccess('');
    if (!activePasswordResetUserId || !newPassword) return;
    try {
      const res = await fetch(`/api/admin/users/${activePasswordResetUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setUsersActionSuccess('Sukses mereset kata sandi user!');
      setActivePasswordResetUserId(null);
      setNewPassword('');
    } catch (err: any) {
      setUsersActionError(err.message || 'Gagal mereset kata sandi');
    }
  };

  const handleSoftDelete = async (userId: string, userName: string) => {
    setUsersActionError('');
    setUsersActionSuccess('');
    if (!confirm(`Apakah Anda yakin ingin menghapus user ${userName} secara soft-delete?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ softDelete: true })
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setUsersActionSuccess(`Sukses melakukan soft-delete pada user ${userName}!`);
      fetchUsers();
    } catch (err: any) {
      setUsersActionError(err.message || 'Gagal menghapus user');
    }
  };

  // 3. AUDIT LOGS STATE
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState('');
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [resourceType, setResourceType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  async function fetchLogs() {
    if (activeTab !== 'audit') return;
    setLogsLoading(true);
    setLogsError('');
    try {
      let query = `/api/admin/audit-logs?page=${logsPage}`;
      if (resourceType) query += `&resourceType=${resourceType}`;
      if (dateFrom) query += `&dateFrom=${dateFrom}`;
      if (dateTo) query += `&dateTo=${dateTo}`;
      const res = await fetch(query).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setLogs(res.data);
      setLogsTotalPages(res.pagination.totalPages);
    } catch (e: any) {
      setLogsError(e.message || 'Gagal memuat log audit');
    } finally {
      setLogsLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [activeTab, logsPage, resourceType, dateFrom, dateTo]);

  // 4. CONFIG SETTINGS STATE
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [runningAutomation, setRunningAutomation] = useState(false);
  const [tariffRules, setTariffRules] = useState<any>({ DARAT: 2000, LAUT: 1500, UDARA: 5000, baseFee: 25000 });
  const [notifTemplates, setNotifTemplates] = useState<any>({ welcome: '', shipmentUpdate: '' });
  const [featureFlags, setFeatureFlags] = useState<any>({ autoAssignArmada: true, enableCompensation: true });

  async function fetchSettings() {
    if (activeTab !== 'settings') return;
    setSettingsLoading(true);
    setSettingsError('');
    try {
      const res = await fetch('/api/admin/settings').then(r => r.json());
      if (res.error) throw new Error(res.error);
      setSettings(res.data);
      if (res.data.tariffRules) setTariffRules(res.data.tariffRules.value);
      if (res.data.notifTemplates) setNotifTemplates(res.data.notifTemplates.value);
      if (res.data.featureFlags) setFeatureFlags(res.data.featureFlags.value);
    } catch (e: any) {
      setSettingsError(e.message || 'Gagal memuat pengaturan');
    } finally {
      setSettingsLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const handleSaveSetting = async (key: string, value: any, category: string) => {
    setSettingsSuccess('');
    setSettingsError('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, category })
      }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setSettingsSuccess(`Sukses memperbarui konfigurasi "${key}"!`);
      fetchSettings();
    } catch (err: any) {
      setSettingsError(err.message || 'Gagal memperbarui konfigurasi');
    }
  };

  const handleTriggerAutomation = async () => {
    setSettingsSuccess('');
    setSettingsError('');
    setRunningAutomation(true);
    setAutomationLogs([]);
    try {
      const res = await fetch('/api/admin/automations/test', { method: 'POST' }).then(r => r.json());
      if (res.error) throw new Error(res.error);
      setSettingsSuccess(res.message);
      setAutomationLogs(res.logs || []);
    } catch (err: any) {
      setSettingsError(err.message || 'Gagal menjalankan engine automasi');
    } finally {
      setRunningAutomation(false);
    }
  };

  // Helper formatting currency
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return (
    <div style={{ display: 'flex', width: '100%', boxSizing: 'border-box' }}>
      
      {/* ─────────────────────────────────────────────────────────────
          DASHBOARD MAIN VIEWPORT (Lebar Penuh Tanpa Sidebar Kiri)
          ───────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '16px 8px', boxSizing: 'border-box' }}>
        
        {/* VIEW 1: RUANG KOMANDO */}
        {activeTab === 'komando' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: 'white', margin: 0 }}>
                RUANG KOMANDO UTAMA ADMIN
              </h1>
              <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
                PENGENDALIAN TOTAL OPERASIONAL, MANAJEMEN TIKET & ALARM ARMADA AKTIF
              </span>
            </div>

            {/* Satelit Monitoring Live Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '9px', color: '#C084FC', fontWeight: 'bold', letterSpacing: '1px' }}>
                🛰️ SATELIT TRACKING AKTIF & KONTROL TELEMETRI GLOBAL
              </span>
              <InteractiveMap compact={true} />
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
              {[
                { label: 'TOTAL KARGO TERDATAL', value: komandoProps.totalShipments, color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)', desc: 'Keseluruhan pengiriman kargo' },
                { label: 'KARGO PENDING / PROSES', value: komandoProps.pendingShipments, color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)', desc: 'Kargo antre & diproses sortir' },
                { label: 'KETERLAMBATAN AKTIF', value: komandoProps.delayedCount, color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)', desc: 'ETA armada melampaui batas waktu' },
                { label: 'TOTAL REVENUE DIKUMPULKAN', value: formatCurrency(komandoProps.totalRevenue), color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)', desc: 'Pendapatan bruto terakumulasi' }
              ].map(card => (
                <div key={card.label} style={{
                  background: '#0D0618',
                  border: `1px solid ${card.border}`,
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>{card.label}</span>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: card.color }}>{card.value}</div>
                  <span style={{ fontSize: '8px', color: '#8B7BA8' }}>{card.desc}</span>
                </div>
              ))}
            </div>

            {/* Alarm Queues */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
              
              {/* Queue 1: Delayed */}
              <div style={{ background: '#0D0618', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 'bold', letterSpacing: '1px' }}>🚨 ANTRIAN ALARM: KARGO TERLAMBAT (DELAYED)</span>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>Kargo melewati estimasi tiba (ETA)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {komandoProps.delayedAlerts.map(s => (
                    <div key={s.id} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '11px', color: 'white' }}>{s.receiptNo}</span>
                        <span style={{ fontSize: '8px', color: '#8B7BA8' }}>{s.itemName} ➔ {s.destination}</span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '8px', color: '#EF4444', fontWeight: 'bold' }}>EXPIRED ETA</span>
                        <span style={{ fontSize: '8px', color: '#8B7BA8' }}>{new Date(s.eta).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                  {komandoProps.delayedAlerts.length === 0 && (
                    <span style={{ fontSize: '10px', color: '#8B7BA8', textAlign: 'center', padding: '16px' }}>Tidak ada keterlambatan pengiriman armada terdeteksi.</span>
                  )}
                </div>
              </div>

              {/* Queue 2: Repair Vehicles */}
              <div style={{ background: '#0D0618', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold', letterSpacing: '1px' }}>🔧 ANTRIAN ALARM: ARMADA DALAM PEMELIHARAAN</span>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>Armada dengan status PERBAIKAN</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {komandoProps.brokenVehiclesAlerts.map(v => (
                    <div key={v.id} style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '11px', color: 'white' }}>{v.name} ({v.plateNo})</span>
                        <span style={{ fontSize: '8px', color: '#8B7BA8' }}>Tipe: {v.type}</span>
                      </div>
                      <span style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #F59E0B', color: '#F59E0B', fontSize: '8px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PERBAIKAN</span>
                    </div>
                  ))}
                  {komandoProps.brokenVehiclesAlerts.length === 0 && (
                    <span style={{ fontSize: '10px', color: '#8B7BA8', textAlign: 'center', padding: '16px' }}>Tidak ada armada dalam status perawatan aktif.</span>
                  )}
                </div>
              </div>

              {/* Queue 3: Support Tickets */}
              <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#C084FC', fontWeight: 'bold', letterSpacing: '1px' }}>🎟️ ANTRIAN ALARM: COMPLAINT AKTIF ({komandoProps.openTicketsCount})</span>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>Tiket complaint berstatus OPEN</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {komandoProps.openTicketsAlerts.map(t => (
                    <div key={t.id} style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '70%' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '11px', color: 'white' }}>{t.ticketNo}</span>
                        <span style={{ fontSize: '8px', color: '#8B7BA8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{t.title}</span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{
                          background: t.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.1)',
                          border: `1px solid ${t.severity === 'CRITICAL' ? '#EF4444' : 'rgba(168, 85, 247, 0.4)'}`,
                          color: t.severity === 'CRITICAL' ? '#EF4444' : '#C084FC',
                          fontSize: '8px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>{t.severity}</span>
                        <Link href={`/dashboard/support`} style={{ fontSize: '8px', color: '#06B6D4', textDecoration: 'none', fontWeight: 'bold' }}>RESPON 💬</Link>
                      </div>
                    </div>
                  ))}
                  {komandoProps.openTicketsAlerts.length === 0 && (
                    <span style={{ fontSize: '10px', color: '#8B7BA8', textAlign: 'center', padding: '16px' }}>Tidak ada tiket OPEN menunggu respons.</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: FLEET MANAGEMENT */}
        {activeTab === 'fleet' && fleetProps && (
          <FleetManagerClient
            initialVehicles={fleetProps.vehicles}
            pendingShipments={fleetProps.pendingShipments}
          />
        )}

        {/* VIEW: MAP TELEMETRY */}
        {activeTab === 'map' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', color: 'white', margin: 0 }}>
                PETA SATELIT MONITORING ARMADA
              </h1>
              <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
                PEMETAAN TELESKOPIS SATELIT ARMADA KAPAL & SISTEM CONTROL ANOMALI CUACA
              </span>
            </div>
            <InteractiveMap />
          </div>
        )}

        {/* VIEW 2: KONTROL CARGO CRUD */}
        {activeTab === 'cargo' && cargoProps && (
          <CargoDashboardClient
            role="ADMIN"
            initialShipments={cargoProps.initialShipments}
            ships={cargoProps.ships}
            stats={cargoProps.stats}
            pagination={cargoProps.pagination}
          />
        )}

        {/* VIEW 3: ANALISIS SISTEM */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>📊 ANALISIS METRIK & VISUALISASI SISTEM</h1>
              <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>METRIK REAL-TIME EFISIENSI RUTE, PENDAPATAN, & UTILISASI ARMADA</span>
            </div>

            {analyticsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#A855F7', fontWeight: 'bold' }}>📡 MENGAMBIL METRIK DARI SATELIT...</div>
            ) : analyticsError ? (
              <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', color: '#EF4444', fontSize: '11px', fontWeight: 'bold' }}>⚠️ ERROR: {analyticsError}</div>
            ) : analyticsData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'PENDAPATAN TERAKUMULASI', value: formatCurrency(analyticsData.overview?.totalRevenue || 0), color: '#22C55E' },
                    { label: 'UTILISASI ARMADA AKTIF', value: `${analyticsData.vehicles?.utilizationRate || 0}%`, color: '#3B82F6' },
                    { label: 'ANTREAN KARGO PENDING', value: analyticsData.overview?.pendingShipments || 0, color: '#F59E0B' },
                    { label: 'ARMADA TERLAMBAT / DELAYED', value: analyticsData.overview?.delayedShipments || 0, color: '#EF4444' }
                  ].map(c => (
                    <div key={c.label} style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>{c.label}</span>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: c.color }}>{c.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
                  {/* Revenue by mode */}
                  <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>💰 PENDAPATAN BERDASARKAN METODE TRANSPORTASI</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {analyticsData.overview?.revenueByType.map((item: any) => {
                        const maxRevenue = Math.max(...(analyticsData.overview?.revenueByType.map((i: any) => i.revenue) || [1]));
                        const percentage = Math.round((item.revenue / maxRevenue) * 100);
                        return (
                          <div key={item.type} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                              <span style={{ fontWeight: 'bold' }}>{item.type} ({item.count} Trip)</span>
                              <span style={{ color: '#22C55E' }}>{formatCurrency(item.revenue)}</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #A855F7 0%, #22C55E 100%)', transition: 'width 1s ease-out' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Routes */}
                  <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>📍 5 RUTE DENGAN TRIP TERBANYAK</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {analyticsData.routes?.topRoutes.slice(0, 5).map((route: any) => {
                        const maxTrips = Math.max(...(analyticsData.routes?.topRoutes.map((i: any) => i.count) || [1]));
                        const percentage = Math.round((route.count / maxTrips) * 100);
                        return (
                          <div key={route.routeString} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                              <span style={{ fontWeight: 'bold' }}>{route.routeString}</span>
                              <span style={{ color: '#A855F7' }}>{route.count} Trip ({route.avgDeliveryHours} Jam Rerata)</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #A855F7 0%, #3B82F6 100%)', transition: 'width 1s ease-out' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Fleet Performance Table */}
                <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>🚀 TINGKAT UTILISASI & DISTRIBUSI ARMADA AKTIF</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.2)', color: '#8B7BA8' }}>
                          <th style={{ padding: '12px 8px' }}>NAMA ARMADA</th>
                          <th style={{ padding: '12px 8px' }}>TIPE</th>
                          <th style={{ padding: '12px 8px' }}>NOMOR PLAT</th>
                          <th style={{ padding: '12px 8px' }}>STATUS</th>
                          <th style={{ padding: '12px 8px' }}>JUMLAH TRIP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.vehicles?.allVehicles.map((v: any) => (
                          <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{v.name}</td>
                            <td style={{ padding: '12px 8px' }}>{v.type}</td>
                            <td style={{ padding: '12px 8px', color: '#A855F7' }}>{v.plateNo}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{
                                background: v.status === 'TERSEDIA' ? 'rgba(34,197,94,0.1)' : v.status === 'DIPAKAI' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${v.status === 'TERSEDIA' ? '#22C55E' : v.status === 'DIPAKAI' ? '#3B82F6' : '#EF4444'}`,
                                color: v.status === 'TERSEDIA' ? '#22C55E' : v.status === 'DIPAKAI' ? '#3B82F6' : '#EF4444',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: 'bold'
                              }}>{v.status}</span>
                            </td>
                            <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{v.tripCount} Trip</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* VIEW 4: DIREKTORI USER */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>👥 DIREKTORI PENGGUNA & KONTROL PERAN</h1>
              <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>MANAJEMEN Kredensial, OTORISASI, & PENONAKTIFAN AKUN (SOFT DELETE)</span>
            </div>

            {/* Search */}
            <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '8px', padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8B7BA8', fontWeight: 'bold' }}>CARI PENGGUNA:</span>
              <input
                type="text"
                placeholder="Masukkan nama / email..."
                value={usersSearch}
                onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1); }}
                style={{ flex: 1, minWidth: '250px', background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '4px', padding: '8px 12px', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}
              />
            </div>

            {usersActionSuccess && <div style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid #22C55E', borderRadius: '6px', color: '#22C55E', fontSize: '11px', fontWeight: 'bold' }}>✅ {usersActionSuccess}</div>}
            {usersActionError && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '6px', color: '#EF4444', fontSize: '11px', fontWeight: 'bold' }}>⚠️ ERROR: {usersActionError}</div>}

            {/* Reset Pass Form Modal */}
            {activePasswordResetUserId && (
              <div style={{ background: '#130A22', border: '2px solid #A855F7', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '12px', color: '#C084FC' }}>🔐 INTI RESET PASSWORD USER</h3>
                <form onSubmit={handlePasswordReset} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="password"
                    placeholder="Kata sandi baru (min 6 karakter)..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ flex: 1, minWidth: '200px', background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.6)', borderRadius: '4px', padding: '8px 12px', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}
                    required
                  />
                  <button type="submit" style={{ background: '#22C55E', border: '1px solid #22C55E', color: 'black', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}>KIRIM RESET</button>
                  <button type="button" onClick={() => { setActivePasswordResetUserId(null); setNewPassword(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#8B7BA8', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px' }}>BATAL</button>
                </form>
              </div>
            )}

            {/* List */}
            <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>👥 DIREKTORI PENGGUNA AKTIF</h3>
              {usersLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8B7BA8' }}>📡 MEMUAT AKUN DARI SERVER...</div>
              ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8B7BA8' }}>Tidak ada user terdaftar.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.2)', color: '#8B7BA8' }}>
                        <th style={{ padding: '12px 8px' }}>NAMA</th>
                        <th style={{ padding: '12px 8px' }}>EMAIL</th>
                        <th style={{ padding: '12px 8px' }}>TELEPON</th>
                        <th style={{ padding: '12px 8px' }}>ROLE</th>
                        <th style={{ padding: '12px 8px' }}>DAFTAR</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{u.name}</td>
                          <td style={{ padding: '12px 8px', color: '#C084FC' }}>{u.email}</td>
                          <td style={{ padding: '12px 8px' }}>{u.phone || '-'}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              background: u.role === 'ADMIN' ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)',
                              border: `1px solid ${u.role === 'ADMIN' ? '#A855F7' : '#3B82F6'}`,
                              color: u.role === 'ADMIN' ? '#A855F7' : '#3B82F6',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: 'bold'
                            }}>{u.role}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleRoleToggle(u.id, u.role)} style={{ background: 'transparent', border: '1px solid rgba(168,85,247,0.4)', color: '#C084FC', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}>TOGGLE ROLE 👥</button>
                            <button onClick={() => setActivePasswordResetUserId(u.id)} style={{ background: 'transparent', border: '1px solid rgba(6,182,212,0.4)', color: '#06B6D4', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}>RESET PW 🔐</button>
                            <button onClick={() => handleSoftDelete(u.id, u.name)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', fontWeight: 'bold' }}>SOFT DELETE ❌</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {usersTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <button disabled={usersPage === 1} onClick={() => setUsersPage(p => p - 1)} style={{ background: '#0D0618', border: '1px solid rgba(168,85,247,0.4)', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: usersPage === 1 ? 'not-allowed' : 'pointer' }}>PREV</button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#8B7BA8' }}>Halaman {usersPage} dari {usersTotalPages}</span>
                <button disabled={usersPage === usersTotalPages} onClick={() => setUsersPage(p => p + 1)} style={{ background: '#0D0618', border: '1px solid rgba(168,85,247,0.4)', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: usersPage === usersTotalPages ? 'not-allowed' : 'pointer' }}>NEXT</button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: LOG AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>🔍 AUDIT TRAIL LOGS & AKTIVITAS SISTEM</h1>
              <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>REKAM JEJAK DIGITAL AKTIVITAS OPERASIONAL & PERUBAHAN CONFIG</span>
            </div>

            {/* Filters */}
            <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '8px', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold' }}>RESOURCE TYPE:</span>
                <select
                  value={resourceType}
                  onChange={(e) => { setResourceType(e.target.value); setLogsPage(1); }}
                  style={{ background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '4px', padding: '8px 12px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                >
                  <option value="">Semua Tipe</option>
                  <option value="Shipment">Shipment (Kargo)</option>
                  <option value="User">User (Akun)</option>
                  <option value="Vehicle">Vehicle (Armada)</option>
                  <option value="Settings">Settings (Config)</option>
                  <option value="Ticket">Ticket (Dukungan)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold' }}>TANGGAL MULAI:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setLogsPage(1); }}
                  style={{ background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '4px', padding: '6px 12px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold' }}>TANGGAL SELESAI:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setLogsPage(1); }}
                  style={{ background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '4px', padding: '6px 12px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                />
              </div>

              <button
                onClick={() => { setResourceType(''); setDateFrom(''); setDateTo(''); setLogsPage(1); }}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', alignSelf: 'flex-end' }}
              >
                RESET FILTER 🔄
              </button>
            </div>

            {/* List */}
            <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>🔍 REKAM JEJAK OPERASI (IMUTABEL)</h3>
              {logsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8B7BA8' }}>📡 MEMBACA LOG AUDIT DARI LEDGER...</div>
              ) : logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8B7BA8' }}>Ledger kosong. Belum ada aktivitas.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {logs.map((log) => (
                    <div key={log.id} style={{ padding: '16px', background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '11px' }}>
                        <div>
                          <span style={{ color: '#A855F7', fontWeight: 'bold' }}>[{log.action}]</span>
                          <span style={{ color: '#8B7BA8' }}> pada </span>
                          <span style={{ fontWeight: 'bold' }}>{log.resourceType} ({log.resourceId.substring(0, 8)}...)</span>
                        </div>
                        <div style={{ color: '#8B7BA8' }}>{new Date(log.createdAt).toLocaleString('id-ID')}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '10px', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <div>
                          <span style={{ color: '#8B7BA8' }}>OPERATOR: </span>
                          <span style={{ color: '#C084FC', fontWeight: 'bold' }}>{log.user?.name} ({log.user?.email})</span>
                        </div>
                        {log.metadata && (
                          <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '4px', marginTop: '6px', color: '#38BDF8', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {log.metadata}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {logsTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                <button disabled={logsPage === 1} onClick={() => setLogsPage(p => p - 1)} style={{ background: '#0D0618', border: '1px solid rgba(168,85,247,0.4)', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: logsPage === 1 ? 'not-allowed' : 'pointer' }}>PREV</button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#8B7BA8' }}>Halaman {logsPage} dari {logsTotalPages}</span>
                <button disabled={logsPage === logsTotalPages} onClick={() => setLogsPage(p => p + 1)} style={{ background: '#0D0618', border: '1px solid rgba(168,85,247,0.4)', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: logsPage === logsTotalPages ? 'not-allowed' : 'pointer' }}>NEXT</button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: CONFIG SISTEM */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>⚙️ PANEL KONFIGURASI & ATURAN SISTEM</h1>
              <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>DITRIBUTED TARIFF RULES, TEMPLATE NOTIFIKASI, & DYNAMIC FEATURE FLAGS</span>
            </div>

            {settingsSuccess && <div style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid #22C55E', borderRadius: '6px', color: '#22C55E', fontSize: '11px', fontWeight: 'bold' }}>✅ {settingsSuccess}</div>}
            {settingsError && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid #EF4444', borderRadius: '6px', color: '#EF4444', fontSize: '11px', fontWeight: 'bold' }}>⚠️ ERROR: {settingsError}</div>}

            {settingsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#A855F7' }}>📡 MEMUAT KONFIGURASI...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                  
                  {/* Tariff Rules */}
                  <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>📊 MODIFIER TARIF KARGO</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#8B7BA8' }}>Tarif Darat (per kg):</span>
                        <input
                          type="number"
                          value={tariffRules.DARAT}
                          onChange={(e) => setTariffRules({ ...tariffRules, DARAT: parseInt(e.target.value) || 0 })}
                          style={{ width: '120px', background: '#07020E', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '6px 10px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#8B7BA8' }}>Tarif Laut (per kg):</span>
                        <input
                          type="number"
                          value={tariffRules.LAUT}
                          onChange={(e) => setTariffRules({ ...tariffRules, LAUT: parseInt(e.target.value) || 0 })}
                          style={{ width: '120px', background: '#07020E', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '6px 10px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#8B7BA8' }}>Tarif Udara (per kg):</span>
                        <input
                          type="number"
                          value={tariffRules.UDARA}
                          onChange={(e) => setTariffRules({ ...tariffRules, UDARA: parseInt(e.target.value) || 0 })}
                          style={{ width: '120px', background: '#07020E', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '6px 10px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#8B7BA8' }}>Biaya Dasar (Base Fee):</span>
                        <input
                          type="number"
                          value={tariffRules.baseFee}
                          onChange={(e) => setTariffRules({ ...tariffRules, baseFee: parseInt(e.target.value) || 0 })}
                          style={{ width: '120px', background: '#07020E', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '6px 10px', color: 'white', fontFamily: 'monospace', fontSize: '11px' }}
                        />
                      </div>
                      <button
                        onClick={() => handleSaveSetting('tariffRules', tariffRules, 'TARIFF')}
                        style={{ marginTop: '12px', background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}
                      >
                        SIMPAN PARAMETER TARIF 💾
                      </button>
                    </div>
                  </div>

                  {/* Feature flags */}
                  <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>⚙️ FITUR & PENGENDALI OPERASIONAL</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block' }}>AUTO-ALLOTMENT FLEET</span>
                          <span style={{ fontSize: '8px', color: '#8B7BA8' }}>Alokasikan armada terdekat otomatis saat order masuk</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={featureFlags.autoAssignArmada}
                          onChange={(e) => {
                            const nextFlags = { ...featureFlags, autoAssignArmada: e.target.checked };
                            setFeatureFlags(nextFlags);
                            handleSaveSetting('featureFlags', nextFlags, 'FEATURE_FLAG');
                          }}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block' }}>KOMPENSASI KETERLAMBATAN</span>
                          <span style={{ fontSize: '8px', color: '#8B7BA8' }}>Izinkan voucher refund otomatis pada tiket delayed</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={featureFlags.enableCompensation}
                          onChange={(e) => {
                            const nextFlags = { ...featureFlags, enableCompensation: e.target.checked };
                            setFeatureFlags(nextFlags);
                            handleSaveSetting('featureFlags', nextFlags, 'FEATURE_FLAG');
                          }}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* templates */}
                <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>✉️ TEMPLATE EMAIL & NOTIFIKASI SISTEM</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B7BA8' }}>Template Sambutan Akun Baru (Welcome):</span>
                      <textarea
                        value={notifTemplates.welcome}
                        onChange={(e) => setNotifTemplates({ ...notifTemplates, welcome: e.target.value })}
                        style={{ height: '80px', background: '#07020E', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '10px', color: 'white', fontFamily: 'monospace', fontSize: '11px', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#8B7BA8' }}>Template Update Status Kargo (Shipment Update):</span>
                      <textarea
                        value={notifTemplates.shipmentUpdate}
                        onChange={(e) => setNotifTemplates({ ...notifTemplates, shipmentUpdate: e.target.value })}
                        style={{ height: '80px', background: '#07020E', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '10px', color: 'white', fontFamily: 'monospace', fontSize: '11px', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSetting('notifTemplates', notifTemplates, 'NOTIFICATION')}
                    style={{ width: '100%', marginTop: '16px', background: 'linear-gradient(90deg, #A855F7 0%, #06B6D4 100%)', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}
                  >
                    SIMPAN TEMPLATE EMAIL NOTIFIKASI 💾
                  </button>
                </div>

                {/* Manual Override Automation */}
                <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: '12px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '8px', color: '#C084FC', letterSpacing: '1px' }}>⚡ TRIGGER AUTOMATION ENGINE OVERRIDE</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#8B7BA8' }}>Jalankan background job automasi secara manual sekarang. Ini memproses pemindaian status kargo terlambat, alokasi armada otomatis, pembuatan invoice kargo selesai, dan preferensi notifikasi.</span>
                    <button
                      onClick={handleTriggerAutomation}
                      disabled={runningAutomation}
                      style={{ alignSelf: 'flex-start', background: '#E11D48', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: runningAutomation ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}
                    >
                      {runningAutomation ? '⏳ MENJALANKAN ENGINE AUTOMASI...' : '⚡ MANUAL OVERRIDE RUN'}
                    </button>
                    {automationLogs.length > 0 && (
                      <div style={{ background: '#07020E', border: '1px solid rgba(168,85,247,0.3)', padding: '16px', borderRadius: '6px', marginTop: '12px', overflowX: 'auto', maxHeight: '180px', overflowY: 'auto' }}>
                        <span style={{ color: '#A855F7', fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🖥️ AUTOMATION ENGINE SYSTEM LOGS:</span>
                        {automationLogs.map((log, index) => (
                          <div key={index} style={{ fontSize: '10px', color: '#38BDF8', borderBottom: '1px solid rgba(255,255,255,0.02)', padding: '4px 0' }}>➔ {log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
