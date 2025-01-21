import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SportCoutServiceInterface } from "./SportCoutServiceInterface";
import { SportsCoutRepository } from "../../repositories/sportCout/prisma/SportCoutRepository";
import { SportCoutRepositoryInterface } from "../../repositories/sportCout/SportsCoutRepositoryInterface";


// Extend Day.js with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export class SportsCoutService implements SportCoutServiceInterface  {
    
    
    private constructor(readonly repository: SportCoutRepositoryInterface) {}
    
    // Método estático para construir o serviço
    public static build(repository: SportsCoutRepository) {
        return new SportsCoutService(repository);
    }



    public async getAllSportCout() {
        try {
            const reservations = await this.repository.list();

            if (!reservations || reservations.length === 0) {
                return {
                    message: "Nenhuma espaço encontrado."
                };
            }


            // Se necessário, você pode realizar mais lógica de negócios aqui
            return reservations;

        } catch (error) {
            console.error('Erro ao buscar reserva com turno no serviço:', error);
            throw new Error('Erro ao buscar reserva no serviço');
        }
    }


   


}
