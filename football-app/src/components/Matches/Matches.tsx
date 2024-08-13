import { useRef, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import MatchLabel from "../MatchLabel/MatchLabel";
import { useMatchesSearch } from "../../hooks/useMatchesSearch";
import { useLastElement } from "../../hooks/useLastElement";
import "./Matches.css";

const Matches = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const { loading, error, matches, hasMore } = useMatchesSearch(pageNumber);

  const observer = useRef<HTMLDivElement>(null) as any;
  const { lastElementRef } = useLastElement(
    loading,
    hasMore,
    observer,
    setPageNumber
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
              ref={lastElementRef}
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
