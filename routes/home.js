module.exports = {
    path: "/my_home",
    config: (router) => {
        router
            .get("/", (req, res) => res.send("GET HOME"))
            .post("/", (req, res) => res.send("POST HOME"));
        return router;
    },
};