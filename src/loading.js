import React from 'react';
import styled from '@emotion/styled';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #282c34;
  color: white;
  flex-direction: column;

`;

const LoadingText = styled.h1`
  font-family: 'Sacramento', cursive;
  font-size: 3rem;
  font-weight: 500;
`;

const LoadingPage = ({ visible }) => {
  return (
    <LoadingContainer visible={visible}>
      <LoadingText>Pretty Skin</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingPage;