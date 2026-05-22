import { prisma } from "@/lib/prisma";

export interface UserData {
  id: string;
  name: string | null;
  email: string;
  password: string;
  emailVerified: Date | null;
  createdAt: Date;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserData | null>;
  findById(id: string): Promise<UserData | null>;
  create(data: { name: string; email: string; password: string }): Promise<UserData>;
  updateEmailVerified(id: string, emailVerified: Date): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserData | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<UserData | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { name: string; email: string; password: string }): Promise<UserData> {
    return prisma.user.create({ data });
  }

  async updateEmailVerified(id: string, emailVerified: Date): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { emailVerified },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await prisma.user.delete({ where: { email } });
  }
}

export const userRepository: UserRepository = new PrismaUserRepository();
