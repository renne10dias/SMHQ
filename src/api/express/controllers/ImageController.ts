import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { SpaceRepository } from "../../../repositories/spaces/prisma/SpaceRepository";
import { ImageService } from "../../../services/image/ImageService";

import { MulterConfig } from "../../../util/multer/MulterConfig"; // Importa a classe do multer




export class ImageController {


    private imageService: ImageService;

    constructor(imageService: ImageService) {
        this.imageService = imageService;
    }

    // Método estático para construir o controlador
    public static build() {
        return new ImageController(ImageService);
    }
    

  

    public async loadImage(request: Request, response: Response): Promise<Response | void> {
        try {
            const { id } = request.params; // Pega o ID da imagem da URL
    
            // Busca o caminho completo da imagem
            const imagePath = ImageService.getImageById(id);
    
            // Se a imagem for encontrada, responde com a imagem
            if (imagePath) {
                response.sendFile(imagePath); // Usa sendFile para servir o arquivo
            } else {
                // Se não for encontrada, responde com erro 404
                return response.status(404).json({ error: 'Imagem não encontrada.' });
            }
    
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }
    

    


    



}
