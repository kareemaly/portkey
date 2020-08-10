const config =
  process.env.NODE_ENV === "development"
    ? {
        SOCKET_IO_BASE_URL: process.env.REACT_APP_SOCKET_IO_BASE_URL,
        API_BASE_URL: process.env.REACT_APP_API_BASE_URL
      }
    : {
        SOCKET_IO_BASE_URL: window["PK_USER_CONFIG"]["socketIoBaseUrl"],
        API_BASE_URL: window["PK_USER_CONFIG"]["apiBaseUrl"]
      };

// validate configurations
const required = ["API_BASE_URL"];

required.forEach(r => {
  if (!config[r]) {
    throw new Error(`Config ["${r}"] is required`);
  }
});

export default config;
