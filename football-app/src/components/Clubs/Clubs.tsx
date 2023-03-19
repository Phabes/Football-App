import { useCallback, useRef, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { useClubsSearch } from "../../hooks/useClubsSearch";
import { Club } from "../../model/Club";
import { Match } from "../../model/Match";
import ClubLabel from "../ClubLabel/ClubLabel";
import MatchCreator from "../MatchCreator/MatchCreator";
import config from "../../config/Config";
import "./Clubs.css";

const Clubs = (): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [selectedTeams, setSelectedTeams] = useState<Array<Club>>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const { loading, error, clubs, hasMore } = useClubsSearch(query, pageNumber);
  const [warning, setWarning] = useState<string>("");

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
          homeTeam: prevSelecteTeams[0],
        };
        if (prevSelecteTeams.length == 2) match.awayTeam = prevSelecteTeams[1];
        setMatch(match);
      }
      return prevSelecteTeams;
    });
  };

  const playMatch = (match: Match) => {
    setWarning("");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match: match }),
    };
    fetch(config.url + "newMatch", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const { success } = data;
        if (success) {
          setSelectedTeams([]);
          setMatch(null);
        } else {
          setWarning("Team already plays");
        }
      })
      .catch((error: any) => {});
  };

  return (
    <div id="clubsFlow">
      {match != null && (
        <MatchCreator
          match={match}
          warning={warning}
          playMatchHandle={() => playMatch(match)}
        />
      )}
      <div id="clubs">
        <div id="queryLabel">
          <input
            value={query}
            placeholder="Search Club"
            autoFocus
            onBlur={(e) => {
              e.target.focus({
                preventScroll: true,
              });
            }}
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
                  clickHandle={() => selectClub(club)}
                />
              );
            else
              return (
                <ClubLabel
                  key={"club" + index}
                  club={club}
                  clickHandle={() => selectClub(club)}
                  ref={lastClubElementRef}
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
    </div>
  );
};

export default Clubs;
