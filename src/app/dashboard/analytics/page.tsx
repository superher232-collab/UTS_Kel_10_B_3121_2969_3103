import React from 'react';
import { auth } from '@/auth';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';
import { CustomerAnalyticsClient } from '@/components/customer/CustomerAnalyticsClient';

export default async function AnalyticsPage() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: 'white', fontFamily: 'monospace' }}>
      {role === 'ADMIN' ? (
        <AnalyticsClient />
      ) : (
        <CustomerAnalyticsClient />
      )}
    </div>
  );
}