export const theme = {
  colors: {
    primary: '#2d6cdf',
    secondary: '#f4f4f4',
    text: '#333',
  },
spacing: (factor: number) => factor * 8 + 'px',
};

export type ThemeType = typeof theme;