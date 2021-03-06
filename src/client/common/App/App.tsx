import React from 'react';
import {
  ChakraProvider,
  extendTheme,
  Container,
  Box,
  Text,
  Spacer,
  Switch as UISwitch
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
  useLocation
} from 'react-router-dom';
import { css } from '@emotion/css';

import { Logo } from 'client/common/images/Logo';

import RestApp from 'client/rest';
import GraphQLApp from 'client/graphql';
import { HomePage } from 'client/common/pages/HomePage/HomePage';

const link = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  },
  styles: {
    global: {
      body: {
        fontFamily: "'Lato', Arial, Helvetica, sans-serif"
      }
    }
  },
  components: {
    Container: {
      baseStyle: {
        maxW: '7xl'
      }
    }
  }
});

function AppSwitch(): React.ReactElement {
  const { module } = useParams<{ module: 'rest' | 'graphql' }>();
  const location = useLocation();
  const history = useHistory();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    history.push(
      location.pathname.replace(
        `/${module}/`,
        `/${e.target.checked ? 'graphql' : 'rest'}/`
      ) +
        location.search +
        location.hash
    );
  }

  return (
    <Box color="white" display="flex" alignItems="center">
      <Text marginInlineEnd="2">Rest</Text>
      <UISwitch
        colorScheme="blue"
        isChecked={module === 'graphql'}
        onChange={handleChange}
      />
      <Text marginInlineStart="2">GraphQL</Text>
    </Box>
  );
}

export function App(): React.ReactElement {
  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Container
          color="red.500"
          paddingBlock="4"
          display="flex"
          borderBottom="2px solid"
        >
          <Link className={link} to="/">
            <Logo size={30} />
            <Text
              as="span"
              fontSize="xl"
              marginInlineStart="2"
              fontWeight="bold"
            >
              Demo App
            </Text>
          </Link>
          <Spacer />
          <Box>
            <Route path="/:module(rest|graphql)">
              <AppSwitch />
            </Route>
          </Box>
        </Container>
        <Container paddingBlock="4">
          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
            <Route path="/:module(rest)">
              <RestApp />
            </Route>
            <Route path="/:module(graphql)">
              <GraphQLApp />
            </Route>
          </Switch>
        </Container>
      </ChakraProvider>
    </Router>
  );
}
