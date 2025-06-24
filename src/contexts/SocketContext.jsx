import { createContext, useContext } from "react";

export const SocketContext = createContext({ socket: null, playSound: () => {} });

export const useSocket = () => useContext(SocketContext);

