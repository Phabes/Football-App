import { useCallback, useRef, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useMatchesSearch } from "../../hooks/useMatchesSearch";
import MatchLabel from "../MatchLabel/MatchLabel";
import "./Matches.css";

const Matches = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const { loading, error, matches, hasMore } = useMatchesSearch(pageNumber);

  const observer = useRef<HTMLDivElement>(null) as any;
  const lastMatchElementRef = useCallback(
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

  return (
    <div id="matches">
      {!loading && matches.length == 0 && (
        <div className="error">There are no matches</div>
      )}
      <div id="matchesList">
        {matches.map((match, index) => {
          return matches.length != index + 1 ? (
            <MatchLabel
              key={"match" + index}
              match={match}
              score={match.score}
              enableWatch={true}
            />
          ) : (
            <MatchLabel
              key={"match" + index}
              match={match}
              score={match.score}
              enableWatch={true}
              ref={lastMatchElementRef}
            />
          );
        })}
        {loading && (
          <div id="loader">
            <PulseLoader color="rgb(0, 195, 255)" speedMultiplier={0.7} />
          </div>
        )}
        {error && <div className="error">Error</div>}
      </div>
    </div>
  );
};

export default Matches;
