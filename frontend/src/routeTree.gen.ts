/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SignInImport } from './routes/sign-in'
import { Route as MockImport } from './routes/mock'
import { Route as IndexImport } from './routes/index'
import { Route as OnboardingSetUsernameImport } from './routes/onboarding/set-username'
import { Route as OnboardingCreateOrJoinClanImport } from './routes/onboarding/create-or-join-clan'

// Create/Update Routes

const SignInRoute = SignInImport.update({
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const MockRoute = MockImport.update({
  path: '/mock',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const OnboardingSetUsernameRoute = OnboardingSetUsernameImport.update({
  path: '/onboarding/set-username',
  getParentRoute: () => rootRoute,
} as any)

const OnboardingCreateOrJoinClanRoute = OnboardingCreateOrJoinClanImport.update(
  {
    path: '/onboarding/create-or-join-clan',
    getParentRoute: () => rootRoute,
  } as any,
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/mock': {
      id: '/mock'
      path: '/mock'
      fullPath: '/mock'
      preLoaderRoute: typeof MockImport
      parentRoute: typeof rootRoute
    }
    '/sign-in': {
      id: '/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInImport
      parentRoute: typeof rootRoute
    }
    '/onboarding/create-or-join-clan': {
      id: '/onboarding/create-or-join-clan'
      path: '/onboarding/create-or-join-clan'
      fullPath: '/onboarding/create-or-join-clan'
      preLoaderRoute: typeof OnboardingCreateOrJoinClanImport
      parentRoute: typeof rootRoute
    }
    '/onboarding/set-username': {
      id: '/onboarding/set-username'
      path: '/onboarding/set-username'
      fullPath: '/onboarding/set-username'
      preLoaderRoute: typeof OnboardingSetUsernameImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  MockRoute,
  SignInRoute,
  OnboardingCreateOrJoinClanRoute,
  OnboardingSetUsernameRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/mock",
        "/sign-in",
        "/onboarding/create-or-join-clan",
        "/onboarding/set-username"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/mock": {
      "filePath": "mock.tsx"
    },
    "/sign-in": {
      "filePath": "sign-in.tsx"
    },
    "/onboarding/create-or-join-clan": {
      "filePath": "onboarding/create-or-join-clan.tsx"
    },
    "/onboarding/set-username": {
      "filePath": "onboarding/set-username.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
