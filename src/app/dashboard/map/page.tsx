"use client";

import React from 'react';
import { InteractiveMap } from '@/components/map/InteractiveMap';

export default function MapPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      <InteractiveMap compact={false} />
    </div>
  );
}