import { FetcherWithComponents, useFetcher } from "react-router";

export function useFetcherSumbit() {
  const fetcher = useFetcher();
  const { errors } =  fetcher.data || { errors: [] } as { errors: string[] };

  return {
    fetcher,
    busy: fetcher.state !== "idle",
    errors
  } as { errors: string[], busy: boolean, fetcher: FetcherWithComponents<any> }
}