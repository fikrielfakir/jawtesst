export const restaurantCategories = [
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'japanese', name: 'Japanese', icon: '🍣' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'chinese', name: 'Chinese', icon: '🥟' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'american', name: 'American', icon: '🍔' },
  { id: 'french', name: 'French', icon: '🥐' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🥙' },
  { id: 'thai', name: 'Thai', icon: '🍜' },
  { id: 'korean', name: 'Korean', icon: '🍲' },
  { id: 'vegan', name: 'Vegan', icon: '🥗' },
  { id: 'seafood', name: 'Seafood', icon: '🦞' },
  { id: 'steakhouse', name: 'Steakhouse', icon: '🥩' },
  { id: 'cafe', name: 'Cafe', icon: '☕' },
  { id: 'dessert', name: 'Dessert', icon: '🍰' },
] as const;

export const priceRanges = [
  { id: '$', name: 'Budget', description: 'Under $15 per person' },
  { id: '$$', name: 'Moderate', description: '$15-30 per person' },
  { id: '$$$', name: 'Expensive', description: '$30-60 per person' },
  { id: '$$$$', name: 'Fine Dining', description: 'Over $60 per person' },
] as const;
