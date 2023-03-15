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
        <div className="addTeam" onClick={() => props.clickHandle()}>
          Add Team
        </div>
      </div>
    );
  }
);

export default ClubLabel;
