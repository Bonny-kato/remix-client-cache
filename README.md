# remix-client-cache

![beta-badge](https://img.shields.io/badge/version-Beta-orange)
![GitHub Repo stars](https://img.shields.io/github/stars/Bonny-kato/remix-client-cache?style=social)
![npm](https://img.shields.io/npm/v/@bonny-kato/remix-client-cache?style=plastic)
![GitHub](https://img.shields.io/github/license/Code-Forge-Net/remix-client-cache?style=plastic)
![npm](https://img.shields.io/npm/dy/@bonny-kato/remix-client-cache?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/Bonny-kato/remix-client-cache?style=plastic)

`remix-client-cache` is a powerful and lightweight library specifically designed for use
with [Remix.run](https://remix.run/). It provides an easy way to cache your server loader data on the client side.


## Motivation

This library is inspired by the [remix-client-cache](https://github.com/forge42dev/remix-client-cache) package. However,
we wanted to provide features that the original package lacked, such as in-background data fetching under various states
such as reconnect or window-focus, as well as better cache management.

## Install

```bash
npm i @bonny-kato/remix-client-cache
```

or

```bash
yarn add remix-client-cache
```

## Getting Started

After installation, you can import and use our module in your Remix.run project. Ensure your project setup meets the
prerequisites before starting to use our library.

## Features

1. Caching server loader data
2. Refetching on mount
3. Refetching on window focus
4. Refetching on reconnect
5. Garbage collection
6. Useful states like isLoading and isFetching
7. Simple API

## Basic Usage

```tsx
// root.tsx
import { CacheProvider } from "@bonny-kato/remix-client-cache";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // ...
    <body>
    {/* wrapp the app with  CacheProvider */}
    <CacheProvider>{children}</CacheProvider>
    <ScrollRestoration />
    <Scripts />
    </body>
    // ...

  );
}

```

```tsx
// users.ts
import { cacheClientLoader, useCachedLoaderData, } from "@bonny-kato/remix-client-cache";

export const loader = async () => {
  const users = getUsers()
  return defer({ users })
}


export const clientLoader = (args: ClientLoaderFunctionArgs) => cacheClientLoader(args);
clientLoader.hydrate = true;


const Users = () => {
  const {
    data: users,
    isFetching,
    isLoading,
    error
  } = useCachedLoaderData<{ users: User[] }>();

  return (
    <div>
      {error && "an error occured"}
      {isLoading ? "is loading" : <>
        {users?.users?.map((user) => <p>{user.name}</p>)}
        <hr />
        {isFetching && "is fetching"}
      </>}
    </div>
  );
};
export default Users;
```

## API Reference

### CacheProvider
CacheProvider is a React function component that manages cache cleanup operations. You should wrap your entire application with this component. It accepts two props;

1. children: The React nodes that this provider will
2. cleanupInterval: An optional interval duration (in milliseconds) for cleaning up the cache. If not provided, a default value (CLEANUP_INTERVAL `100000ms`) will be used.

### cacheClientLoader
Utility function use alongside with `clientLoader` to cache server loader data

### useCachedLoaderData
Customer hook to access cached data and invalidate cached data in different states like on `on mount`, `reconnect` and `on window focus`

## Support
If you like the project, please consider supporting us by giving a ⭐️ on GitHub.

## License

MIT

## Bugs

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/Bonny-kato/remix-client-cache/issues)


## Contributing

Thank you for considering contributing to remix-client-cache! We welcome any contributions, big or small, including bug reports, feature requests, documentation improvements, or code changes.

To get started, please fork this repository and make your changes in a new branch. Once you're ready to submit your changes, please open a pull request with a clear description of your changes and any related issues or pull requests.

Please note that all contributions are subject to our [Code of Conduct](https://github.com/Bonny-kato/remix-client-cache/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

We appreciate your time and effort in contributing to remix-client-cache and helping to make it a better tool for the community!
