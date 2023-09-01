import "./PitchLines2D.css";

import config from "../../config/Config";

const PitchLines2D = (props: {
  width: number;
  height: number;
}): JSX.Element => {
  const { width, height } = props;
  const cornerLineSize = height / 16;
  const leftTopCorner = `M 0 ${cornerLineSize} A 45 45, 0, 0, 0, ${cornerLineSize} 0`;
  const rightTopCorner = `M ${width * 2 - cornerLineSize} 0 A 45 45, 0, 0, 0, ${
    width * 2
  } ${cornerLineSize}`;
  const rightBottomCorner = `M ${width * 2} ${
    height - cornerLineSize
  } A 45 45, 0, 0, 0, ${width * 2 - cornerLineSize} ${height}`;
  const leftBottomCorner = `M ${cornerLineSize} ${height} A 45 45, 0, 0, 0, 0 ${
    height - cornerLineSize
  }`;

  return (
    <svg id="pitchLines">
      {/* sideline */}
      <rect
        x={config.pitchLinesWidth / 2}
        y={config.pitchLinesWidth / 2}
        width={width * 2 - config.pitchLinesWidth}
        height={height - config.pitchLinesWidth}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></rect>
      {/* home team panalty box */}
      <rect
        x={config.pitchLinesWidth / 2}
        y={height / 4}
        width={width / 4}
        height={height / 2}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></rect>
      {/* away team panalty box */}
      <rect
        x={width * 2 - width / 4 - config.pitchLinesWidth / 2}
        y={height / 4}
        width={width / 4}
        height={height / 2}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></rect>
      {/* center line */}
      <line
        x1={width}
        y1={0}
        x2={width}
        y2={height}
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></line>
      {/* main circle */}
      <circle
        cx={width}
        cy={height / 2}
        r={height / 4}
        fill="none"
        strokeWidth={config.pitchLinesWidth}
        stroke="white"
      ></circle>
      {/* ball circle */}
      <circle
        cx={width}
        cy={height / 2}
        r={config.pitchLinesWidth}
        strokeWidth={config.pitchLinesWidth}
        fill="white"
        stroke="white"
      ></circle>
      {/* left top corner */}
      <path
        d={leftTopCorner}
        strokeWidth={config.pitchLinesWidth}
        fill="none"
        stroke="white"
      />
      {/* right top corner */}
      <path
        d={rightTopCorner}
        strokeWidth={config.pitchLinesWidth}
        fill="none"
        stroke="white"
      />
      {/* right bottom corner */}
      <path
        d={rightBottomCorner}
        strokeWidth={config.pitchLinesWidth}
        fill="none"
        stroke="white"
      />
      {/* left bottom corner */}
      <path
        d={leftBottomCorner}
        strokeWidth={config.pitchLinesWidth}
        fill="none"
        stroke="white"
      />
    </svg>
  );
};

export default PitchLines2D;
