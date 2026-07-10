"use client";

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SkeletonCard from '@/components/ui/SkeletonCard'
import SkeletonTable from '@/components/ui/SkeletonTable'
import { 
  ExclamationTriangleIcon, WrenchIcon, TicketIcon, 
  ChartBarIcon, UsersIcon, ClipboardDocumentListIcon,
  Cog6ToothIcon, BoltIcon, LockClosedIcon,
  CheckCircleIcon, XCircleIcon, ArrowRightIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { CargoDashboardClient } from '@/components/cargo/CargoDashboardClient';
import { FleetManagerClient } from '@/components/admin/FleetManagerClient';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';

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
      startTransition(() => {
        setActiveTab(tabParam);
      });
    }
  }, [searchParams]);

  // ─────────────────────────────────────────────────────────────
  // CLIENT STATE FETCHERS FOR THE TABS
  // ─────────────────────────────────────────────────────────────
  
  // Analytics state handled inside AnalyticsClient component itself

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
    startTransition(() => {
      fetchUsers();
    });
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
    startTransition(() => {
      fetchLogs();
    });
  }, [activeTab, logsPage, resourceType, dateFrom, dateTo]);

  // 4. CONFIG SETTINGS STATE
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [automationLogs, setAutomationLogs] = useState<string[]>([]);
  const [runningAutomation, setRunningAutomation] = useState(false);
  const [tariffRules, setTariffRules] = useState<any>({ LAUT: 1500, baseFee: 25000 });
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
    startTransition(() => {
      fetchSettings();
    });
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
        
        {/* VIEW 1: DASHBOARD UTAMA */}
        {activeTab === 'komando' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Dashboard Utama
              </h1>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                Pengendalian total operasional, manajemen tiket, dan alarm armada aktif.
              </span>
            </div>

            {/* Live Map */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600 }}>
                <MapIcon style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '4px' }} />
                Peta Tracking Aktif
              </span>
              <InteractiveMap compact={true} />
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Total Kiriman', value: komandoProps.totalShipments, color: 'var(--accent)', border: 'var(--border-focus)', desc: 'Keseluruhan pengiriman kargo' },
                { label: 'Menunggu Diproses', value: komandoProps.pendingShipments, color: 'var(--warning)', border: 'rgba(255,214,0,0.3)', desc: 'Kargo antre dan diproses' },
                { label: 'Terlambat', value: komandoProps.delayedCount, color: 'var(--danger)', border: 'rgba(255,23,68,0.3)', desc: 'ETA armada melampaui batas waktu' },
                { label: 'Total Pendapatan', value: formatCurrency(komandoProps.totalRevenue), color: 'var(--success)', border: 'rgba(0,230,118,0.3)', desc: 'Pendapatan bruto terakumulasi' }
              ].map(card => (
                <div key={card.label} style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${card.border}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 500 }}>{card.label}</span>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: card.color, fontFamily: 'var(--font-mono)' }}>{card.value}</div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{card.desc}</span>
                </div>
              ))}
            </div>

            {/* Alarm Queues */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
              
              {/* Queue 1: Delayed */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,23,68,0.25)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid rgba(255,23,68,0.2)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ExclamationTriangleIcon style={{ width: '14px', height: '14px' }} /> Kargo Terlambat
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Kargo melewati estimasi tiba</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {komandoProps.delayedAlerts.map(s => (
                    <div key={s.id} style={{ padding: '12px', background: 'rgba(255,23,68,0.03)', border: '1px solid rgba(255,23,68,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{s.receiptNo}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{s.itemName} → {s.destination}</span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)', fontWeight: 600 }}>ETA Lewat</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{new Date(s.eta).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                  {komandoProps.delayedAlerts.length === 0 && (
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px' }}>Tidak ada keterlambatan terdeteksi.</span>
                  )}
                </div>
              </div>

              {/* Queue 2: Repair Vehicles */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,214,0,0.25)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid rgba(255,214,0,0.2)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--warning)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <WrenchIcon style={{ width: '14px', height: '14px' }} /> Armada Dalam Pemeliharaan
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Armada dengan status perbaikan</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {komandoProps.brokenVehiclesAlerts.map(v => (
                    <div key={v.id} style={{ padding: '12px', background: 'rgba(255,214,0,0.03)', border: '1px solid rgba(255,214,0,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{v.name} ({v.plateNo})</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Tipe: {v.type}</span>
                      </div>
                      <span className="badge badge-warning">Perbaikan</span>
                    </div>
                  ))}
                  {komandoProps.brokenVehiclesAlerts.length === 0 && (
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px' }}>Tidak ada armada dalam perawatan.</span>
                  )}
                </div>
              </div>

              {/* Queue 3: Support Tickets */}
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TicketIcon style={{ width: '14px', height: '14px' }} /> Tiket Aktif ({komandoProps.openTicketsCount})
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Tiket complaint berstatus open</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {komandoProps.openTicketsAlerts.map(t => (
                    <div key={t.id} style={{ padding: '12px', background: 'var(--accent-dim)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '70%' }}>
                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{t.ticketNo}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{t.title}</span>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className={t.severity === 'CRITICAL' ? 'badge badge-danger' : 'badge badge-accent'}>{t.severity}</span>
                        <Link href={`/dashboard/support`} style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Respon</Link>
                      </div>
                    </div>
                  ))}
                  {komandoProps.openTicketsAlerts.length === 0 && (
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px' }}>Tidak ada tiket menunggu respons.</span>
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
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Peta Armada
              </h1>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                Pemetaan posisi GPS kapal kargo dan indikator cuaca dinamis.
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

        {/* VIEW 3: ANALISIS & LAPORAN */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Analitik & Laporan</h1>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Laporan harian, mingguan, bulanan — diperbarui otomatis.</span>
            </div>
            <AnalyticsClient role="ADMIN" />
          </div>
        )}

        {/* VIEW 4: DIREKTORI USER */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Direktori Pengguna</h1>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Manajemen kredensial, otorisasi, dan penonaktifan akun.</span>
            </div>

            {/* Search */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 500 }}>Cari Pengguna:</span>
              <input
                type="text"
                placeholder="Masukkan nama atau email..."
                value={usersSearch}
                onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1); }}
                style={{ flex: 1, minWidth: '250px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
              />
            </div>

            {usersActionSuccess && <div className="badge badge-success" style={{ padding: '12px', width: '100%', justifyContent: 'center' }}>{usersActionSuccess}</div>}
            {usersActionError && <div className="badge badge-danger" style={{ padding: '12px', width: '100%', justifyContent: 'center' }}>{usersActionError}</div>}

            {/* Reset Pass Form Modal */}
            {activePasswordResetUserId && (
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600 }}>Reset Password User</h3>
                <form onSubmit={handlePasswordReset} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="password"
                    placeholder="Kata sandi baru (min 6 karakter)..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ flex: 1, minWidth: '200px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}>Simpan</button>
                  <button type="button" onClick={() => { setActivePasswordResetUserId(null); setNewPassword(''); }} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}>Batal</button>
                </form>
              </div>
            )}

            {/* List */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--accent)', fontWeight: 600 }}>Daftar Pengguna Aktif</h3>
              {usersLoading ? (
                <SkeletonTable rows={5} cols={4} />
              ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Tidak ada user terdaftar.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
                        <th style={{ padding: '12px 8px' }}>Nama</th>
                        <th style={{ padding: '12px 8px' }}>Email</th>
                        <th style={{ padding: '12px 8px' }}>Telepon</th>
                        <th style={{ padding: '12px 8px' }}>Role</th>
                        <th style={{ padding: '12px 8px' }}>Daftar</th>
                        <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 600 }}>{u.name}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--accent)' }}>{u.email}</td>
                          <td style={{ padding: '12px 8px' }}>{u.phone || '-'}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span className={u.role === 'ADMIN' ? 'badge badge-accent' : 'badge badge-info'}>{u.role}</span>
                          </td>
                          <td style={{ padding: '12px 8px' }}>{new Date(u.createdAt).toLocaleDateString('id-ID')}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleRoleToggle(u.id, u.role)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}>Ubah Role</button>
                            <button onClick={() => setActivePasswordResetUserId(u.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', borderColor: 'var(--accent)', color: 'var(--accent)' }}>Reset PW</button>
                            <button onClick={() => handleSoftDelete(u.id, u.name)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Hapus</button>
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
                <button disabled={usersPage === 1} onClick={() => setUsersPage(p => p - 1)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', opacity: usersPage === 1 ? 0.5 : 1 }}>Sebelumnya</button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Halaman {usersPage} dari {usersTotalPages}</span>
                <button disabled={usersPage === usersTotalPages} onClick={() => setUsersPage(p => p + 1)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', opacity: usersPage === usersTotalPages ? 0.5 : 1 }}>Selanjutnya</button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: LOG AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Audit Trail</h1>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Rekam jejak aktivitas operasional dan perubahan konfigurasi.</span>
            </div>

            {/* Filters */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>Tipe Resource:</span>
                <select
                  value={resourceType}
                  onChange={(e) => { setResourceType(e.target.value); setLogsPage(1); }}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
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
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>Tanggal Mulai:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setLogsPage(1); }}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', fontWeight: 500 }}>Tanggal Selesai:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setLogsPage(1); }}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <button
                onClick={() => { setResourceType(''); setDateFrom(''); setDateTo(''); setLogsPage(1); }}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: 'var(--text-sm)', borderColor: 'var(--danger)', color: 'var(--danger)', alignSelf: 'flex-end' }}
              >
                Reset Filter
              </button>
            </div>

            {/* List */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--accent)', fontWeight: 600 }}>Rekam Jejak Operasi</h3>
              {logsLoading ? (
                <SkeletonTable rows={4} cols={3} />
              ) : logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>Belum ada aktivitas tercatat.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {logs.map((log) => (
                    <div key={log.id} style={{ padding: '16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: 'var(--text-sm)' }}>
                        <div>
                          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>[{log.action}]</span>
                          <span style={{ color: 'var(--text-tertiary)' }}> pada </span>
                          <span style={{ fontWeight: 600 }}>{log.resourceType} ({log.resourceId.substring(0, 8)}...)</span>
                        </div>
                        <div style={{ color: 'var(--text-tertiary)' }}>{new Date(log.createdAt).toLocaleString('id-ID')}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: 'var(--text-xs)', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>User: </span>
                          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{log.user?.name} ({log.user?.email})</span>
                        </div>
                        {log.metadata && (
                          <div style={{ width: '100%', background: 'var(--bg-void)', border: '1px solid var(--border)', padding: '10px', borderRadius: 'var(--radius-sm)', marginTop: '6px', color: 'var(--info)', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
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
                <button disabled={logsPage === 1} onClick={() => setLogsPage(p => p - 1)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', opacity: logsPage === 1 ? 0.5 : 1 }}>Sebelumnya</button>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Halaman {logsPage} dari {logsTotalPages}</span>
                <button disabled={logsPage === logsTotalPages} onClick={() => setLogsPage(p => p + 1)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', opacity: logsPage === logsTotalPages ? 0.5 : 1 }}>Selanjutnya</button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: CONFIG SISTEM */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Pengaturan Sistem</h1>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Aturan tarif, template notifikasi, dan fitur operasional.</span>
            </div>

            {settingsSuccess && <div className="badge badge-success" style={{ padding: '12px', width: '100%', justifyContent: 'center' }}>{settingsSuccess}</div>}
            {settingsError && <div className="badge badge-danger" style={{ padding: '12px', width: '100%', justifyContent: 'center' }}>{settingsError}</div>}

            {settingsLoading ? (
              <SkeletonCard lines={6} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                  
                  {/* Tariff Rules */}
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--accent)', fontWeight: 600 }}>Tarif Kargo</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Tarif Laut (per kg):</span>
                        <input
                          type="number"
                          value={tariffRules.LAUT || 0}
                          onChange={(e) => setTariffRules({ ...tariffRules, LAUT: parseInt(e.target.value) || 0 })}
                          style={{ width: '120px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Biaya Dasar:</span>
                        <input
                          type="number"
                          value={tariffRules.baseFee || 0}
                          onChange={(e) => setTariffRules({ ...tariffRules, baseFee: parseInt(e.target.value) || 0 })}
                          style={{ width: '120px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
                        />
                      </div>
                      <button
                        onClick={() => handleSaveSetting('tariffRules', tariffRules, 'TARIFF')}
                        className="btn-primary"
                        style={{ marginTop: '12px', padding: '10px', fontSize: 'var(--text-sm)' }}
                      >
                        Simpan Tarif
                      </button>
                    </div>
                  </div>

                  {/* Feature flags */}
                  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--accent)', fontWeight: 600 }}>Fitur Operasional</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block' }}>Auto-Alokasi Armada</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Alokasikan armada terdekat otomatis saat order masuk</span>
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

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                        <div>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'block' }}>Kompensasi Keterlambatan</span>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Izinkan voucher refund otomatis pada tiket delayed</span>
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
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--accent)', fontWeight: 600 }}>Template Email & Notifikasi</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-tertiary)' }}>Template Sambutan Akun Baru:</span>
                      <textarea
                        value={notifTemplates.welcome}
                        onChange={(e) => setNotifTemplates({ ...notifTemplates, welcome: e.target.value })}
                        style={{ height: '80px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-tertiary)' }}>Template Update Status Kargo:</span>
                      <textarea
                        value={notifTemplates.shipmentUpdate}
                        onChange={(e) => setNotifTemplates({ ...notifTemplates, shipmentUpdate: e.target.value })}
                        style={{ height: '80px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSetting('notifTemplates', notifTemplates, 'NOTIFICATION')}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '16px', padding: '10px', fontSize: 'var(--text-sm)' }}
                  >
                    Simpan Template
                  </button>
                </div>

                {/* Manual Override Automation */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--accent)', fontWeight: 600 }}>Manual Override Automation</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>Jalankan background job automasi secara manual. Memproses pemindaian status kargo terlambat, alokasi armada otomatis, dan pembuatan invoice.</span>
                    <button
                      onClick={handleTriggerAutomation}
                      disabled={runningAutomation}
                      className="btn-primary"
                      style={{ alignSelf: 'flex-start', background: 'var(--danger)', padding: '10px 20px', fontSize: 'var(--text-sm)', opacity: runningAutomation ? 0.7 : 1 }}
                    >
                      {runningAutomation ? 'Menjalankan...' : 'Jalankan Sekarang'}
                    </button>
                    {automationLogs.length > 0 && (
                      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)', marginTop: '12px', overflowX: 'auto', maxHeight: '180px', overflowY: 'auto' }}>
                        <span style={{ color: 'var(--accent)', fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Log Automasi:</span>
                        {automationLogs.map((log, index) => (
                          <div key={index} style={{ fontSize: 'var(--text-xs)', color: 'var(--info)', borderBottom: '1px solid var(--border)', padding: '4px 0', fontFamily: 'var(--font-mono)' }}>{log}</div>
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
