import { fastify } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import routes from "./service.js";
const version = process.env.PICASSO_VERSION ?? "v0.0.0-alpha.0";
const server = fastify();
await server.register(fastifyConnectPlugin, {
    routes
});
server.get("/", async (_, reply) => {
    reply.type("application/json");
    return {
        app: "demo-man",
        service: "picasso",
        version: version
    };
});
server.get("/healthz", (_, reply) => {
    reply.type("text/plain");
    reply.send("ok");
});
await server.listen({ port: 8080 });
console.log("server is listening at", server.addresses());
