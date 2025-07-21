import styled from 'styled-components';

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

export const SearchInput = styled.input`
  width: 300px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
`;

export const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2f7a2f;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1f5a1f;
  }
`;