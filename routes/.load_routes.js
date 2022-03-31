const snakeCase = require("lodash/snakeCase");
const express = require("express");

module.exports = async (app) => {
    require("fs")
        .readdirSync(__dirname)
        .forEach((file) => {
            console.log(file, 'loaded route')
            if (file === ".load_routes.js") return;
            const router = express.Router();
            const routeModule = require(require("path").join(__dirname, file));
            const path =
                routeModule.path ||
                "/" +
                    (file !== "index.js"
                        ? snakeCase(file.replace(".js", ""))
                        : "");
            const route = routeModule.config
                ? routeModule.config(router)
                : routeModule(router);
            app.use(path, route);
        });
};

/* ROUTE-IIN ZAM ZAAGAAGUI UYED DOORH SYNTAX-G ASHIGLANA */
// module.exports = (router) => {
//     router
//         .get("/", (req, res) => res.send("GET ABOUT"))
//         .post("/", (req, res) => res.send("POST ABOUT"));
//     return router;
// };

/* ROUTE-IIN ZAMIIG ZAAH SHAARDLAGATAI BOL DOORH SYNTAX-G ASHIGLANA */
// module.exports = {
//     path: "/my_home",
//     config: (router) => {
//         router
//             .get("/", (req, res) => res.send("GET HOME"))
//             .post("/", (req, res) => res.send("POST HOME"));
//         return router;
//     },
// };