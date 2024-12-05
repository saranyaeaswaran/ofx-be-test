import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment, type Payment } from './lib/payments'
import { buildResponse } from './lib/apigateway';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let paymentId = event?.pathParameters?.id;
    if (!paymentId) {
        return buildResponse(404, { error: 'Payment ID missing in the request'});
    }
    try {
        const payment: Payment | null = await getPayment(paymentId);
        if(!payment){
            return buildResponse(400, { error: 'Payment ID does not exist in the database'});
        }
        return buildResponse(200, { ...payment });
    }
    catch (err) {
        console.log('Error getting the payment by Payment ID: ' + err);
        return buildResponse(500, { error: 'Internal Error while getting the payment'});
    }
};
