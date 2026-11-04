export type ServiceId =
  | 'custom-builds'
  | 'remodeling'
  | 'painting'
  | 'flooring'
  | 'handyman'
  | 'fascia'
  | 'soffit'
  | 'siding'
  | 'skid-steer'
  | 'other'

export interface ProjectPhoto {
  id: string
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface ProjectAlbum {
  id: string
  title: string
  service: ServiceId
  description: string
  location?: string
  published: boolean
  photos: ProjectPhoto[]
}

export interface Review {
  id: string
  author: string
  text: string
  rating?: 1 | 2 | 3 | 4 | 5
  city?: string
  featured?: boolean
  source?: 'facebook'
  sourceUrl?: string
  published: boolean
}

export interface PublicContent {
  albums: ProjectAlbum[]
  reviews: Review[]
}

export type ContactMethod = 'phone' | 'text' | 'email'

export interface EstimateDraft {
  name: string
  phone: string
  email: string
  contactMethod: ContactMethod
  location: string
  service: ServiceId | ''
  description: string
}
