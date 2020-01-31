export interface Signature {
    message: string,
    messageHash: string,
    signature: string,
    r: string,
    v: string,
    s: string
}

export interface ISignedRequest {
    signature?: Signature
}
