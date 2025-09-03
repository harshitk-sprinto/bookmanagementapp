import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewer: String,
    comment: String,
    rating: { type: Number, min: 0, max: 5 },
  },
  { timestamps: true, _id: false }
);

const bookMetaSchema = new mongoose.Schema(
  {
    bookId: { type: Number, index: true, required: true },
    averageRating: { type: Number, min: 0, max: 5 },
    reviews: [reviewSchema],
  },
  { timestamps: true, collection: "book_meta" }
);

const authorMetaSchema = new mongoose.Schema(
  {
    authorId: { type: Number, index: true, required: true },
    averageRating: { type: Number, min: 0, max: 5 },
    reviews: [reviewSchema],
  },
  { timestamps: true, collection: "author_meta" }
);

export const BookMeta = mongoose.model("BookMeta", bookMetaSchema);
export const AuthorMeta = mongoose.model("AuthorMeta", authorMetaSchema);
