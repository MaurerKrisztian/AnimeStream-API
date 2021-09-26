// import { IServerSetup } from "./IServerSetup";
// import { Express } from "express";
// import { Server } from "../Server";
//
// export class SwaggerSetup implements IServerSetup {
//
//     DOCS_ROUTE = "/docs";
//
//     setup(app: Express): any {
//         const routingControllersOptions = {
//             controllers: Server.controllers
//         };
//
//         const schemas = validationMetadatasToSchemas({
//             refPointerPrefix: "#/components/schemas/",
//         });
//         const storage = getMetadataArgsStorage();
//         const spec = routingControllersToSpec(storage, routingControllersOptions, {
//             components: {
//                 schemas,
//                 securitySchemes: {
//                     basicAuth: {
//                         scheme: "basic",
//                         type: "http",
//                     },
//                 },
//             },
//             info: {
//                 description: "",
//                 title: "Video Inquiry API",
//                 version: "1.0.0",
//             },
//         });
//         app.use(this.DOCS_ROUTE, swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
//     }
//
// }
