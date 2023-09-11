import { forwardRef, Ref } from "react";
import { Link } from "react-router-dom";
import { Match } from "../../model/Match";
import "./MatchLabel.css";

const MatchLabel = forwardRef(
  (
    props: { match: Match; score: Array<number>; enableWatch: boolean },
    ref: Ref<HTMLDivElement>
  ): JSX.Element => {
    const { match, score, enableWatch } = props;

    return (
      <div ref={ref} className="matchLabel">
        <div className="matchFirstClubName">{match.homeTeam.name}</div>
        <div className="matchFirstClubScore">{score[0]}</div>
        <div className="versus">VS</div>
        <div className="matchSecondClubScore">{score[1]}</div>
        <div className="matchSecondClubName">{match.awayTeam?.name}</div>
        {enableWatch && (
          <Link to={`/matches/${match.id}`} className="watchMatch">
            Watch
          </Link>
        )}
      </div>
    );
  }
);

export default MatchLabel;
