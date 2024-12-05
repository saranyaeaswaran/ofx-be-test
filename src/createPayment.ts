import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, type Payment } from './lib/payments';
import { randomUUID } from 'crypto';
import { object, string, number, ZodError } from 'zod'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payment  = parseInput(event.body || '{}') as Partial<Payment>;
    if(Object.keys(payment).length == 0){
        return buildResponse(404, { error: 'Request body is missing' });
    }
    let paymentInputSchema = object({
        currency: string(),
        amount: number().positive(),
    })

    try{
        paymentInputSchema.parse(payment);
        const paymentWithId = {
            ...payment ,
            paymentId: randomUUID(),
        } as Payment;
        await createPayment(paymentWithId);
        return buildResponse(201, { result: {
            message: 'Created payment successfully',
            paymentId: paymentWithId.paymentId }
        });
    }
    catch(err: any){
        console.log('Error creating the payment: '+ err.message);
        if(err instanceof ZodError){
            return buildResponse(422, { error: `Error creating the payment: ${JSON.parse(err.message)?.message})}`});
        }
        return buildResponse(500, { error: 'Internal Error while creating the payment'});
    }
};
