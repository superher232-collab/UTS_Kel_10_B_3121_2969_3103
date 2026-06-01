import { redirect } from 'next/navigation';

export default function AdminAnalyticsPageRedirect() {
  redirect('/admin?tab=analytics');
}
