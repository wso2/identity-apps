import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography,
    Grid, TextField, MenuItem, IconButton, Divider, InputAdornment
} from "@mui/material";
import { Add, Delete, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import axios from "axios";

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
    source_field_one?: string;
    source_field_two?: string;
    time_range?: string;
    merge_strategy: string;
    trigger: TraitTrigger;
    enabled: boolean;
}

interface AddTraitModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (finalPayload: TraitFormData) => void;
    form: TraitFormData;
    propertyGroup: string;
    propertySuffix: string;
    setPropertyGroup: (val: string) => void;
    setPropertySuffix: (val: string) => void;
    updateForm: (key: keyof TraitFormData, value: any) => void;
    updateTrigger: (key: keyof TraitTrigger, value: any) => void;
    updateCondition: (index: number, field: keyof Condition, value: string) => void;
    addCondition: () => void;
    removeCondition: (index: number) => void;
}

const traitTypes = ["static", "computed"];
const mergeStrategies = ["overwrite", "combine", "ignore"];
const eventTypes = ["identify", "page", "track"];
const propertyGroups = [
    { label: "Identity Attribute", value: "identity_attributes" },
    { label: "Application Data", value: "application_data" },
    { label: "Trait", value: "traits" }
];
const computationMethods = ["copy", "concat", "count"];
const valueTypes = ["string", "int", "boolean", "date", "arrayOfString", "arrayOfInt"];
const conditionOperators = [
    "equals", "not_equals", "exists", "not_exists",
    "contains", "not_contains", "greater_than", "greater_than_equals",
    "less_than", "less_than_equals"
];
const timeRanges = [
    { label: "Last 15 mins", value: "900" },
    { label: "Last 30 mins", value: "1800" },
    { label: "Last 1 hour", value: "3600" },
    { label: "Last 3 hours", value: "10800" },
    { label: "Last 6 hours", value: "21600" },
    { label: "Last 12 hours", value: "43200" },
    { label: "Last day", value: "86400" },
    { label: "Last 3 days", value: "259200" },
    { label: "Last week", value: "604800" },
    { label: "Last 2 weeks", value: "1209600" },
    { label: "Last 1 month", value: "2592000" }
];

const AddTraitModal: React.FC<AddTraitModalProps> = ({
    open, onClose, onSubmit, form,
    propertyGroup, propertySuffix,
    setPropertyGroup, setPropertySuffix,
    updateForm, updateTrigger, updateCondition,
    addCondition, removeCondition
}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [existingTraitNames, setExistingTraitNames] = useState<string[]>([]);
    const [nameExists, setNameExists] = useState(false);

    const fullTraitName = `${propertyGroup}.${propertySuffix}`;

    const handleFinalSubmit = () => {
        const finalPayload = {
            ...form,
            trait_name: fullTraitName,
            value: form.trait_type === "static" ? form.value : undefined,
            computation: form.trait_type === "computed" ? form.computation : undefined,
            source_field: form.computation === "copy" ? form.source_field : undefined,
            source_field_one: form.computation === "concat" ? form.source_field_one : undefined,
            source_field_two: form.computation === "concat" ? form.source_field_two : undefined,
            time_range: form.computation === "count" ? form.time_range : undefined
        };
        onSubmit(finalPayload);
    };

    useEffect(() => {
        const fetchExistingTraits = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8900/api/v1/enrichment-rules?filter=trait_name+sw+${propertyGroup}`
                );
                const traits = response.data.map((rule: any) => rule.trait_name);
                setExistingTraitNames(traits);
            } catch (err) {
                console.error("Failed to fetch traits", err);
                setExistingTraitNames([]);
            }
        };

        if (open) fetchExistingTraits();
    }, [propertyGroup, open]);

    useEffect(() => {
        setNameExists(existingTraitNames.includes(fullTraitName));
    }, [fullTraitName, existingTraitNames]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Create Trait</DialogTitle>
            <DialogContent>
                {step === 1 ? (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><Typography variant="subtitle1">📌 Property Details</Typography></Grid>

                        <Grid item xs={4}>
                            <TextField select label="Property Scope" fullWidth value={propertyGroup}
                                       onChange={(e) => setPropertyGroup(e.target.value)}>
                                {propertyGroups.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Property Name"
                                fullWidth
                                value={propertySuffix}
                                onChange={(e) => setPropertySuffix(e.target.value)}
                                error={nameExists}
                                helperText={nameExists ? "Trait name already exists." : " "}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {propertySuffix && (
                                                nameExists ? (
                                                    <ErrorIcon color="error" />
                                                ) : (
                                                    <CheckCircle color="success" />
                                                )
                                            )}
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField select label="Value Type" fullWidth value={form.value_type}
                                       onChange={(e) => updateForm("value_type", e.target.value)}>
                                {valueTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField label="Description" fullWidth value={form.description}
                                       onChange={(e) => updateForm("description", e.target.value)} />
                        </Grid>

                        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

                        <Grid item xs={12}><Typography variant="subtitle1">🧮 Computation</Typography></Grid>

                        <Grid item xs={4}>
                            <TextField select label="Trait Type" fullWidth value={form.trait_type}
                                       onChange={(e) => updateForm("trait_type", e.target.value)}>
                                {traitTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField>
                        </Grid>

                        {form.trait_type === "static" && (
                            <Grid item xs={12}>
                                <TextField label="Value" fullWidth value={form.value}
                                           onChange={(e) => updateForm("value", e.target.value)} />
                            </Grid>
                        )}

                        {form.trait_type === "computed" && (
                            <>
                                <Grid item xs={4}>
                                    <TextField select label="Computation" fullWidth value={form.computation}
                                               onChange={(e) => updateForm("computation", e.target.value)}>
                                        {computationMethods.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                {form.computation === "copy" && (
                                    <Grid item xs={12}>
                                        <TextField label="Source Field" fullWidth value={form.source_field}
                                                   onChange={(e) => updateForm("source_field", e.target.value)} />
                                    </Grid>
                                )}
                                {form.computation === "concat" && (
                                    <>
                                        <Grid item xs={6}>
                                            <TextField label="Source Field One" fullWidth value={form.source_field_one}
                                                       onChange={(e) => updateForm("source_field_one", e.target.value)} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField label="Source Field Two" fullWidth value={form.source_field_two}
                                                       onChange={(e) => updateForm("source_field_two", e.target.value)} />
                                        </Grid>
                                    </>
                                )}
                                {form.computation === "count" && (
                                    <Grid item xs={12}>
                                        <TextField select label="Time Range" fullWidth value={form.time_range}
                                                   onChange={(e) => updateForm("time_range", e.target.value)}>
                                            {timeRanges.map(tr => <MenuItem key={tr.value} value={tr.value}>{tr.label}</MenuItem>)}
                                        </TextField>
                                    </Grid>
                                )}
                            </>
                        )}

                        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

                        <Grid item xs={12}><Typography variant="subtitle1">🔄 Merge Strategy</Typography></Grid>
                        <Grid item xs={6}>
                            <TextField select label="Merge Strategy" fullWidth value={form.merge_strategy}
                                       onChange={(e) => updateForm("merge_strategy", e.target.value)}>
                                {mergeStrategies.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                ) : (
                    <>
                        <Box>
                            <Typography variant="subtitle1">🔁 Trigger Configuration</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select label="Event Type" fullWidth value={form.trigger.event_type}
                                           onChange={(e) => updateTrigger("event_type", e.target.value)}>
                                    {eventTypes.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Event Name" fullWidth value={form.trigger.event_name}
                                           onChange={(e) => updateTrigger("event_name", e.target.value)} />
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Conditions</Typography>
                        {form.trigger.conditions.map((cond, i) => (
                            <Grid container spacing={2} alignItems="center" key={i} sx={{ mb: 1 }}>
                                <Grid item xs={3}>
                                    <TextField label="Field" fullWidth value={cond.field}
                                               onChange={(e) => updateCondition(i, "field", e.target.value)} />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField select label="Operator" fullWidth value={cond.operator}
                                               onChange={(e) => updateCondition(i, "operator", e.target.value)}>
                                        {conditionOperators.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                                    </TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="Value" fullWidth value={cond.value}
                                               onChange={(e) => updateCondition(i, "value", e.target.value)} />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton color="error" onClick={() => removeCondition(i)}><Delete /></IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={addCondition} startIcon={<Add />} sx={{ mt: 1 }}>Add Condition</Button>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {step === 1 && (
                    <Button variant="contained" onClick={() => setStep(2)}>Next</Button>
                )}
                {step === 2 && (
                    <>
                        <Button onClick={() => setStep(1)}>Back</Button>
                        <Button variant="contained" onClick={handleFinalSubmit} disabled={nameExists}>
                            Create
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddTraitModal;
