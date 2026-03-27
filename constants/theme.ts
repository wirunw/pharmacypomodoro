export const Theme = {
  colors: {
    background: '#F0F8FF', // Calming blue background
    primary: '#FF6B35', // Vibrant orange for active elements
    success: '#4CB944', // Fresh green for completed tasks/breaks
    danger: '#E63946', // Distinct red for Interruptions / Serve Customer
    text: '#2B2D42', // Dark slate for readable text
    textLight: '#8D99AE', // Muted text for secondary info
    white: '#FFFFFF',
    border: '#E0E7EE', // Soft border color
    // Category colors
    categoryClinical: '#3A86FF',
    categoryInventory: '#E0A96D',
    categoryAdmin: '#8338EC',
    categoryRPA: '#FFBE0B',
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: 'System', // Standard modern sans-serif
    sizes: {
      small: 12,
      body: 16,
      h3: 20,
      h2: 24,
      h1: 32,
      display: 64, // For the main timer
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      bold: '700' as const,
    },
  },
  borderRadius: {
    small: 4,
    medium: 12,
    large: 20,
    round: 9999,
  },
};
