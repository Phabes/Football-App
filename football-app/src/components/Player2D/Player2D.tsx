import "./Player2D.css";
import config from "../../config/Config";
import football from "../../images/football.png";

const Player2D = (props: {
  left: number;
  top: number;
  total: number;
  hasBall: boolean;
  colors: {
    mainColor: string;
    secondaryColor: string;
  };
  scale: number;
}): JSX.Element => {
  const { left, top, total, hasBall, colors, scale } = props;

  return (
    <div
      className="player2D"
      style={{
        width: config.player2dSize * scale + "px",
        height: config.player2dSize * scale + "px",
        top: top + "px",
        left: left + "px",
      }}
    >
      <div className="shirt">
        <div className="pattern">
          <div
            className="strip"
            style={{ backgroundColor: colors.mainColor }}
          ></div>
          <div
            className="strip"
            style={{ backgroundColor: colors.secondaryColor }}
          ></div>
          <div
            className="strip"
            style={{ backgroundColor: colors.mainColor }}
          ></div>
          <div
            className="strip"
            style={{ backgroundColor: colors.secondaryColor }}
          ></div>
          <div
            className="strip"
            style={{ backgroundColor: colors.mainColor }}
          ></div>
        </div>
        <div className="playerInfo">
          <div className="playerName">
            <div className="playerNamePlaceholder">Name</div>
          </div>
          <div className="playerNumber">{total}</div>
          <div className="ball">
            {hasBall ? (
              <img src={football} alt="ball" className="ball" />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player2D;
