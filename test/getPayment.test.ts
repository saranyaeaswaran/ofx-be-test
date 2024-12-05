import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for a specific payment', () => {
    it('Returns the payment matching their input parameter.', async () => {
        const paymentId = randomUUID();
        const mockPayment = {
            paymentId: paymentId,
            currency: 'AUD',
            amount: 2000,
        };
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(mockPayment);

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockPayment);

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });
    it('Error when payment id is missing in the request', async () => {
        const result = await handler({
            pathParameters: {
                id: '',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(404);
    });
    it('Error when payment id does not exist in the database', async () => {
        jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);

        const result = await handler({
            pathParameters: {
                id: 'test',
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
