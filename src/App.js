import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink  } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter } from 'react-router-dom'
import { setContext } from 'apollo-link-context'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'


const httpLink = new HttpLink({
  uri: 'http://localhost:8000/'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8000/graphql/`,
  options: {
    reconnect: true
  }
});


const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);


const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

function App() {
  return (
    <BrowserRouter>
    <ApolloProvider client={client}>
      App
    </ApolloProvider>
  </BrowserRouter>
  );
}

export default App;