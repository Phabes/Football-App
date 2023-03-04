import { forwardRef } from "react";
import { Club } from "../../model/club";
import "./ClubLabel.css";

const ClubLabel = forwardRef(
  (props: { club: Club }, ref: React.Ref<HTMLDivElement>): JSX.Element => {
    const { id, name } = props.club;
    return (
      <div ref={ref} className="clubLabel">
        {name}
      </div>
    );
  }
);

export default ClubLabel;
