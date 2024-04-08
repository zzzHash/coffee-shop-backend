import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../prismaClient";

const productCreateSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  imgUrl: z.string(),
  price: z.number({
    required_error: "Price is required",
  }),
  description: z.string(),
});

const productDeleteSchema = z.object({
  id: z.string().min(1),
});

export default {
  async create(req: FastifyRequest, reply: FastifyReply) {
    const { title, imgUrl, price, description } = productCreateSchema.parse(
      req.body
    );

    const titleAlreadyExists = await prisma.product.findFirst({
      where: {
        title,
      },
    });

    if (titleAlreadyExists) {
      return reply.status(409).send({ message: "Title already exists" });
    }

    try {
      const product = await prisma.product.create({
        data: {
          title,
          imgUrl,
          price,
          description,
        },
      });

      return reply.status(201).send(product);
    } catch (err) {
      console.log(err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  },

  async list(req: FastifyRequest, reply: FastifyReply) {
    const data = await prisma.product.findMany();

    return reply.status(200).send(data);
  },

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = productDeleteSchema.parse(req.params);

    try {
      const deleteProduct = await prisma.product.delete({
        where: {
          id,
        },
      });

      return reply.status(200).send(deleteProduct);
    } catch (err) {
      if (err.code === "P2025") {
        return reply.status(404).send({ message: "Product not found" });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
};
