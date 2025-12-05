import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.itemsService.findAll(query);
    }

    @Post()
    create(@Body() createItemDto: any) {
        return this.itemsService.create(createItemDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateItemDto: any) {
        return this.itemsService.update(id, updateItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.itemsService.remove(id);
    }
}
