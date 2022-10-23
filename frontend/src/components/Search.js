import React, { useRef } from 'react';
import './Search.css';
import searchIcon from '../assets/icon-search.svg';

export default function Search(props) {
   const inputRef = useRef(null);

   return (
      <div className="search">
         <div className="searchLogo" onClick={() => inputRef.current.focus()}>
            <img src={searchIcon} alt="" />
         </div>
         <input
            onChange={props.onSearch}
            ref={inputRef}
            type="text"
            placeholder={props.placeholder}
         />
      </div>
   );
}
