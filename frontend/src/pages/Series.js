import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '../components/LoadingSpinner';
import Search from '../components/Search';
import Show from '../components/Show';
import useHttp from '../hooks/use-http';
import { getTvSeries } from '../lib/api';
import AuthContext from '../store/authContext';

export default function Series() {
   const [search, setSearch] = useState('');
   const { sendRequest, status, data, error } = useHttp(getTvSeries, true);
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

   const series = data.tvSeries;
   let searchList;
   if (search) {
      searchList = series.filter((show) =>
         show.title.toLowerCase().includes(search.trim().toLowerCase())
      );
   }

   return (
      <Fragment>
         <div>
            <Helmet>
               <title>TV Series</title>
            </Helmet>
            <Search
               onSearch={onSearchHandler}
               placeholder="Search for TV Series"
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
               <h1>TV Series</h1>
               <div>
                  {series.map((movieData) => (
                     <Show data={movieData} key={movieData._id} />
                  ))}
               </div>
            </div>
         )}
      </Fragment>
   );
}
