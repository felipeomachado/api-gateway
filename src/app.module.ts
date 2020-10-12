import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { LocalesModule } from './locales/locales.module';
import { ComplainsModule } from './complains/complains.module';
import { ConfigModule } from '@nestjs/config';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ClientProxyReclameAquiHost } from './proxyrmq/client-proxy';

@Module({
  imports: [
    CompaniesModule, 
    LocalesModule, 
    ProxyRMQModule,
    ComplainsModule,
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [],
  providers: [ClientProxyReclameAquiHost],
})
export class AppModule {}
