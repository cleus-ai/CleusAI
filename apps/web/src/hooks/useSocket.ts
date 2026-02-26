import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
export function useSocket(namespace = "/") {
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}${namespace}`, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, [namespace]);
  return socketRef.current;
}
