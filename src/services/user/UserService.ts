import { User } from "../../entities/User";
import { FindOutputDto_repository, ListRepositoryOutputDtoArrayUsers_repository, UserRepositoryInterface, UserUpdateInputDto_repository } from "../../repositories/user/UserRepositoryInterface";


import bcrypt from "bcrypt";
import { CreateOutputDto_service, ListServiceOutputDto_service, UserServiceInterface } from "../../services/user/UserServiceInterface";


import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extenda o Day.js com os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

export class UserService implements UserServiceInterface {

    private constructor(readonly repository: UserRepositoryInterface) {}


    public static build(repository: UserRepositoryInterface) {
        return new UserService(repository);
    }

    /*
        A UUID deve ser gerada no serviço (service) por razões semelhantes às da hash da senha. A
        geração de UUIDs é uma preocupação de aplicação, não de domínio. O modelo (entidade) deve 
        focar na representação dos dados e regras de negócio da entidade, enquanto o serviço lida 
        com operações e lógica de negócios mais complexas.
    */


    // SERVICES
    
    public async save(user: User): Promise<CreateOutputDto_service> {
        const uuid = crypto.randomUUID();  // Gera um UUID único
        const password_hash = await bcrypt.hash(user.getPasswordHash(), 8);
        
        user.setUuid(uuid);
        user.setPasswordHash(password_hash);

        try {
            await this.repository.save(user);  // Cria a notificação no repositório
            return { 
                uuid: user.getUuid() as string 
            };  // Retorna o UUID criado

        } catch (error) {
            throw new Error("Erro ao criar espaço");
        }
    }

    public async list(): Promise<ListServiceOutputDto_service[]> {
        try {
            const aUsers = await this.repository.list();
    
            const mappedUsers: ListServiceOutputDto_service[] = aUsers.map(user => ({
                uuid: user.uuid,
                name: user.name,
                surname: user.surname,
                email: user.email,
                // Converte a data UTC para o fuso horário de Brasília para exibição
                created_at: dayjs.utc(user.createdAt).tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ssZ'),
                userType: user.userType.type
            }));
    
            return mappedUsers;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Could not retrieve users.");
        }
    }
    
    

    
    
    






    

}