import * as payments from '../src/lib/payments';
import { handler } from '../src/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for creating a payment', () => {
    beforeEach(() => {
        jest.spyOn(payments, 'createPayment').mockResolvedValueOnce();
    });
    it('Create and returns the payment id', async () => {
        const result = await handler({
            body: JSON.stringify({
                currency: 'AUD',
                amount: 2000,
            }),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body).result.paymentId).toBeTruthy();
    });

    it('Error when the input parameters are incorrect', async () => {
        const result = await handler({
            body: JSON.stringify({
                currency: 'AUD',
                amount: 0,
            }),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
