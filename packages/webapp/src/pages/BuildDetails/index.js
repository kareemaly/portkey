import React from "react";
import keys from "lodash/keys";
import { useParams } from "react-router-dom";
import buildEventHandlers from "./buildEventHandlers";
import io from "../../api/socketIO";

const BuildDetails = () => {
  const { buildId } = useParams();
  const [messages, setMessages] = React.useState({});

  React.useEffect(() => {
    const eventHandlers = buildEventHandlers(buildId, setMessages);
    keys(eventHandlers).forEach(action => io.on(action, eventHandlers[action]));
    return function cleanup() {
      keys(eventHandlers).forEach(action =>
        io.off(action, eventHandlers[action])
      );
    };
  }, []);

  return <div>BuildDetails Page</div>;
};

export default BuildDetails;
