import { Query } from '../types/types'

const searchFilters = (query: Query) => [
  {
    name: {
      $regex: query.name || '',
      $options: 'i',
    },
  },
  {
    variant: {
      $regex: query.variant || '',
      $options: 'i',
    },
  },
  {
    size: {
      $regex: query.size || '',
      $options: 'i',
    },
  },
  {
    categories: {
      $regex: query.category || '',
      $options: 'i',
    },
  },
]

export default searchFilters