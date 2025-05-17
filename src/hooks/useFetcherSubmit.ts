import { FetcherWithComponents, useFetcher } from "react-router";

export function useFetcherSumbit() {
  const fetcher = useFetcher();
  const { errors, data } =  fetcher.data || { errors: [], data: null } as { errors: string[], data: any };

  return {
    fetcher,
    busy: fetcher.state !== "idle",
    errors,
    data
  } as { errors: string[], busy: boolean, fetcher: FetcherWithComponents<any>, data: any }
}