import { useEffect, useState } from "react";
import { Club } from "../model/Club";
import config from "../config/Config";

export const useClubsSearch = (query: string, pageNumber: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(true);
  const [clubs, setClubs] = useState<Array<Club>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    setClubs([]);
  }, [query]);

  const getClubsData = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query, pageNumber: pageNumber }),
      signal: signal,
    };
    fetch(config.url + "clubs", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setClubs((prevClubs) => {
          return [...prevClubs, ...data.clubs];
        });
        setHasMore(data.hasMore);
        setLoading(false);
      })
      .catch((error: any) => setError(true));
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    const timeout = setTimeout(getClubsData, 500);
    return () => clearTimeout(timeout);
  }, [query, pageNumber]);

  return { loading, error, clubs, hasMore };
};
