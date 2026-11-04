import { Quote, Star } from 'lucide-react'
import type { Review } from '../types/content'

export function Reviews({ reviews }: { reviews: Review[] }) {
  const published = reviews.filter(
    (review) => review.published && review.author.trim() && review.text.trim(),
  )
  if (!published.length) return null
  return (
    <section className="section container" id="reviews" aria-labelledby="reviews-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FROM OUR CUSTOMERS</p>
          <h2 id="reviews-heading">A few words from home.</h2>
        </div>
      </div>
      <div className="review-grid">
        {published.map((review) => (
          <figure className="review-card" key={review.id}>
            <Quote size={28} aria-hidden="true" />
            {review.rating && (
              <div className="review-rating" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }, (_, index) => (
                  <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
            )}
            <blockquote>{review.text}</blockquote>
            <figcaption>
              <strong>{review.author}</strong>
              {review.city && <span>{review.city}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
