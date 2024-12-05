import { DocumentClient } from './dynamodb';
import { GetCommand, PutCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export const getPayment = async (paymentId: string): Promise<Payment | null> => {
    const result = await DocumentClient.send(
        new GetCommand({
            TableName: 'PaymentsTable',
            Key: { paymentId },
        })
    );

    return (result.Item as Payment) || null;
};

export const listPayments = async (): Promise<Payment[]> => {
    const result = await DocumentClient.send(
        new ScanCommand({
            TableName: 'PaymentsTable',
        })
    );

    return (result.Items as Payment[]) || [];
};

export const listPaymentsByCurrency = async (currency: string): Promise<Payment[]> => {
    const params = {
        TableName: 'PaymentsTable',
        FilterExpression: 'currency=:currencyValue',
        ExpressionAttributeValues: {
            ':currencyValue': currency,
        },
    }
    const result = await DocumentClient.send(
        new ScanCommand(params)
    );
    return (result.Items as Payment[]) || [];
};

export const createPayment = async (payment: Payment) => {
    await DocumentClient.send(
        new PutCommand({
            TableName: 'PaymentsTable',
            Item: payment,
        })
    );
};

export type Payment = {
    paymentId: string;
    amount: number;
    currency: string;
};
