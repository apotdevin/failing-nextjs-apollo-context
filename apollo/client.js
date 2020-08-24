import { useMemo } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { getContext } from './context'

let apolloClient

function createIsomorphLink(context = {}) {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema')
    const { schema } = require('./schema')
    const { getContext } = require('./context')
    return new SchemaLink({ schema, context: getContext(context) })
  } else {
    const { HttpLink } = require('@apollo/client/link/http')
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    })
  }
}

function createApolloClient(context) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(context),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null, context) {
  const _apolloClient = apolloClient ?? createApolloClient(context)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
