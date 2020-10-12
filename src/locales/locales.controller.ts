import { Body, Controller, Get, Logger, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyReclameAquiHost } from 'src/proxyrmq/client-proxy';
import { CreateLocaleDto } from './dtos/create-locale.dto';
import { UpdateLocaleDto } from './dtos/update-locale.dto';


@Controller('api/v1/locales')
export class LocalesController {
  
  private logger = new Logger(LocalesController.name);

  constructor(private clientProxyReclameAquiHost : ClientProxyReclameAquiHost){}

  private clientLocaleBackend = this.clientProxyReclameAquiHost.getClientProxyLocaleBackendInstance();


  @Post()
  @UsePipes(ValidationPipe)
  createLocale(@Body() createLocaleDto : CreateLocaleDto) {
    this.clientLocaleBackend.emit('create-locale', createLocaleDto);
  }

  @Get()
  findAllLocales(): Observable<any> {
    return this.clientLocaleBackend.send('find-all-locales', '');
  }

  @Get('/:_id')
  findLocaleById(@Param() params): Observable<any> {
    return this.clientLocaleBackend.send('find-locale-by-id', params._id);

  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateLocale(
    @Body() updateLocaleDto: UpdateLocaleDto,
    @Param('_id') _id: string
    ) {
      this.clientLocaleBackend.emit('update-locale', {id: _id, locale: updateLocaleDto});
  }
}
