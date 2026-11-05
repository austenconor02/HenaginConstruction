import type { ServiceId } from '../types/content'

export interface Service {
  id: Exclude<ServiceId, 'other'>
  title: string
  description: string
  icon: 'house' | 'hammer' | 'paint' | 'floor' | 'wrench' | 'fascia' | 'soffit' | 'siding' | 'truck'
}

export const services: Service[] = [
  {
    id: 'custom-builds',
    title: 'Custom built-ins & storage',
    description:
      'Make room for your vision with shelving and fitted storage designed for your home.',
    icon: 'house',
  },
  {
    id: 'remodeling',
    title: 'Remodeling & renovations',
    description:
      'Rethink the spaces you use every day, from a single room to a bigger transformation.',
    icon: 'hammer',
  },
  {
    id: 'painting',
    title: 'Interior & exterior painting',
    description: 'A fresh perspective for your home, inside and out.',
    icon: 'paint',
  },
  {
    id: 'flooring',
    title: 'Flooring installation',
    description: 'Bring a new look and feel to the foundation of every room.',
    icon: 'floor',
  },
  {
    id: 'handyman',
    title: 'Handyman services',
    description: 'Get the repairs and smaller projects on your list moving.',
    icon: 'wrench',
  },
  {
    id: 'fascia',
    title: 'Fascia installation & repair',
    description: 'Refresh or repair the finishing boards along your roofline.',
    icon: 'fascia',
  },
  {
    id: 'soffit',
    title: 'Soffit installation & repair',
    description: 'Give the underside of your eaves the attention it needs.',
    icon: 'soffit',
  },
  {
    id: 'siding',
    title: 'Siding painting',
    description: 'A new finish to bring the outside of your home together.',
    icon: 'siding',
  },
  {
    id: 'skid-steer',
    title: 'Skid steer work',
    description: 'Tell us about your property work and site preparation needs.',
    icon: 'truck',
  },
]
