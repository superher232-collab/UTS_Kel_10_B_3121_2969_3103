import { useState, useEffect, useCallback, useRef } from 'react';
import { mockDb, Vessel, VesselLog } from '@/lib/mockDb';

export function useVessels() {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [logs, setLogs] = useState<VesselLog[]>([]);
  const [weather, setWeather] = useState<string>('Normal');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorSignal, setErrorSignal] = useState<boolean>(false);
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);

  // Keep a reference to the last successful data state (SWR pattern)
  const lastDataRef = useRef<{ vessels: Vessel[]; logs: VesselLog[]; weather: string }>({
    vessels: [],
    logs: [],
    weather: 'Normal'
  });

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    
    // Simulate network latency (300ms - 600ms)
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      // Check if we are simulating network failure / connection loss
      if (simulateFailure) {
        console.warn('📶 [PrimeLog Simulation] Sinyal Terputus: Gagal menghubungkan ke satelit monitoring.');
        // Gracefully fallback to cached state and raise connection lost signal without throwing a raw Error
        setVessels(lastDataRef.current.vessels);
        setLogs(lastDataRef.current.logs);
        setWeather(lastDataRef.current.weather);
        setErrorSignal(true);
        setLoading(false);
        return;
      }

      // Fetch from PostgreSQL database via API
      let currentVessels: Vessel[] = [];
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
      
      if (savedUser && savedUser !== 'Tamu') {
        const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`);
        if (res.ok) {
          const data = await res.json();
          const dbVessels = data.armada || [];
          
          // Get simulated telemetry cache from localStorage to keep radar movements smooth
          const localCacheStr = typeof window !== 'undefined' ? localStorage.getItem('primelog_vessels_coords') : null;
          let localCoords: Record<number, { lat: number; lng: number }> = {};
          if (localCacheStr) {
            try {
              localCoords = JSON.parse(localCacheStr);
            } catch (e) {}
          }
          
          currentVessels = dbVessels.map((v: any) => {
            const cache = localCoords[v.id];
            // Format status dynamically if color mapping changes
            const statusColorMap = {
              'DALAM PERJALANAN': '#22C55E',
              'DI PELABUHAN': '#3B82F6',
              'TERLAMBAT': '#F59E0B',
              'PEMELIHARAAN': '#EF4444'
            };
            const currentStatus = (v.status || 'DALAM PERJALANAN') as Vessel['status'];
            return {
              id: v.id,
              name: v.name || '',
              type: v.type || 'Kapal Kargo',
              status: currentStatus,
              statusColor: statusColorMap[currentStatus] || '#22C55E',
              location: v.location || '',
              destination: v.destination || '',
              eta: v.eta || '',
              cargo: v.cargo || '',
              latitude: cache ? cache.lat : (v.latitude || 400 + Math.round(Math.random() * 200)),
              longitude: cache ? cache.lng : (v.longitude || 200 + Math.round(Math.random() * 100)),
              update: 'Baru saja'
            };
          });
        } else {
          currentVessels = mockDb.getVessels();
        }
      } else {
        currentVessels = mockDb.getVessels();
      }

      const currentLogs = mockDb.getLogs();
      const currentWeather = mockDb.getWeather();

      // Update successful data cache
      lastDataRef.current = {
        vessels: currentVessels,
        logs: currentLogs,
        weather: currentWeather
      };

      setVessels(currentVessels);
      setLogs(currentLogs);
      setWeather(currentWeather);
      setErrorSignal(false);
    } catch (err) {
      console.error('[useVessels] Fetch error caught gracefully:', err);
      
      // Captured error: Hold last successful state (prevent white screen!)
      setVessels(lastDataRef.current.vessels);
      setLogs(lastDataRef.current.logs);
      setWeather(lastDataRef.current.weather);
      
      // Raise the Connection Lost signal
      setErrorSignal(true);
    } finally {
      setLoading(false);
    }
  }, [simulateFailure]);

  // Handle mutations
  const updateWeather = useCallback((newWeather: string) => {
    mockDb.setWeather(newWeather);
    fetchData(true);
  }, [fetchData]);

  const addVessel = useCallback(async (vesselData: Partial<Vessel>) => {
    try {
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
      if (savedUser && savedUser !== 'Tamu') {
        const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vesselData)
        });
        if (res.ok) {
          const data = await res.json();
          mockDb.addLogEntry(
            data.kapal.id,
            data.kapal.name,
            'Registrasi Armada',
            data.kapal.status,
            `Kapal baru berhasil diregistrasikan ke database Neon PostgreSQL.`
          );
          await fetchData(true);
          return { success: true, vessel: data.kapal };
        }
      }
      // Fallback to local
      const added = mockDb.addVessel(vesselData);
      await fetchData(true);
      return { success: true, vessel: added };
    } catch (e) {
      console.error('[useVessels] Gagal menambah kapal:', e);
      return { success: false, error: e };
    }
  }, [fetchData]);

  const deleteVessel = useCallback(async (id: number) => {
    try {
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
      if (savedUser && savedUser !== 'Tamu') {
        const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}&id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          const data = await res.json();
          mockDb.addLogEntry(
            id,
            data.deleted?.nama_kapal || 'KAPAL',
            'Penghapusan Armada',
            'OFFLINE',
            `Kapal telah dinonaktifkan dari database Neon PostgreSQL.`
          );
          await fetchData(true);
          return { success: true };
        }
      }
      // Fallback
      const success = mockDb.deleteVessel(id);
      await fetchData(true);
      return { success: success };
    } catch (e) {
      console.error('[useVessels] Gagal menghapus kapal:', e);
      return { success: false, error: e };
    }
  }, [fetchData]);

  const editVessel = useCallback(async (id: number, vesselData: Partial<Vessel>) => {
    try {
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
      if (savedUser && savedUser !== 'Tamu') {
        const res = await fetch(`/api/kapal?username=${encodeURIComponent(savedUser)}&id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vesselData)
        });
        if (res.ok) {
          const data = await res.json();
          mockDb.addLogEntry(
            id,
            data.kapal.name,
            'Pembaruan Data',
            data.kapal.status,
            `Data detail kapal berhasil diperbarui di database Neon PostgreSQL oleh Admin.`
          );
          await fetchData(true);
          return { success: true, vessel: data.kapal };
        }
      }
      // Fallback
      const updated = mockDb.updateVessel(id, vesselData);
      await fetchData(true);
      return { success: !!updated, vessel: updated };
    } catch (e) {
      console.error('[useVessels] Gagal memperbarui detail kapal:', e);
      return { success: false, error: e };
    }
  }, [fetchData]);

  const triggerVesselMutation = useCallback(async (
    id: number,
    status: Vessel['status'],
    location?: string,
    destination?: string,
    eta?: string
  ) => {
    try {
      const updated = mockDb.updateVesselStatus(id, status, location, destination, eta);
      await fetchData(true);
      return { success: !!updated, vessel: updated };
    } catch (e) {
      console.error('[useVessels] Gagal memperbarui status kapal:', e);
      return { success: false, error: e };
    }
  }, [fetchData]);

  // Initial Fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- AUTOMATIC STREAMING SIMULATION (Every 30 seconds) ---
  useEffect(() => {
    const streamInterval = setInterval(() => {
      if (typeof window === 'undefined') return;

      if (vessels.length === 0) return;

      // Select 1 random vessel to update its coordinates/positions or status
      const randomIndex1 = Math.floor(Math.random() * vessels.length);
      const vesselToUpdate = vessels[randomIndex1];

      // Add a slight movement to its coordinates
      let newLat = vesselToUpdate.latitude;
      let newLng = vesselToUpdate.longitude;

      if (vesselToUpdate.status === 'DALAM PERJALANAN') {
        const angle = Math.random() * Math.PI * 2;
        const driftDistance = 8 + Math.random() * 15;
        newLat = Math.round(Math.max(100, Math.min(900, newLat + Math.cos(angle) * driftDistance)));
        newLng = Math.round(Math.max(50, Math.min(450, newLng + Math.sin(angle) * driftDistance)));
      }

      // Check if we want to trigger a slight chance of status update for demo
      let newStatus = vesselToUpdate.status;
      let eventText = 'Pembaruan Koordinat';
      let noteText = `Posisi GPS kapal terdeteksi di koordinat (${newLat}, ${newLng}).`;

      // 10% chance of status transition
      if (Math.random() < 0.12) {
        const statuses: Vessel['status'][] = ['DALAM PERJALANAN', 'DI PELABUHAN', 'TERLAMBAT', 'PEMELIHARAAN'];
        const possibleStatuses = statuses.filter(s => s !== vesselToUpdate.status);
        newStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
        eventText = 'Pembaruan Status Maritim';
        
        const noteMap = {
          'DALAM PERJALANAN': 'Kapal telah menyelesaikan administrasi pelabuhan dan kembali berlayar.',
          'DI PELABUHAN': 'Kapal sukses merapat di pelabuhan tujuan untuk proses bongkar muat.',
          'TERLAMBAT': 'Keterlambatan dideteksi karena hambatan cuaca buruk di perairan.',
          'PEMELIHARAAN': 'Kapal diarahkan masuk galangan terdekat untuk perbaikan darurat.'
        };
        noteText = noteMap[newStatus];
      }

      // Save coords cache in LocalStorage to keep fluid coordinates
      const localCacheStr = localStorage.getItem('primelog_vessels_coords');
      let localCoords: Record<number, { lat: number; lng: number }> = {};
      if (localCacheStr) {
        try {
          localCoords = JSON.parse(localCacheStr);
        } catch (e) {}
      }
      localCoords[vesselToUpdate.id] = { lat: newLat, lng: newLng };
      localStorage.setItem('primelog_vessels_coords', JSON.stringify(localCoords));

      // Add log entry if status changed or just randomly log coordinates
      if (newStatus !== vesselToUpdate.status) {
        mockDb.addLogEntry(
          vesselToUpdate.id,
          vesselToUpdate.name,
          eventText,
          newStatus,
          noteText
        );
      } else if (Math.random() < 0.3) {
        mockDb.addLogEntry(
          vesselToUpdate.id,
          vesselToUpdate.name,
          eventText,
          newStatus,
          noteText
        );
      }

      // Trigger SWR fetch
      fetchData(true);
    }, 30000); // Trigger streaming simulator every 30 seconds

    return () => clearInterval(streamInterval);
  }, [fetchData, vessels]);

  return {
    vessels,
    logs,
    weather,
    loading,
    errorSignal,
    simulateFailure,
    setSimulateFailure,
    updateWeather,
    addVessel,
    deleteVessel,
    editVessel,
    triggerVesselMutation,
    refreshData: () => fetchData(false)
  };
}
