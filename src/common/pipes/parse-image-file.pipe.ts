import { ParseFilePipeBuilder } from '@nestjs/common';

export function ParseImageFilePipe() {
  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^image\/(jpeg|jpg|png|webp)$/,
      errorMessage:
        'Formato inválido. Envie uma imagem JPEG, JPG, PNG ou WebP.',
    })
    .addMaxSizeValidator({
      maxSize: 5 * 1024 * 1024,
      errorMessage: 'A imagem deve ter no máximo 5 MB.',
    })
    .build({
      fileIsRequired: false,
    });
}
