"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useVessels } from '@/hooks/useVessels';

const DashboardContext = createContext<any>(null);

export const useDashboard = () => {
    return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState('User');
    const [username, setUsername] = useState('Tamu');

    // Load credentials from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('username') || 'Tamu';
            const savedRole = localStorage.getItem('role')     || 'User';
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsername(savedUser);
            setRole(savedRole);
        }
    }, []);

    // Instantiate our custom hooks SWR state manager
    const {
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
        refreshData
    } = useVessels();

    return (
        <DashboardContext.Provider value={{
            role,
            username,
            armada: vessels, // Maps directly to vessel list
            logs,            // Real-time event logbook
            cuaca: weather,  // Mapped from global weather
            loading,
            errorSignal,
            simulateFailure,
            setSimulateFailure,
            updateCuaca: updateWeather, // Admin trigger weather status
            tambahKapal: addVessel,      // Admin CRUD: Add vessel
            hapusKapal: deleteVessel,    // Admin CRUD: Delete vessel
            triggerVesselMutation,       // Simulate ship status/log mutations
            refreshData
        }}>
            {children}
        </DashboardContext.Provider>
    );
};