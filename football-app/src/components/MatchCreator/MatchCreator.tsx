import { Club } from "../../model/Club";
import { Match } from "../../model/Match";
import change from "../../images/change.png";
import "./MatchCreator.css";

const matchCreator = (props: {
  match: Match;
  warning: string;
  playMatchHandle: () => void;
  switchClubs: (club: Club) => void;
}): JSX.Element => {
  const { homeTeam, awayTeam } = props.match;
  const { warning, playMatchHandle, switchClubs } = props;

  return (
    <div className="matchOverflow">
      <div className="match">
        <div className="matchCreator">Match Creator</div>
        <div className="sides">
          <div className="teams">
            <div className="team">
              <div className="teamSituation">HOME: </div>
              <div className="teamName">{homeTeam.name}</div>
            </div>
            {awayTeam && (
              <>
                <div className="team">
                  <div className="teamSituation">AWAY: </div>
                  <div className="teamName">{awayTeam.name}</div>
                </div>
              </>
            )}
          </div>
          {awayTeam && (
            <div id="change" onClick={() => switchClubs(awayTeam)}>
              <img src={change} alt="change" id="changeIMG" />
            </div>
          )}
        </div>
        {awayTeam && (
          <>
            <div className="warning">{warning}</div>
            <div className="playMatch" onClick={() => playMatchHandle()}>
              PLAY
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default matchCreator;
