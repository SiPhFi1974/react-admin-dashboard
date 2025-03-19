// src/services/intuneService.js
import { graphConfig } from "../authConfig";

export const fetchIntuneDevices = async (accessToken) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${accessToken}`);

    const options = {
        method: "GET",
        headers: headers,
    };

    try {
        const response = await fetch(graphConfig.graphDevicesEndpoint, options);
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching Intune devices:", error);
        throw error;
    }
};

export const fetchIntuneDeviceCompliance = async (accessToken) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${accessToken}`);

    const options = {
        method: "GET",
        headers: headers,
    };

    try {
        const response = await fetch(
            "https://graph.microsoft.com/v1.0/deviceManagement/deviceCompliancePolicySettingStateSummaries",
            options
        );
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching Intune compliance data:", error);
        throw error;
    }
};

export const fetchIntuneApps = async (accessToken) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${accessToken}`);

    const options = {
        method: "GET",
        headers: headers,
    };

    try {
        const response = await fetch(
            "https://graph.microsoft.com/v1.0/deviceAppManagement/mobileApps",
            options
        );
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error("Error fetching Intune apps:", error);
        throw error;
    }
};