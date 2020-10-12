import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [CompaniesController]
})
export class CompaniesModule {}
