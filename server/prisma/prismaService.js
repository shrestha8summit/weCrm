import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()


async function createUser (data) {
    return await prisma.user.create({
      data,
    });
  }
  // Function to fetch all users
  async function getAllUsers() {
    return await prisma.user.findMany();
  }
  // Function to disconnect Prisma Client
  async function disconnect() {
    await prisma.$disconnect();
  }
  module.exports = {
    createUser ,
    getAllUsers,
    disconnect,
  };
  

export default prisma;