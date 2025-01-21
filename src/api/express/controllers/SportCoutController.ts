import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { ReservationRepository } from "../../../repositories/reservation/prisma/ReservationRepository";
import { ReservationService } from "../../../services/reservation/ReservationService";
import Joi from 'joi';
import {  CreateResponsibleInputDto, CreateSportsCoutHasResponsibleAddResponsibleInputDto, CreateSportsCoutHasResponsibleInputDto } from "../../../services/reservation/ReservationServiceInterface";
import { SportsCoutService } from "../../../services/sportCout/SportCoutService";
import { SportsCoutRepository } from "../../../repositories/sportCout/prisma/SportCoutRepository";

export class SportCoutController {
    private sportCoutService: SportsCoutService;

    constructor(sportCoutService: SportsCoutService) {
        this.sportCoutService = sportCoutService;
    }

    // Método estático para construir o controlador
    public static build() {
        const sportCoutRepository = SportsCoutRepository.build(prisma);
        const sportCoutService = SportsCoutService.build(sportCoutRepository);
        return new SportCoutController(sportCoutService);
    }



   


    public async getAllSportCout(request: Request, response: Response): Promise<Response> {
        try {

            const output = await this.sportCoutService.getAllSportCout();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }



    


}
