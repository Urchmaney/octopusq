import { useEffect, useState } from "react";
import { Rect } from "../core";

export function useWindowDimension() {
  const { innerWidth: width, innerHeight: height } = window;
  const [windowDimensions, setWindowDimensions] = useState<Rect>(new Rect(0, 0, width, height));

  useEffect(() => {
    function handleResize(_: Event) {
      setWindowDimensions(new Rect(0, 0, window.innerWidth, window.innerHeight));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  })

  return windowDimensions;
}
