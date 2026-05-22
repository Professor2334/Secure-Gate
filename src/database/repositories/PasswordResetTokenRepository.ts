import { prisma } from "@/lib/prisma";

export interface PasswordResetTokenData {
  email: string;
  token: string;
  expires: Date;
}

export interface PasswordResetTokenRepository {
  findByToken(token: string): Promise<PasswordResetTokenData | null>;
  findByEmail(email: string): Promise<PasswordResetTokenData | null>;
  create(data: PasswordResetTokenData): Promise<PasswordResetTokenData>;
  deleteByToken(token: string): Promise<void>;
}

export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  async findByToken(token: string): Promise<PasswordResetTokenData | null> {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  }

  async findByEmail(email: string): Promise<PasswordResetTokenData | null> {
    return prisma.passwordResetToken.findFirst({ where: { email } });
  }

  async create(data: PasswordResetTokenData): Promise<PasswordResetTokenData> {
    return prisma.passwordResetToken.create({ data });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.passwordResetToken.delete({ where: { token } });
  }
}

export const passwordResetTokenRepository: PasswordResetTokenRepository = new PrismaPasswordResetTokenRepository();
