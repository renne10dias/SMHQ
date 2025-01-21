import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { UserRepository } from "../../../repositories/user/prisma/UserRepository";
import { UserService } from "../../../services/user/UserService";
import { User } from "../../../entities/User";

export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    // Método estático para construir o controlador
    public static build() {
        const userRepository = UserRepository.build(prisma);
        const userService = UserService.build(userRepository);
        return new UserController(userService);
    }

    // Método para criar uma notificação
    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { name, surname, email, password, user_types_id } = request.body;

            // Validação de dados (pode ser feita com uma biblioteca como Joi ou class-validator)

            const space = new User(name, surname, email, password, true, user_types_id, undefined, undefined); // UUID será gerado no serviço
            const output = await this.userService.save(space);

            return response.status(201).json(output); // Status 201 para criação
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async registerUser(request: Request, response: Response): Promise<Response> {
        try {
            const { name, surname, email, password } = request.body;

            // Validação de dados (pode ser feita com uma biblioteca como Joi ou class-validator)

            const space = new User(name, surname, email, password, true, "abcdef12-3456-7890-abcd-ef1234567890", undefined, undefined); // UUID será gerado no serviço
            const output = await this.userService.save(space);

            return response.status(201).json(output); // Status 201 para criação
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    public async list(request: Request, response: Response): Promise<Response> {
        try {
            const output = await this.userService.list();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }

    






}
