'use strict';

import axios from 'axios';
import qs from 'qs';

export async function handler(event, context) {
    // respond fast - not possible with Lambda, must use queue
    const body = event.body ? event.body : {};
    const queryStringParameters = event.queryStringParameters
        ? event.queryStringParameters
        : {};

    // lead data w/ debug per request
    const lead = {
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        company: body.company,
        oid: process.env.OID, // salesforce organization id
        debug: queryStringParameters.debug ? 1 : 0
    };

    // add a lead to salesforce
    // https://www.salesforce.com/products/guide/lead-gen/web-to-lead/
    const webToLeadRequest = {
        method: 'POST',
        url:
            'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
        data: qs.stringify(lead),
        config: {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    };

    try {
        const response = await axios(webToLeadRequest);
        console.log('res', response.status, response.data);

        // proxy integration structure
        return {
            statusCode: 201,
            body: JSON.stringify(response.data),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        console.log('err', error);

        // this will provide a more meaningful client response
        return {
            statusCode: 500,
            body: JSON.stringify({
                Error: error.message,
                Reference: context.awsRequestId
            }),
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
}
