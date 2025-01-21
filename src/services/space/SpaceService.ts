import { Space } from "../../entities/Space";
import { 
    FindOutputDto_repository, 
    ListOutputDto_repository, 
    SpaceRepositoryInterface, 
    UpdateInputDto_repository 
} 
from "../../repositories/spaces/SpaceRepositoryInterface";


import { 
    CreateOutputDto_Service, 
    FindOutputDto_Service, 
    ListOutputDto_Service, 
    SpaceServiceInterface, 
    UpdateInputDto_Service 
} 
from "../../services/space/SpaceServiceInterface";

import { SpaceRepository } from "../../repositories/spaces/prisma/SpaceRepository";
import crypto from "crypto";  // Importar biblioteca para gerar UUID

import { Request } from 'express';


export class SpaceService implements SpaceServiceInterface {

    private constructor(readonly repository: SpaceRepository) {}

    // Método estático para construir o serviço
    public static build(repository: SpaceRepository) {
        return new SpaceService(repository);
    }

    /*
        A UUID deve ser gerada no serviço por razões semelhantes às da hash da senha.
        A geração de UUIDs é uma preocupação de aplicação, não de domínio.
    */




    public async create(space: Space, filePath: string): Promise<CreateOutputDto_Service> {
        const uuid = crypto.randomUUID();  // Gera um UUID único
        
        space.setUuid(uuid);
        space.setActivityStatus(true);

        //console.log(space);

        try {
            await this.repository.create(space, filePath);  // Cria a notificação no repositório
            return { 
                uuid: space.getUuid() as string 
            };  // Retorna o UUID criado


        } catch (error) {
            console.error('Erro ao criar espaço:', error);
            throw new Error("Erro ao criar espaço");
        }
    }

   


    public async listSpaces(request: Request) {
        try {
            const spaces = await this.repository.listSpaces();
    
            const hostUrl = `${request.protocol}://${request.get('host')}`;
    
            // Criamos um novo array onde o path será convertido em uma URL
            const reservationsWithUrls = spaces.map(space => ({
                uuid: space.uuid,
                name: space.name,
                type: space.type,
                activityStatus: space.activityStatus,
                files: space.files.map(file => ({
                    // Construção da URL completa dinamicamente
                    path: `${hostUrl}/image/${file.path}`,
                }))
            }));
    
            return reservationsWithUrls;
    
        } catch (error) {
            console.error('Erro ao buscar reservas no serviço:', error);
            throw new Error('Erro ao buscar reservas no serviço');
        }
    }

    public async findSpace(request: Request, uuid: string) {
        try {
            const space = await this.repository.findSpaceById(uuid);
    
            if (!space) {
                return null; // Se o espaço não for encontrado, retornar null
            }
    
            const hostUrl = `${request.protocol}://${request.get('host')}`;
    
            // Construção da resposta com URL completa para os arquivos
            const spaceWithUrls = {
                uuid: space.uuid,
                name: space.name,
                location: space.location,
                capacity: space.capacity,
                type: space.type,
                equipment: space.equipment,
                files: space.files.map(file => ({
                    // Construção da URL completa dinamicamente
                    path: `${hostUrl}/image/${file.path}`,
                })),
            };
    
            return spaceWithUrls;
    
        } catch (error) {
            console.error('Erro ao buscar espaço no serviço:', error);
            throw new Error('Erro ao buscar espaço no serviço');
        }
    }
    

    
    
    


    public async find(uuid: string): Promise<FindOutputDto_Service | null> {
        try {
            const space = await this.repository.find(uuid);
            if (!space) {
                return null;
            }
            return this.mapToFindOutputDto(space);
        } catch (error) {
            throw new Error("Erro ao buscar notificação");
        }
    }

    

    public async list(): Promise<ListOutputDto_Service[]> {
        try {
            const spaces = await this.repository.list();
            return spaces.map(this.mapToListOutputDto);
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao listar notificações");
        }
    }


    public async update(spaceDto: UpdateInputDto_Service): Promise<void> {
        try {
            await this.repository.update({
                uuid: spaceDto.uuid,
                name: spaceDto.name,
                location: spaceDto.location,
                capacity: spaceDto.capacity,
                type: spaceDto.type,
                equipment: spaceDto.equipment,
                activityStatus: spaceDto.activityStatus,
            });
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao atualizar notificação");
        }
    }

    // Deleta uma notificação pelo UUID
    public async delete(uuid: string): Promise<void> {
        try {
            await this.repository.delete(uuid);
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao deletar notificação");
        }
    }

    // Método privado para mapear um objeto de repositório para FindOutputDto
    private mapToFindOutputDto(space: FindOutputDto_repository): FindOutputDto_Service {
        return {
            uuid: space.uuid,
            name: space.name,
            location: space.location,
            capacity: space.capacity,
            type: space.type,
            equipment: space.equipment,
            activityStatus: space.activityStatus,
        };
    }

    // Método privado para mapear um objeto de repositório para ListOutputDto
    private mapToListOutputDto(space: ListOutputDto_repository): ListOutputDto_Service {
        return {
            uuid: space.uuid,
            name: space.name,
            location: space.location,
            capacity: space.capacity,
            type: space.type,
            equipment: space.equipment,
            activityStatus: space.activityStatus,
        };
    }
}
