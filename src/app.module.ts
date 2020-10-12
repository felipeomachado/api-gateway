import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { LocalesModule } from './locales/locales.module';
import { ComplainsModule } from './complains/complains.module';

@Module({
  imports: [CompaniesModule, LocalesModule, ComplainsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
