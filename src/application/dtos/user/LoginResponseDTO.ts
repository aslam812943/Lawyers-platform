// DTO Interface Loign response

export interface ILoginResponseDTO{
    id:string;
    name:string;
    email:string;
    phone:number;
    role:string;
    hasSubmittedVerification:boolean
}





// DTO Class Login Response

export class LoginResponseDTO implements ILoginResponseDTO{
    constructor(data:ILoginResponseDTO){
        this.id = data.id!;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.role = data.role
        this.hasSubmittedVerification = data.hasSubmittedVerification
    }

    id:string;
    name:string;
    email: string;
    phone: number;
    role: string;
    hasSubmittedVerification:boolean;
}


