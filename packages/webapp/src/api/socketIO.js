import ioClient from "socket.io-client";
import config from "../config";

export default ioClient(config.SOCKET_IO_BASE_URL);
