module.exports = {
    path: "/",
    config: (router) => {
        router
            .get("/", (req, res) => res.send("GET"))
            .post("/", (req, res) => res.send("POST"));
        return router;
    },
};