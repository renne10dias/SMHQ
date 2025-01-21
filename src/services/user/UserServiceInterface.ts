import { User } from "../../entities/User";

export type CreateOutputDto_service = {
    uuid: string;
};


export type ListServiceOutputDto_service = {
    uuid: string;
    name: string;
    surname: string;
    email: string;
    created_at: string;
    userType: string;
};
 




export interface UserServiceInterface {
    save(user: User): Promise<CreateOutputDto_service>;
    list(): Promise<ListServiceOutputDto_service[]>;
}
  