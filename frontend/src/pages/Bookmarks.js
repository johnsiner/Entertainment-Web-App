import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../components/LoadingSpinner';
import Search from '../components/Search';
import Show from '../components/Show';
import useHttp from '../hooks/use-http';
import { getBookmarked } from '../lib/api';
import AuthContext from '../store/authContext';

export default function Bookmarks() {
   const [search, setSearch] = useState('');
   const { sendRequest, status, data, error } = useHttp(getBookmarked, true);
   const token = useContext(AuthContext).token;

   const onSearchHandler = (event) => {
      setSearch(event.target.value);
   };

   useEffect(() => {
      sendRequest(token);
   }, [sendRequest, token]);

   if (status === 'pending') {
      return (
         <div className="center">
            <LoadingSpinner />
         </div>
      );
   }

   if (error) {
      return <p className="center">Something went wrong</p>;
   }

   const bookmarks = data.bookmarked;
   const bookmarkedTvSeries = bookmarks.filter(
      (show) => show.category === 'TV Series'
   );
   const bookmarkedMovies = bookmarks.filter(
      (show) => show.category === 'Movie'
   );

   if (bookmarks.length === 0) {
      return (
         <div className="center">
            <h1>No show bookmarked</h1>
         </div>
      );
   }

   let searchList;
   if (search) {
      searchList = bookmarks.filter((show) =>
         show.title.toLowerCase().includes(search.trim().toLowerCase())
      );
   }

   return (
      <Fragment>
         <div>
            <Helmet>
               <title>Bookmarks</title>
            </Helmet>
            <Search
               onSearch={onSearchHandler}
               placeholder="Search for bookmarked shows"
            />
         </div>
         {search && bookmarks.length > 0 && (
            <div className="recommended">
               <h1>{`Found ${searchList.length} ${
                  searchList.length === 1 ? 'result' : 'results'
               } for "${search}"`}</h1>
               <div>
                  {searchList.map((show) => (
                     <Show data={show} key={show._id} />
                  ))}
               </div>
            </div>
         )}
         {!search && (
            <div>
               {bookmarkedMovies.length > 0 && (
                  <div className="recommended general">
                     <h1>Bookmarked Movies</h1>
                     <div>
                        {bookmarkedMovies.map((movieData) => (
                           <Show data={movieData} key={movieData._id} />
                        ))}
                     </div>
                  </div>
               )}
               {bookmarkedTvSeries.length > 0 && (
                  <div className="recommended general">
                     <h1>Bookmarked TV Series</h1>
                     <div>
                        {bookmarkedTvSeries.map((movieData) => (
                           <Show data={movieData} key={movieData._id} />
                        ))}
                     </div>
                  </div>
               )}
            </div>
         )}
      </Fragment>
   );
}
