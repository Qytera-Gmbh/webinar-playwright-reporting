import {
    DecryptionFailure,
    InternalServiceError,
    InvalidParameterException,
    InvalidRequestException,
    ResourceNotFoundException,
} from "@aws-sdk/client-secrets-manager";
import type {
    Callback,
    CloudFrontRequestEvent,
    CloudFrontResponse,
    CloudFrontResultResponse,
    Context,
    Handler,
} from "aws-lambda";
import { getSecret } from "./secrets";

const RESPONSE_UNAUTHORIZED: CloudFrontResultResponse = {
    status: "401",
    statusDescription: "Unauthorized",
    headers: {
        "www-authenticate": [{ key: "WWW-Authenticate", value: "Basic" }],
    },
};

// Cache expected header during the Lambda's warm period.
let expectedHeader: string;

export const handler: Handler = async (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback
): Promise<CloudFrontResponse | CloudFrontResultResponse> => {
    const request = event.Records[0].cf.request;
    const authorizationHeader = request.headers["authorization"];
    if (!authorizationHeader) {
        return RESPONSE_UNAUTHORIZED;
    }
    if (!expectedHeader) {
        try {
            expectedHeader = await getExpectedHeader(context);
        } catch (error: unknown) {
            return {
                status: "403",
                statusDescription: "Forbidden",
                body: error instanceof Error ? error.message : JSON.stringify(error),
            };
        }
    }
    if (authorizationHeader[0].value === expectedHeader) {
        callback(null, request);
    }
    return RESPONSE_UNAUTHORIZED;
};

async function getExpectedHeader(context: Context): Promise<string> {
    try {
        if (!process.env.ARN_SECRET) {
            throw new Error("Failed to find AWS Secret ARN in lambda environment variables");
        }
        const secret = await getSecret(process.env.ARN_SECRET);
        // Can happen if the secret was created, but its content has not yet been defined.
        if (!secret.SecretString) {
            throw new Error("Basic authentication has not yet been configured");
        }
        const secretData = JSON.parse(secret.SecretString);
        const username = secretData["username"];
        const password = secretData["password"];
        const expectedHeaderValue = Buffer.from(`${username}:${password}`).toString("base64");
        return `Basic ${expectedHeaderValue}`;
    } catch (error: unknown) {
        const errorInfo = {
            context: context,
            error: error,
        };
        console.error(`${context.awsRequestId}: ${JSON.stringify(errorInfo)}`);
        // See: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/secrets-manager/command/GetSecretValueCommand/
        if (error instanceof DecryptionFailure) {
            throw new Error("Cannot decrypt the protected secret text using the provided KMS key");
        } else if (error instanceof InternalServiceError) {
            throw new Error("An error occurred on AWS side");
        } else if (error instanceof InvalidParameterException) {
            throw new Error("The secret name or value is invalid");
        } else if (error instanceof InvalidRequestException) {
            throw new Error("The secret value is not valid because it is scheduled for deletion");
        } else if (error instanceof ResourceNotFoundException) {
            throw new Error("Cannot find the secret that was asked for");
        }
        throw new Error("An unknown error occurred");
    }
}
