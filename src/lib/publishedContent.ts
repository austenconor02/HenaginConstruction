import type { PublicContent } from '../types/content'

export function publishedContent(content: PublicContent): PublicContent {
  return {
    albums: content.albums.filter((album) => album.published && album.photos.length > 0),
    reviews: content.reviews.filter(
      (review) => review.published && review.author.trim() && review.text.trim(),
    ),
  }
}
