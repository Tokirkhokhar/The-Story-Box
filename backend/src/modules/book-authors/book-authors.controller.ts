import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BookAuthorsService } from './book-authors.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';

@Controller('book-authors')
export class BookAuthorsController {
  constructor(private readonly bookAuthorsService: BookAuthorsService) {}

  @Post()
  create(@Body() createBookAuthorDto: CreateBookAuthorDto) {
    return this.bookAuthorsService.create(createBookAuthorDto);
  }

  @Get()
  findAll(@Query('bookId') bookId?: string) {
    if (bookId) {
      return this.bookAuthorsService.findByBookId(bookId);
    }
    return this.bookAuthorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookAuthorsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookAuthorDto: UpdateBookAuthorDto) {
    return this.bookAuthorsService.update(id, updateBookAuthorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookAuthorsService.remove(id);
  }
}
