import { RefObject, useEffect } from "react";

export const useInputFocus = (ref: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        ref.current.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
};
