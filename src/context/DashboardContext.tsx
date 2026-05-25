"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const DashboardContext = createContext<any>(null);

export const useDashboard = () => {
    return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole]       = useState('User');
    const [username, setUsername] = useState('');
    const [armada, setArmada]   = useState<any[]>([]);
    const [cuaca, setCuaca]     = useState('Standar');
    const [loading, setLoading] = useState(true);

    const FALLBACK_ARMADA = [
        { id: 1, name: 'KM NUSANTARA',   type: 'Kapal Petikemas',  status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Laut Jawa',              destination: 'Tanjung Perak',   eta: '2026-04-12 08:30', cargo: 'Elektronik',        update: 'Baru saja'   },
        { id: 2, name: 'KM BIMA SAKTI',  type: 'Kapal Kargo Bulk', status: 'DI PELABUHAN',     statusColor: '#3B82F6', location: 'Pelabuhan Tanjung Priok', destination: 'Tanjung Priok',   eta: 'Tiba',             cargo: 'Batu Bara',         update: '5 mnt lalu'  },
        { id: 3, name: 'KM SRIWIJAYA',   type: 'Kapal Tanker',     status: 'TERLAMBAT',        statusColor: '#F59E0B', location: 'Selat Sunda',             destination: 'Pelabuhan Merak', eta: '2026-04-11 14:00', cargo: 'Minyak Mentah',     update: '1 mnt lalu'  },
        { id: 4, name: 'KM GADJAH MADA', type: 'Kapal Petikemas',  status: 'PEMELIHARAAN',     statusColor: '#EF4444', location: 'Galangan Kapal Batam',    destination: 'Batam',           eta: 'Dalam Perawatan',  cargo: '-',                 update: '10 mnt lalu' },
        { id: 5, name: 'KM KARTINI',     type: 'Kapal Kargo',      status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Laut Sulawesi',           destination: 'Makassar',        eta: '2026-04-10 16:45', cargo: 'Suku Cadang Mesin', update: 'Baru saja'   },
        { id: 6, name: 'KM MAJAPAHIT',   type: 'Kapal Kargo Bulk', status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Selat Malaka',            destination: 'Belawan',         eta: '2026-04-09 22:15', cargo: 'Beras',             update: 'Baru saja'   },
        { id: 7, name: 'KM DEWARUCI',    type: 'Kapal Tanker',     status: 'DI PELABUHAN',     statusColor: '#3B82F6', location: 'Pelabuhan Tanjung Emas',  destination: 'Semarang',        eta: 'Tiba',             cargo: 'LNG',               update: '7 mnt lalu'  },
        { id: 8, name: 'KM CENDRAWASIH', type: 'Kapal Petikemas',  status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Laut Banda',              destination: 'Sorong',          eta: '2026-04-13 10:00', cargo: 'Barang Konsumsi',   update: 'Baru saja'   },
        { id: 9, name: 'KM MERPATI',     type: 'Kapal Kargo',      status: 'DI PELABUHAN',     statusColor: '#3B82F6', location: 'Pelabuhan Tanjung Perak', destination: 'Tanjung Perak',   eta: 'Tiba',             cargo: 'Beras & Sembako',   update: '3 mnt lalu'  },
        { id: 10, name: 'KM RAJAWALI',   type: 'Kapal Petikemas',  status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Selat Makassar',          destination: 'Makassar',        eta: '2026-04-14 12:00', cargo: 'Semen',             update: 'Baru saja'   },
    ];

    // ─── Fetch ────────────────────────────────────────────────
    const fetchArmada = async () => {
        if (typeof window === 'undefined') return;

        try {
            const savedUser = localStorage.getItem('username') || 'Tamu';
            const savedRole = localStorage.getItem('role')     || 'User';

            setUsername(savedUser);
            setRole(savedRole);

            const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`);

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                console.error(`[fetchArmada] HTTP ${res.status}:`, errBody);
                setArmada(FALLBACK_ARMADA);
                return;
            }

            const data = await res.json();
            setArmada(data.armada?.length ? data.armada : FALLBACK_ARMADA);
            if (data.role) setRole(data.role);

        } catch (error) {
            console.error('[fetchArmada] Network/parse error:', error);
            setArmada(FALLBACK_ARMADA);
        } finally {
            setLoading(false);
        }
    };

    // ─── Tambah Kapal ─────────────────────────────────────────
    const tambahKapal = async (dataKapal: any) => {
        if (typeof window === 'undefined') return { success: false };

        try {
            const savedUser = localStorage.getItem('username') || '';

            const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataKapal)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('[tambahKapal] Gagal:', err);
                return { success: false, error: err };
            }

            const data = await res.json();

            // Update state lokal langsung
            setArmada(prev => [...prev, data.kapal]);
            return { success: true, kapal: data.kapal };

        } catch (error) {
            console.error('[tambahKapal] Error:', error);
            return { success: false, error };
        }
    };

    // ─── Edit Kapal ───────────────────────────────────────────
    const editKapal = async (id: any, dataKapal: any) => {
        if (typeof window === 'undefined') return { success: false };

        try {
            const savedUser = localStorage.getItem('username') || '';

            // Asumsi API Anda menggunakan method PUT dan menerima ID di body atau query
            // Sesuaikan endpoint ini dengan struktur route.js Anda jika berbeda
            const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...dataKapal })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('[editKapal] Gagal:', err);
                return { success: false, error: err };
            }

            // Update state lokal langsung (Reaktivitas UI)
            setArmada(prev => prev.map(k => k.id === id ? { ...k, ...dataKapal, update: 'Baru saja' } : k));
            return { success: true };

        } catch (error) {
            console.error('[editKapal] Error:', error);
            return { success: false, error };
        }
    };

    // ─── Hapus Kapal ──────────────────────────────────────────
    const hapusKapal = async (id: any) => {
        if (typeof window === 'undefined') return { success: false };

        try {
            const savedUser = localStorage.getItem('username') || '';

            const res = await fetch(
                `/api/kapal?id=${id}&username=${encodeURIComponent(savedUser)}`,
                { method: 'DELETE' }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                console.error('[hapusKapal] Gagal:', err);
                return { success: false, error: err };
            }

            // Hapus dari state lokal langsung
            setArmada(prev => prev.filter(k => k.id !== id));
            return { success: true };

        } catch (error) {
            console.error('[hapusKapal] Error:', error);
            return { success: false, error };
        }
    };

    // ─── Cuaca ────────────────────────────────────────────────
    const updateCuaca = (status: string) => {
        setCuaca(status);
        console.log(`Mengirim POST Request -> Cuaca update: ${status}`);
    };

    // ─── Polling ──────────────────────────────────────────────
    useEffect(() => {
        fetchArmada();
        const intervalId = setInterval(fetchArmada, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <DashboardContext.Provider value={{
            role,
            username,
            armada,
            cuaca,
            loading,
            updateCuaca,
            tambahKapal,
            hapusKapal,
            editKapal, // <--- Sudah ditambahkan di sini
            refreshData: fetchArmada
        }}>
            {children}
        </DashboardContext.Provider>
    );
};
