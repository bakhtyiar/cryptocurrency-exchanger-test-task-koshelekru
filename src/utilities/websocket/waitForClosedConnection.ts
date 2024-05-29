import {waitFor} from "./waitFor";

export function waitForClosedConnection(socket, options?: {attempts: number, intervalTime: number}): Promise<void> {
    return waitFor(() => socket.readyState === socket.CLOSED, options)
}
