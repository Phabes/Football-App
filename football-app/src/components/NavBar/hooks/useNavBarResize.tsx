import { useEffect, useState } from "react";

export const useNavBarResize = () => {
  const [active, setActive] = useState<boolean>(false);

  const windowResizeHandler = () => {
    if (window.innerWidth > 800) {
      setActive(true);
      return;
    }
    setActive(false);
  };

  useEffect(() => {
    windowResizeHandler();
    window.addEventListener("resize", windowResizeHandler);

    return () => window.removeEventListener("resize", windowResizeHandler);
  }, []);

  return { active, setActive, windowResizeHandler };
};
