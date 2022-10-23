import React, { Fragment, useEffect } from 'react';
import './Home.css';
import Search from '../components/Search';
import TrendingShow from '../components/TrendingShow';
import Show from '../components/Show';
import LoadingSpinner from '../components/LoadingSpinner';
import useHttp from '../hooks/use-http';
import { getShows } from '../lib/api';
import { useContext } from 'react';
import AuthContext from '../store/authContext';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
   const [search, setSearch] = useState('');
   const { sendRequest, status, data, error } = useHttp(getShows, true);
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

   const shows = data.shows;
   const trendingShows = shows.filter((show) => show.isTrending === true);
   const normalShows = shows.filter((show) => show.isTrending === false);

   let searchList;
   if (search) {
      searchList = shows.filter((show) =>
         show.title.toLowerCase().includes(search.trim().toLowerCase())
      );
   }

   return (
      <div className="home">
         <Helmet>
            <title>Home</title>
         </Helmet>
         <Search
            onSearch={onSearchHandler}
            placeholder="Search for movies or TV series"
         />
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
            <Fragment>
               <div className="trending">
                  <h1>Trending</h1>
                  <div>
                     {trendingShows.map((show) => (
                        <TrendingShow data={show} key={show._id} />
                     ))}
                  </div>
               </div>
               <div className="recommended">
                  <h1>Recommended for you</h1>
                  <div>
                     {normalShows.map((show) => (
                        <Show data={show} key={show._id} />
                     ))}
                  </div>
               </div>
            </Fragment>
         )}
      </div>
   );
}
