import { BadRequestException, Body, Controller, Get, Logger, NotFoundException, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
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
  async createLocale(@Body() createLocaleDto : CreateLocaleDto) {
    const localeFound = await this.clientLocaleBackend.send('find-locale-by-cityId', createLocaleDto.cityId).toPromise();

    if(localeFound) {
      throw new BadRequestException('Locale already registered');
    }

    this.clientLocaleBackend.emit('create-locale', createLocaleDto);
  }

  @Get()
  findAllLocales(): Observable<any> {
    return this.clientLocaleBackend.send('find-all-locales', '');
  }

  @Get('/:_id')
  async findLocaleById(@Param() params): Promise<Observable<any>> {
    const localeFound = await this.clientLocaleBackend.send('find-locale-by-id', params._id).toPromise();

    if(!localeFound) {
      throw new NotFoundException('Locale not found');
    }

    return localeFound;
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateLocale(
    @Body() updateLocaleDto: UpdateLocaleDto,
    @Param('_id') _id: string
    ) {
      const localeFoundById = await this.clientLocaleBackend.send('find-locale-by-id', _id).toPromise();
      const localeFoundByCityId = await this.clientLocaleBackend.send('find-locale-by-cityId', updateLocaleDto.cityId).toPromise();

      if(!localeFoundById) {
        throw new NotFoundException('Locale not found');
      }

      if(localeFoundByCityId && (localeFoundByCityId._id.toString() != localeFoundById._id.toString())) {
        throw new BadRequestException('This cityId is already being used by another locale');
      }

      this.clientLocaleBackend.emit('update-locale', {id: _id, locale: updateLocaleDto});
  }
}
