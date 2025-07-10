import {
  DefaultAzureCredential,
  ClientSecretCredential,
} from "@azure/identity";

export interface AzureTokenResult {
  token: string;
  expiresOnTimestamp: number;
}

export const getAzureDatabaseAccessToken =
  async (): Promise<AzureTokenResult> => {
    try {
      const scopes = ["https://ossrdbms-aad.database.windows.net/.default"];

      let credential;

      const client_id = process.env.ARM_CLIENT_ID;
      const client_secret = process.env.ARM_CLIENT_SECRET;
      const tenant_id = process.env.ARM_TENANT_ID;

      const credentialsArePresent = client_id && client_secret && tenant_id;

      if (credentialsArePresent) {
        credential = new ClientSecretCredential(
          tenant_id,
          client_id,
          client_secret,
        );
      } else {
        credential = new DefaultAzureCredential();
      }

      const tokenResponse = await credential.getToken(scopes);

      if (!tokenResponse) {
        throw new Error("Failed to get Azure access token");
      }

      return tokenResponse;
    } catch (error) {
      console.error("Error getting Azure access token:", error);
      throw new Error(
        `Failed to authenticate with Azure: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

export const buildDatabaseURL = async (): Promise<string> => {
  const baseUrl = process.env.JDBC_URL;

  if (!baseUrl) {
    throw new Error("JDBC_URL environment variable is required");
  }

  const authMethod = process.env.DB_AUTH_METHOD;

  if (authMethod === "service_principal") {
    try {
      const response = await getAzureDatabaseAccessToken();

      const url = new URL(baseUrl);

      url.password = response.token;

      return url.toString();
    } catch (error) {
      console.error(
        "Failed to get Azure token, falling back to basic auth:",
        error,
      );
      return baseUrl;
    }
  }

  return baseUrl;
};
