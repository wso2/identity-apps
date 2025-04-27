import React, { useState, useEffect } from "react";
import {
    Box, Typography, TextField, MenuItem, IconButton, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";
import { fetchProfiles } from "../api/users";

const propertyScopes = [
    { label: "Identity Attribute", value: "identity_attributes" },
    { label: "Trait", value: "traits" },
    { label: "Application Data", value: "application_data" }
];

const operatorOptions = [
    { label: "equals", value: "eq" },
    { label: "contains", value: "co" },
    { label: "starts with", value: "sw" },
    { label: "ends with", value: "ew" },
    { label: "greater than", value: "gt" },
    { label: "less than", value: "lt" }
];

const UsersPage = ({ router }) => {
    const [profiles, setProfiles] = useState([]);
    const [filters, setFilters] = useState([
        { scope: "identity_attributes", property: "", operator: "eq", value: "" }
    ]);
    const [availableProperties, setAvailableProperties] = useState<Record<string, string[]>>({});

    const fetchFilteredProfiles = async (query = "") => {
        try {
            const result = await fetchProfiles(query);
            setProfiles(result || []);
        } catch (err) {
            console.error("Failed to fetch profiles", err);
            setProfiles([]);
        }
    };

    const fetchPropertiesForScope = async (scope: string, index: number) => {
        try {
            const response = await axios.get(
                `http://localhost:8900/api/v1/enrichment-rules?filter=trait_name+sw+${scope}`
            );
            const props = response.data?.map((r: any) => {
                const name = r.trait_name || "";
                const parts = name.split(".");
                return parts.length > 1 ? parts[1] : name;
            }) || [];

            setAvailableProperties(prev => ({
                ...prev,
                [`${scope}_${index}`]: props
            }));
        } catch (err) {
            console.error(`Failed to fetch properties for ${scope}`, err);
            setAvailableProperties(prev => ({
                ...prev,
                [`${scope}_${index}`]: []
            }));
        }
    };

    const buildQueryParams = () => {
        return filters
            .filter(f => f.scope && f.property && f.operator && f.value)
            .map(f => `filter=${f.scope}.${f.property}+${f.operator}+${f.value}`)
            .join("&");
    };

    const handleApplyFilters = () => {
        const query = buildQueryParams();
        fetchFilteredProfiles(query);
    };

    const handleAddFilter = () => {
        const newIndex = filters.length;
        const newScope = "traits";
        setFilters([...filters, { scope: newScope, property: "", operator: "eq", value: "" }]);
        fetchPropertiesForScope(newScope, newIndex);
    };

    const handleRemoveFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const handleFilterChange = (index: number, key: string, value: string) => {
        const updated = [...filters];
        updated[index][key] = value;

        if (key === "scope") {
            updated[index]["property"] = "";
            fetchPropertiesForScope(value, index);
        }

        setFilters(updated);
    };

    const handleRowClick = (permaId: string) => {
        router.navigate(`/users/${permaId}`);
    };

    const exportProfilesToCSV = () => {
        if (profiles.length === 0) return;

        const rows: string[] = [];
        const headers = [
            "profile_id", "origin_country", "identity_key", "identity_value",
            "trait_key", "trait_value", "application_id", "device_id",
            "os", "browser", "last_used"
        ];
        rows.push(headers.join(","));

        profiles.forEach(profile => {
            const base = {
                profile_id: profile.profile_id || "",
                origin_country: profile.origin_country || ""
            };

            const identity = profile.identity_attributes || {};
            const traits = profile.traits || {};
            const apps = profile.application_data || [];

            const identityEntries = Object.entries(identity);
            const traitEntries = Object.entries(traits);

            const identity_key = identityEntries[0]?.[0] || "";
            const identity_value = Array.isArray(identityEntries[0]?.[1])
                ? identityEntries[0][1].join("; ")
                : identityEntries[0]?.[1] || "";

            const trait_key = traitEntries[0]?.[0] || "";
            const trait_value = traitEntries[0]?.[1] || "";

            if (apps.length === 0) {
                rows.push([
                    base.profile_id, base.origin_country,
                    identity_key, identity_value,
                    trait_key, trait_value,
                    "", "", "", "", ""
                ].map(cell => `"${cell}"`).join(","));
                return;
            }

            apps.forEach(app => {
                const appId = app.application_id || "";
                const devices = app.devices || [];

                if (devices.length === 0) {
                    rows.push([
                        base.profile_id, base.origin_country,
                        identity_key, identity_value,
                        trait_key, trait_value,
                        appId, "", "", "", ""
                    ].map(cell => `"${cell}"`).join(","));
                } else {
                    devices.forEach(device => {
                        rows.push([
                            base.profile_id, base.origin_country,
                            identity_key, identity_value,
                            trait_key, trait_value,
                            appId,
                            device.device_id || "",
                            device.os || "",
                            device.browser || "",
                            device.last_used || ""
                        ].map(cell => `"${cell}"`).join(","));
                    });
                }
            });
        });

        const blob = new Blob([rows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "profiles_export.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchFilteredProfiles(); // load all profiles initially
        fetchPropertiesForScope("identity_attributes", 0); // preload default scope traits
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>🔍 Filter Profiles</Typography>

            {filters.map((f, i) => (
                <Grid container spacing={2} key={i} alignItems="center" sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        <TextField
                            select fullWidth label="Property Scope"
                            value={f.scope}
                            onChange={(e) => handleFilterChange(i, "scope", e.target.value)}
                        >
                            {propertyScopes.map(p => (
                                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            select fullWidth label="Property Name"
                            value={f.property}
                            onChange={(e) => handleFilterChange(i, "property", e.target.value)}
                        >
                            {(availableProperties[`${f.scope}_${i}`] || []).map((propName) => (
                                <MenuItem key={propName} value={propName}>{propName}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            select fullWidth label="Operator"
                            value={f.operator}
                            onChange={(e) => handleFilterChange(i, "operator", e.target.value)}
                        >
                            {operatorOptions.map(o => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth label="Value"
                            value={f.value}
                            onChange={(e) => handleFilterChange(i, "value", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton color="error" onClick={() => handleRemoveFilter(i)}><Delete /></IconButton>
                    </Grid>
                </Grid>
            ))}

            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <Button startIcon={<Add />} onClick={handleAddFilter}>
                    Add Filter
                </Button>
                <Button variant="contained" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
                {profiles.length > 0 && (
                    <Button variant="outlined" onClick={exportProfilesToCSV}>
                        Export Profiles
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={1}>
                {profiles.length === 0 ? (
                    <Box sx={{ p: 4 }}>
                        <Typography align="center" color="text.secondary">
                            No profiles found.
                        </Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Profile Id</strong></TableCell>
                                <TableCell><strong>Attached User</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {profiles.map((profile, index) => {
                                const identity = profile.identity_attributes || {};
                                const userId = identity.user_id;
                                const username = identity.user_name;

                                return (
                                    <TableRow
                                        key={index}
                                        onClick={() => handleRowClick(profile.profile_id)}
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": { backgroundColor: "#f5f5f5" }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography>{profile.profile_id}</Typography>
                                            {username && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {username}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {userId ? (
                                                <>
                                                    <Chip label="Registered User" color="success" size="small" />
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                                                        {userId}
                                                    </Typography>
                                                </>
                                            ) : (
                                                <Chip label="Anonymous Profile" color="primary" size="small" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </Box>
    );
};

export default UsersPage;
