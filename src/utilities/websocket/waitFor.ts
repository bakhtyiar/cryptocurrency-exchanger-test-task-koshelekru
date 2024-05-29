export function waitFor(func: () => boolean, options?: {attempts: number, intervalTime: number}): Promise<void> {
    return new Promise((resolve, reject) => {
        const attempts = options?.attempts ?? 10;
        const intervalTime = options?.intervalTime ?? 300; //ms

        let currentAttempt = 0
        const interval = setInterval(() => {
            if (func()) {
                clearInterval(interval)
                resolve()
            }
            if (currentAttempt > attempts - 1) {
                clearInterval(interval)
                reject(new Error('Maximum number of attempts exceeded'))
            }
            currentAttempt++
        }, intervalTime)
    })
}
