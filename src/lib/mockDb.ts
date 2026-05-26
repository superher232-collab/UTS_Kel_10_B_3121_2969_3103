// ============================================================
// PRIMELOG FLEET MONITORING - MOCK DATABASE SYSTEM
// ============================================================

export interface Vessel {
  id: number;
  name: string;
  type: string;
  status: 'DALAM PERJALANAN' | 'DI PELABUHAN' | 'TERLAMBAT' | 'PEMELIHARAAN';
  statusColor: string;
  location: string;
  destination: string;
  eta: string;
  cargo: string;
  update: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  vesselId: number;
  coordinates: { x: number; y: number }[];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface VesselLog {
  id: string;
  vesselId: number;
  vesselName: string;
  timestamp: string;
  event: string;
  status: string;
  notes: string;
}

// Initial High-Quality Datasets matching original armada in Indonesia
const INITIAL_VESSELS: Vessel[] = [
  { id: 1, name: 'KM NUSANTARA',   type: 'Kapal Petikemas',  status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Laut Jawa',               destination: 'Tanjung Perak',   eta: '2026-05-25 08:30', cargo: 'Elektronik & Garment', update: 'Baru saja',   latitude: 320, longitude: 280 },
  { id: 2, name: 'KM BIMA SAKTI',  type: 'Kapal Kargo Bulk', status: 'DI PELABUHAN',     statusColor: '#3B82F6', location: 'Pelabuhan Tanjung Priok', destination: 'Tanjung Priok',   eta: 'Tiba',             cargo: 'Batu Bara',         update: '5 mnt lalu',  latitude: 300, longitude: 360 },
  { id: 3, name: 'KM SRIWIJAYA',   type: 'Kapal Tanker',     status: 'TERLAMBAT',        statusColor: '#F59E0B', location: 'Selat Sunda',             destination: 'Pelabuhan Merak', eta: '2026-05-24 14:00', cargo: 'Minyak Mentah',     update: '1 mnt lalu',  latitude: 260, longitude: 365 },
  { id: 4, name: 'KM GADJAH MADA', type: 'Kapal Petikemas',  status: 'PEMELIHARAAN',     statusColor: '#EF4444', location: 'Galangan Kapal Batam',    destination: 'Batam',           eta: 'Dalam Perawatan',  cargo: '-',                 update: '10 mnt lalu', latitude: 250, longitude: 175 },
  { id: 5, name: 'KM KARTINI',     type: 'Kapal Kargo',      status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Laut Sulawesi',           destination: 'Makassar',        eta: '2026-05-23 16:45', cargo: 'Suku Cadang Mesin', update: 'Baru saja',   latitude: 560, longitude: 190 },
  { id: 6, name: 'KM MAJAPAHIT',   type: 'Kapal Kargo Bulk', status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Selat Malaka',            destination: 'Belawan',         eta: '2026-05-22 22:15', cargo: 'Beras & Gula',      update: 'Baru saja',   latitude: 280, longitude: 100 },
  { id: 7, name: 'KM DEWARUCI',    type: 'Kapal Tanker',     status: 'DI PELABUHAN',     statusColor: '#3B82F6', location: 'Pelabuhan Tanjung Emas',  destination: 'Semarang',        eta: 'Tiba',             cargo: 'LNG',               update: '7 mnt lalu',  latitude: 380, longitude: 370 },
  { id: 8, name: 'KM CENDRAWASIH', type: 'Kapal Petikemas',  status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Laut Banda',              destination: 'Sorong',          eta: '2026-05-26 10:00', cargo: 'Barang Konsumsi',   update: 'Baru saja',   latitude: 760, longitude: 250 },
  { id: 9, name: 'KM MERPATI',     type: 'Kapal Kargo',      status: 'DI PELABUHAN',     statusColor: '#3B82F6', location: 'Pelabuhan Tanjung Perak', destination: 'Tanjung Perak',   eta: 'Tiba',             cargo: 'Beras & Sembako',   update: '3 mnt lalu',  latitude: 450, longitude: 375 },
  { id: 10, name: 'KM RAJAWALI',   type: 'Kapal Petikemas',  status: 'DALAM PERJALANAN', statusColor: '#22C55E', location: 'Selat Makassar',          destination: 'Makassar',        eta: '2026-05-27 12:00', cargo: 'Semen & Semen Tiga', update: 'Baru saja',  latitude: 580, longitude: 230 }
];

const INITIAL_LOGS: VesselLog[] = [
  { id: 'log-1', vesselId: 1, vesselName: 'KM NUSANTARA', timestamp: '2026-05-22 08:30:10', event: 'Perubahan Lokasi', status: 'DALAM PERJALANAN', notes: 'Kapal melintasi koordinat aman di Laut Jawa.' },
  { id: 'log-2', vesselId: 3, vesselName: 'KM SRIWIJAYA', timestamp: '2026-05-22 08:15:22', event: 'Pemberitahuan Keterlambatan', status: 'TERLAMBAT', notes: 'Kecepatan melambat akibat cuaca berangin kencang di Selat Sunda.' },
  { id: 'log-3', vesselId: 2, vesselName: 'KM BIMA SAKTI', timestamp: '2026-05-22 07:44:00', event: 'Proses Bongkar Muat', status: 'DI PELABUHAN', notes: 'Bongkar muat batu bara sedang berlangsung di Tanjung Priok.' },
  { id: 'log-4', vesselId: 4, vesselName: 'KM GADJAH MADA', timestamp: '2026-05-22 06:00:00', event: 'Pemeliharaan Rutin', status: 'PEMELIHARAAN', notes: 'Masuk dok kering galangan Batam untuk inspeksi baling-baling kapal.' },
  { id: 'log-5', vesselId: 7, vesselName: 'KM DEWARUCI', timestamp: '2026-05-22 05:22:15', event: 'Sandar Pelabuhan', status: 'DI PELABUHAN', notes: 'Kapal sukses membuang sauh di Pelabuhan Tanjung Emas Semarang.' }
];

const KEYS = {
  VESSELS: 'primelog_vessels',
  LOGS: 'primelog_logs',
  WEATHER: 'primelog_weather'
};

const getStorageItem = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const mockDb = {
  // --- Getters ---
  getVessels(): Vessel[] {
    return getStorageItem(KEYS.VESSELS, INITIAL_VESSELS);
  },

  getLogs(): VesselLog[] {
    return getStorageItem(KEYS.LOGS, INITIAL_LOGS);
  },

  getWeather(): string {
    if (typeof window === 'undefined') return 'Normal';
    const w = localStorage.getItem(KEYS.WEATHER);
    if (!w) {
      localStorage.setItem(KEYS.WEATHER, 'Normal');
      return 'Normal';
    }
    return w;
  },

  // --- Mutations ---
  setWeather(weather: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.WEATHER, weather);
  },

  addVessel(vesselData: Partial<Vessel>): Vessel {
    const vessels = this.getVessels();
    const nextId = vessels.reduce((max, v) => (v.id > max ? v.id : max), 0) + 1;
    
    // Status colors mapping
    const statusColorMap = {
      'DALAM PERJALANAN': '#22C55E',
      'DI PELABUHAN': '#3B82F6',
      'TERLAMBAT': '#F59E0B',
      'PEMELIHARAAN': '#EF4444'
    };

    const status = (vesselData.status || 'DALAM PERJALANAN') as Vessel['status'];
    const newVessel: Vessel = {
      id: nextId,
      name: (vesselData.name || `KM BARU ${nextId}`).toUpperCase(),
      type: vesselData.type || 'Kapal Kargo',
      status: status,
      statusColor: statusColorMap[status] || '#22C55E',
      location: vesselData.location || 'Laut Lepas',
      destination: vesselData.destination || 'Tujuan Global',
      eta: vesselData.eta || 'Segera',
      cargo: vesselData.cargo || '-',
      update: 'Baru saja',
      latitude: vesselData.latitude || 400 + Math.random() * 200,
      longitude: vesselData.longitude || 200 + Math.random() * 100
    };

    const updated = [...vessels, newVessel];
    setStorageItem(KEYS.VESSELS, updated);

    // Write log entry for new vessel
    this.addLogEntry(
      newVessel.id,
      newVessel.name,
      'Registrasi Armada',
      newVessel.status,
      `Kapal baru berhasil diregistrasikan ke sistem PrimeLog.`
    );

    return newVessel;
  },

  deleteVessel(id: number): boolean {
    const vessels = this.getVessels();
    const exists = vessels.some(v => v.id === id);
    if (!exists) return false;

    const targetVessel = vessels.find(v => v.id === id);
    const filtered = vessels.filter(v => v.id !== id);
    setStorageItem(KEYS.VESSELS, filtered);

    if (targetVessel) {
      this.addLogEntry(
        id,
        targetVessel.name,
        'Penghapusan Armada',
        'OFFLINE',
        `Kapal telah dinonaktifkan dari sistem pemantauan PrimeLog.`
      );
    }

    return true;
  },

  updateVesselStatus(
    id: number,
    status: Vessel['status'],
    location?: string,
    destination?: string,
    eta?: string
  ): Vessel | null {
    const vessels = this.getVessels();
    const index = vessels.findIndex(v => v.id === id);
    if (index === -1) return null;

    const vessel = vessels[index];
    const prevStatus = vessel.status;

    // Status colors mapping
    const statusColorMap = {
      'DALAM PERJALANAN': '#22C55E',
      'DI PELABUHAN': '#3B82F6',
      'TERLAMBAT': '#F59E0B',
      'PEMELIHARAAN': '#EF4444'
    };

    vessels[index] = {
      ...vessel,
      status: status,
      statusColor: statusColorMap[status] || vessel.statusColor,
      location: location !== undefined ? location : vessel.location,
      destination: destination !== undefined ? destination : vessel.destination,
      eta: eta !== undefined ? eta : vessel.eta,
      update: 'Baru saja'
    };

    setStorageItem(KEYS.VESSELS, vessels);

    // If status changed, write event log
    if (prevStatus !== status) {
      this.addLogEntry(
        id,
        vessel.name,
        'Transisi Status',
        status,
        `Status armada berubah dari ${prevStatus} menjadi ${status}.`
      );
    }

    return vessels[index];
  },

  addLogEntry(
    vesselId: number,
    vesselName: string,
    event: string,
    status: string,
    notes: string
  ): VesselLog {
    const logs = this.getLogs();
    const newLog: VesselLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      vesselId,
      vesselName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event,
      status,
      notes
    };

    const updated = [newLog, ...logs].slice(0, 100); // Cap at 100 logs
    setStorageItem(KEYS.LOGS, updated);
    return newLog;
  },

  resetDatabase(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.VESSELS);
    localStorage.removeItem(KEYS.LOGS);
    localStorage.removeItem(KEYS.WEATHER);
  }
};
