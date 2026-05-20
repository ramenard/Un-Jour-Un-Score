import { apiClient } from './client';

export interface CoinPackage {
  id: string;
  coins: number;
  amount: number;
  currency: string;
  label: string;
  description: string;
}

export interface PaymentIntentResponse extends CoinPackage {
  clientSecret: string;
  paymentIntentId: string;
}

export const getPackages = async (): Promise<CoinPackage[]> => {
  const response = await apiClient.get<CoinPackage[]>('/payments/packages');
  return response.data;
};

export const createPaymentIntent = async (packageId: string): Promise<PaymentIntentResponse> => {
  const response = await apiClient.post<PaymentIntentResponse>('/payments/create-payment-intent', { packageId });
  return response.data;
};

export const confirmPayment = async (paymentIntentId: string): Promise<{ coins: number; message: string }> => {
  const response = await apiClient.post('/payments/confirm', { paymentIntentId });
  return response.data;
};