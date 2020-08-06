import React from "react";
import client from "./client";

const useApiRequest = (requestDetails, { lazy } = {}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [data, setData] = React.useState(null);

  const call = React.useCallback(
    extraDetails => {
      setIsLoading(true);
      client
        .request({
          ...requestDetails,
          ...extraDetails
        })
        .then(response => {
          setData(response.data.data);
          setIsLoading(false);
          setIsSuccess(true);
        })
        .catch(err => {
          setIsLoading(false);
          if (err.response) {
            setError({
              message: err.message,
              status: err.response.status,
              data: err.response.data
            });
          } else {
            setError(err);
          }
        });
    },
    [requestDetails]
  );

  React.useEffect(() => {
    if (!lazy) {
      call();
    }
  }, []);

  return {
    isLoading,
    error,
    isSuccess,
    data,
    call
  };
};

export default useApiRequest;
