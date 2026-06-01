import { redirect } from 'next/navigation';

export default function AdminCargoPageRedirect() {
  redirect('/admin?tab=cargo');
}
