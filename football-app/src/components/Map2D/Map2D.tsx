import { useRef, useState } from "react";
import PitchLines2D from "../PitchLines2D/PitchLines2D";
import PassLine2D from "../PassLine2D/PassLine2D";
import Ball2D from "../Ball2D/Ball2D";
import MatchLabel from "../MatchLabel/MatchLabel";
import Slider from "../Slider/Slider";
import PulseLoader from "react-spinners/PulseLoader";
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
  const { width, height, ballSize, handleResize } = useResize(ref, ballRef);
  const { match, queue, totalNumberOfActions, action, setAction, getAction } =
    useMatchData();
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
  const { xStep, yStep } = getCalculations(started, line, queue, action);

  const streamLive =
    started && queue[action]
      ? totalNumberOfActions - (queue[action].index + 1) <= 5
      : false;

  return (
    <div className="map2D">
      <div className="mapContent">
        {!match && (
          <div id="loader">
            <PulseLoader color="rgb(0, 195, 255)" speedMultiplier={0.7} />
          </div>
        )}
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
        {match && (
          <>
            <div id="timeline">
              <div id="liveInfo">
                <div
                  id="backToLive"
                  onClick={() => getAction(totalNumberOfActions - 1)}
                >
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
              <Slider
                totalActions={totalNumberOfActions - 1}
                currentAction={
                  started
                    ? Math.min(queue[action].index, totalNumberOfActions - 1)
                    : 0
                }
                onChange={getAction}
              />
            </div>
            <div id="matchInfo">
              <div>{JSON.stringify(queue[action])}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Map2D;
