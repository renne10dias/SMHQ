import { District } from "../../entities/District";


export type CreateOutputDto_repository = {
    uuid: string;
};

export type FindOutputDto_repository = {
    uuid: string;
    name: string;
    user_uuid: string;
    
};

export type ListRepositoryOutputDto_repository = {
    uuid: string;
    name: string;
};



export type ListRepositoryOutputDtoArrayDistricts_repository = {
    districts: {
        uuid: string;
        name: string;
        
    }[];
};


export type DistrictUpdateInputDto_repository = {
    uuid: string;
    name: string;

};






export interface DistrictRepositoryInterface {
    save(district: District): Promise<void>;
    find(id: string): Promise<FindOutputDto_repository | null>;
    list(): Promise<ListRepositoryOutputDto_repository[]>;
    listArrayUsers(): Promise<ListRepositoryOutputDtoArrayDistricts_repository>;
    update(userDto: DistrictUpdateInputDto_repository): Promise<void>;
    delete(id: string): Promise<void>;

}