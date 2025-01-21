import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import crypto from "crypto";  // For UUID generation
import { subMinutes, isBefore } from 'date-fns'; // Biblioteca de manipulação de datas


import { ReservationRepositoryInterface, 
    CreateResponsibleInputDto,
    CreateSportsCoutHasResponsibleInputDto,
    CreateSportsCoutHasReservationInputDto,
    SportsCoutHasResponsibleOutputDto,
    ReservationsWithResponsibleAndSportsCout
        } from "../ReservationRepositoryInterface";



// Extende Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReservationRepository implements ReservationRepositoryInterface {

    private constructor(readonly prisma: PrismaClient) {}

    // Método estático para construir o repositório
    public static build(prisma: PrismaClient) {
        return new ReservationRepository(prisma);
    }



    public async isEmailExists(email: string): Promise<boolean> {
      try {
          // Verifica se existe um registro com o email fornecido
          const responsible = await this.prisma.responsible.findFirst({
              where: {
                  email: email,
              },
          });
  
          // Retorna true se o email for encontrado, false caso contrário
          return responsible !== null;
      } catch (error) {
          console.error('Error checking if email exists:', error);
          throw new Error('Failed to check email existence.');
      }
    }



      public async createReservationWithResponsible(responsibleData: CreateResponsibleInputDto, assignmentData: CreateSportsCoutHasResponsibleInputDto): Promise<boolean> {
        try {
    
            const uuid_responsible = crypto.randomUUID();
    
            // Inicia a transação
            await this.prisma.$transaction(async (prisma) => {
                // Primeiro, insere o registro na tabela `responsible`
                await prisma.responsible.create({
                    data: {
                        uuid: uuid_responsible,
                        name: responsibleData.name,
                        address: responsibleData.address,
                        phone: responsibleData.phone,
                        email: responsibleData.email,
                    },
                });
    
                // Depois, insere o registro na tabela `sports_cout_has_responsible`
                await prisma.sportsCoutHasResponsible.create({
                    data: {
                        initHour: assignmentData.initHour,
                        endHour: assignmentData.endHour,
                        enabled: assignmentData.enabled,
                        observations: assignmentData.observations,
                        sportsCoutUuid: assignmentData.sportsCoutUuid,
                        responsibleUuid: uuid_responsible, // Usa o UUID do responsável criado
                    },
                });
            });
    
            return true; // Retorna true se a criação for bem-sucedida
        } catch (error) {
            console.error('Error while creating reservation:', error);
            return false; // Retorna false se ocorrer um erro
        }
    }


    public async isTimeSlotTaken(initHour: Date, endHour: Date, sportsCoutUuid: string): Promise<boolean> {
      try {
          // Consulta se há algum registro no intervalo de horários fornecido para o mesmo `sportsCoutUuid`
          const conflictingReservation = await this.prisma.sportsCoutHasResponsible.findFirst({
              where: {
                  sportsCoutUuid: sportsCoutUuid, // Filtra pelo mesmo `sportsCoutUuid`
                  OR: [
                      {
                          // Verifica se o horário inicial está dentro de um intervalo existente
                          initHour: {
                              lte: endHour, // Menor ou igual ao horário final fornecido
                          },
                          endHour: {
                              gte: initHour, // Maior ou igual ao horário inicial fornecido
                          },
                      },
                  ],
              },
          });
  
          // Retorna true se houver um horário conflitante, false caso contrário
          return conflictingReservation !== null;
      } catch (error) {
          console.error('Error while checking for time slot conflicts:', error);
          throw new Error('Failed to check time slot conflicts.');
      }
  }


  public async isReservationWithinOpeningHours(sportsCoutUuid: string, initHour: Date, endHour: Date): Promise<boolean> {
    try {
        // Busca o horário de abertura e fechamento do `sports_cout`
        const sportsCout = await this.prisma.sportsCout.findUnique({
            where: { uuid: sportsCoutUuid },
            select: {
                opening: true,
                closest: true,
            },
        });

        // Se o `sports_cout` não existir, lança um erro
        if (!sportsCout) {
            throw new Error(`SportsCout with UUID ${sportsCoutUuid} not found.`);
        }

        // Converte os horários de abertura e fechamento para objetos `Date`
        const openingHour = new Date(sportsCout.opening);
        const closingHour = new Date(sportsCout.closest);

        // Verifica se o horário de início e término estão dentro do intervalo permitido
        const isValid = initHour >= openingHour && endHour <= closingHour;

        return isValid;
    } catch (error) {
        console.error('Error while validating reservation time:', error);
        throw new Error('Failed to validate reservation time.');
    }
}

  
  



      public async createReservationAddResponsible(assignmentData: CreateSportsCoutHasReservationInputDto): Promise<boolean> {
        try {

            await this.prisma.$transaction(async (prisma) => {
                // Insere o registro na tabela `sports_cout_has_responsible`
                await prisma.sportsCoutHasResponsible.create({
                data: {
                    initHour: assignmentData.initHour,
                    endHour: assignmentData.endHour,
                    enabled: assignmentData.enabled,
                    observations: assignmentData.observations,
                    sportsCoutUuid: assignmentData.sportsCoutUuid,
                    responsibleUuid: assignmentData.responsibleCoutUuid, // UUID do responsável existente
                },
                });
            });
      
            return true; // Retorna true se a criação for bem-sucedida

        } catch (error) {
            console.error("Error while creating reservation:", error);    
            return false; // Retorna false se ocorrer um erro
        }
      }



      public async listAllReservations(): Promise<SportsCoutHasResponsibleOutputDto[]> {
        try {
            // Consulta todos os registros na tabela `sports_cout_has_responsible`
            const reservations = await this.prisma.sportsCoutHasResponsible.findMany();
    
            if (!reservations) {
                return [];
            }
    
            // Define o fuso horário brasileiro (BRT)
            const timeZone = 'America/Sao_Paulo';
    
            // Retorna os dados convertidos para o fuso horário brasileiro
            return reservations.map((reservation) => {
                const initHourInBRT = dayjs(reservation.initHour).utc().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
                const endHourInBRT = dayjs(reservation.endHour).utc().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    
                return {
                    uuid: reservation.uuid,
                    initHour: initHourInBRT,
                    endHour: endHourInBRT,
                    enabled: reservation.enabled,
                    observations: reservation.observations,
                    sportsCoutUuid: reservation.sportsCoutUuid,
                    responsibleUuid: reservation.responsibleUuid,
                };
            });
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw new Error('Failed to fetch reservations.');
        }
    }


    public async listReservationsBySportsCoutUuid(sportsCoutUuid: string): Promise<SportsCoutHasResponsibleOutputDto[]> {
      try {
          // Consulta todos os registros na tabela `sports_cout_has_responsible` filtrando pelo uuid da sports_cout
          const reservations = await this.prisma.sportsCoutHasResponsible.findMany({
              where: {
                  sportsCoutUuid: sportsCoutUuid, // Filtro pelo uuid da sports_cout
              },
          });
  
          if (!reservations || reservations.length === 0) {
              return []; // Retorna lista vazia se não houver registros
          }
  
          // Define o fuso horário brasileiro (BRT)
          const timeZone = 'America/Sao_Paulo';
  
          // Retorna os dados convertidos para o fuso horário brasileiro
          return reservations.map((reservation) => {
              const initHourInBRT = dayjs(reservation.initHour).utc().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
              const endHourInBRT = dayjs(reservation.endHour).utc().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
  
              return {
                  uuid: reservation.uuid,
                  initHour: initHourInBRT,
                  endHour: endHourInBRT,
                  enabled: reservation.enabled,
                  observations: reservation.observations,
                  sportsCoutUuid: reservation.sportsCoutUuid,
                  responsibleUuid: reservation.responsibleUuid,
              };
          });
        } catch (error) {
            console.error('Error fetching reservations by sportsCoutUuid:', error);
            throw new Error('Failed to fetch reservations by sportsCoutUuid.');
        }
     }
  


      public async listAllReservationsWithResponsibleAndSportsCout(uuid: string): Promise<ReservationsWithResponsibleAndSportsCout[]> {
        try {
            // Consulta todos os registros na tabela `sports_cout_has_responsible`
            const reservations = await this.prisma.sportsCoutHasResponsible.findMany({
              where: {
                uuid: uuid, // Find the reservation by UUID
            },
              include: {
                responsible: true, // Inclui os dados do responsável relacionado
                sportsCout: true,  // Inclui os dados do esporte relacionado
              },
            });

            if (!reservations) {
               return [];
            }
        
            // Define o fuso horário brasileiro (BRT)
            const timeZone = 'America/Sao_Paulo';

            

            // Mapeia os registros para o formato de saída desejado
            return reservations.map((reservation) => ({
              initHour: dayjs(reservation.initHour).utc().tz(timeZone).format('YYYY-MM-DD HH:mm:ss'),
              endHour: dayjs(reservation.endHour).utc().tz(timeZone).format('YYYY-MM-DD HH:mm:ss'),
              enabled: reservation.enabled,
              observations: reservation.observations,
              sportsCoutUuid: reservation.sportsCoutUuid,
              responsibleUuid: reservation.responsibleUuid,
              responsible: {
                uuid: reservation.responsible?.uuid || null,
                name: reservation.responsible?.name || null,
                email: reservation.responsible?.email || null,
                phone: reservation.responsible?.phone || null,
                address: reservation.responsible?.address || null,
              },
              sportsCout: {
                uuid: reservation.sportsCout?.uuid || null,
                name: reservation.sportsCout?.name || null,
                opening: reservation.sportsCout?.opening || null,
                closest: reservation.sportsCout?.closest || null,
              },
            }));

        } catch (error) {
          console.error('Error fetching reservations:', error);
          throw new Error('Failed to fetch reservations.');
        }
      }




      public async getResponsibleDetailsByUuid(reservationUuid: string, sportsCoutUuid: string, responsibleUuid: string): Promise<{ name: string; email: string } | null> {
        try {
            // Consulta o registro na tabela `sports_cout_has_responsible` e retorna os dados do responsável associado
            const record = await this.prisma.sportsCoutHasResponsible.findUnique({
                where: {
                    uuid_sportsCoutUuid_responsibleUuid: {
                        uuid: reservationUuid,
                        sportsCoutUuid: sportsCoutUuid,
                        responsibleUuid: responsibleUuid,
                    },
                },
                include: {
                    responsible: true, // Inclui os dados do responsável associado
                },
            });
    
            // Verifica se o registro foi encontrado
            if (!record || !record.responsible) {
                return null; // Retorna null se não houver responsável associado
            }
    
            // Retorna o nome e o email do responsável
            return {
                name: record.responsible.name,
                email: record.responsible.email || '', // Garante que o e-mail não seja undefined
            };
        } catch (error) {
            console.error(
                `Error fetching responsible details for sportsCoutUuid ${sportsCoutUuid} and responsibleUuid ${responsibleUuid}:`,
                error
            );
            throw new Error('Failed to fetch responsible details.');
        }
    }
    



      public async updateEnabledStatus(uuid: string, sportsCoutUuid: string, responsibleCoutUuid: string, newStatus: boolean, observations: string): Promise<boolean> {
        try {
            // Atualiza o campo `enabled` pelo `uuid`
            const updatedRecord = await this.prisma.sportsCoutHasResponsible.update({
              where: {
                uuid_sportsCoutUuid_responsibleUuid: {
                  uuid: uuid,
                  sportsCoutUuid: sportsCoutUuid,
                  responsibleUuid: responsibleCoutUuid
                }
            },
                data: { 
                  enabled: newStatus,
                  observations
                },
            });
    
            // Retorna true se a atualização foi bem-sucedida
            return !!updatedRecord;
        } catch (error) {
            console.error(`Error updating enabled status for uuid ${uuid}:`, error);
            throw new Error('Failed to update enabled status.');
        }
     }




     public async getAllResponsibles(): Promise<{ uuid: string; name: string; email: string | null; phone: string | null }[]> {
        try {
            // Consulta todos os registros da tabela `responsible`
            const responsibles = await this.prisma.responsible.findMany({
              select: {
                  uuid: true,
                  name: true,
                  email: true,
                  phone: true,
              },
            });
    
            if (!responsibles) {
                return [];
            }
    
            return responsibles;
          
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw new Error('Failed to fetch reservations.');
        }
    }



    public async searchResponsiblesByName(name: string): Promise<{ uuid: string; name: string }[]> {
      try {
          // Consulta registros na tabela `responsible` com filtro pelo nome
          const responsibles = await this.prisma.responsible.findMany({
              where: {
                  name: {
                      contains: name, // Equivalente ao operador LIKE, busca parcial
                      // mode: 'insensitive', // Torna a busca case-insensitive
                  },
              },
              select: {
                  uuid: true,
                  name: true,
                  email: true
              },
          });
  
          // Retorna os resultados encontrados ou uma lista vazia
          return responsibles || [];
      } catch (error) {
          console.error('Error searching responsibles by name:', error);
          throw new Error('Failed to search responsibles by name.');
      }
  }
  

     
    
      
      
      




    

}
