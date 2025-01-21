import path from 'path';
import fs from 'fs';

export class ImageService {
  // Método para buscar o caminho da imagem pelo ID
  public static getImageById(imageId: string): string | null {
    const uploadsDir = path.join(__dirname, '../../../uploads');
    const imagePath = path.join(uploadsDir, imageId);

    // Verifica se o arquivo existe
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
    
    return null; // Retorna null se a imagem não for encontrada
  }
}
