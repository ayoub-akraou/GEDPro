import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role?: UserRole;
    orgId?: string | null;
  }): Promise<User> {
    const user = this.usersRepo.create({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role ?? UserRole.RH,
      orgId: data.orgId ?? null,
    });
    return this.usersRepo.save(user);
  }

  async assignOrg(userId: string, orgId: string): Promise<User | null> {
    await this.usersRepo.update(userId, { orgId });
    return this.findById(userId);
  }
}
