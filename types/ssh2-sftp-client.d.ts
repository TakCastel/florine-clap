declare module 'ssh2-sftp-client' {
  export interface SFTPFile {
    name: string
    size: number
    accessTime: number
    modifyTime: number
    rights?: string
    owner?: number
    group?: number
    isDirectory?: boolean
    type?: string
  }

  export interface ConnectOptions {
    host: string
    port?: number
    username: string
    password?: string
    privateKey?: string | Buffer
    passphrase?: string
  }

  export default class SftpClient {
    connect(options: ConnectOptions): Promise<void>
    list(path: string): Promise<SFTPFile[]>
    mkdir(path: string, recursive?: boolean): Promise<void>
    exists(path: string): Promise<false | 'd' | '-'>
    delete(path: string): Promise<void>
    put(
      input: string | Buffer | NodeJS.ReadableStream,
      remotePath: string
    ): Promise<void>
    end(): Promise<void>
  }
}

