import { Body, Controller, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyReclameAquiHost } from 'src/proxyrmq/client-proxy';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('api/v1/companies')
export class CompaniesController {

  private logger = new Logger(CompaniesController.name);

  constructor(private clientProxyReclameAquiHost : ClientProxyReclameAquiHost){}

  private clientCompanyBackend = this.clientProxyReclameAquiHost.getClientProxyCompanyBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    this.clientCompanyBackend.emit('create-company', createCompanyDto);
  }

  @Get()
  findAllCompanies(): Observable<any> {
    return this.clientCompanyBackend.send('find-all-companies', '');
  }

  @Get('/:_id')
  findCompanyById(@Param() params): Observable<any> {
    return this.clientCompanyBackend.send('find-company-by-id', params._id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateCompany(@Body() updateCompanyDto: UpdateCompanyDto, @Param('_id') _id: string) {

    this.clientCompanyBackend.emit('update-company', {id: _id, company: updateCompanyDto});
  }
}
