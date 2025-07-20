import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #f0f8f0;
    font-family: 'Segoe UI', sans-serif;
  }
`;
