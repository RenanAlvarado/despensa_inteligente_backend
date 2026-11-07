import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from './types/cloudinary.types';

interface CloudinaryDeleteResult {
  result: 'ok' | 'not found' | 'error';
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
      secure: true,
    });
  }

  // Subir a imagem
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'despensa_inteligente/produtos',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(new Error(error.message));
          }

          if (!result) {
            return reject(
              new Error('O Cloudinary não retornou os dados do upload.'),
            );
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  // Excluir a Imagem
  async deleteImage(imageUrl: string): Promise<void> {
    const url = new URL(imageUrl);

    if (url.hostname !== 'res.cloudinary.com') {
      return;
    }

    const publicId = new URL(imageUrl).pathname
      .split('/upload/')[1]
      ?.replace(/^v\d+\//, '')
      .replace(/\.[^/.]+$/, '');

    if (!publicId) {
      throw new BadRequestException(
        'Não foi possível identificar a imagem no Cloudinary.',
      );
    }

    const result = (await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    })) as CloudinaryDeleteResult;

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new BadRequestException(
        'Não foi possível excluir a imagem do Cloudinary.',
      );
    }
  }
}
