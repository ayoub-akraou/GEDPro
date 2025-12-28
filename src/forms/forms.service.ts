import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Form } from './form.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form) private readonly formsRepo: Repository<Form>,
  ) {}

  async create(orgId: string, data: { title: string; description?: string }) {
    const form = this.formsRepo.create({
      orgId,
      title: data.title,
      description: data.description ?? null,
    });
    return this.formsRepo.save(form);
  }

  async findAll(orgId: string) {
    return this.formsRepo.find({
      where: { orgId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(orgId: string, id: string) {
    const form = await this.formsRepo.findOne({ where: { id, orgId } });
    if (!form) {
      throw new NotFoundException('Form not found');
    }
    return form;
  }

  async update(
    orgId: string,
    id: string,
    data: { title?: string; description?: string },
  ) {
    await this.findOne(orgId, id);
    await this.formsRepo.update(id, {
      title: data.title,
      description: data.description,
    });
    return this.findOne(orgId, id);
  }

  async remove(orgId: string, id: string) {
    const form = await this.findOne(orgId, id);
    await this.formsRepo.delete(id);
    return form;
  }
}
