import { notFound } from 'next/navigation';
import { mockMovies } from '@/lib/mockData';
import MovieDetailsClient from './MovieDetailsClient';

// Server Component - handles static params generation
export async function generateStaticParams() {
  return mockMovies.map((movie) => ({
    id: movie.id,
  }));
}

// Server Component - fetches data and handles not found
export default function MovieDetailsPage({ params }: { params: { id: string } }) {
  const movie = mockMovies.find(m => m.id === params.id);

  if (!movie) {
    notFound();
  }

  return <MovieDetailsClient movie={movie} />;
}