import express from 'express';
import {
   getBookmarked,
   getMovies,
   getSeed,
   getShows,
   getTvSeries,
   toggleBookmark,
} from '../controller/show.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.put('/', getSeed);

router.put('/:showId', isAuth, toggleBookmark);

router.get('/', isAuth, getShows);

router.get('/movies', isAuth, getMovies);

router.get('/tvseries', isAuth, getTvSeries);

router.get('/bookmarked', isAuth, getBookmarked);

export default router;
