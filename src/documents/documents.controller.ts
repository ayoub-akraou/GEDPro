import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        candidateId: 'uuid',
        orgId: 'uuid',
        filename: 'cv.pdf',
        mimeType: 'application/pdf',
        size: 12345,
        objectKey: 'org/candidate/...',
      },
    },
  })
  upload(
    @Body() payload: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.documentsService.upload(req.user.orgId, payload.candidateId, file);
  }
}
