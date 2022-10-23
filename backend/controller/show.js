import Show from '../models/Show.js';
import data from '../data.js';
import User from '../models/User.js';

export const getSeed = async (req, res, next) => {
   await Show.remove({});
   const addedShow = await Show.insertMany(data);
   res.status(201).json(addedShow);
};

export const getShows = async (req, res, next) => {
   const userId = req.userId;
   try {
      const user = await User.findById(userId);
      // console.log(user);
      res.status(200).json({ shows: user.shows });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
};

export const getMovies = async (req, res, next) => {
   const userId = req.userId;
   try {
      const user = await User.findById(userId);
      const movies = user.shows.filter((show) => show.category === 'Movie');
      res.status(200).json({ movies });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
};

export const getTvSeries = async (req, res, next) => {
   const userId = req.userId;
   try {
      const user = await User.findById(userId);
      const tvSeries = user.shows.filter(
         (show) => show.category === 'TV Series'
      );
      res.status(200).json({ tvSeries });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
};

export const getBookmarked = async (req, res, next) => {
   const userId = req.userId;
   try {
      const user = await User.findById(userId);
      const bookmarked = user.shows.filter(
         (show) => show.isBookmarked === true
      );
      res.status(200).json({ bookmarked });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
};

export const toggleBookmark = async (req, res, next) => {
   const showId = req.params.showId;
   const userId = req.userId;
   try {
      const user = await User.findById(userId);
      const shows = user.shows;
      const showIndex = shows.findIndex(
         (show) => show._id.toString() === showId
      );
      if (showIndex === -1) {
         const error = new Error('Show not found');
         error.statusCode = 404;
         throw error;
      }
      const prevState = user.shows[showIndex].isBookmarked;
      user.shows[showIndex].isBookmarked = !prevState;
      await User.updateOne({ id: userId }, user);
      res.status(200).json({
         showId,
         isBookmarked: user.shows[showIndex].isBookmarked,
      });
   } catch (err) {
      if (!err.statusCode) {
         err.statusCode = 500;
      }
      next(err);
   }
};
