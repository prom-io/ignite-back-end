export interface EthereumSignature {
    message: string,
    messageHash: string,
    signature: string,
    r: string,
    v: string,
    s: string
}
