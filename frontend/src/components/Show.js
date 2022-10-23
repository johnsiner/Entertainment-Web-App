import React, { useContext, useEffect, useState } from 'react';
import BookmarkEmptyIcon from '../assets/BookmarkEmptyIcon';
import classes from './Show.module.css';
import playIcon from '../assets/icon-play.svg';
import MoviesIcon from '../assets/MoviesIcon';
import TvSeriesIcon from '../assets/TvSeriesIcon';
import AuthContext from '../store/authContext';

export default function Show({ data }) {
   const mobileCheck = matchMedia('(max-width: 480px)');
   const tabCheck = matchMedia('(max-width: 800px)');
   const [mobile, setMobile] = useState(mobileCheck.matches);
   const [tab, setTab] = useState(tabCheck.matches);
   const [isBookmarked, setIsBookmarked] = useState(null);
   const id = data._id;
   const token = useContext(AuthContext).token;

   useEffect(() => {
      function mobileState() {
         setMobile(mobileCheck.matches);
      }
      function tabState() {
         setTab(tabCheck.matches);
      }
      mobileCheck.addEventListener('change', mobileState);
      tabCheck.addEventListener('change', tabState);
      return () => {
         mobileCheck.removeEventListener('change', mobileState);
         tabCheck.removeEventListener('change', tabState);
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
      <div className={classes.show}>
         <div className={classes.card}>
            <div className={classes.image}>
               <img
                  src={require('../' +
                     (mobile
                        ? data.thumbnail.regular.small
                        : tab
                        ? data.thumbnail.regular.medium
                        : data.thumbnail.regular.large))}
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
            <h4>{data.title}</h4>
         </div>
      </div>
   );
}
