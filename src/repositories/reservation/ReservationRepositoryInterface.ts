

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

  
  export type CreateSportsCoutHasReservationInputDto = {
    initHour: Date;
    endHour: Date;
    enabled: boolean;
    observations?: string;
    sportsCoutUuid: string;
    responsibleCoutUuid: string;
  };

  export type SportsCoutHasResponsibleOutputDto = {
    uuid: string;
    initHour: string;
    endHour: string;
    enabled: boolean;
    observations: string | null;
    sportsCoutUuid: string;
    responsibleUuid: string;
  };

  export type ReservationsWithResponsibleAndSportsCout = {
    initHour: string;
    endHour: string;
    enabled: boolean;
    observations: string | null;
    sportsCoutUuid: string;
    responsibleUuid: string;
    responsible: {
      uuid: string | null;
      name: string | null;
      email: string | null;
      phone: string | null;
      address: string | null;
    };
    sportsCout: {
      uuid: string | null;
      name: string | null;
      opening: Date | null;
      closest: Date | null;
    };
  };
  
  




export interface ReservationRepositoryInterface {
    isEmailExists(email: string): Promise<boolean>;
    createReservationWithResponsible(responsible: CreateResponsibleInputDto, reservation: CreateSportsCoutHasResponsibleInputDto): Promise<Boolean>;
    isTimeSlotTaken(initHour: Date, endHour: Date, sportsCoutUuid: string): Promise<boolean>;
    isReservationWithinOpeningHours(sportsCoutUuid: string, initHour: Date, endHour: Date): Promise<boolean>;
    createReservationAddResponsible(assignmentData: CreateSportsCoutHasReservationInputDto): Promise<boolean>;
    listAllReservations(): Promise<SportsCoutHasResponsibleOutputDto[]>;
    listReservationsBySportsCoutUuid(sportsCoutUuid: string): Promise<SportsCoutHasResponsibleOutputDto[]>
    listAllReservationsWithResponsibleAndSportsCout(uuid: string): Promise<ReservationsWithResponsibleAndSportsCout[]>;
    updateEnabledStatus(uuid: string, sportsCoutUuid: string, responsibleCoutUuid: string, newStatus: boolean, observations: string): Promise<boolean>;
    getResponsibleDetailsByUuid(reservationUuid: string, sportsCoutUuid: string, responsibleUuid: string): Promise<{ name: string; email: string } | null>;
    getAllResponsibles(): Promise<{ uuid: string; name: string; email: string | null; phone: string | null }[]>;
    searchResponsiblesByName(name: string): Promise<{ uuid: string; name: string}[]>;
}