import { PrismaClient } from "@prisma/client";
import { FindOutputDto_repository, ListRepositoryOutputDto_repository, DistrictRepositoryInterface, ListRepositoryOutputDtoArrayDistricts_repository, DistrictUpdateInputDto_repository } from "../DistrictRepositoryInterface";
import { District } from "../../../entities/District";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class DistrictRepository implements DistrictRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}
    public static build(prisma: PrismaClient) {
        return new DistrictRepository(prisma);
    }


    
    // Save (Create)
    public async save(district: District): Promise<void> {
        try {

        await this.prisma.district.create({
            data: {
                uuid: district.getUuid(),
                name: district.getName(),
                userUuid: district.getUserUuid(),
            },
        });
    } catch (error) {
        console.error("Error while creating reservation:", error);
        throw new Error("Erro ao criar notificação");
    }
    }

    // Find (Read)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        const district = await this.prisma.district.findUnique({ where: { uuid } });
        if (!district) return null;
        return {
            uuid: district.uuid,
            name: district.name,
            user_uuid: district.uuid,
        };
    }

    // List (Read)
    public async list(): Promise<ListRepositoryOutputDto_repository[]> {
        const districts = await this.prisma.district.findMany();
    
        return districts.map(district => ({
          uuid: district.uuid,
          name: district.name,
          user_uuid: district.uuid,
        }));
      }
    


    // ListArrayList (Read)
    public async listArrayUsers(): Promise<ListRepositoryOutputDtoArrayDistricts_repository> {
        const aDistricts = await this.prisma.district.findMany();

        const districts = aDistricts.map(district => ({
            uuid: district.uuid,
            name: district.name, 
            user_uuid: district.uuid,
        }));

        return { districts };
    }



    // Update
    public async update(userDto: DistrictUpdateInputDto_repository): Promise<void> {
        const { uuid, name } = userDto;
        await this.prisma.user.update({
            where: { uuid },
            data: {
                name,
            },
        });
    }

    // Delete
    public async delete(uuid: string): Promise<void> {
        await this.prisma.user.delete({
            where: { uuid },
        });
    }




}