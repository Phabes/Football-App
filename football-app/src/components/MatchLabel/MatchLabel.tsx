import { Club } from "../../model/Club";
import { Match } from "../../model/Match";

const MatchLabel = (props: {
  match: Match;
  clickHandle: Function;
}): JSX.Element => {
  const { firstTeam } = props.match;
  return (
    <div>
      <div>{firstTeam.name}</div>
      <div onClick={() => props.clickHandle()}>PLAY</div>
    </div>
  );
};

export default MatchLabel;
