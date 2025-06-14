import { notFound } from 'next/navigation';
import { mockPlays } from '@/lib/mockData';
import PlayBookingClient from './PlayBookingClient';

// Server Component - handles static params generation
export async function generateStaticParams() {
  return mockPlays.map((play) => ({
    id: play.id,
  }));
}

// Server Component - fetches data and handles not found
export default function PlayBookingPage({ params }: { params: { id: string } }) {
  const play = mockPlays.find(p => p.id === params.id);

  if (!play) {
    notFound();
  }

  return <PlayBookingClient play={play} />;
}