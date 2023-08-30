import "./PitchLines.css";

import config from "../../config/Config";

const PitchLines = (props: { width: number; height: number }): JSX.Element => {
  const { width, height } = props;

  return (
    <svg id="pitchLines">
      <rect
        x={config.pitchLinesWidth / 2}
        y={config.pitchLinesWidth / 2}
        width={width * 2 - config.pitchLinesWidth}
        height={height - config.pitchLinesWidth}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></rect>
      <rect
        x={config.pitchLinesWidth / 2}
        y={height / 4}
        width={width / 6}
        height={height / 2}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></rect>
      <rect
        x={width * 2 - width / 6 - config.pitchLinesWidth / 2}
        y={height / 4}
        width={width / 6}
        height={height / 2}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></rect>
      <line
        x1={width}
        y1={0}
        x2={width}
        y2={height}
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></line>
      <circle
        cx={width}
        cy={height / 2}
        r={height / 4}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></circle>
      <circle
        cx={width}
        cy={height / 2}
        r={config.pitchLinesWidth}
        strokeWidth={config.pitchLinesWidth}
        fill="white"
        stroke="white"
      ></circle>
    </svg>
  );
};

export default PitchLines;
