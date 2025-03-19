// src/scenes/intune/index.jsx
import { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import { fetchIntuneDevices, fetchIntuneDeviceCompliance, fetchIntuneApps } from "../../services/intuneService";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SecurityIcon from "@mui/icons-material/Security";
import AppsIcon from "@mui/icons-material/Apps";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Intune = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { instance, accounts } = useMsal();
    const [devices, setDevices] = useState([]);
    const [compliance, setCompliance] = useState([]);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIntuneData = async () => {
            try {
                const request = {
                    ...loginRequest,
                    account: accounts[0]
                };

                const response = await instance.acquireTokenSilent(request);
                const accessToken = response.accessToken;

                const [devicesData, complianceData, appsData] = await Promise.all([
                    fetchIntuneDevices(accessToken),
                    fetchIntuneDeviceCompliance(accessToken),
                    fetchIntuneApps(accessToken)
                ]);

                setDevices(devicesData);
                setCompliance(complianceData);
                setApps(appsData);
            } catch (error) {
                setError(error.message);
                console.error("Error fetching Intune data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (accounts.length > 0) {
            fetchIntuneData();
        }
    }, [instance, accounts]);

    const getDeviceStatusCounts = () => {
        const counts = {
            compliant: 0,
            nonCompliant: 0,
            unknown: 0
        };

        devices.forEach(device => {
            if (device.complianceState === "compliant") {
                counts.compliant++;
            } else if (device.complianceState === "noncompliant") {
                counts.nonCompliant++;
            } else {
                counts.unknown++;
            }
        });

        return counts;
    };

    const deviceStatusCounts = getDeviceStatusCounts();

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "deviceName", headerName: "Device Name", flex: 1 },
        { field: "operatingSystem", headerName: "OS", flex: 1 },
        { field: "osVersion", headerName: "OS Version", flex: 1 },
        { field: "managedDeviceOwnerType", headerName: "Owner Type", flex: 1 },
        { field: "complianceState", headerName: "Compliance", flex: 1 },
        { field: "lastSyncDateTime", headerName: "Last Sync", flex: 1 },
    ];

    if (loading) {
        return (
            <Box m="20px">
                <Header title="INTUNE DASHBOARD" subtitle="Managing your device inventory" />
                <Typography>Loading Intune data...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box m="20px">
                <Header title="INTUNE DASHBOARD" subtitle="Managing your device inventory" />
                <Typography color={colors.redAccent[500]}>Error: {error}</Typography>
                <Typography>Please ensure you have the proper permissions and are logged in correctly.</Typography>
            </Box>
        );
    }

    return (
        <Box m="20px">
            <Header title="INTUNE DASHBOARD" subtitle="Managing your device inventory" />

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={devices.length.toString()}
                        subtitle="Total Devices"
                        icon={
                            <PhoneAndroidIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={deviceStatusCounts.compliant.toString()}
                        subtitle="Compliant Devices"
                        icon={
                            <SecurityIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={deviceStatusCounts.nonCompliant.toString()}
                        subtitle="Non-Compliant Devices"
                        icon={
                            <ErrorOutlineIcon
                                sx={{ color: colors.redAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={apps.length.toString()}
                        subtitle="Managed Apps"
                        icon={
                            <AppsIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>

                {/* ROW 2 */}
                <Box
                    gridColumn="span 12"
                    gridRow="span 2"
                    backgroundColor={colors.primary[400]}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.grey[100]}
                            >
                                Managed Devices
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        height="250px"
                        m="10px 0 0 0"
                        sx={{
                            "& .MuiDataGrid-root": {
                                border: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                            "& .name-column--cell": {
                                color: colors.greenAccent[300],
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: colors.blueAccent[700],
                                borderBottom: "none",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "none",
                                backgroundColor: colors.blueAccent[700],
                            },
                        }}
                    >
                        <DataGrid
                            rows={devices.map((device, index) => ({
                                id: index,
                                deviceName: device.deviceName || "Unknown",
                                operatingSystem: device.operatingSystem || "Unknown",
                                osVersion: device.osVersion || "Unknown",
                                managedDeviceOwnerType: device.managedDeviceOwnerType || "Unknown",
                                complianceState: device.complianceState || "Unknown",
                                lastSyncDateTime: new Date(device.lastSyncDateTime).toLocaleString() || "Unknown",
                            }))}
                            columns={columns}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Intune;