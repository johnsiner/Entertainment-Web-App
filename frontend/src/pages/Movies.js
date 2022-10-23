import React, { Fragment, useContext, useEffect, useState } from 'react';
import './general.css';
import Search from '../components/Search';
import Show from '../components/Show';
import LoadingSpinner from '../components/LoadingSpinner';
import useHttp from '../hooks/use-http';
import { getMovies } from '../lib/api';
import AuthContext from '../store/authContext';
import { Helmet } from 'react-helmet-async';

export default function Movies() {
   const [search, setSearch] = useState('');
   const { sendRequest, status, data, error } = useHttp(getMovies, true);
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

   const movies = data.movies;
   let searchList;
   if (search) {
      searchList = movies.filter((movie) =>
         movie.title.toLowerCase().includes(search.trim().toLowerCase())
      );
   }

   return (
      <Fragment>
         <div>
            <Helmet>
               <title>Movies</title>
            </Helmet>
            <Search
               onSearch={onSearchHandler}
               placeholder="Search for movies"
            />
         </div>
         {search && (
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
            <div className="recommended general">
               <h1>Movies</h1>
               <div>
                  {movies.map((movieData) => (
                     <Show data={movieData} key={movieData._id} />
                  ))}
               </div>
            </div>
         )}
      </Fragment>
   );
}
