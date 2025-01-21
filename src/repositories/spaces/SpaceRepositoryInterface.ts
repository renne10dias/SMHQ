import { Space } from "../../entities/Space";

export type CreateOutputDto_repository = {
    uuid: string;
};

export type FindOutputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};

export type ListOutputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};


export type UpdateInputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string;
    activityStatus: boolean; 
};

export type ListSpaceWithFileAllOutputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string | null;
    activityStatus: boolean;
    files: {
        uuid: string;
        path: string;
        dateUpload: Date;
    }[]
};

export type FindSpaceOutputDto_repository = {
    uuid: string;
    name: string;
    location: string;
    capacity: number;
    type: string;
    equipment: string | null;
    files: {
        path: string;
    }[]
};

export type ListSpaceWithFileOutputDto_repository = {
    uuid: string;
    name: string;
    type: string;
    activityStatus: boolean;
    files: {
        path: string;
    }[]
};



export interface SpaceRepositoryInterface {
    create(space: Space, filePath: string): Promise<void>;
    listSpaces(): Promise<ListSpaceWithFileOutputDto_repository[]>;
    listSpacesWithFilesAll(): Promise<ListSpaceWithFileAllOutputDto_repository[]>;
    find(id: string): Promise<FindOutputDto_repository | null>;
    findSpaceById(uuid: string): Promise<FindSpaceOutputDto_repository | null>;
    list(): Promise<ListOutputDto_repository[]>;
    update(spaceDto: UpdateInputDto_repository): Promise<void>;
    delete(id: string): Promise<void>;

}