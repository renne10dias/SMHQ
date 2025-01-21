
import { Space } from "../../entities/Space";

export type CreateOutputDto_Service = {
    uuid: string;
};

export type FindOutputDto_Service = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};

export type ListOutputDto_Service = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};


export type UpdateInputDto_Service = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};



export interface SpaceServiceInterface {
    create(space: Space, filePath: string): Promise<CreateOutputDto_Service>;
    find(id: string): Promise<FindOutputDto_Service | null>;
    list(): Promise<ListOutputDto_Service[]>;
    update(spaceDto: UpdateInputDto_Service): Promise<void>;
    delete(id: string): Promise<void>;

}