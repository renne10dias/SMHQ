import { Request, Response } from "express";
import { prisma } from "../../../util/prisma.util";
import { ReservationRepository } from "../../../repositories/reservation/prisma/ReservationRepository";
import { ReservationService } from "../../../services/reservation/ReservationService";
import Joi from 'joi';
import {  CreateResponsibleInputDto, CreateSportsCoutHasResponsibleAddResponsibleInputDto, CreateSportsCoutHasResponsibleInputDto } from "../../../services/reservation/ReservationServiceInterface";

export class ReservationController {
    private reservationService: ReservationService;

    constructor(reservationService: ReservationService) {
        this.reservationService = reservationService;
    }

    // Método estático para construir o controlador
    public static build() {
        const reservationRepository = ReservationRepository.build(prisma);
        const reservationService = ReservationService.build(reservationRepository);
        return new ReservationController(reservationService);
    }



    // Método para criar uma reserva
    public async createReservationWithResponsible(request: Request, response: Response): Promise<Response> {

        
        // Definição do schema de validação usando Joi
        const responsible = Joi.object({ 
            initHour: Joi.string().required(),  
            endHour: Joi.string().required(),  
            observations: Joi.string().required(), 
            sportsCoutUuid: Joi.string().uuid().required(),  
            name: Joi.string().required(),  
            address: Joi.string().required(),    
            phone: Joi.string().required(),    
            email: Joi.string().required(),  
        });

        // Validação do corpo da requisição
        const { error } = responsible.validate(request.body);
        if (error) {
            return response.status(400).json({ error: 'Validation error controller: ' + error.details[0].message });
        }

        

        try {
            // Extração dos dados da requisição
            const { name, address, phone, email } = request.body;
            const { initHour, endHour, observations, sportsCoutUuid } = request.body;
            const userUuid = request.user?.uuid; 

        

            const assignmentDataResponsible: CreateResponsibleInputDto = {
                name,
                address,
                phone,
                email,
              };


              const assignmentDataSportCout: CreateSportsCoutHasResponsibleInputDto = {
                initHour,
                endHour,
                enabled: true,
                observations,
                sportsCoutUuid, // UUID do esporte já existente
              };
            
            

            // Chamada do serviço de criação da reserva
            // Chamada do serviço de criação da reserva
            const output = await this.reservationService.createReservationWithResponsible(assignmentDataResponsible, assignmentDataSportCout);

            switch (output['httpCode']) {
                case 201:
                    return response.status(201).json({ message: "Reserva criada com sucesso." });
                case 203:
                    return response.status(201).json({ message: "Esta quadra não está funcionando para esse horário." });
                case 409:
                    return response.status(409).json({ message: "Email já cadastrado." });
                case 401:
                    return response.status(401).json({ message: "horário ocupado" });
                case 500:
                    return response.status(500).json({ message: "Falha ao criar reserva." });
                default:
                    return response.status(400).json({ message: "Erro inesperado. Por favor, tente novamente." });
            }


            // Retorna sucesso com o objeto criado
            return response.status(201).json(output);

        } catch (error) {
            // Tratamento de erros inesperados
            console.error("Error while creating reservation:", error);
            return response.status(500).json({ error: (error as Error).message });
        }
    } 



    public async createReservationAddResponsible(request: Request, response: Response): Promise<Response> {

        
        // Definição do schema de validação usando Joi
        const responsible = Joi.object({ 
            initHour: Joi.string().required(),  
            endHour: Joi.string().required(),  
            observations: Joi.string().required(), 
            sportsCoutUuid: Joi.string().uuid().required(),  
            responsibleCoutUuid: Joi.string().uuid().required()
        });

        // Validação do corpo da requisição
        const { error } = responsible.validate(request.body);
        if (error) {
            return response.status(400).json({ error: 'Validation error controller: ' + error.details[0].message });
        }

        

        try {
            // Extração dos dados da requisição
            const { initHour, endHour, observations, sportsCoutUuid, responsibleCoutUuid } = request.body;
            const userUuid = request.user?.uuid; 

        


              const assignmentDataSportCout: CreateSportsCoutHasResponsibleAddResponsibleInputDto = {
                initHour,
                endHour,
                enabled: true,
                observations,
                sportsCoutUuid,
                responsibleCoutUuid,
              };
            
            

            // Chamada do serviço de criação da reserva
            // Chamada do serviço de criação da reserva
            const output = await this.reservationService.createReservationAddResponsible(assignmentDataSportCout);

            switch (output['httpCode']) {
                case 201:
                    return response.status(201).json({ message: "Reserva criada com sucesso." });
                case 203:
                    return response.status(201).json({ message: "Esta quadra não está funcionando para esse horário." });
                case 409:
                    return response.status(409).json({ message: "Email já cadastrado." });
                case 401:
                    return response.status(401).json({ message: "horário ocupado" });
                case 500:
                    return response.status(500).json({ message: "Falha ao criar reserva." });
                default:
                    return response.status(400).json({ message: "Erro inesperado. Por favor, tente novamente." });
            }


            // Retorna sucesso com o objeto criado
            return response.status(201).json(output);

        } catch (error) {
            // Tratamento de erros inesperados
            console.error("Error while creating reservation:", error);
            return response.status(500).json({ error: (error as Error).message });
        }
    } 



    public async listReservationsBySportsCoutUuid(request: Request, response: Response): Promise<Response> {
        try {

            const { sportsCoutUuid } = request.params;

            const output = await this.reservationService.listReservationsBySportsCoutUuid(sportsCoutUuid);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async getReservationsWithResponsibleAndSportsCout(request: Request, response: Response): Promise<Response> {
        try {

            const { reservationUuid } = request.params;

            const output = await this.reservationService.listAllReservationsWithResponsibleAndSportsCout(reservationUuid);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async updateEnabledStatus(request: Request, response: Response): Promise<Response> {

        // Definição do schema de validação usando Joi
        const responsible = Joi.object({ 
            newStatus: Joi.boolean().required(), 
            observations: Joi.string().required()
        });

        // Validação do corpo da requisição
        const { error } = responsible.validate(request.body);
        if (error) {
            return response.status(400).json({ error: 'Validation error controller: ' + error.details[0].message });
        }


        try {

            const { reservationUuid, sportsCoutUuid, responsibleCoutUuid } = request.params;
            const { newStatus, observations } = request.body;

            const output = await this.reservationService.updateEnabledStatus(reservationUuid, sportsCoutUuid, responsibleCoutUuid, newStatus, observations);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async getAllResponsibles(request: Request, response: Response): Promise<Response> {
        try {

            const output = await this.reservationService.getAllResponsibles();

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }


    public async searchResponsiblesByName(request: Request, response: Response): Promise<Response> {
        try {

            const { name } = request.params;

            const output = await this.reservationService.searchResponsiblesByName(name);

            // Retorna a resposta com status 200 (OK) e os dados formatados
            return response.status(200).json(output);
        } catch (error) {
            return response.status(500).json({ error: (error as Error).message });
        }
    }
    


}
