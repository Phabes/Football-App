import { Match } from "../../model/Match";
import "./MatchLabel.css";

const MatchLabel = (props: {
  match: Match;
  playMatchHandle: Function;
}): JSX.Element => {
  const { firstTeam, secondTeam } = props.match;
  return (
    <div className="matchOverflow">
      <div className="match">
        <div className="matchCreator">Match Creator</div>
        <div className="team">
          <div className="teamSituation">HOME: </div>
          <div className="teamName">{firstTeam.name}</div>
        </div>
        {secondTeam != undefined && (
          <>
            <div className="team">
              <div className="teamSituation">AWAY: </div>
              <div className="teamName">{secondTeam.name}</div>
            </div>
            <div className="playMatch" onClick={() => props.playMatchHandle()}>
              PLAY
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchLabel;
