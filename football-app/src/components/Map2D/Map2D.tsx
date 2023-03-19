import "./Map2D.css";

const map2D = (): JSX.Element => {
  const params = window.location.pathname.split("/");
  console.log(params[2]);

  return <div className="map2D">MAP 2D</div>;
};

export default map2D;
