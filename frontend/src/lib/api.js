const API_DOMAIN = 'http://192.168.43.166:5000';

export const getShows = async (token) => {
   const response = await fetch(API_DOMAIN + '/show', {
      headers: {
         Authorization: 'Bearer ' + token,
      },
   });
   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message || 'Could not fetch shows');
   }
   return data;
};

export const getTvSeries = async (token) => {
   const response = await fetch(API_DOMAIN + '/show/tvseries', {
      headers: {
         Authorization: 'Bearer ' + token,
      },
   });
   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message || 'Could not fetch TV series');
   }
   return data;
};

export const getMovies = async (token) => {
   const response = await fetch(API_DOMAIN + '/show/movies', {
      headers: {
         Authorization: 'Bearer ' + token,
      },
   });
   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message || 'Could not fetch movies');
   }
   return data;
};

export const getBookmarked = async (token) => {
   const response = await fetch(API_DOMAIN + '/show/bookmarked', {
      headers: {
         Authorization: 'Bearer ' + token,
      },
   });
   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message || 'Could not fetch bookmarked shows');
   }
   return data;
};
