import fastify from "fastify";
import productController from "./controllers/product.controller";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

const port = 3333;

const app = fastify();

app.register(swagger, {
  swagger: {
    paths: {
      "/products": {
        post: {
          summary: "Create a new product",
          operationId: "createProduct",
          tags: ["Products"],
          consumes: ["application/json"],
          parameters: [
            {
              in: "body",
              name: "body",
              description: "Product data",
              required: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  imgUrl: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
          ],
          schemes: ["http"],
          responses: {
            201: {
              description: "Product created successfully",
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  imgUrl: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
        get: {
          summary: "List all products",
          operationId: "listProducts",
          tags: ["Products"],
          consumes: ["application/json"],

          responses: {
            200: {
              description: "List of products",
              schema: {
                type: "array",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  imgUrl: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
      "/products/{id}": {
        delete: {
          summary: "Delete a product",
          operationId: "deleteProduct",
          tags: ["Products"],
          consumes: ["application/json"],
          parameters: [
            {
              in: "path",
              name: "id",
              description: "Product ID",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Product deleted successfully",
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  imgUrl: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
            404: {
              description: "Product not found",
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
});

app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

app.post("/products", productController.create);

app.get("/products", productController.list);

app.delete("/products/:id", productController.delete);

app.listen(
  { port: process.env.PORT ? Number(process.env.PORT) : port },
  (err, address) => {
    console.log(`HTTP server is running on http://localhost:${port}`);
  }
);
