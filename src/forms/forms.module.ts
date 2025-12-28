import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormField } from './form-field.entity';
import { FormFieldsController } from './form-fields.controller';
import { FormFieldsService } from './form-fields.service';
import { Form } from './form.entity';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormField])],
  controllers: [FormsController, FormFieldsController],
  providers: [FormsService, FormFieldsService],
  exports: [FormsService],
})
export class FormsModule {}
