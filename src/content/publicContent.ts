import type { PublicContent } from '../types/content'
import { business } from './business'

// Owner-supplied recommendations and approved project photography only.
// The featured recommendation was supplied as a Facebook screenshot.
export const publicContent: PublicContent = {
  albums: [],
  reviews: [
    {
      id: 'clayton-ralston-insulation',
      author: 'Clayton Ralston',
      text: 'Adam and his team did an excellent job blowing in insulation into my home! The upstairs was around 82 degrees at noon and now everything is sitting around 74 degrees! From my family to yours Adam we genuinely thank you!',
      featured: true,
      source: 'facebook',
      // The business page is known; no individual post URL was supplied.
      sourceUrl: business.facebookUrl,
      published: true,
    },
  ],
}

// Marketing illustrations live in /images/marketing/, never in project albums.
