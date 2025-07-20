import styled from 'styled-components';

export const ExampleButton = styled.button\`
  padding: \${({ theme }) => theme.spacing(1)};
  background-color: \${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
\`;