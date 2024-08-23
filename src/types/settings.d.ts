export type Settings = {
    version: number
    storageSpace: number
    username: string | null
    sentry: boolean
    advanced: { rpcPort: number; udpPort: number; tcpPort: number }
}