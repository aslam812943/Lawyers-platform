import { Review } from "../entities/Review";

export interface IReviewRepository {
    addReview(review: Review): Promise<Review>;
}
