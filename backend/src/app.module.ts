import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { BookAuthorsModule } from './modules/book-authors/book-authors.module';
import { BooksModule } from './modules/books/books.module';
import { PublishersModule } from './modules/publishers/publishers.module';

@Module({
  imports: [
    DatabaseModule,
    AuthorsModule,
    PublishersModule,
    BooksModule,
    BookAuthorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
