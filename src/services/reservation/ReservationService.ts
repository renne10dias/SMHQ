import { ReservationRepositoryInterface } from "../../repositories/reservation/ReservationRepositoryInterface";
import { ReservationRepository } from "../../repositories/reservation/prisma/ReservationRepository";
import crypto from "crypto";  // For UUID generation
import { CreateOutputDto_service, 
        ReservationServiceInterface,
        CreateSportsCoutHasResponsibleInputDto,
        CreateSportsCoutHasResponsibleAddResponsibleInputDto,
        CreateResponsibleInputDto } from "../../services/reservation/ReservationServiceInterface";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Request } from 'express';
import { EmailService } from "../../util/email/EmailService ";


// Extend Day.js with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReservationService implements ReservationServiceInterface {
    
    private constructor(readonly repository: ReservationRepositoryInterface) {}
    
    // Método estático para construir o serviço
    public static build(repository: ReservationRepository) {
        return new ReservationService(repository);
    }


    public async createReservationWithResponsible(responsible: CreateResponsibleInputDto, reservation: CreateSportsCoutHasResponsibleInputDto): Promise<CreateOutputDto_service> {
        
        try {

            const isValid = await this.repository.isReservationWithinOpeningHours(reservation.sportsCoutUuid, reservation.initHour, reservation.endHour);

            if (!isValid) { 
                return {
                    httpCode: 203
                };
            } 



            // Verifica se o email já existe
            const emailExists = await this.repository.isEmailExists(responsible.email);
            if (emailExists) {
                return {
                    httpCode: 409
                };
            }



            const isTaken = await this.repository.isTimeSlotTaken(reservation.initHour, reservation.endHour, reservation.sportsCoutUuid);

            if (isTaken) {
                return {
                    httpCode: 401
                };
            } 


            
            // Tenta criar a reserva no repositório
            const result = await this.repository.createReservationWithResponsible(responsible, reservation);
            if (result) {
                return {
                    httpCode: 201
                };
            } else {
                return {
                    httpCode: 500
                };
            }
    
        } catch (error) {
            console.error("Erro ao criar a reserva:", error);
            throw new Error("Erro ao criar a reserva, tente novamente mais tarde.");
        }
    }




    public async createReservationAddResponsible(reservation: CreateSportsCoutHasResponsibleAddResponsibleInputDto): Promise<CreateOutputDto_service> {
        
        try {

            const isValid = await this.repository.isReservationWithinOpeningHours(reservation.sportsCoutUuid, reservation.initHour, reservation.endHour);

            if (!isValid) { 
                return {
                    httpCode: 203
                };
            } 

            const isTaken = await this.repository.isTimeSlotTaken(reservation.initHour, reservation.endHour, reservation.sportsCoutUuid);

            if (isTaken) {
                return {
                    httpCode: 401
                };
            } 


            // Tenta criar a reserva no repositório
            const result = await this.repository.createReservationAddResponsible(reservation);
            if (result) {
                return {
                    httpCode: 201
                };
            } else {
                return {
                    httpCode: 500
                };
            }
    
        } catch (error) {
            console.error("Erro ao criar a reserva:", error);
            throw new Error("Erro ao criar a reserva, tente novamente mais tarde.");
        }
    }


    public async listReservationsBySportsCoutUuid(sportsCoutUuid: string) {
        try {
            const reservations = await this.repository.listReservationsBySportsCoutUuid(sportsCoutUuid);

            if (!reservations || reservations.length === 0) {
                return {
                    message: "Nenhuma reserva encontrada."
                };
            }


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }

    public async listAllReservationsWithResponsibleAndSportsCout(uuid: string) {
        try {
            const reservations = await this.repository.listAllReservationsWithResponsibleAndSportsCout(uuid);

            if (!reservations || reservations.length === 0) {
                return {
                    message: "Nenhuma reserva encontrada."
                };
            }


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }


    public async updateEnabledStatus(reservationUuid: string, sportsCoutUuid: string, responsibleCoutUuid: string, newStatus: boolean, observations: string) {
        try {
            const reservations = await this.repository.updateEnabledStatus(reservationUuid, sportsCoutUuid, responsibleCoutUuid, newStatus, observations);

            // Se necessário, você pode realizar mais lógica de negócios aqui
            if (!reservations) {
                return {
                    message: "Nenhuma reserva encontrada."
                };
            } 

            const responsible = await this.repository.getResponsibleDetailsByUuid(reservationUuid, sportsCoutUuid, responsibleCoutUuid);
            
            if (!responsible) {
                throw new Error('Responsável não encontrado.');
            }

            (async () => {
                const emailService = new EmailService();
              
                try {
                  await emailService.sendEmail(
                    "projetosdiasdev@gmail.com", // Nome e e-mail do remetente
                    responsible.email, // Destinatário
                    "Cancelamento de horário de reserva", // Assunto
                    "Reserva Cancelada", // Texto
                    `<p>${observations}</p>` // HTML opcional
                  );
              
                  console.log("E-mail enviado com sucesso!");
                } catch (error) {
                  console.error("Erro ao enviar o e-mail:", error);
                }
              })();
              

            return {
                message: "Reserva desativada com sucesso."
            };


        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }


    public async getAllResponsibles() {
        try {
            const responsibles = await this.repository.getAllResponsibles();

            if (!responsibles || responsibles.length === 0) {
                return {
                    message: "Nenhuma reserva encontrada."
                };
            }


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return responsibles;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }



    public async searchResponsiblesByName(name: string) {
        try {
            const responsibles = await this.repository.searchResponsiblesByName(name);

            if (!responsibles || responsibles.length === 0) {
                return {
                    message: "Nenhuma usuário encontrado."
                };
            }


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return responsibles;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }

   






}
