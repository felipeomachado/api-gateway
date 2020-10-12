import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ComplainsController } from './complains.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [ComplainsController]
})
export class ComplainsModule {}
