import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormsModule } from '../forms/forms.module';
import { Candidate } from './candidate.entity';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { PublicCandidatesController } from './public-candidates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate]), FormsModule],
  controllers: [PublicCandidatesController, CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
