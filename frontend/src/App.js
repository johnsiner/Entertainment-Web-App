import './App.css';
import { NavLink, Routes, Route, useLocation } from 'react-router-dom';
import HomeIcon from './assets/HomeIcon';
import logo from './assets/logo.svg';
import avatar from './assets/image-avatar.png';
import MoviesIcon from './assets/MoviesIcon';
import TvSeriesIcon from './assets/TvSeriesIcon';
import BookmarkFullIcon from './assets/BookmarkFullIcon';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Movies from './pages/Movies';
import { useContext } from 'react';
import AuthContext from './store/authContext';
import Series from './pages/Series';
import Bookmarks from './pages/Bookmarks';

function App() {
   const path = useLocation().pathname;
   const logout = useContext(AuthContext).logout;

   return (
      <div className="App">
         {path === '/auth' ? (
            <Routes>
               <Route path="/auth" element={<Auth />} />
            </Routes>
         ) : (
            <div className="main-app">
               <header>
                  <div className="logo">
                     <img src={logo} alt="logo" />
                  </div>
                  <nav>
                     <NavLink
                        to="/"
                        end
                        className={({ isActive }) => (isActive ? 'active' : '')}
                     >
                        <HomeIcon />
                     </NavLink>
                     <NavLink
                        to="/movies"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                     >
                        <MoviesIcon />
                     </NavLink>
                     <NavLink
                        to="/series"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                     >
                        <TvSeriesIcon />
                     </NavLink>
                     <NavLink
                        to="/bookmarks"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                     >
                        <BookmarkFullIcon />
                     </NavLink>
                  </nav>
                  <div tabIndex="0" className="avatar">
                     <img src={avatar} alt="" />
                     <p onClick={logout} className="logout">
                        Logout
                     </p>
                  </div>
               </header>
               <main>
                  <Routes>
                     <Route
                        path="/"
                        element={
                           <ProtectedRoute>
                              <Home />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/movies"
                        element={
                           <ProtectedRoute>
                              <Movies />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/series"
                        element={
                           <ProtectedRoute>
                              <Series />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/bookmarks"
                        element={
                           <ProtectedRoute>
                              <Bookmarks />
                           </ProtectedRoute>
                        }
                     />
                  </Routes>
               </main>
            </div>
         )}
      </div>
   );
}

export default App;
