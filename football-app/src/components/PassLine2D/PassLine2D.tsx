import config from "../../config/Config";
import { Line } from "../../model/Line";
import "./PassLine2D.css";

const PassLine2D = (props: { line: Line }): JSX.Element => {
  const { line } = props;

  return (
    <svg id="passLine">
      <line
        x1={line.start.left}
        y1={line.start.top}
        x2={line.end.left}
        y2={line.end.top}
        stroke="black"
        strokeWidth={config.pitchLinesWidth}
      ></line>
    </svg>
  );
};

export default PassLine2D;
