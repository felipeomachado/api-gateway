import { Body, Controller, Get, Logger, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyReclameAquiHost } from 'src/proxyrmq/client-proxy';
import { CreateComplainDto } from './dtos/create-complain.dto';
import { QueryComplainDto } from './dtos/query-complain.dto';
import { UpdateComplainDto } from './dtos/update-complain.dto';

@Controller('api/v1/complains')
export class ComplainsController {

  private logger = new Logger(ComplainsController.name);

  constructor(private clientProxyReclameAquiHost : ClientProxyReclameAquiHost){}

  private clientComplainBackend = this.clientProxyReclameAquiHost.getClientProxyComplainBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  createComplain(@Body() createComplainDto : CreateComplainDto) {
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
