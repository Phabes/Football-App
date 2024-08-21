import { useRef, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import ClubLabel from "../ClubLabel/ClubLabel";
import MatchCreator from "../MatchCreator/MatchCreator";
import { Club } from "../../model/Club";
import { useClubsSearch } from "../../hooks/useClubsSearch";
import { useInputFocus } from "../../hooks/useInputFocus";
import { useLastElement } from "../../hooks/useLastElement";
import { playMatch } from "../../utils/playMatch";
import "./Clubs.css";

const Clubs = (): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);
  const observer = useRef<HTMLDivElement>(null) as any;
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [selectedTeams, setSelectedTeams] = useState<Array<Club>>([]);
  const [warning, setWarning] = useState<string>("");

  useInputFocus(ref);
  const { loading, error, clubs, hasMore } = useClubsSearch(query, pageNumber);
  const { lastElementRef } = useLastElement(
    loading,
    hasMore,
    observer,
    setPageNumber
  );

  const match = {
    homeTeam: selectedTeams[0],
    awayTeam: selectedTeams.length == 2 ? selectedTeams[1] : undefined,
    score: [0, 0],
  };

  const searchHandler = (query: string) => {
    setQuery(query);
    setPageNumber(0);
  };

  const selectClub = (club: Club) => {
    setWarning("");
    setSelectedTeams((prevSelectedTeams) => {
      const selectedClubs: Club[] = [];
      if (prevSelectedTeams.length != 0) {
        selectedClubs.push(prevSelectedTeams.pop()!);
      }
      if (!selectedClubs.includes(club)) {
        selectedClubs.push(club);
      } else {
        if (prevSelectedTeams.length == 1) {
          selectedClubs.push(prevSelectedTeams.pop()!);
        }
      }
      return selectedClubs;
    });
  };

  const createMatch = () => {
    if (!match.awayTeam) {
      return;
    }

    setWarning("");
    const matchCreation = playMatch(match);
    matchCreation
      .then((data) => {
        const { success, message } = data;
        if (success) {
          setSelectedTeams([]);
        } else {
          setWarning(message);
        }
      })
      .catch((error: any) => {
        setWarning("Problems during creating match");
      });
  };

  return (
    <div id="clubsFlow">
      {selectedTeams.length != 0 && (
        <MatchCreator
          match={match}
          warning={warning}
          playMatchHandle={createMatch}
          switchClubs={selectClub}
        />
      )}
      <div id="clubs">
        <div id="queryLabel">
          <input
            ref={ref}
            value={query}
            placeholder="Search Club"
            onChange={(e) => searchHandler(e.target.value)}
          />
        </div>
        <div id="clubsList">
          {clubs.map((club, index) => {
            if (clubs.length != index + 1) {
              return (
                <ClubLabel
                  key={"club" + index}
                  club={club}
                  clickHandle={() => selectClub(club)}
                />
              );
            } else {
              return (
                <ClubLabel
                  key={"club" + index}
                  club={club}
                  clickHandle={() => selectClub(club)}
                  ref={lastElementRef}
                />
              );
            }
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
