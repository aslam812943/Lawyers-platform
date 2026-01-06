import { IAvailabilityRuleRepository } from "../../../domain/repositories/lawyer/IAvailabilityRuleRepository";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { IPaymentService } from "../../interface/services/IPaymentService";
import { BadRequestError } from "../../../infrastructure/errors/BadRequestError";
import { NotFoundError } from "../../../infrastructure/errors/NotFoundError";

export class UpdateAppointmentStatusUseCase {
    constructor(
        private _repository: IAvailabilityRuleRepository,
        private _bookingRepository: IBookingRepository,
        private _paymentService: IPaymentService
    ) { }

    async execute(id: string, status: string): Promise<void> {
        if (!id || !status) {
            throw new BadRequestError("Appointment ID and status are required.");
        }

        const booking = await this._bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError("Appointment not found.");
        }

        if (status === 'rejected') {
           
            if (booking.paymentStatus === 'paid' && booking.paymentId) {
                await this._paymentService.refundPayment(booking.paymentId, booking.consultationFee);
                await this._bookingRepository.updateStatus(id, 'rejected', undefined, {
                    amount: booking.consultationFee,
                    status: 'full'
                });
            } else {
                await this._bookingRepository.updateStatus(id, 'rejected');
            }

           
            await this._repository.cancelSlot(booking.startTime, booking.lawyerId, booking.date);
        } else {
        
            await this._bookingRepository.updateStatus(id, status);
        }
    }
}
