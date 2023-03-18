import { forwardRef, Ref } from "react";
import { Match } from "../../model/Match";
import "./MatchLabel.css";

const MatchLabel = forwardRef(
  (
    props: { match: Match; clickHandle: Function },
    ref: Ref<HTMLDivElement>
  ): JSX.Element => {
    const { match } = props;
    return (
      <div ref={ref} className="matchLabel">
        <div className="matchFirstClubName">{match.firstTeam.name}</div>
        <div className="versus">VS</div>
        <div className="matchSecondClubName">{match.secondTeam?.name}</div>
        <div className="watchMatch" onClick={() => props.clickHandle()}>
          Watch
        </div>
      </div>
    );
  }
);

export default MatchLabel;
