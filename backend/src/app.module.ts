import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './modules/books/books.module';

@Module({
  imports: [DatabaseModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
