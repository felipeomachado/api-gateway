import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyReclameAquiHost } from 'src/proxyrmq/client-proxy';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('api/v1/companies')
export class CompaniesController {

  constructor(private clientProxyReclameAquiHost : ClientProxyReclameAquiHost){}

  private clientCompanyBackend = this.clientProxyReclameAquiHost.getClientProxyCompanyBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const companyFound = await this.clientCompanyBackend.send('find-company-by-name', createCompanyDto.name).toPromise();

    if(companyFound) {
      throw new BadRequestException('Company already registered');
    }
    
    this.clientCompanyBackend.emit('create-company', createCompanyDto);
  }

  @Get()
  findAllCompanies(): Observable<any> {
    return this.clientCompanyBackend.send('find-all-companies', '');
  }

  @Get('/:_id')
  async findCompanyById(@Param() params): Promise<Observable<any>> {
    const company = await this.clientCompanyBackend.send('find-company-by-id', params._id).toPromise();

    if(!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateCompany(@Body() updateCompanyDto: UpdateCompanyDto, @Param('_id') _id: string) {
    const companyFoundById = await this.clientCompanyBackend.send('find-company-by-id', _id).toPromise();
    const companyFoundByName = await this.clientCompanyBackend.send('find-company-by-name', updateCompanyDto.name).toPromise();

    if(!companyFoundById) {
      throw new NotFoundException('Company not found by Id');
    }

    if(companyFoundByName && (companyFoundByName._id.toString() != companyFoundById._id.toString())) {
      throw new BadRequestException('This name is already being used by another company');
    }

    this.clientCompanyBackend.emit('update-company', {id: _id, company: updateCompanyDto});
  }
}
