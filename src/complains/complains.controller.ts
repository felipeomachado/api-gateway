import { Body, Controller, Get, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyReclameAquiHost } from 'src/proxyrmq/client-proxy';
import { CreateComplainDto } from './dtos/create-complain.dto';
import { QueryComplainDto } from './dtos/query-complain.dto';
import { UpdateComplainDto } from './dtos/update-complain.dto';

@Controller('api/v1/complains')
export class ComplainsController {

  constructor(private clientProxyReclameAquiHost : ClientProxyReclameAquiHost){}

  private clientComplainBackend = this.clientProxyReclameAquiHost.getClientProxyComplainBackendInstance();
  private clientCompanyBackend = this.clientProxyReclameAquiHost.getClientProxyCompanyBackendInstance();
  private clientLocaleBackend = this.clientProxyReclameAquiHost.getClientProxyLocaleBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createComplain(@Body() createComplainDto : CreateComplainDto) {
    const company = await this.clientCompanyBackend.send('find-company-by-id', createComplainDto.company._id).toPromise();

    if(!company) {
      throw new NotFoundException('Company not found');
    }

    const localeFound = await this.clientLocaleBackend.send('find-locale-by-id', createComplainDto.locale._id).toPromise();

    if(!localeFound) {
      throw new NotFoundException('Locale not found');
    }

    this.clientComplainBackend.emit('create-complain', createComplainDto);
  }

  @Get()
  findComplains(@Query() queryComplainDto: QueryComplainDto): Observable<any> {
    return this.clientComplainBackend.send('find-complains', queryComplainDto);
  }

  @Get('/count')
  countComplains(@Query() queryComplainDto: QueryComplainDto) {
    return this.clientComplainBackend.send('count-complains', queryComplainDto);
  }

  @Get('/:_id')
  async findComplainById(@Param() params): Promise<Observable<any>> {
    const complainFound = await this.clientComplainBackend.send('find-complain-by-id', params._id).toPromise();

    if(!complainFound) {
      throw new NotFoundException('Complain not found');
    }

    return complainFound;
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateComplain(
    @Body() updateComplainDto: UpdateComplainDto,
    @Param('_id') _id: string
    ) {
      this.clientComplainBackend.emit('update-locale', {id: _id, complain: updateComplainDto});
  }
}
