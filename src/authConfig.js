// src/authConfig.js
export const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID", // Replace with your Azure AD app registration client ID
        authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with your tenant ID
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
};

// Add the API permissions you need for Intune
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphDevicesEndpoint: "https://graph.microsoft.com/v1.0/deviceManagement/managedDevices",
};

// Scopes for Graph API requests
export const loginRequest = {
    scopes: ["User.Read", "DeviceManagementManagedDevices.Read.All"]
};