import "./Slider.css";

const Slider = (props: {
  totalActions: number;
  currentAction: number;
  onChange: (value: number) => void;
}): JSX.Element => {
  const { totalActions, currentAction, onChange } = props;

  return (
    <div id="sliderContainer">
      <input
        type="range"
        min="0"
        max={totalActions - 1}
        value={currentAction}
        onChange={(e) => onChange(Number(e.target.value))}
        id="slider"
      />
    </div>
  );
};

export default Slider;
