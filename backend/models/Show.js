import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const showSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   thumbnail: {
      type: Object,
      required: true,
   },
   year: {
      type: Number,
      required: true,
   },
   category: {
      type: String,
      required: true,
   },
   isBookmarked: {
      type: Boolean,
      default: false,
   },
   isTrending: {
      type: Boolean,
      required: true,
   },
});

export default mongoose.model('Show', showSchema);
