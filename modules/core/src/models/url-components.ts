export interface URLComponents {
    /**
     * Does not include any trailing colon(:) from the protocol.
     * For example: https, http, ftp, etc.
     */
    protocol: string;
    /**
     * Contains host + port (if theres any).
     */
    host: string;
    origin: string;
}
