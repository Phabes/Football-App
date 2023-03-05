import { useCallback, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import { useClubsSearch } from "../../hooks/useClubsSearch";
import { Club } from "../../model/Club";
import { Match } from "../../model/Match";
import ClubLabel from "../ClubLabel/ClubLabel";
import MatchLabel from "../MatchLabel/MatchLabel";
import "./Clubs.css";

const Clubs = (): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [team, setTeam] = useState<Club | null>(null);
  const [matches, setMatches] = useState<Array<Match>>([]);
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
    setTeam(null);
  };

  const getNotFullMatches = (club: Club) => {
    setTeam(club);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("http://localhost:5000/getNotFullMatches", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setMatches(data.matches);
      })
      .catch((error: any) => {});
  };

  const opponentChoosed = (match: Match) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchID: match.matchID, opponentID: team?.id }),
    };
    fetch("http://localhost:5000/setOpponent", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMatches([]);
      })
      .catch((error: any) => {})
      .finally(() => setTeam(null));
  };

  return (
    <div id="clubs">
      {matches.length > 0 &&
        matches.map((match, index) => {
          return (
            <MatchLabel
              key={"match" + index}
              match={match}
              clickHandle={() => opponentChoosed(match)}
            />
          );
        })}
      <div id="queryLabel">
        <input
          value={query}
          placeholder="Search Club"
          onChange={(e) => searchHandler(e.target.value)}
        />
      </div>
      <div id="clubsList">
        {clubs.map((club, index) => {
          if (clubs.length != index + 1)
            return (
              <ClubLabel
                key={"club" + index}
                club={club}
                clickHandle={() => getNotFullMatches(club)}
              />
            );
          else
            return (
              <ClubLabel
                key={index}
                club={club}
                clickHandle={() => getNotFullMatches(club)}
                ref={lastClubElementRef}
              />
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
