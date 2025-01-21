import { PrismaClient } from "@prisma/client";
import { FindOutputDto_repository, ListRepositoryOutputDto_repository, SportCoutRepositoryInterface, ListRepositoryOutputDtoArraySportCout_repository, SportCoutUpdateInputDto_repository } from "../SportsCoutRepositoryInterface";
import { SportsCout } from "../../../entities/SportsCout";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';



// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class SportsCoutRepository implements SportCoutRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}
    public static build(prisma: PrismaClient) {
        return new SportsCoutRepository(prisma);
    }


    
    // Save (Create)
    public async save(sportsCout: SportsCout): Promise<void> {
        try {

        await this.prisma.sportsCout.create({
            data: {
                uuid: sportsCout.getUuid(),
                name: sportsCout.getName(),
                opening: sportsCout.getOpening(),
                closest: sportsCout.getClosest(),
                districtUuid: sportsCout.getDistrictUuid()
            },
        });
    } catch (error) {
        console.error("Error while creating reservation:", error);
        throw new Error("Erro ao criar notificação");
    }
    }

    // Find (Read)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        const sportsCout = await this.prisma.sportsCout.findUnique({ where: { uuid } });
        if (!sportsCout) return null;
        return {
            uuid: sportsCout.uuid,
            name: sportsCout.name,
            opening: sportsCout.opening,
            closest: sportsCout.closest,
        };
    }

    public async list(): Promise<ListRepositoryOutputDto_repository[]> {
        const sportsCout = await this.prisma.sportsCout.findMany();
    
        if (!sportsCout) {
            return [];
        }

        // Define o fuso horário brasileiro (BRT)
        const timeZone = 'America/Sao_Paulo';
    
        return sportsCout.map(sportCout => {
            // Extrair apenas as horas no formato HH:mm
            const formatTime = (date: Date): string => {
                return date.toISOString().substring(11, 16); // Extrai HH:mm da string ISO
            };

            
            return {
                uuid: sportCout.uuid,
                name: sportCout.name,
                opening: dayjs(sportCout.opening).utc().tz(timeZone).format('HH:mm'), // Formata a hora da abertura
                closest: dayjs(sportCout.closest).utc().tz(timeZone).format('HH:mm'), // Formata a hora de fechamento
            };
        });
    }
    
    


    // ListArrayList (Read)
    public async listArrayUsers(): Promise<ListRepositoryOutputDtoArraySportCout_repository> {
        const aSportsCout = await this.prisma.sportsCout.findMany();

        const sportsCout = aSportsCout.map(sportCout => ({
            uuid: sportCout.uuid,
            name: sportCout.name,
            opening: sportCout.opening,
            closest: sportCout.closest,
        }));

        return { sportsCout };
    }



    // Update
    public async update(userDto: SportCoutUpdateInputDto_repository): Promise<void> {
        const { uuid, name, opening, closest } = userDto;
        await this.prisma.sportsCout.update({
            where: { uuid },
            data: {
                name,
                opening,
                closest

            },
        });
    }

    // Delete
    public async delete(uuid: string): Promise<void> {
        await this.prisma.sportsCout.delete({
            where: { uuid },
        });
    }




}