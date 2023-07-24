import "./Map2D.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const Map2D = (): JSX.Element => {
  const [retrievedData, setRetrievedData] = useState<string>("");
  const params = window.location.pathname.split("/");

  useEffect(() => {
    const socket = io("localhost:5000");
    socket.connect();

    const handleConnect = () => {
      console.log(`Connected ${socket.id}`);
      socket.emit(`matches`, {
        matchID: params[params.length - 1],
      });
    };

    const handleMatchesData = (data: string) => {
      setRetrievedData(data);
      console.log(data);
    };

    const handleDisconnect = () => {
      console.log("Disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on(`matches/${params[params.length - 1]}`, handleMatchesData);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off(`matches/${params[params.length - 1]}`, handleMatchesData);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [params]);

  return (
    <div className="map2D">
      <div>MAP 2D</div>
      <div>{retrievedData}</div>
    </div>
  );
};

export default Map2D;
