import React from "react";
import { useDispatch } from "react-redux";
import io from "../../api/socketIO";

export default function useDispatchIoEvents(events) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const handlers = events.map(event => {
      const handler = payload => dispatch({ type: event, payload });
      io.on(event, handler);
      return { event, handler };
    });
    return function cleanup() {
      handlers.forEach(({ event, handler }) => io.off(event, handler));
    };
  }, []);
}
