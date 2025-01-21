
// CREATE RESERVATION WITH RESPONSIBLE
export type CreateResponsibleInputDto = {
    name: string;
    address: string;
    phone: string;
    email: string;
  };


  

export type CreateSportsCoutHasResponsibleInputDto = {
    initHour: Date;
    endHour: Date;
    enabled: boolean;
    observations?: string;
    sportsCoutUuid: string;
  };



// CREATE RESERVATION ADD RESPONSIBLE
export type CreateSportsCoutHasResponsibleAddResponsibleInputDto = {
    initHour: Date;
    endHour: Date;
    enabled: boolean;
    observations?: string;
    sportsCoutUuid: string;
    responsibleCoutUuid: string;
  };






export type CreateOutputDto_service = {
    httpCode: number;
};

export type UpdateOutputDto_service = {
    message: string;
};



 


export interface ReservationServiceInterface {

    createReservationWithResponsible(responsible: CreateResponsibleInputDto, reservation: CreateSportsCoutHasResponsibleInputDto): Promise<CreateOutputDto_service>;

    createReservationAddResponsible(reservation: CreateSportsCoutHasResponsibleAddResponsibleInputDto): Promise<CreateOutputDto_service>;


    
    //updateReservationStatus(uuid: string): Promise<UpdateOutputDto_service>;
}
  