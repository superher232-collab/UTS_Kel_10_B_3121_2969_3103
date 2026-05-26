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
        throw new Error('Sinyal Terputus: Gagal menghubungkan ke satelit monitoring PrimeLog.');
      }

      // Successful fetch
      const currentVessels = mockDb.getVessels();
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
      const success = mockDb.deleteVessel(id);
      await fetchData(true);
      return { success: success };
    } catch (e) {
      console.error('[useVessels] Gagal menghapus kapal:', e);
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

      const currentVessels = mockDb.getVessels();
      if (currentVessels.length === 0) return;

      // Select 1 or 2 random vessels to update their coordinates/positions or status
      const randomIndex1 = Math.floor(Math.random() * currentVessels.length);
      const vesselToUpdate = currentVessels[randomIndex1];

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

      // Save to mockDb
      const updatedList = [...currentVessels];
      updatedList[randomIndex1] = {
        ...vesselToUpdate,
        latitude: newLat,
        longitude: newLng,
        status: newStatus,
        update: 'Baru saja'
      };

      // Set directly to storage to update mock DB
      localStorage.setItem('primelog_vessels', JSON.stringify(updatedList));

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
  }, [fetchData]);

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
    triggerVesselMutation,
    refreshData: () => fetchData(false)
  };
}
