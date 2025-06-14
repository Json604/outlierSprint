import { notFound } from 'next/navigation';
import { mockActivities } from '@/lib/mockData';
import ActivityBookingClient from './ActivityBookingClient';

// Server Component - handles static params generation
export async function generateStaticParams() {
  return mockActivities.map((activity) => ({
    id: activity.id,
  }));
}

// Server Component - fetches data and handles not found
export default function ActivityBookingPage({ params }: { params: { id: string } }) {
  const activity = mockActivities.find(a => a.id === params.id);

  if (!activity) {
    notFound();
  }

  return <ActivityBookingClient activity={activity} />;
}