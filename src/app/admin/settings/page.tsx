import { redirect } from 'next/navigation';

export default function AdminSettingsPageRedirect() {
  redirect('/admin?tab=settings');
}
