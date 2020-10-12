import { Module } from '@nestjs/common';
import { ClientProxyReclameAquiHost } from './client-proxy';

@Module({
  providers: [ClientProxyReclameAquiHost],
  exports: [ClientProxyReclameAquiHost]
})

export class ProxyRMQModule {}

