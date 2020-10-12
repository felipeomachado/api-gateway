import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { LocalesController } from './locales.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [LocalesController]
})
export class LocalesModule {}
