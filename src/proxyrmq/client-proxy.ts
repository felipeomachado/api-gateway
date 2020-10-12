import { Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxyReclameAquiHost {
  getClientProxyCompanyBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:Z1wfdAr8TTKl@174.129.50.31:5672/reclameAquiHost'],
        queue: 'company-backend'
      }
    })
  }

  getClientProxyLocaleBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:Z1wfdAr8TTKl@174.129.50.31:5672/reclameAquiHost'],
        queue: 'locale-backend'
      }
    })
  }
}