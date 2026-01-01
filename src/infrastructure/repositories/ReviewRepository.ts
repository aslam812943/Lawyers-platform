import { IReviewRepository } from "../../domain/repositories/IReviewRepository";
import { Review } from "../../domain/entities/Review";
import { ReviewModel } from "../db/models/ReviewModel";

export class ReviewRepository implements IReviewRepository {
    async addReview(review: Review): Promise<Review> {
       
       
        const newReview = new ReviewModel(review);
       
        const savedReview = await newReview.save();
        

        return new Review(
            savedReview.userId.toString(),
            savedReview.lawyerId.toString(),
            savedReview.rating,
            savedReview.comment,
            savedReview.createdAt,
            (savedReview as any)._id.toString()
        );
         
    }
}
