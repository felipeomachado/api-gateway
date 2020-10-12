import { Body, Controller, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientCompanyBackend: ClientProxy;
  
  constructor() {
    this.clientCompanyBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:Z1wfdAr8TTKl@174.129.50.31:5672/smartcomplain'],
        queue: 'company-backend'
      }
    })
  }

  @Post('/companies')
  @UsePipes(ValidationPipe)
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    this.clientCompanyBackend.emit('create-company', createCompanyDto);
  }

  @Get('/companies/:_id')
  findCompanyById(@Param() params): Observable<any> {
    return this.clientCompanyBackend.send('find-company-by-id', params._id);
  }

  @Get('/companies')
  findAll() {
    return this.clientCompanyBackend.send('find-all-companies', '');
  }

  @Put('/companies/:_id')
  @UsePipes(ValidationPipe)
  updateCompany(@Body() updateCompanyDto: UpdateCompanyDto, @Param('_id') _id: string) {

    this.clientCompanyBackend.emit('update-company', {id: _id, company: updateCompanyDto});
  }
}
