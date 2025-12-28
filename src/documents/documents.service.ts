import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CandidatesService } from '../candidates/candidates.service';
import { Document } from './document.entity';
import { MinioService } from './minio.service';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
]);

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepo: Repository<Document>,
    private readonly minioService: MinioService,
    private readonly candidatesService: CandidatesService,
  ) {}

  async upload(
    orgId: string,
    candidateId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File too large');
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    await this.candidatesService.findById(orgId, candidateId);

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectKey = `${orgId}/${candidateId}/${Date.now()}-${safeName}`;
    await this.minioService.upload(objectKey, file.buffer, file.mimetype);

    const document = this.documentsRepo.create({
      candidateId,
      orgId,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      objectKey,
    });

    return this.documentsRepo.save(document);
  }

  async findById(id: string) {
    const document = await this.documentsRepo.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async download(orgId: string, id: string) {
    const document = await this.findById(id);
    if (document.orgId !== orgId) {
      throw new ForbiddenException('Access denied');
    }

    const stream = await this.minioService.getObject(document.objectKey);
    return { document, stream };
  }
}
