// src/features/payment/components/paymentService.ts

import axiosInstance from './axiosInstance';
import { PaymentRequestData, PaymentResponse } from '../entities/apiTypes';

export const submitPayment = async (data: PaymentRequestData): Promise<PaymentResponse> => {
    try {
        const response = await axiosInstance.post<PaymentResponse>('/order/payment/pre-registration', data);
        return response.data;
    } catch (error) {
        console.error('Error completing order:', error);
        throw new Error('Payment submission failed');
    }
};
// src/features/payment/components/paymentService.ts
