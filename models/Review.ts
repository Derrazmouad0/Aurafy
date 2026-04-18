import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  userEmail: String,
  userName: String,
  userImage: String,
  mediaId: String,
  rating: Number,
  comment: String
}, { timestamps: true });

const Review = models.Review || model("Review", ReviewSchema);
export default Review;