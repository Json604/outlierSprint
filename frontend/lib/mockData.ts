// Mock data for the application
export interface Movie {
  id: string;
  title: string;
  genre: string[];
  language: string[];
  duration: number; // in minutes
  rating: number;
  votes: number;
  poster: string;
  banner: string;
  trailer: string;
  description: string;
  cast: string[];
  director: string;
  releaseDate: string;
  city: string[];
  theaters: Theater[];
  price: {
    regular: number;
    premium: number;
    executive: number;
  };
}

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  venues: { [city: string]: string }; // Dynamic venues per city
  city: string[];
  price: number;
  poster: string;
  banner: string;
  description: string;
  artist: string;
  duration: number;
  language: string[];
}

export interface Play {
  id: string;
  title: string;
  genre: string[];
  language: string[];
  duration: number;
  rating: number;
  votes: number;
  poster: string;
  banner: string;
  description: string;
  cast: string[];
  director: string;
  venues: { [city: string]: string }; // Dynamic venues per city
  city: string[];
  showtimes: string[];
  price: {
    regular: number;
    premium: number;
    vip: number;
  };
  dates: string[];
}

export interface Sport {
  id: string;
  title: string;
  sport: string;
  teams: string[];
  venues: { [city: string]: string }; // Dynamic venues per city
  city: string[];
  date: string;
  time: string;
  poster: string;
  banner: string;
  description: string;
  price: {
    general: number;
    premium: number;
    vip: number;
  };
  category: string;
}

export interface Activity {
  id: string;
  title: string;
  category: string;
  venues: { [city: string]: string }; // Dynamic venues per city
  city: string[];
  date: string;
  time: string;
  duration: number;
  poster: string;
  banner: string;
  description: string;
  instructor: string;
  price: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  ageGroup: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: 'Movies' | 'Events' | 'Plays' | 'Sports' | 'Activities' | 'All';
  code: string;
  image: string;
  terms: string[];
}

export interface GiftCard {
  id: string;
  title: string;
  description: string;
  image: string;
  denominations: number[];
  category: 'Movies' | 'Events' | 'All';
  validityMonths: number;
}

export interface Theater {
  id: string;
  name: string;
  address: string;
  showtimes: string[];
  seats: SeatLayout;
  city: string; // Add city to theater
}

export interface SeatLayout {
  regular: number;
  premium: number;
  executive: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  movieId?: string;
  eventId?: string;
  playId?: string;
  sportId?: string;
  activityId?: string;
  theaterId?: string;
  seats: string[];
  showtime: string;
  date: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  bookingDate: string;
}

export const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
];

export const genres = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 
  'Thriller', 'Adventure', 'Animation', 'Crime', 'Fantasy'
];

export const languages = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 
  'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'
];

export const playGenres = [
  'Drama', 'Comedy', 'Musical', 'Thriller', 'Romance', 
  'Historical', 'Contemporary', 'Experimental'
];

export const sportsCategories = [
  'Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton',
  'Hockey', 'Kabaddi', 'Wrestling', 'Boxing', 'Athletics'
];

export const activityCategories = [
  'Workshop', 'Fitness', 'Dance', 'Music', 'Art & Craft',
  'Cooking', 'Photography', 'Adventure', 'Wellness', 'Kids'
];

// Helper function to get future dates
const getFutureDate = (daysFromNow: number) => {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

// Helper function to get past dates
const getPastDate = (daysAgo: number) => {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
};

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Pathaan',
    genre: ['Action', 'Thriller'],
    language: ['Hindi', 'English'],
    duration: 146,
    rating: 4.2,
    votes: 245000,
    poster: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=1200',
    trailer: 'https://example.com/pathaan-trailer',
    description: 'An action-packed thriller featuring a spy who must save his country from a dangerous threat.',
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham'],
    director: 'Siddharth Anand',
    releaseDate: getPastDate(30),
    city: ['Mumbai', 'Delhi', 'Bangalore'],
    theaters: [
      {
        id: 't1',
        name: 'PVR Cinemas',
        address: 'Phoenix Mall, Mumbai',
        city: 'Mumbai',
        showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'],
        seats: { regular: 150, premium: 50, executive: 25 }
      },
      {
        id: 't1-delhi',
        name: 'PVR Select City Walk',
        address: 'Select City Walk, Delhi',
        city: 'Delhi',
        showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM'],
        seats: { regular: 140, premium: 60, executive: 30 }
      },
      {
        id: 't1-bangalore',
        name: 'PVR Forum Mall',
        address: 'Forum Mall, Bangalore',
        city: 'Bangalore',
        showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'],
        seats: { regular: 130, premium: 55, executive: 25 }
      }
    ],
    price: { regular: 200, premium: 350, executive: 500 }
  },
  {
    id: '2',
    title: 'Jawan',
    genre: ['Action', 'Drama'],
    language: ['Hindi', 'Tamil', 'Telugu'],
    duration: 169,
    rating: 4.5,
    votes: 189000,
    poster: 'https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/8721342/pexels-photo-8721342.jpeg?auto=compress&cs=tinysrgb&w=1200',
    trailer: 'https://example.com/jawan-trailer',
    description: 'A high-octane action thriller that follows a man who is out to seek justice for his family.',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi'],
    director: 'Atlee',
    releaseDate: getPastDate(15),
    city: ['Mumbai', 'Chennai', 'Hyderabad'],
    theaters: [
      {
        id: 't2',
        name: 'INOX Megaplex',
        address: 'Forum Mall, Mumbai',
        city: 'Mumbai',
        showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM'],
        seats: { regular: 120, premium: 60, executive: 30 }
      },
      {
        id: 't2-chennai',
        name: 'INOX Express Avenue',
        address: 'Express Avenue Mall, Chennai',
        city: 'Chennai',
        showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'],
        seats: { regular: 110, premium: 65, executive: 35 }
      },
      {
        id: 't2-hyderabad',
        name: 'INOX GVK One',
        address: 'GVK One Mall, Hyderabad',
        city: 'Hyderabad',
        showtimes: ['11:30 AM', '3:00 PM', '6:30 PM', '10:00 PM'],
        seats: { regular: 125, premium: 55, executive: 28 }
      }
    ],
    price: { regular: 220, premium: 380, executive: 550 }
  },
  {
    id: '3',
    title: 'Oppenheimer',
    genre: ['Biography', 'Drama', 'History'],
    language: ['English'],
    duration: 180,
    rating: 4.7,
    votes: 156000,
    poster: 'https://images.pexels.com/photos/8199098/pexels-photo-8199098.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/8199098/pexels-photo-8199098.jpeg?auto=compress&cs=tinysrgb&w=1200',
    trailer: 'https://example.com/oppenheimer-trailer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    releaseDate: getFutureDate(5),
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    theaters: [
      {
        id: 't3',
        name: 'Cinepolis',
        address: 'DLF Mall, Delhi',
        city: 'Delhi',
        showtimes: ['10:30 AM', '2:15 PM', '6:00 PM', '9:45 PM'],
        seats: { regular: 100, premium: 80, executive: 40 }
      },
      {
        id: 't3-mumbai',
        name: 'Cinepolis Andheri',
        address: 'Andheri West, Mumbai',
        city: 'Mumbai',
        showtimes: ['9:30 AM', '1:15 PM', '5:00 PM', '8:45 PM'],
        seats: { regular: 95, premium: 75, executive: 35 }
      },
      {
        id: 't3-bangalore',
        name: 'Cinepolis Nexus',
        address: 'Nexus Mall, Bangalore',
        city: 'Bangalore',
        showtimes: ['10:00 AM', '1:45 PM', '5:30 PM', '9:15 PM'],
        seats: { regular: 105, premium: 70, executive: 38 }
      },
      {
        id: 't3-chennai',
        name: 'Cinepolis VR Mall',
        address: 'VR Mall, Chennai',
        city: 'Chennai',
        showtimes: ['11:00 AM', '2:30 PM', '6:15 PM', '10:00 PM'],
        seats: { regular: 90, premium: 85, executive: 42 }
      }
    ],
    price: { regular: 250, premium: 400, executive: 600 }
  },
  {
    id: '4',
    title: 'Gadar 2',
    genre: ['Action', 'Drama', 'Romance'],
    language: ['Hindi'],
    duration: 168,
    rating: 4.1,
    votes: 98000,
    poster: 'https://images.pexels.com/photos/7991159/pexels-photo-7991159.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/7991159/pexels-photo-7991159.jpeg?auto=compress&cs=tinysrgb&w=1200',
    trailer: 'https://example.com/gadar2-trailer',
    description: 'The sequel to the blockbuster Gadar, continuing the love story across borders.',
    cast: ['Sunny Deol', 'Ameesha Patel', 'Utkarsh Sharma'],
    director: 'Anil Sharma',
    releaseDate: getFutureDate(10),
    city: ['Delhi', 'Jaipur', 'Pune'],
    theaters: [
      {
        id: 't4',
        name: 'Carnival Cinemas',
        address: 'City Center, Pune',
        city: 'Pune',
        showtimes: ['11:30 AM', '3:00 PM', '6:30 PM', '10:00 PM'],
        seats: { regular: 140, premium: 45, executive: 20 }
      },
      {
        id: 't4-delhi',
        name: 'Carnival Cinemas',
        address: 'Pacific Mall, Delhi',
        city: 'Delhi',
        showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'],
        seats: { regular: 135, premium: 50, executive: 25 }
      },
      {
        id: 't4-jaipur',
        name: 'Carnival Cinemas',
        address: 'World Trade Park, Jaipur',
        city: 'Jaipur',
        showtimes: ['12:00 PM', '3:30 PM', '7:00 PM', '10:30 PM'],
        seats: { regular: 130, premium: 40, executive: 18 }
      }
    ],
    price: { regular: 180, premium: 320, executive: 450 }
  },
  {
    id: '5',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: ['Animation', 'Action', 'Adventure'],
    language: ['English', 'Hindi'],
    duration: 140,
    rating: 4.6,
    votes: 234000,
    poster: 'https://images.pexels.com/photos/8369684/pexels-photo-8369684.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/8369684/pexels-photo-8369684.jpeg?auto=compress&cs=tinysrgb&w=1200',
    trailer: 'https://example.com/spiderman-trailer',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry'],
    director: 'Joaquim Dos Santos',
    releaseDate: getFutureDate(15),
    city: ['Mumbai', 'Bangalore', 'Hyderabad', 'Chennai'],
    theaters: [
      {
        id: 't5',
        name: 'AMB Cinemas',
        address: 'Gachibowli, Hyderabad',
        city: 'Hyderabad',
        showtimes: ['10:15 AM', '1:45 PM', '5:15 PM', '8:45 PM'],
        seats: { regular: 110, premium: 70, executive: 35 }
      },
      {
        id: 't5-mumbai',
        name: 'AMB Cinemas',
        address: 'Malad West, Mumbai',
        city: 'Mumbai',
        showtimes: ['9:45 AM', '1:15 PM', '4:45 PM', '8:15 PM'],
        seats: { regular: 115, premium: 65, executive: 30 }
      },
      {
        id: 't5-bangalore',
        name: 'AMB Cinemas',
        address: 'Whitefield, Bangalore',
        city: 'Bangalore',
        showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'],
        seats: { regular: 105, premium: 75, executive: 40 }
      },
      {
        id: 't5-chennai',
        name: 'AMB Cinemas',
        address: 'OMR, Chennai',
        city: 'Chennai',
        showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM'],
        seats: { regular: 100, premium: 80, executive: 45 }
      }
    ],
    price: { regular: 210, premium: 360, executive: 520 }
  },
  {
    id: '6',
    title: 'RRR',
    genre: ['Action', 'Drama'],
    language: ['Telugu', 'Hindi', 'Tamil'],
    duration: 187,
    rating: 4.8,
    votes: 345000,
    poster: 'https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg?auto=compress&cs=tinysrgb&w=1200',
    trailer: 'https://example.com/rrr-trailer',
    description: 'A fictional story about two legendary revolutionaries away from home before they started fighting for their country.',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt'],
    director: 'S.S. Rajamouli',
    releaseDate: getFutureDate(20),
    city: ['Hyderabad', 'Chennai', 'Bangalore', 'Mumbai'],
    theaters: [
      {
        id: 't6',
        name: 'Prasads IMAX',
        address: 'Necklace Road, Hyderabad',
        city: 'Hyderabad',
        showtimes: ['9:30 AM', '1:00 PM', '4:30 PM', '8:00 PM'],
        seats: { regular: 200, premium: 100, executive: 50 }
      },
      {
        id: 't6-chennai',
        name: 'Prasads IMAX',
        address: 'Vadapalani, Chennai',
        city: 'Chennai',
        showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'],
        seats: { regular: 180, premium: 120, executive: 60 }
      },
      {
        id: 't6-bangalore',
        name: 'Prasads IMAX',
        address: 'Brigade Road, Bangalore',
        city: 'Bangalore',
        showtimes: ['9:00 AM', '12:30 PM', '4:00 PM', '7:30 PM'],
        seats: { regular: 190, premium: 110, executive: 55 }
      },
      {
        id: 't6-mumbai',
        name: 'Prasads IMAX',
        address: 'Lower Parel, Mumbai',
        city: 'Mumbai',
        showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '9:00 PM'],
        seats: { regular: 170, premium: 130, executive: 65 }
      }
    ],
    price: { regular: 240, premium: 420, executive: 650 }
  }
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Sunburn Arena ft. David Guetta',
    category: 'Music',
    date: getFutureDate(7),
    time: '7:00 PM',
    venues: {
      'Mumbai': 'MMRDA Grounds, Mumbai',
      'Delhi': 'Jawaharlal Nehru Stadium, Delhi',
      'Bangalore': 'Palace Grounds, Bangalore'
    },
    city: ['Mumbai', 'Delhi', 'Bangalore'],
    price: 2500,
    poster: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Experience the electrifying performance by world-renowned DJ David Guetta at Sunburn Arena.',
    artist: 'David Guetta',
    duration: 240,
    language: ['English']
  },
  {
    id: 'e2',
    title: 'Stand-up Comedy Night with Zakir Khan',
    category: 'Comedy',
    date: getFutureDate(12),
    time: '8:00 PM',
    venues: {
      'Mumbai': 'Phoenix Marketcity, Mumbai',
      'Bangalore': 'UB City Mall, Bangalore',
      'Delhi': 'Kingdom of Dreams, Delhi'
    },
    city: ['Mumbai', 'Bangalore', 'Delhi'],
    price: 800,
    poster: 'https://images.pexels.com/photos/7991227/pexels-photo-7991227.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/7991227/pexels-photo-7991227.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Laugh out loud with Zakir Khan\'s hilarious stand-up comedy performance.',
    artist: 'Zakir Khan',
    duration: 120,
    language: ['Hindi', 'English']
  },
  {
    id: 'e3',
    title: 'Classical Music Concert - Ustad Rahat Fateh Ali Khan',
    category: 'Music',
    date: getFutureDate(17),
    time: '6:30 PM',
    venues: {
      'Delhi': 'Siri Fort Auditorium, Delhi',
      'Mumbai': 'NCPA, Mumbai',
      'Kolkata': 'Rabindra Sadan, Kolkata'
    },
    city: ['Delhi', 'Mumbai', 'Kolkata'],
    price: 1500,
    poster: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Experience the soulful music of Ustad Rahat Fateh Ali Khan in this classical music concert.',
    artist: 'Ustad Rahat Fateh Ali Khan',
    duration: 180,
    language: ['Urdu', 'Hindi']
  },
  {
    id: 'e4',
    title: 'Tech Conference 2024',
    category: 'Workshop',
    date: getFutureDate(27),
    time: '9:00 AM',
    venues: {
      'Hyderabad': 'Hyderabad International Convention Centre',
      'Bangalore': 'Bangalore International Exhibition Centre',
      'Pune': 'Pune International Centre'
    },
    city: ['Hyderabad', 'Bangalore', 'Pune'],
    price: 1200,
    poster: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Join industry leaders and tech enthusiasts for the biggest tech conference of the year.',
    artist: 'Various Speakers',
    duration: 480,
    language: ['English']
  },
  {
    id: 'e5',
    title: 'Dance Workshop by Shiamak Davar',
    category: 'Workshop',
    date: getFutureDate(22),
    time: '4:00 PM',
    venues: {
      'Chennai': 'Express Avenue Mall, Chennai',
      'Mumbai': 'Shiamak Davar Institute, Mumbai',
      'Delhi': 'Select City Walk, Delhi'
    },
    city: ['Chennai', 'Mumbai', 'Delhi'],
    price: 600,
    poster: 'https://images.pexels.com/photos/1701194/pexels-photo-1701194.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1701194/pexels-photo-1701194.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Learn contemporary dance moves from the master choreographer Shiamak Davar.',
    artist: 'Shiamak Davar',
    duration: 150,
    language: ['English', 'Tamil']
  }
];

export const mockPlays: Play[] = [
  {
    id: 'p1',
    title: 'Hamlet - The Danish Prince',
    genre: ['Drama', 'Tragedy'],
    language: ['English'],
    duration: 180,
    rating: 4.6,
    votes: 12500,
    poster: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Shakespeare\'s timeless tragedy about the Prince of Denmark seeking revenge for his father\'s murder.',
    cast: ['Rajesh Kumar', 'Priya Sharma', 'Vikram Singh'],
    director: 'Aditya Menon',
    venues: {
      'Mumbai': 'National Centre for the Performing Arts, Mumbai',
      'Delhi': 'Kamani Auditorium, Delhi',
      'Bangalore': 'Ranga Shankara, Bangalore'
    },
    city: ['Mumbai', 'Delhi', 'Bangalore'],
    showtimes: ['7:00 PM', '8:30 PM'],
    price: { regular: 500, premium: 800, vip: 1200 },
    dates: [getFutureDate(7), getFutureDate(8), getFutureDate(9), getFutureDate(10)]
  },
  {
    id: 'p2',
    title: 'Mughal-E-Azam - The Musical',
    genre: ['Musical', 'Historical'],
    language: ['Hindi', 'Urdu'],
    duration: 210,
    rating: 4.8,
    votes: 18900,
    poster: 'https://images.pexels.com/photos/3137891/pexels-photo-3137891.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/3137891/pexels-photo-3137891.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'The epic love story of Prince Salim and Anarkali brought to life on stage with magnificent music and dance.',
    cast: ['Dhanveer Singh', 'Neha Sargam', 'Sanjay Gagnani'],
    director: 'Feroz Abbas Khan',
    venues: {
      'Mumbai': 'Jamshed Bhabha Theatre, Mumbai',
      'Delhi': 'Siri Fort Auditorium, Delhi',
      'Bangalore': 'Chowdiah Memorial Hall, Bangalore'
    },
    city: ['Mumbai', 'Delhi', 'Bangalore'],
    showtimes: ['7:30 PM'],
    price: { regular: 800, premium: 1500, vip: 2500 },
    dates: [getFutureDate(12), getFutureDate(13), getFutureDate(14), getFutureDate(15), getFutureDate(16)]
  },
  {
    id: 'p3',
    title: 'The Comedy of Errors',
    genre: ['Comedy'],
    language: ['English'],
    duration: 150,
    rating: 4.3,
    votes: 8700,
    poster: 'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/3137892/pexels-photo-3137892.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Shakespeare\'s hilarious comedy about mistaken identities and twin brothers separated at birth.',
    cast: ['Rahul Bose', 'Kalki Koechlin', 'Jim Sarbh'],
    director: 'Atul Kumar',
    venues: {
      'Mumbai': 'Prithvi Theatre, Mumbai',
      'Delhi': 'India Habitat Centre, Delhi',
      'Chennai': 'Museum Theatre, Chennai'
    },
    city: ['Mumbai', 'Delhi', 'Chennai'],
    showtimes: ['8:00 PM'],
    price: { regular: 400, premium: 600, vip: 900 },
    dates: [getFutureDate(17), getFutureDate(18), getFutureDate(19)]
  }
];

export const mockSports: Sport[] = [
  {
    id: 's1',
    title: 'Mumbai Indians vs Chennai Super Kings',
    sport: 'Cricket',
    teams: ['Mumbai Indians', 'Chennai Super Kings'],
    venues: {
      'Mumbai': 'Wankhede Stadium, Mumbai',
      'Chennai': 'M. A. Chidambaram Stadium, Chennai'
    },
    city: ['Mumbai', 'Chennai'],
    date: getFutureDate(10),
    time: '7:30 PM',
    poster: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'The ultimate clash between two IPL giants at the iconic stadium.',
    price: { general: 800, premium: 2000, vip: 5000 },
    category: 'IPL'
  },
  {
    id: 's2',
    title: 'India vs Australia - Test Match',
    sport: 'Cricket',
    teams: ['India', 'Australia'],
    venues: {
      'Bangalore': 'M. Chinnaswamy Stadium, Bangalore',
      'Delhi': 'Arun Jaitley Stadium, Delhi',
      'Mumbai': 'Wankhede Stadium, Mumbai'
    },
    city: ['Bangalore', 'Delhi', 'Mumbai'],
    date: getFutureDate(14),
    time: '9:30 AM',
    poster: 'https://images.pexels.com/photos/1661951/pexels-photo-1661951.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1661951/pexels-photo-1661951.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'International Test cricket at its finest as India takes on Australia.',
    price: { general: 500, premium: 1200, vip: 3000 },
    category: 'International'
  },
  {
    id: 's3',
    title: 'Bengaluru FC vs Mumbai City FC',
    sport: 'Football',
    teams: ['Bengaluru FC', 'Mumbai City FC'],
    venues: {
      'Bangalore': 'Sree Kanteerava Stadium, Bangalore',
      'Mumbai': 'Mumbai Football Arena, Mumbai'
    },
    city: ['Bangalore', 'Mumbai'],
    date: getFutureDate(12),
    time: '7:00 PM',
    poster: 'https://images.pexels.com/photos/1661952/pexels-photo-1661952.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1661952/pexels-photo-1661952.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'ISL action as the teams clash in a crucial league match.',
    price: { general: 300, premium: 800, vip: 1500 },
    category: 'ISL'
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'a1',
    title: 'Pottery Making Workshop',
    category: 'Art & Craft',
    venues: {
      'Mumbai': 'Creative Arts Studio, Bandra',
      'Delhi': 'Art House, CP',
      'Bangalore': 'Craft Corner, Koramangala'
    },
    city: ['Mumbai', 'Delhi', 'Bangalore'],
    date: getFutureDate(8),
    time: '10:00 AM',
    duration: 180,
    poster: 'https://images.pexels.com/photos/1661953/pexels-photo-1661953.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1661953/pexels-photo-1661953.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Learn the ancient art of pottery making with expert guidance and create your own masterpiece.',
    instructor: 'Meera Patel',
    price: 1200,
    difficulty: 'Beginner',
    ageGroup: '12+ years'
  },
  {
    id: 'a2',
    title: 'Yoga & Meditation Retreat',
    category: 'Wellness',
    venues: {
      'Bangalore': 'Serenity Wellness Center, Whitefield',
      'Chennai': 'Zen Garden, Adyar',
      'Pune': 'Mindful Space, Koregaon Park'
    },
    city: ['Bangalore', 'Chennai', 'Pune'],
    date: getFutureDate(11),
    time: '6:00 AM',
    duration: 240,
    poster: 'https://images.pexels.com/photos/1661954/pexels-photo-1661954.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1661954/pexels-photo-1661954.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Start your day with rejuvenating yoga sessions and guided meditation for inner peace.',
    instructor: 'Guru Anand',
    price: 800,
    difficulty: 'Beginner',
    ageGroup: 'All ages'
  },
  {
    id: 'a3',
    title: 'Photography Walk - Street Photography',
    category: 'Photography',
    venues: {
      'Delhi': 'Old Delhi Streets',
      'Mumbai': 'Colaba Causeway',
      'Kolkata': 'Park Street'
    },
    city: ['Delhi', 'Mumbai', 'Kolkata'],
    date: getFutureDate(13),
    time: '7:00 AM',
    duration: 300,
    poster: 'https://images.pexels.com/photos/1661955/pexels-photo-1661955.jpeg?auto=compress&cs=tinysrgb&w=400',
    banner: 'https://images.pexels.com/photos/1661955/pexels-photo-1661955.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Capture the essence of the city through your lens with professional photography guidance.',
    instructor: 'Rohit Sharma',
    price: 1500,
    difficulty: 'Intermediate',
    ageGroup: '16+ years'
  }
];

export const mockOffers: Offer[] = [
  {
    id: 'o1',
    title: 'Movie Monday Madness',
    description: 'Get 25% off on all movie tickets every Monday',
    discount: '25% OFF',
    validUntil: getFutureDate(365), // Valid for 1 year
    category: 'Movies',
    code: 'MONDAY25',
    image: 'https://images.pexels.com/photos/1661956/pexels-photo-1661956.jpeg?auto=compress&cs=tinysrgb&w=400',
    terms: [
      'Valid only on Mondays',
      'Maximum discount of ₹100',
      'Valid on all movie tickets',
      'Cannot be combined with other offers'
    ]
  },
  {
    id: 'o2',
    title: 'First Booking Special',
    description: 'Flat ₹100 off on your first booking',
    discount: '₹100 OFF',
    validUntil: getFutureDate(180), // Valid for 6 months
    category: 'All',
    code: 'FIRST100',
    image: 'https://images.pexels.com/photos/1661957/pexels-photo-1661957.jpeg?auto=compress&cs=tinysrgb&w=400',
    terms: [
      'Valid for new users only',
      'Minimum booking amount ₹300',
      'Valid on all categories',
      'One time use only'
    ]
  },
  {
    id: 'o3',
    title: 'Weekend Event Bonanza',
    description: 'Buy 2 get 1 free on event tickets',
    discount: 'Buy 2 Get 1 Free',
    validUntil: getFutureDate(90), // Valid for 3 months
    category: 'Events',
    code: 'WEEKEND3',
    image: 'https://images.pexels.com/photos/1661958/pexels-photo-1661958.jpeg?auto=compress&cs=tinysrgb&w=400',
    terms: [
      'Valid on weekends only',
      'Applicable on same event only',
      'Lowest priced ticket will be free',
      'Valid on selected events'
    ]
  }
];

export const mockGiftCards: GiftCard[] = [
  {
    id: 'g1',
    title: 'BookSmart Movie Gift Card',
    description: 'Perfect gift for movie lovers - redeemable for any movie ticket',
    image: 'https://images.pexels.com/photos/1661959/pexels-photo-1661959.jpeg?auto=compress&cs=tinysrgb&w=400',
    denominations: [500, 1000, 2000, 5000],
    category: 'Movies',
    validityMonths: 12
  },
  {
    id: 'g2',
    title: 'BookSmart Universal Gift Card',
    description: 'The ultimate entertainment gift - use for movies, events, plays, and more',
    image: 'https://images.pexels.com/photos/1661960/pexels-photo-1661960.jpeg?auto=compress&cs=tinysrgb&w=400',
    denominations: [1000, 2000, 3000, 5000, 10000],
    category: 'All',
    validityMonths: 24
  },
  {
    id: 'g3',
    title: 'BookSmart Events Gift Card',
    description: 'For the event enthusiast - concerts, comedy shows, workshops and more',
    image: 'https://images.pexels.com/photos/1661961/pexels-photo-1661961.jpeg?auto=compress&cs=tinysrgb&w=400',
    denominations: [1000, 2500, 5000],
    category: 'Events',
    validityMonths: 18
  }
];

export const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  city: 'Mumbai',
  bookings: [
    {
      id: 'b1',
      movieId: '1',
      theaterId: 't1',
      seats: ['F12', 'F13'],
      showtime: '8:30 PM',
      date: getFutureDate(2),
      totalPrice: 700,
      status: 'confirmed',
      bookingDate: new Date(Date.now()).toISOString().split('T')[0]
    },
    {
      id: 'b2',
      eventId: 'e1',
      seats: ['GA001'],
      showtime: '7:00 PM',
      date: getFutureDate(7),
      totalPrice: 2500,
      status: 'confirmed',
      bookingDate: getPastDate(3)
    }
  ]
};