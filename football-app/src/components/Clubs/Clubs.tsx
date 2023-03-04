import { useCallback, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import { useClubsSearch } from "../../hooks/useClubsSearch";
import ClubLabel from "../ClubLabel/ClubLabel";
import "./Clubs.css";

const Clubs = (): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const { loading, error, clubs, hasMore } = useClubsSearch(query, pageNumber);

  const observer = useRef<HTMLDivElement>(null) as any;
  const lastClubElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const searchHandler = (query: string) => {
    setQuery(query);
    setPageNumber(0);
  };

  return (
    <div id="clubs">
      <div id="queryLabel">
        <input value={query} onChange={(e) => searchHandler(e.target.value)} />
      </div>
      <div id="clubsList">
        {clubs.map((club, index) => {
          if (clubs.length != index + 1)
            return <ClubLabel key={index} club={club} />;
          else
            return (
              <ClubLabel key={index} club={club} ref={lastClubElementRef} />
            );
        })}
        {loading && (
          <PulseLoader color="rgb(0, 195, 255)" speedMultiplier={0.7} />
        )}
        {error && <div>Error</div>}
      </div>
    </div>
  );
};

export default Clubs;
