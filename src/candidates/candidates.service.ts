import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormsService } from '../forms/forms.service';
import { Candidate, CandidateStatus } from './candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidatesRepo: Repository<Candidate>,
    private readonly formsService: FormsService,
  ) {}

  async submit(publicId: string, data: Record<string, unknown>) {
    const form = await this.formsService.findPublishedByPublicId(publicId);

    const missing = form.fields.filter((field) => {
      if (!field.required) {
        return false;
      }
      const value = data?.[field.id];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      throw new BadRequestException('Missing required fields');
    }

    const candidate = this.candidatesRepo.create({
      orgId: form.orgId,
      formId: form.id,
      data,
      status: CandidateStatus.NOUVEAU,
    });

    return this.candidatesRepo.save(candidate);
  }
}
