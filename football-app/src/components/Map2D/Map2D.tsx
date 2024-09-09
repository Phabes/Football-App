import { useEffect, useRef, useState } from "react";
import PitchLines2D from "../PitchLines2D/PitchLines2D";
import PassLine2D from "../PassLine2D/PassLine2D";
import Ball2D from "../Ball2D/Ball2D";
import MatchLabel from "../MatchLabel/MatchLabel";
import { useMatchData } from "./hooks/useMatchData";
import { useMapDraw } from "./hooks/useMapDraw";
import { useResize } from "../../hooks/useResize";
import { useActionProgress } from "./hooks/useActionProgress";
import { getCalculations } from "./utils/getCalculations";
import live from "../../images/live.png";
import "./Map2D.css";

const Map2D = (): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState<number>(-1);
  const { width, height, ballSize, handleResize } = useResize(ref, ballRef);
  const { match, queue } = useMatchData();
  const { line, homeTeam, awayTeam } = useMapDraw(
    match,
    width,
    height,
    queue,
    action
  );
  const { tick, started } = useActionProgress(
    queue,
    action,
    setAction,
    line,
    handleResize
  );
  const { xStep, yStep } = getCalculations(line, queue, action);

  const backToLive = () => {
    const lifeAction = queue.length - 1;
    setAction(lifeAction);
  };

  const streamLive = action > queue.length - 5;

  return (
    <div className="map2D">
      <div className="mapContent">
        {match && (
          <MatchLabel
            match={match}
            score={started ? queue[action].score : match.score}
            enableWatch={false}
          />
        )}
        <div id="matchStream" style={{ height: height }}>
          <div ref={ref} id="homeTeam" className="halfField">
            {homeTeam}
          </div>
          <div id="awayTeam" className="halfField">
            {awayTeam}
          </div>
          {height > 0 && <PitchLines2D width={width} height={height} />}
          {started && <PassLine2D line={line} />}
          {started ? (
            <Ball2D
              ballRef={ballRef}
              posistion={{
                top: line.start.top + yStep * tick - ballSize / 2,
                left: line.start.left + xStep * tick - ballSize / 2,
              }}
            />
          ) : (
            <Ball2D
              ballRef={ballRef}
              posistion={{
                top: height / 2 - ballSize / 2,
                left: width - ballSize / 2,
              }}
            />
          )}
        </div>
        <div id="timeline">
          <div id="backToLive" onClick={backToLive}>
            <img
              src={live}
              alt="live"
              id="liveIMG"
              className={streamLive ? "" : "backToLiveIMG"}
            />
          </div>
          <div id="backToLiveInfo">
            {streamLive ? <>You are watching live</> : <>Back to live</>}
          </div>
        </div>
        <div id="matchInfo">
          <div>{JSON.stringify(queue[action])}</div>
        </div>
      </div>
    </div>
  );
};

export default Map2D;
