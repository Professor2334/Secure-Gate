import { prisma } from "@/lib/prisma";

export interface VerificationTokenData {
  identifier: string;
  token: string;
  expires: Date;
}

export interface VerificationTokenRepository {
  findByToken(token: string): Promise<VerificationTokenData | null>;
  findByIdentifier(identifier: string): Promise<VerificationTokenData | null>;
  create(data: VerificationTokenData): Promise<VerificationTokenData>;
  deleteByToken(token: string): Promise<void>;
}

export class PrismaVerificationTokenRepository implements VerificationTokenRepository {
  async findByToken(token: string): Promise<VerificationTokenData | null> {
    return prisma.verificationToken.findUnique({ where: { token } });
  }

  async findByIdentifier(identifier: string): Promise<VerificationTokenData | null> {
    return prisma.verificationToken.findFirst({ where: { identifier } });
  }

  async create(data: VerificationTokenData): Promise<VerificationTokenData> {
    return prisma.verificationToken.create({ data });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.verificationToken.delete({ where: { token } });
  }
}

export const verificationTokenRepository: VerificationTokenRepository = new PrismaVerificationTokenRepository();
