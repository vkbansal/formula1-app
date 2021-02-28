import React from 'react';
import { Container } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/css';

const link = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10rem;
  border: 1px solid currentColor;
  border-radius: 0.5rem;
  font-size: 2rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export function HomePage(): React.ReactElement {
  return (
    <Container
      paddingBlockStart="8"
      display="grid"
      gridTemplateColumns="1fr 1fr"
      gridColumnGap="8"
      color="red.500"
    >
      <Link className={link} to="/rest">
        Rest Application
      </Link>
      <Link className={link} to="/graphql">
        GraphQL Application
      </Link>
    </Container>
  );
}
