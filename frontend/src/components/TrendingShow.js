import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import classes from './TrendingShow.module.css';
import MoviesIcon from '../assets/MoviesIcon';
import TvSeriesIcon from '../assets/TvSeriesIcon';
import playIcon from '../assets/icon-play.svg';
import BookmarkEmptyIcon from '../assets/BookmarkEmptyIcon';
import { useContext } from 'react';
import AuthContext from '../store/authContext';

export default function TrendingShow({ data }) {
   const mobileCheck = matchMedia('(max-width: 480px)');
   const [mobile, setMobile] = useState(mobileCheck.matches);
   const [isBookmarked, setIsBookmarked] = useState(null);
   const id = data._id;

   const token = useContext(AuthContext).token;

   useEffect(() => {
      function handleScreenChange() {
         setMobile(mobileCheck.matches);
      }
      mobileCheck.addEventListener('change', handleScreenChange);
      return () => {
         mobileCheck.removeEventListener('change', handleScreenChange);
      };
   });

   const toggleBookmark = async () => {
      const response = await fetch('http://192.168.43.166:5000/show/' + id, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
         },
      });
      const data = await response.json();
      if (response.ok) {
         setIsBookmarked(data.isBookmarked);
      }
   };

   const bookmarked = () => {
      if (isBookmarked === null) {
         return data.isBookmarked;
      } else {
         return isBookmarked;
      }
   };

   return (
      <div className={classes.card}>
         <div className={classes.image}>
            <img
               src={require('../' +
                  (mobile
                     ? data.thumbnail.trending.small
                     : data.thumbnail.trending.large))}
               alt=""
            />
         </div>
         <div className={classes['play-modal']}>
            <div className={classes['icon-container']}>
               <div>
                  <img src={playIcon} alt="play" />
               </div>
               <h4>Play</h4>
            </div>
         </div>
         <div
            onClick={toggleBookmark}
            className={`${classes.bookmark} ${
               bookmarked() ? classes.bookmarked : ''
            }`}
         >
            <BookmarkEmptyIcon />
         </div>
         <div className={classes.details}>
            <div className={classes.top}>
               <p>{data.year}</p>
               <div className={classes.dot}></div>
               <div className={classes.category}>
                  {data.category === 'Movie' ? (
                     <MoviesIcon />
                  ) : (
                     <TvSeriesIcon />
                  )}
                  <p>{data.category}</p>
               </div>
               <div className={classes.dot}></div>
               <p>{data.rating}</p>
            </div>
            <h2>{data.title}</h2>
         </div>
      </div>
   );
}
