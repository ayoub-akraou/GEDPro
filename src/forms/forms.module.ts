import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormField } from './form-field.entity';
import { FormFieldsController } from './form-fields.controller';
import { FormFieldsService } from './form-fields.service';
import { Form } from './form.entity';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { PublicFormsController } from './public-forms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Form, FormField])],
  controllers: [FormsController, FormFieldsController, PublicFormsController],
  providers: [FormsService, FormFieldsService],
  exports: [FormsService],
})
export class FormsModule {}
