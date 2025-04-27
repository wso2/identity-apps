import React, { useEffect, useState } from "react";
import {
    Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
    TableBody, TableContainer, Paper, IconButton, Button
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";
import AddTraitModal from "../components/modals/trait-add-modal";
import { Chip } from "@oxygen-ui/react";

interface Condition {
    field: string;
    operator: string;
    value: string;
}

interface TraitTrigger {
    event_type: string;
    event_name: string;
    conditions: Condition[];
}

interface TraitFormData {
    trait_name: string;
    description: string;
    trait_type: "static" | "computed";
    value?: string;
    value_type: string;
    computation?: string;
    source_field?: string;
    time_range?: string;
    merge_strategy: string;
    masking_required: boolean;
    masking_strategy?: string;
    trigger: TraitTrigger;
    enabled: boolean;
}

const ProfileTraitsPage: React.FC = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);

    const defaultForm: TraitFormData = {
        trait_name: "",
        description: "",
        trait_type: "static",
        value: "",
        value_type: "string",
        computation: "",
        source_field: "",
        time_range: "",
        merge_strategy: "overwrite",
        masking_required: false,
        masking_strategy: "",
        trigger: {
            event_type: "",
            event_name: "",
            conditions: [{ field: "", operator: "", value: "" }]
        },
        enabled: true
    };

    const [form, setForm] = useState<TraitFormData>(defaultForm);
    const [propertyGroup, setPropertyGroup] = useState("identity_attributes");
    const [propertySuffix, setPropertySuffix] = useState("");

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const res = await axios.get("http://localhost:8900/api/v1/enrichment-rules");
            setRules(res.data || []);
        } catch (err) {
            console.error("Failed to fetch profile traits", err);
        }
    };

    const handleDelete = async (traitId: string) => {
        try {
            await axios.delete(`http://localhost:8900/api/v1/enrichment-rules/${traitId}`);
            loadRules();
        } catch (err) {
            console.error("Failed to delete trait", err);
        }
    };

    const updateForm = (key: keyof TraitFormData, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateTrigger = (key: keyof TraitTrigger, value: any) => {
        setForm((prev) => ({
            ...prev,
            trigger: { ...prev.trigger, [key]: value }
        }));
    };

    const updateCondition = (index: number, field: keyof Condition, value: string) => {
        const updated = [...form.trigger.conditions];
        updated[index][field] = value;
        updateTrigger("conditions", updated);
    };

    const addCondition = () => {
        updateTrigger("conditions", [...form.trigger.conditions, { field: "", operator: "", value: "" }]);
    };

    const removeCondition = (index: number) => {
        const updated = form.trigger.conditions.filter((_, i) => i !== index);
        updateTrigger("conditions", updated);
    };

    const scopeStyles: Record<string, { bg: string; color: string }> = {
        "Identity Attribute": { bg: "#e8f5e9", color: "#2e7d32" },
        "Application Data": { bg: "#e3f2fd", color: "#1565c0" },
        "Personality": { bg: "#fff3e0", color: "#ef6c00" },
        "Trait": { bg: "#f3e5f5", color: "#6a1b9a" },
        "Custom": { bg: "#eeeeee", color: "#424242" }
    };

    return (
        <Box sx={{ p: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={ 4 }>
                <Box>
                    <Typography variant="h4" gutterBottom>Profile Enrichment Traits</Typography>
                    <Typography variant="body1">
                        Create and manage rules that enrich user profiles based on identity data, app context, and event triggers.
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenModal(true)}>
                    Add Trait
                </Button>
            </Box>

            <Card>
                <CardContent>
                    {/* <TableContainer component={ Paper } sx={{ borderRadius: 2, overflow: "hidden" }}> */}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Trait Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Value Type</TableCell>
                                    <TableCell>Merge Strategy</TableCell>
                                    <TableCell>Event</TableCell>
                                    <TableCell>Conditions</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rules.map((rule) => {
                                    const [scopeKey, attr] = rule.trait_name?.split(".") || [];
                                    const scopeMap: Record<string, string> = {
                                        identity_attributes: "Identity Attribute",
                                        application_data: "Application Data",
                                        personality: "Personality",
                                        traits: "Trait"
                                    };
                                    const scope = scopeMap[scopeKey] || "Custom";

                                    return (
                                        <TableRow
                                            key={ rule.trait_id }
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: 1.5,
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                                transition: "background-color 0.2s",
                                                '&:hover': { backgroundColor: "#f9f9f9" },
                                                "& > td": {
                                                    borderBottom: "none",
                                                    paddingTop: 2,
                                                    paddingBottom: 2
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {attr || rule.trait_name}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={scope}
                                                    sx={{
                                                        mt: 0.5,
                                                        backgroundColor: scopeStyles[scope].bg,
                                                        color: scopeStyles[scope].color
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{rule.trait_type}</TableCell>
                                            <TableCell>{rule.value_type}</TableCell>
                                            <TableCell>
                                                <Chip size="small" label={rule.merge_strategy} variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography>{rule.trigger?.event_name}</Typography>
                                                    <Chip
                                                        size="small"
                                                        label={rule.trigger?.event_type}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
                                                    {rule.trigger?.conditions?.map((c, i) => (
                                                        <li key={i}>
                                                            <Typography variant="body2">
                                                                <strong>{c.field}</strong> {c.operator} <em>{c.value}</em>
                                                            </Typography>
                                                        </li>
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton color="error" onClick={() => handleDelete(rule.trait_id!)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                </CardContent>
            </Card>

            <AddTraitModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(finalPayload) => {
                    axios.post("http://localhost:8900/api/v1/enrichment-rules", finalPayload)
                        .then(() => {
                            setOpenModal(false);
                            loadRules();
                        })
                        .catch(err => console.error("Failed to create trait", err));
                }}
                form={form}
                propertyGroup={propertyGroup}
                propertySuffix={propertySuffix}
                setPropertyGroup={setPropertyGroup}
                setPropertySuffix={setPropertySuffix}
                updateForm={updateForm}
                updateTrigger={updateTrigger}
                updateCondition={updateCondition}
                addCondition={addCondition}
                removeCondition={removeCondition}
            />
        </Box>
    );
};

export default ProfileTraitsPage;