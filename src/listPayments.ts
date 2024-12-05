import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPaymentsByCurrency, type Payment } from './lib/payments';
import { string, ZodError } from 'zod'
import { currencyList } from './config/currencyList';

const currencySchema = string()
    .length(3, { message: 'Curency must be 3 characters only' })
    .refine(
        (currency) => currencyList.includes(currency),
        { message: 'Given currency is not a valid and accepted one' }
    );

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let currency = event?.queryStringParameters?.currency;
    if (!currency) {
        return buildResponse(
            404,
            {
                error: 'Currency value is missing in the request'
            });
    }
    try {
        currencySchema.parse(currency);
        const payments: Payment[] = await listPaymentsByCurrency(currency) as Payment[];
        return buildResponse(200, { data: payments });
    }
    catch (err) {
        console.log('Error listing the payments by currency: ' + err);
        if (err instanceof ZodError) {
            return buildResponse(422, { error: `Error listing the payments by currency: ${err.message}`});
        }
        return buildResponse(500, { error: 'Internal server error while listing payment by currency' });
    }
};
