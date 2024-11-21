// src/global.d.ts
export {};

declare global {
    interface Window {
        IMP?: {
            init: (accountID: string) => void;
            request_pay: (
                params: {
                    pg: string;
                    pay_method: string;
                    merchant_uid: string;
                    name: string;
                    amount: number;
                    buyer_name: string;
                    buyer_tel: string;
                    buyer_postcode?: string;
                    buyer_addr?: string;
                    [key: string]: string | number | undefined;
                },
                callback: (response: {
                    success: boolean;
                    error_msg?: string;
                    imp_uid?: string;
                    merchant_uid: string;
                    paid_amount?: number;
                    [key: string]: string | number | boolean | undefined;
                }) => void
            ) => void;
        };
    }
}
