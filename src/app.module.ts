import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { LocalesModule } from './locales/locales.module';

@Module({
  imports: [CompaniesModule, LocalesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
