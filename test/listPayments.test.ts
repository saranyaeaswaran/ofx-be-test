import * as payments from '../src/lib/payments';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { type Payment } from '../src/lib/payments';


describe('When the user requests the records for creating a payment', () => {
    let mockPayments: Payment[];
    beforeEach(() => {
        mockPayments = [
            {
                paymentId: randomUUID(),
                currency: 'AUD',
                amount: 2000,
            },
            {
                paymentId: randomUUID(),
                currency: 'AUD',
                amount: 3000,
            }
        ];
        jest.spyOn(payments, 'listPaymentsByCurrency').mockResolvedValueOnce(mockPayments);
    });
    it('List the payments by currency', async () => {
        const result = await handler({
            queryStringParameters: {
                currency: 'AUD',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).data).toEqual(mockPayments);
    });

    it('Error when no currency is provided', async () => {
        const result = await handler({
            queryStringParameters: {
                currency: '',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(404);
    });

    it('Error when invalid currency is provided', async () => {
        const result = await handler({
            queryStringParameters: {
                currency: 11,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
