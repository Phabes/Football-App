import { forwardRef, useState } from "react";
import { Club } from "../../model/Club";
import "./ClubLabel.css";

const ClubLabel = forwardRef(
  (
    props: { club: Club; clickHandle: Function },
    ref: React.Ref<HTMLDivElement>
  ): JSX.Element => {
    const { id, name } = props.club;
    return (
      <div ref={ref} className="clubLabel">
        <div className="clubName">{name}</div>
        <div className="addMatch" onClick={() => props.clickHandle()}>
          Add To Existing Match
        </div>
        <div
          className="addMatch"
          onClick={() => {
            const requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: id }),
            };
            fetch("http://localhost:5000/addMatch", requestOptions)
              .then((response) => response.json())
              .then((data) => {})
              .catch((error: any) => {});
          }}
        >
          Create New Match
        </div>
      </div>
    );
  }
);

export default ClubLabel;
