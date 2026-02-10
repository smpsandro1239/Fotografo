import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { StorageService } from '../storage/storage.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Photos')
@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotosService,
    private readonly storageService: StorageService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a new photo and save metadata' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        albumId: { type: 'string' },
      },
    },
  })
  async uploadPhoto(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('albumId') albumId: string,
  ) {
    const key = \`albums/\${albumId}/\${Date.now()}-\${file.originalname}\`;
    const url = await this.storageService.uploadFile(file, key);

    return this.photosService.create(userId, {
      albumId,
      url,
      metadata: { key },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new photo metadata manually' })
  create(@GetUser('id') userId: string, @Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(userId, createPhotoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all photos for a specific album' })
  findAllByAlbum(@Query('albumId') albumId: string) {
    return this.photosService.findAllByAlbum(albumId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific photo metadata' })
  findOne(@Param('id') id: string) {
    return this.photosService.findOne(id);
  }

  @Get(':id/signed-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a signed URL for a protected photo' })
  async getSignedUrl(@Param('id') id: string) {
    const photo = await this.photosService.findOne(id);
    const metadata = photo.metadata as any;
    if (metadata && metadata.key) {
      const signedUrl = await this.storageService.getSignedUrl(metadata.key);
      return { signedUrl };
    }
    return { url: photo.url };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a photo' })
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    const photo = await this.photosService.findOne(id);
    const metadata = photo.metadata as any;
    if (metadata && metadata.key) {
      await this.storageService.deleteFile(metadata.key);
    }
    return this.photosService.remove(id, userId);
  }
}
