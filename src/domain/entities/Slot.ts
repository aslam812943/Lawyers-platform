

export class Slot {
  constructor(
    public id: string,
    public ruleId: string,
    public userId: string,
    public startTime: string,
    public endTime: string,
    public date: string,
    public sessionType: string,
    public isBooked: boolean,
    public bookingId?: string | null,
    public maxBookings: Number = 1,
    public consultationFee?:string
  ) { }
}
