import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

export const createContext = () => ({ eventEmitter });

export type Context = ReturnType<typeof createContext>;
