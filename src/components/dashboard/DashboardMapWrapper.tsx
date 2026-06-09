"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface DashboardMapWrapperProps {
  children: React.ReactNode;
}

export function DashboardMapWrapper({ children }: DashboardMapWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        background: '#12101A',
        border: '1px solid #7C3AED',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)'
      }}
    >
      {children}
    </motion.div>
  );
}
