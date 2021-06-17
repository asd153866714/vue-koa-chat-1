import { io } from "socket.io-client";
const socket = io.connect(process.env.VUE_APP_API);
console.log("process.env:", process.env);
export default socket;
