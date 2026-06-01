import { redirect } from 'next/navigation';

export default function AdminFleetPageRedirect() {
  redirect('/admin?tab=fleet');
}
