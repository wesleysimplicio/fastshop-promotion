export interface HttpError {
    headers?: Headers;
    status?: number;
    statusText?: string;
    url?: string;
    ok?: boolean;
    name?: string;
    message?: string;
    error: Error;
}

export interface HttpResponseObserver {
    body: string;
    headers: Headers;
    status: number;
    statusText: string;
    url: string;
    ok: boolean;
    name: string;
}

interface Error {
    errorCode: number;
    errorMessage: string;
}

interface Headers {
   // normalizedNames: NormalizedNames;
    lazyUpdate?: any;
}

/*interface NormalizedNames {
}*/
