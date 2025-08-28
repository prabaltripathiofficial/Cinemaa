// app/api/movies/route.ts
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, QueryConstraint } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

// Define the shape of our movie data
interface Movie {
  title: string;
  poster_url: string;
  imdb_rating: number;
  genres: number[]; 
  platforms: string[];
  achievements: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platforms = searchParams.get('platforms')?.split(',');
    const genreIds = searchParams.get('genres')?.split(',').map(Number); 
    const minRating = searchParams.get('rating');
    
    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'Platforms are required' }, { status: 400 });
    }

    const moviesRef = collection(db, 'movies');
    const queryConstraints: QueryConstraint[] = [];
    
    queryConstraints.push(where('platforms', 'array-contains-any', platforms));

    if (minRating) {
      queryConstraints.push(where('imdb_rating', '>=', parseFloat(minRating)));
    }
    
    const q = query(moviesRef, ...queryConstraints);
    
    const querySnapshot = await getDocs(q);
    
    // Tell TypeScript to treat the data as our Movie type
    let movies = querySnapshot.docs.map(doc => {
      const data = doc.data() as Movie; // Assert the type here
      return {
        id: doc.id,
        ...data,
      };
    });

    // Perform Genre Filtering in Code
    if (genreIds && genreIds.length > 0) {
      movies = movies.filter(movie => 
        movie.genres.some((genreId: number) => genreIds.includes(genreId))
      );
    }

    return NextResponse.json(movies);

  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
