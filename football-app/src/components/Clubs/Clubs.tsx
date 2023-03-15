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
  const [selectedTeams, setSelectedTeams] = useState<Array<Club>>([]);
  const [match, setMatch] = useState<Match | null>(null);
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

  const selectClub = (club: Club) => {
    setSelectedTeams((prevSelecteTeams) => {
      if (prevSelecteTeams.length == 2) prevSelecteTeams.shift();
      if (!prevSelecteTeams.includes(club)) {
        prevSelecteTeams.push(club);
        const match: Match = {
          firstTeam: prevSelecteTeams[0],
        };
        if (prevSelecteTeams.length == 2)
          match.secondTeam = prevSelecteTeams[1];
        setMatch(match);
      }
      return prevSelecteTeams;
    });
  };

  const playMatch = (match: Match) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match: match }),
    };
    fetch("http://localhost:5000/addMatch", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const { success } = data;
        if (success) {
          setSelectedTeams([]);
          setMatch(null);
        }
      })
      .catch((error: any) => {});
  };

  return (
    <div id="clubsFlow">
      {match != null && (
        <MatchLabel match={match} playMatchHandle={() => playMatch(match)} />
      )}
      <div id="clubs">
        {!loading && (
          <div id="queryLabel">
            <input
              value={query}
              placeholder="Search Club"
              onChange={(e) => searchHandler(e.target.value)}
            />
          </div>
        )}
        <div id="clubsList">
          {clubs.map((club, index) => {
            if (clubs.length != index + 1)
              return (
                <ClubLabel
                  key={"club" + index}
                  club={club}
                  clickHandle={() => selectClub(club)}
                />
              );
            else
              return (
                <ClubLabel
                  key={index}
                  club={club}
                  clickHandle={() => selectClub(club)}
                  ref={lastClubElementRef}
                />
              );
          })}
          {loading && (
            <PulseLoader color="rgb(0, 195, 255)" speedMultiplier={0.7} />
          )}
          {error && <div className="error">Error</div>}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
