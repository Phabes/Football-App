import "./Ball2D.css";
import football from "../../images/football.png";
import { Point } from "../../model/Point";
import { RefObject } from "react";

const Ball2D = (props: {
  ballRef: RefObject<HTMLDivElement>;
  posistion: Point;
}): JSX.Element => {
  const { ballRef, posistion } = props;

  return (
    <div
      ref={ballRef}
      id="ball"
      style={{ top: posistion.top, left: posistion.left }}
    >
      <img src={football} alt="ball" id="ballIMG" />
    </div>
  );
};

export default Ball2D;
