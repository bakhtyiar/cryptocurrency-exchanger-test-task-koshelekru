import {waitFor} from "./waitFor";

export function waitForOpenConnection(socket, options?: {attempts: number, intervalTime: number}): Promise<void> {
    return waitFor(() => socket.readyState === socket.OPEN, options)
}
