import { SportsCout } from "../../entities/SportsCout";


export type CreateOutputDto_repository = {
    uuid: string;
};

export type FindOutputDto_repository = {
    uuid: string;
    name: string;
    opening: Date;
    closest: Date;
};

export type ListRepositoryOutputDto_repository = {
    uuid: string;
    name: string;
    opening: string; // Alterado para string porque será retornado no formato HH:mm
    closest: string; // Alterado para string porque será retornado no formato HH:mm
};



export type ListRepositoryOutputDtoArraySportCout_repository = {
    sportsCout: {
        uuid: string;
        name: string;
        opening: Date;
        closest: Date;    
    }[];
};


export type SportCoutUpdateInputDto_repository = {
    uuid: string;
    name: string;
    opening: Date;
    closest: Date; 
};






export interface SportCoutRepositoryInterface {
    save(sportCout: SportsCout): Promise<void>;
    find(id: string): Promise<FindOutputDto_repository | null>;
    list(): Promise<ListRepositoryOutputDto_repository[]>;
    listArrayUsers(): Promise<ListRepositoryOutputDtoArraySportCout_repository>;
    update(userDto: SportCoutUpdateInputDto_repository): Promise<void>;
    delete(id: string): Promise<void>;

}