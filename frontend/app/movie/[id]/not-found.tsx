import Link from 'next/link';
import { ArrowLeft, Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Film className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
          <p className="text-gray-400 text-lg mb-6">
            The movie you're looking for doesn't exist or may have been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/movies"
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Movies
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try searching for a different movie</p>
          </div>
        </div>
      </div>
    </div>
  );
}