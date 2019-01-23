/// <reference types="node" />
import { EventEmitter } from "events";
export declare class CancellationToken extends EventEmitter {
    private parentCancelHandler;
    private _cancelled;
    readonly cancelled: boolean;
    private _parent;
    parent: CancellationToken;
    constructor(parent?: CancellationToken);
    cancel(): void;
    private onCancel;
    createPromise<R>(callback: (resolve: (thenableOrResult?: R) => void, reject: (error: Error) => void, onCancel: (callback: () => void) => void) => void): Promise<R>;
    private removeParentCancelHandler;
    dispose(): void;
}
export declare class CancellationError extends Error {
    constructor();
}
