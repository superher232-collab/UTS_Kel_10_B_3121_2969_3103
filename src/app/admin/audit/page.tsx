import { redirect } from 'next/navigation';

export default function AdminAuditPageRedirect() {
  redirect('/admin?tab=audit');
}
