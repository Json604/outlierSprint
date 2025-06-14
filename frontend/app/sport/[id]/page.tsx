import { notFound } from 'next/navigation';
import { mockSports } from '@/lib/mockData';
import SportDetailsClient from './SportDetailsClient';

// Server Component - handles static params generation
export async function generateStaticParams() {
  return mockSports.map((sport) => ({
    id: sport.id,
  }));
}

// Server Component - fetches data and handles not found
export default function SportDetailsPage({ params }: { params: { id: string } }) {
  const sport = mockSports.find(s => s.id === params.id);

  if (!sport) {
    notFound();
  }

  return <SportDetailsClient sport={sport} />;
}