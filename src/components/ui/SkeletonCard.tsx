'use client'

import Skeleton from './Skeleton'

export default function SkeletonCard({ lines = 4 }: { lines?: number }) {
  return (
    <div style={{
      background: '#12101A',
      border: '1px solid rgba(168, 85, 247, 0.15)',
      borderRadius: '8px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <Skeleton width="60%" height="14px" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} width={`${85 - i * 8}%`} height="12px" />
          ))}
      </div>
    </div>
  )
}
