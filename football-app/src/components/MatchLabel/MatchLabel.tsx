import { forwardRef, Ref } from "react";
import { Link } from "react-router-dom";
import { Match } from "../../model/Match";
import "./MatchLabel.css";

const MatchLabel = forwardRef(
  (props: { match: Match }, ref: Ref<HTMLDivElement>): JSX.Element => {
    const { match } = props;

    return (
      <div ref={ref} className="matchLabel">
        <div className="matchFirstClubName">{match.homeTeam.name}</div>
        <div className="versus">VS</div>
        <div className="matchSecondClubName">{match.awayTeam?.name}</div>
        <Link to={`/matches/${match.id}`} className="watchMatch">
          Watch
        </Link>
      </div>
    );
  }
);

export default MatchLabel;
