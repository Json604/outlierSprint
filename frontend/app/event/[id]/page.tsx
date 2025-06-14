import { notFound } from 'next/navigation';
import { mockEvents } from '@/lib/mockData';
import EventDetailsClient from './EventDetailsClient';

// Server Component - handles static params generation
export async function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }));
}

// Server Component - fetches data and handles not found
export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const event = mockEvents.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  return <EventDetailsClient event={event} />;
}