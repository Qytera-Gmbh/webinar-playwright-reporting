import {
    GetSecretValueCommand,
    GetSecretValueResponse,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });

export async function getSecret(id: string): Promise<GetSecretValueResponse> {
    const command = new GetSecretValueCommand({
        SecretId: id,
    });
    return await client.send(command);
}
