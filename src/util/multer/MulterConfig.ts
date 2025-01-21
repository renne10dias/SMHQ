import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express'; // Importa Request para tipagem
import crypto from "crypto";  // Importar biblioteca para gerar UUID

export class MulterConfig {
  private static storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../../uploads')); // Caminho onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
      // Gera um UUID para nomear a imagem
      const uniqueSuffix = crypto.randomUUID();
      // Usa o UUID e a extensão do arquivo original
      const filename = uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
    }
  });

  // Método estático para retornar o middleware do multer
  public static getMulterInstance() {
    return multer({
      storage: this.storage,
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Apenas arquivos de imagem são permitidos!')); // Mensagem de erro personalizada
        }
      }
    });
  }

  // Função estática para retornar o nome da imagem carregada
  public static getUploadedFileName(req: Request): string | null {
    if (req.file) {
      // Retorna o nome da imagem
      return req.file.filename;
    }
    // Se o arquivo não existir, retorna null
    return null;
  }
}
