import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, TextField, MenuItem, Button,
    Grid, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
    TableContainer, Chip, Divider
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";

interface Condition {
    field: string;
    operator: string;
    value?: string;
}

interface PropertyFilter {
    propertyKey: string;
    operator: string;
    propertyValue: string;
}

interface EventData {
    event_type: string;
    event_name: string;
    event_timestamp: number;
    profile_id: string;
    properties: Record<string, any>;
}

const fieldOptions = [
    { label: "Event Type", value: "event_type" },
    { label: "Event Name", value: "event_name" },
    { label: "Application ID", value: "application_id" }
];

const operatorOptions = [
    { label: "equals", value: "eq" },
    { label: "contains", value: "co" },
    { label: "starts with", value: "sw" },
    { label: "ends with", value: "ew" }
];

const timeOptions = [
    { label: "Last 15 minutes", value: 900 },
    { label: "Last 30 minutes", value: 1800 },
    { label: "Last 1 hour", value: 3600 },
    { label: "Last 3 hours", value: 10800 },
    { label: "Last 6 hours", value: 21600 },
    { label: "Last 12 hours", value: 43200 },
    { label: "Last 1 day", value: 86400 },
    { label: "Last 3 days", value: 259200 },
    { label: "Last 1 week", value: 604800 },
    { label: "Last 2 weeks", value: 1209600 },
    { label: "Last 1 month", value: 2592000 }
];

const eventTypeColor: Record<string, "primary" | "secondary" | "info" | "default"> = {
    identify: "primary",
    track: "secondary",
    page: "info"
};

const EventExplorerPage: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<number>(900); // Last 15 min
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [properties, setProperties] = useState<PropertyFilter[]>([]);
    const [events, setEvents] = useState<EventData[]>([]);

    const handleAddCondition = () => {
        setConditions([...conditions, { field: "event_type", operator: "eq", value: "" }]);
    };

    const handleAddProperty = () => {
        setProperties([...properties, { propertyKey: "", operator: "eq", propertyValue: "" }]);
    };

    const handleConditionChange = (index: number, key: keyof Condition, value: string) => {
        const updated = [...conditions];
        updated[index][key] = value;
        setConditions(updated);
    };

    const handlePropertyChange = (index: number, key: keyof PropertyFilter, value: string) => {
        const updated = [...properties];
        updated[index][key] = value;
        setProperties(updated);
    };

    const handleRemoveCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    };

    const handleRemoveProperty = (index: number) => {
        setProperties(properties.filter((_, i) => i !== index));
    };

    const buildQueryParams = (): string => {
        const filters: string[] = [];

        conditions.forEach((cond) => {
            if (cond.field && cond.operator && cond.value) {
                filters.push(`filter=${cond.field}+${cond.operator}+${cond.value}`);
            }
        });

        properties.forEach((prop) => {
            if (prop.propertyKey && prop.operator && prop.propertyValue) {
                filters.push(`filter=properties.${prop.propertyKey}+${prop.operator}+${prop.propertyValue}`);
            }
        });

        filters.push(`time_range=${timeFilter}`);
        return filters.join("&");
    };

    const fetchEvents = async () => {
        const query = buildQueryParams();
        try {
            const res = await axios.get<EventData[]>(`http://localhost:8900/api/v1/events?${query}`);
            setEvents(res.data || []);
        } catch (err) {
            console.error("Failed to fetch events", err);
        }
    };

    useEffect(() => {
        fetchEvents(); // initial load
    }, []);

    return (
        <Box sx={{ p: 6 }}>
            <Typography variant="h5" gutterBottom>🎯 Event Explorer</Typography>

            <Box>
                <TextField
                    select
                    label="Time Filter"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(Number(e.target.value))}
                    sx={{ width: 300, mb: 3 }}
                >
                    {timeOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                </TextField>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6">📌 Basic Filters</Typography>
            {conditions.map((cond, index) => (
                <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        <TextField
                            select fullWidth label="Field" value={cond.field}
                            onChange={(e) => handleConditionChange(index, "field", e.target.value)}
                        >
                            {fieldOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            select fullWidth label="Operator" value={cond.operator}
                            onChange={(e) => handleConditionChange(index, "operator", e.target.value)}
                        >
                            {operatorOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth label="Value" value={cond.value || ""}
                            onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => handleRemoveCondition(index)} color="error">
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<Add />} onClick={handleAddCondition} sx={{ mt: 1 }}>
                Add Filter
            </Button>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6">🧷 Property Filters</Typography>
            {properties.map((prop, index) => (
                <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth label="Property Name"
                            value={prop.propertyKey}
                            onChange={(e) => handlePropertyChange(index, "propertyKey", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            select fullWidth label="Operator"
                            value={prop.operator}
                            onChange={(e) => handlePropertyChange(index, "operator", e.target.value)}
                        >
                            {operatorOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth label="Property Value"
                            value={prop.propertyValue}
                            onChange={(e) => handlePropertyChange(index, "propertyValue", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton onClick={() => handleRemoveProperty(index)} color="error">
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}

            <Button startIcon={<Add />} onClick={handleAddProperty} sx={{ mt: 1 }}>
                Add Property
            </Button>

            <Box sx={{ mt: 4 }}>
                <Button variant="contained" onClick={fetchEvents}>
                    Fetch Events
                </Button>
            </Box>

            <Box sx={{ mt: 5 }}>
                <Typography variant="h6">📋 Events</Typography>
                {events.length === 0 ? (
                    <Typography>No events found.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Event Type</TableCell>
                                    <TableCell>Event Name</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Event Properties</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {events.map((e, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Chip
                                                label={e.event_type}
                                                size="small"
                                                color={eventTypeColor[e.event_type.toLowerCase()] || "default"}
                                            />
                                        </TableCell>
                                        <TableCell>{e.event_name}</TableCell>
                                        <TableCell>
                                            {new Date(e.event_timestamp * 1000).toLocaleString(undefined, {
                                                timeZoneName: "short",
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit"
                                            })}
                                        </TableCell>
                                        <TableCell>{e.profile_id}</TableCell>
                                        <TableCell>
                                            <pre>{JSON.stringify(e.properties, null, 2)}</pre>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default EventExplorerPage;
