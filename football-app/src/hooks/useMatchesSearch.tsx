import { useEffect, useState } from "react";
import { Match } from "../model/Match";

export const useMatchesSearch = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(true);
  const [matches, setMatches] = useState<Array<Match>>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    getMatchesData();
  }, []);

  const getMatchesData = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: signal,
    };
    fetch("http://localhost:5000/match", requestOptions)
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

  return { loading, error, matches, hasMore };
};
