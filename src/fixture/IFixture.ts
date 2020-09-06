import {InjectionToken} from "injection-js";

export interface IFixture {
    load(): Promise<any>;
}
export const FIXTURE = new InjectionToken<IFixture>("fixture-token");