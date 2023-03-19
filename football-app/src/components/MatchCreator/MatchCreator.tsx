import { Match } from "../../model/Match";
import "./MatchCreator.css";

const matchCreator = (props: {
  match: Match;
  warning: string;
  playMatchHandle: Function;
}): JSX.Element => {
  const { homeTeam, awayTeam } = props.match;
  const { warning } = props;

  return (
    <div className="matchOverflow">
      <div className="match">
        <div className="matchCreator">Match Creator</div>
        <div className="team">
          <div className="teamSituation">HOME: </div>
          <div className="teamName">{homeTeam.name}</div>
        </div>
        {awayTeam != undefined && (
          <>
            <div className="team">
              <div className="teamSituation">AWAY: </div>
              <div className="teamName">{awayTeam.name}</div>
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

export default matchCreator;
