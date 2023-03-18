import { useEffect, useState } from "react";
import { Match } from "../model/Match";
import config from "../config/Config";

export const useMatchesSearch = (pageNumber: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(true);
  const [matches, setMatches] = useState<Array<Match>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = new AbortController();
  const signal = controller.signal;

  const getMatchesData = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageNumber: pageNumber }),
      signal: signal,
    };
    fetch(config.url + "matches", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMatches((prevMatches) => {
          return [...prevMatches, ...data.matches];
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
    const timeout = setTimeout(getMatchesData, 500);
    return () => clearTimeout(timeout);
  }, [pageNumber]);

  return { loading, error, matches, hasMore };
};
