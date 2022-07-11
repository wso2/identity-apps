# Data Fetching

## Overview

Recently we migrated to [SWR](https://swr.vercel.app/) which is based on the [HTTP RFC 5861](https://datatracker.ietf.org/doc/html/rfc5861) spec.

With SWR, components will get a stream of data updates constantly and automatically.
And the UI will be always fast and reactive.

> 💡 IMPORTANT: Any new features or major refactorings should adopt the SWR strategy when invoking external data sources.

## API

### useRequest

`useRequest` is a custom hook which wraps the [`useSWR`](https://swr.vercel.app/docs/options) hook provided by the library.

> 💡 The main reason for writing a wrapper is to move the `fetcher` to a common place for easy maintainance. And also, we are using an `Axios Instance` provided by the [@asgardeo/auth-react](https://github.com/asgardeo/asgardeo-auth-react-sdk#httprequest) which uses request objects to invoke APIs though Axios, hence additional boilerplate code should be written to plug this as the fetcher. By writing a custom hook, we can abstract out that additional complexity from the usage.

```ts
const requestConfig = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    method: HttpMethods.GET,
    params: {
        filter,
        limit,
        offset
    },
    url: store.getState().config.endpoints.applications
};

const { data, error } = useRequest<ApplicationListInterface, AxiosError>(requestConfig);
```

## Examples

### Before

### API Function

```ts
const getApplications = () => {
  const requestConfig = {
      headers: {
          "Accept": "application/json",
          "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
          "Content-Type": "application/json"
      },
      method: HttpMethods.GET,
      params: {
          filter,
          limit,
          offset
      },
      url: store.getState().config.endpoints.applications
  };

  return httpClient(requestConfig)
      .then((response) => {
          if (response.status !== 200) {
              return Promise.reject(new Error("Failed to get application list from: "));
          }

          return Promise.resolve(response.data as ApplicationListInterface);
      }).catch((error) => {
          return Promise.reject(error);
      });
};
```

### Component

```tsx

const ApplicationsList = () => {

  const [ applicationsList, setApplicationsList ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    getApplications()
      .then((response) => {
        setApplicationsList(response);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {
        data.map((item) => {
          // render items
        })
      }
    </div>
  )
};

```

### After

### Custom Hook

```ts
export function useApplicationList<Data = ApplicationListInterface, Error = AxiosError>(): {
    error: AxiosError;
    isLoading: boolean;
    applicationsList: ApplicationListInterface;
} {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.applications
    };

    const { data, error } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error,
        isLoading: !error && !data
    };
}
```

### Component

```tsx
const ApplicationsList = () => {

  const {
      data,
      isLoading,
      error
  } = useApplicationList();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {
        data.map((item) => {
          // render items
        })
      }
    </div>
  )
};

```
