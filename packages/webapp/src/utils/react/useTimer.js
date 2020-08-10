import React from "react";
export default function useTimer(every = 1000) {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, every);
    return function cleanup() {
      clearInterval(id);
    };
  }, []);
}
