import { PrismaClient } from "@prisma/client";
import {
    FindOutputDto_repository,
    ListOutputDto_repository,
    SpaceRepositoryInterface,
    UpdateInputDto_repository,
    ListSpaceWithFileOutputDto_repository,
    ListSpaceWithFileAllOutputDto_repository,
    FindSpaceOutputDto_repository
} 
from "../SpaceRepositoryInterface";
import { Space } from "../../../entities/Space";


export class SpaceRepository implements SpaceRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}

    // Método estático para construir o repositório
    public static build(prisma: PrismaClient) {
        return new SpaceRepository(prisma);
    }





    // Create (Salvar uma nova notificação)
    public async create(space: Space, filePath: string): Promise<void> {
        const transaction = await this.prisma.$transaction(async (prisma) => {
            try {
                const newSpace = await prisma.space.create({
                    data: {
                        uuid: space.getUuid(),
                        name: space.getName(),
                        location: space.getLocation(),
                        capacity: space.getCapacity(),
                        type: space.getType(),
                        equipment: space.getEquipment(),
                        activityStatus: space.isActivityStatus() as boolean,
                    },
                });

                // Create the associated file entry
                await prisma.file.create({
                    data: {
                        uuid: newSpace.uuid, // Use the same UUID or generate a new one
                        path: filePath,
                        dateUpload: new Date(), // Current date as the upload date
                        spaceId: newSpace.uuid, // Reference to the created space
                    },
                });
            } catch (error) {
                console.error('Erro:', error);
                throw new Error("Erro ao criar espaço e arquivo - repository");
            }
        });

        return transaction;
    }


    // Listar espaços com os dados dos arquivos
    public async listSpacesWithFilesAll(): Promise<ListSpaceWithFileAllOutputDto_repository[]> {
        try {
            const spaces = await this.prisma.space.findMany({
                include: {
                    files: true, // Incluir arquivos relacionados ao espaço
                }
            });

            // Mapear os dados de saída para o DTO de retorno
            return spaces.map(space => ({
                uuid: space.uuid,
                name: space.name,
                location: space.location,
                capacity: space.capacity,
                type: space.type,
                equipment: space.equipment || "",
                activityStatus: space.activityStatus,
                files: space.files.map(file => ({
                    uuid: file.uuid,
                    path: file.path,
                    dateUpload: file.dateUpload,
                }))
            }));
        } catch (error) {
            console.error("Erro ao listar espaços com arquivos - repository", error);
            throw new Error("Erro ao listar espaços com arquivos - repository");
        }
    }


    // Listar espaços com os dados dos arquivos
    public async listSpaces(): Promise<ListSpaceWithFileOutputDto_repository[]> {
        try {
            const spaces = await this.prisma.space.findMany({
                include: {
                    files: true, // Incluir arquivos relacionados ao espaço
                }
            });

            // Mapear os dados de saída para o DTO de retorno
            return spaces.map(space => ({
                uuid: space.uuid,
                name: space.name,
                type: space.type,
                activityStatus: space.activityStatus,
                files: space.files.map(file => ({
                    path: file.path,
                }))
            }));
        } catch (error) {
            console.error("Erro ao listar espaços com arquivos - repository", error);
            throw new Error("Erro ao listar espaços com arquivos - repository");
        }
    }




    // Find (Buscar uma notificação por UUID)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        try {
            const space = await this.prisma.space.findUnique({ where: { uuid } });
            if (!space) {
                return null;
            }
            return {
                uuid: space.uuid,
                name: space.name,
                location: space.location,
                capacity: space.capacity,
                type: space.type,
                equipment: space.equipment as string,
                activityStatus: space.activityStatus,
        };
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao buscar espaço - repository");
        }
    }

     // Buscar espaço com os dados dos arquivos pelo UUID
     public async findSpaceById(uuid: string): Promise<FindSpaceOutputDto_repository | null> {
        try {
            const space = await this.prisma.space.findUnique({
                where: { uuid },
                include: {
                    files: true, // Incluir arquivos relacionados ao espaço
                },
            });

            if (!space) {
                return null; // Se o espaço não for encontrado, retornar null
            }

            // Mapear os dados de saída para o DTO de retorno
            return {
                uuid: space.uuid,
                name: space.name,
                location: space.location,
                capacity: space.capacity,
                type: space.type,
                equipment: space.equipment,
                files: space.files.map(file => ({
                    path: file.path,
                })),
            };
        } catch (error) {
            console.error("Erro ao buscar espaço por ID - repository", error);
            throw new Error("Erro ao buscar espaço por ID - repository");
        }
    }

    // List (Listar todas as notificações)
    public async list(): Promise<ListOutputDto_repository[]> {
        try {
            const spaces = await this.prisma.space.findMany();
            return spaces.map(space => ({
                uuid: space.uuid,
                name: space.name,
                location: space.location,
                capacity: space.capacity,
                type: space.type,
                equipment: space.equipment as string,
                activityStatus: space.activityStatus,
            }));
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao listar espaço - repository");
        }
    }

    // Update (Atualizar uma notificação existente)
    public async update(spaceDto: UpdateInputDto_repository): Promise<void> {
        const { uuid, name, location, capacity, type, equipment, activityStatus } = spaceDto;
        try {
            await this.prisma.space.update({
                where: { uuid },
                data: {
                    name,
                    location,
                    capacity,
                    type,
                    equipment,
                    activityStatus
                },
            });
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao atualizar espaço - repository");
        }
    }

    // Delete (Deletar uma notificação pelo UUID)
    public async delete(uuid: string): Promise<void> {
        try {
            await this.prisma.space.delete({
                where: { uuid },
            });
        } catch (error) {
            console.error('Erro:', error);
            throw new Error("Erro ao deletar espaço - repository");
        }
    }

    

    

    
    
}
