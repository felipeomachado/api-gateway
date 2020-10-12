import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";

@Injectable()
export class ClientProxyReclameAquiHost {
  constructor(private configService: ConfigService){}

  getClientProxyCompanyBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'company-backend'
      }
    })
  }

  getClientProxyLocaleBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'locale-backend'
      }
    })
  }

  getClientProxyComplainBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'complain-backend'
      }
    })
  }
}