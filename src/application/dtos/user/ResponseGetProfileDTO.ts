export class ResponseGetProfileDTO{
    constructor(
        public id:string,
        public name:string,
        public email:string,
        public phone:string,
        public profileImage:string,
        public Address:object,
        public isPassword:boolean
        
    ){}
}