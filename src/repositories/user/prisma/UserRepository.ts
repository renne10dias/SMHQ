import { PrismaClient } from "@prisma/client";
import { FindOutputDto_repository, ListRepositoryOutputDto_repository, UserRepositoryInterface, ListRepositoryOutputDtoArrayUsers_repository, UserUpdateInputDto_repository } from "../UserRepositoryInterface";
import { User } from "../../../entities/User";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class UserRepository implements UserRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}
    public static build(prisma: PrismaClient) {
        return new UserRepository(prisma);
    }


    
    // Save (Create)
    public async save(user: User): Promise<void> {
        try {
        // Obtém a data atual em UTC
        const createdAt = dayjs().utc().toDate(); // Obtemos a data atual no formato UTC

        await this.prisma.user.create({
            data: {
                uuid: user.getUuid(),
                name: user.getName(),
                email: user.getEmail(),
                password: user.getPasswordHash(),
                createdAt: createdAt,
            },
        });
    } catch (error) {
        console.error("Error while creating reservation:", error);
        throw new Error("Erro ao criar notificação");
    }
    }

    // Find (Read)
    public async find(uuid: string): Promise<FindOutputDto_repository | null> {
        const user = await this.prisma.user.findUnique({ where: { uuid } });
        if (!user) return null;
        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        };
    }

    // List (Read)
    public async list(): Promise<ListRepositoryOutputDto_repository[]> {
        const users = await this.prisma.user.findMany();
    
        return users.map(user => ({
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
        }));
      }
    


    // ListArrayList (Read)
    public async listArrayUsers(): Promise<ListRepositoryOutputDtoArrayUsers_repository> {
        const aUsers = await this.prisma.user.findMany();

        const users = aUsers.map(user => ({
            uuid: user.uuid,
            name: user.name, 
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        }));

        return { users };
    }



    // Update
    public async update(userDto: UserUpdateInputDto_repository): Promise<void> {
        const { uuid, name, email, password } = userDto;
        await this.prisma.user.update({
            where: { uuid },
            data: {
                name,
                email,
                password
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