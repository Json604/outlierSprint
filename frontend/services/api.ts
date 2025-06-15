const BASE_URL = "http://localhost:8000";

export const fetchMovies = async () => {
  const res = await fetch(`${BASE_URL}/movies`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return await res.json();
};

export const fetchEvents = async () => {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return await res.json();
};

// Add more as needed: plays, sports, etc.
