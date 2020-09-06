import {ReflectiveInjector} from "injection-js";
import {AdminFixture} from "../fixture/AdminFixture";
import {FIXTURE} from "../fixture/IFixture";
import {Fixtures} from "../fixture/Fixtures";

export class DIprovider{
    static  injector = ReflectiveInjector.resolveAndCreate([
        AdminFixture,
        {
            provide: FIXTURE,
            multi: true,
            useExisting: AdminFixture
        },
        Fixtures
    ])
}