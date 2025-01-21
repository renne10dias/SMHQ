import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { SpaceRepository } from "../../../repositories/spaces/prisma/SpaceRepository";
import { SpaceService } from "../../../services/space/SpaceService";
import { Space } from "../../../entities/Space";

import { MulterConfig } from "../../../util/multer/MulterConfig"; // Importa a classe do multer

import Joi from 'joi';


export class SpaceController {
    private spaceService: SpaceService;

    constructor(spaceService: SpaceService) {
        this.spaceService = spaceService;
    }

    // Método estático para construir o controlador
    public static build() {
        const spaceRepository = SpaceRepository.build(prisma);
        const spaceService = SpaceService.build(spaceRepository);
        return new SpaceController(spaceService);
    }

    // Método para criar uma notificação
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            // Definição do schema de validação usando Joi
            const reservationSchema = Joi.object({
                name: Joi.string().required(),
                location: Joi.string().required(),
                capacity: Joi.number().integer().required(), // Garante que é um número inteiro
                type: Joi.string().required(),
                equipment: Joi.string().required(),
            });
    
            // Validação do corpo da requisição
            const { error } = reservationSchema.validate(request.body);
            if (error) {
                return response.status(400).json({ error: 'Validation error: ' + error.details[0].message });
            }
    
            // Obtém o identificador do arquivo de imagem carregado
            const imageIdentifier = MulterConfig.getUploadedFileName(request);
    
            if (!imageIdentifier) {
                return response.status(400).json({ error: 'A imagem é obrigatória.' });
            }
    
            // Para monitorar o nome da imagem no servidor
            //console.log('Identificador da imagem:', imageIdentifier);
    
            const { name, location, capacity, type, equipment } = request.body;
    
            // Converte capacidade para inteiro
            const capacityAsInt = parseInt(capacity, 10);
    
            // Criação do espaço com os dados fornecidos
            const space = new Space(name, location, capacityAsInt, type, undefined, undefined, equipment);
    
            // Chama o serviço para salvar o espaço com a imagem associada
            const output = await this.spaceService.create(space, imageIdentifier);
    
            // Retorna a resposta de sucesso
            return response.status(201).json(output);
        } catch (error) {
            // Retorna uma resposta de erro genérica
            console.error('Erro na criação da reserva:', error);
            return response.status(500).json({ error: (error as Error).message });
        }
    }
    



    public async listSpaces(request: Request, response: Response): Promise<Response> {
        try {

            const output = await this.spaceService.listSpaces(request);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async findSpace(request: Request, response: Response): Promise<Response> {
        try {

            const { id } = request.params;

            const output = await this.spaceService.findSpace(request, id);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async find(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const output = await this.spaceService.find(id)

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }



}
