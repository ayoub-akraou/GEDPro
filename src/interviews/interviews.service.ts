import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CandidatesService } from '../candidates/candidates.service';
import { Interview, InterviewStatus } from './interview.entity';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewsRepo: Repository<Interview>,
    private readonly candidatesService: CandidatesService,
  ) {}

  async create(
    orgId: string,
    data: { candidateId: string; scheduledAt: Date; participants: string[] },
  ) {
    await this.candidatesService.findById(orgId, data.candidateId);
    const interview = this.interviewsRepo.create({
      orgId,
      candidateId: data.candidateId,
      scheduledAt: data.scheduledAt,
      participants: data.participants,
      status: InterviewStatus.SCHEDULED,
    });
    return this.interviewsRepo.save(interview);
  }

  async findById(orgId: string, id: string) {
    const interview = await this.interviewsRepo.findOne({
      where: { id, orgId },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }

  async update(
    orgId: string,
    id: string,
    data: { scheduledAt?: Date; participants?: string[] },
  ) {
    await this.findById(orgId, id);
    await this.interviewsRepo.update(id, {
      scheduledAt: data.scheduledAt,
      participants: data.participants,
    });
    return this.findById(orgId, id);
  }

  async cancel(orgId: string, id: string) {
    await this.findById(orgId, id);
    await this.interviewsRepo.update(id, { status: InterviewStatus.CANCELED });
    return this.findById(orgId, id);
  }

  async list(orgId: string, dateFrom?: Date, dateTo?: Date) {
    const qb = this.interviewsRepo
      .createQueryBuilder('interview')
      .where('interview.orgId = :orgId', { orgId });

    if (dateFrom) {
      qb.andWhere('interview.scheduledAt >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      qb.andWhere('interview.scheduledAt <= :dateTo', { dateTo });
    }

    return qb.orderBy('interview.scheduledAt', 'ASC').getMany();
  }
}
