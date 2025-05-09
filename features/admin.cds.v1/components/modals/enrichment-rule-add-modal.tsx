import React, { useState, useEffect, useCallback } from "react";
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

interface EnrichmentRuleTrigger {
    event_type: string;
    event_name: string;
    conditions: Condition[];
}

interface EnrichmentRuleFormData {
    property_name: string;
    description: string;
    value?: string;
    value_type: string;
    computation_method?: string;
    source_field?: string;
    time_range?: string;
    merge_strategy: string;
    trigger: EnrichmentRuleTrigger;
    enabled: boolean;
}

interface AddEnrichmentRuleModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (finalPayload: EnrichmentRuleFormData) => void;
    form: EnrichmentRuleFormData;
    initialFormState?: EnrichmentRuleFormData; // Made optional here for safety, but parent should always provide it.
    propertyGroup: string;
    propertySuffix: string;
    setPropertyGroup: (val: string) => void;
    setPropertySuffix: (val: string) => void;
    updateForm: (key: keyof EnrichmentRuleFormData, value: any) => void;
    updateTrigger: (key: keyof EnrichmentRuleTrigger, value: any) => void;
    updateCondition: (index: number, field: keyof Condition, value: string) => void;
    addCondition: () => void;
    removeCondition: (index: number) => void;
}

const mergeStrategies = ["overwrite", "combine", "ignore"];
const eventTypes = ["identify", "page", "track"];
const propertyGroups = [
    { label: "Identity Attribute", value: "identity_attributes" },
    { label: "Application Data", value: "application_data" },
    { label: "Trait", value: "traits" }
];
const computationMethods = ["static", "extract", "count"];
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

const AddEnrichmentRuleModal: React.FC<AddEnrichmentRuleModalProps> = ({
    open, onClose, onSubmit, form, initialFormState, // initialFormState should ideally always be provided
    propertyGroup, propertySuffix,
    setPropertyGroup, setPropertySuffix,
    updateForm, updateTrigger, updateCondition,
    addCondition, removeCondition
}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [existingTraitNames, setExistingPropertyNames] = useState<string[]>([]);
    const [nameExists, setNameExists] = useState(false);
    const [existingTraitDetails, setExistingTraitDetails] = useState<EnrichmentRuleFormData | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const fullEnrichmentRulePropertyName = `${propertyGroup}.${propertySuffix}`;

    useEffect(() => {
        if (!open) {
            setStep(1);
            setExistingPropertyNames([]);
            setNameExists(false);
            setExistingTraitDetails(null);
            setIsLoadingDetails(false);
        } else {
            if (propertyGroup) {
                axios.get(`http://localhost:8900/api/v1/enrichment-rules?filter=property_name+sw+${propertyGroup}`)
                    .then(res => {
                        const traits = res.data.map((rule: any) => rule.property_name);
                        setExistingPropertyNames(traits);
                    })
                    .catch(err => {
                        console.error("Failed to fetch traits", err);
                        setExistingPropertyNames([]);
                    });
            } else {
                setExistingPropertyNames([]);
            }
        }
    }, [open, propertyGroup]);

    useEffect(() => {
        if (!propertySuffix || !propertyGroup) {
            setNameExists(false);
            setExistingTraitDetails(null);
            return;
        }
        const exists = existingTraitNames.includes(fullEnrichmentRulePropertyName);
        setNameExists(exists);

        if (!exists) {
            setExistingTraitDetails(null);
            // Revert to initial/default values if the name becomes unique
            // Ensure initialFormState exists before accessing its properties
            if (initialFormState) {
                if (form.value_type !== initialFormState.value_type) updateForm("value_type", initialFormState.value_type);
                if (form.description !== initialFormState.description) updateForm("description", initialFormState.description);
                if (form.merge_strategy !== initialFormState.merge_strategy) updateForm("merge_strategy", initialFormState.merge_strategy);
            }
        }
    }, [fullEnrichmentRulePropertyName, propertySuffix, propertyGroup, existingTraitNames, updateForm, initialFormState, form.value_type, form.description, form.merge_strategy]);

    useEffect(() => {
        if (nameExists && fullEnrichmentRulePropertyName && propertySuffix) {
            setIsLoadingDetails(true);
            axios.get(`http://localhost:8900/api/v1/enrichment-rules?filter=property_name+eq+${fullEnrichmentRulePropertyName}`)
                .then(res => {
                    if (res.data && res.data.length > 0 && res.data[0]) { // Ensure res.data[0] is not null/undefined
                        setExistingTraitDetails(res.data[0] as EnrichmentRuleFormData);
                    } else {
                        setExistingTraitDetails(null);
                        setNameExists(false);
                    }
                })
                .catch(err => {
                    console.error(`Failed to fetch details for trait ${fullEnrichmentRulePropertyName}`, err);
                    setExistingTraitDetails(null);
                })
                .finally(() => {
                    setIsLoadingDetails(false);
                });
        } else if (!nameExists) {
            setExistingTraitDetails(null);
        }
    }, [nameExists, fullEnrichmentRulePropertyName, propertySuffix]);

    const stableUpdateForm = useCallback(updateForm, []); // Ensure updateForm is stable

    useEffect(() => {
        // Ensure existingTraitDetails and its properties are valid before updating form
        if (nameExists && existingTraitDetails &&
            typeof existingTraitDetails.value_type !== 'undefined' && // Explicit check
            typeof existingTraitDetails.description !== 'undefined' &&
            typeof existingTraitDetails.merge_strategy !== 'undefined') {

            if (form.value_type !== existingTraitDetails.value_type) {
                stableUpdateForm("value_type", existingTraitDetails.value_type);
            }
            if (form.description !== existingTraitDetails.description) {
                stableUpdateForm("description", existingTraitDetails.description);
            }
            if (form.merge_strategy !== existingTraitDetails.merge_strategy) {
                stableUpdateForm("merge_strategy", existingTraitDetails.merge_strategy);
            }
        }
    }, [nameExists, existingTraitDetails, stableUpdateForm, form.value_type, form.description, form.merge_strategy]);


    const handleFinalSubmit = () => {
        const finalPayload: EnrichmentRuleFormData = {
            property_name: fullEnrichmentRulePropertyName,
            description: form.description,
            value_type: form.value_type,
            merge_strategy: form.merge_strategy,
            enabled: form.enabled,
            trigger: form.trigger, // Ensure form.trigger is initialized
            value: form.computation_method === "static" ? form.value : undefined,
            computation_method: form.computation_method !== "static" ? form.computation_method : undefined,
            source_field: form.computation_method === "extract" ? form.source_field : undefined,
            time_range: form.computation_method === "count" ? form.time_range : undefined
        };
        onSubmit(finalPayload);
    };

    const isStep1FieldDisabled = nameExists && !!existingTraitDetails;
    const isNextButtonDisabled = !propertySuffix || !propertyGroup || isLoadingDetails;

    // Ensure form is defined before accessing its properties in JSX, though props should guarantee this.
    // This is more of a safeguard for unexpected parent behavior.
    if (!form) {
        return <Dialog open={open} onClose={onClose}><DialogTitle>Error</DialogTitle><DialogContent><Typography>Form data is missing.</Typography></DialogContent></Dialog>;
    }
    // Ensure form.trigger is initialized, as it's accessed directly in JSX
    const safeTrigger = form.trigger || { event_type: '', event_name: '', conditions: [] };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Create Trait</DialogTitle>
            <DialogContent>
                {isLoadingDetails && <Typography sx={{ mb: 1 }}>Loading existing trait details...</Typography>}
                {step === 1 ? (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}><Typography variant="subtitle1">📌 Property Details</Typography></Grid>
                        <Grid item xs={4}>
                            <TextField select label="Property Scope" fullWidth value={propertyGroup}
                                onChange={(e) => setPropertyGroup(e.target.value)}
                                disabled={isLoadingDetails}
                            >
                                {propertyGroups.map(p => (
                                    <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Property Name"
                                fullWidth
                                value={propertySuffix}
                                onChange={(e) => setPropertySuffix(e.target.value)}
                                disabled={isLoadingDetails}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {propertySuffix && !isLoadingDetails && (
                                                nameExists ? (
                                                    <ErrorIcon color="warning" />
                                                ) : (
                                                    <CheckCircle color="success" />
                                                )
                                            )}
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {propertySuffix && nameExists && !isLoadingDetails && (
                                <Typography variant="caption" sx={{ color: "orange", mt: 0.5 }}>
                                    ⚠️ This property name is already in use. Its type, description, and merge strategy are locked.
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField select label="Value Type" fullWidth value={form.value_type || ""} // Fallback for safety
                                onChange={(e) => updateForm("value_type", e.target.value)}
                                disabled={isStep1FieldDisabled || isLoadingDetails}
                            >
                                {valueTypes.map(t => (
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Description" fullWidth value={form.description || ""} // Fallback for safety
                                onChange={(e) => updateForm("description", e.target.value)}
                                disabled={isStep1FieldDisabled || isLoadingDetails}
                            />
                        </Grid>
                        <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>
                        <Grid item xs={12}><Typography variant="subtitle1">🔄 Merge Strategy</Typography></Grid>
                        <Grid item xs={6}>
                            <TextField select label="Merge Strategy" fullWidth value={form.merge_strategy || ""} // Fallback for safety
                                onChange={(e) => updateForm("merge_strategy", e.target.value)}
                                disabled={isStep1FieldDisabled || isLoadingDetails}
                            >
                                {mergeStrategies.map(m => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                ) : (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">Computation Method</Typography>
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={4}>
                                <TextField select label="Computation" fullWidth value={form.computation_method || ""}
                                    onChange={(e) => updateForm("computation_method", e.target.value)}>
                                    {computationMethods.map(m => (
                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {form.computation_method === "static" && (
                                <Grid item xs={12}>
                                    <TextField label="Value" fullWidth value={form.value || ""}
                                        onChange={(e) => updateForm("value", e.target.value)} />
                                </Grid>
                            )}
                            {form.computation_method === "extract" && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Source Property Name"
                                        fullWidth
                                        value={form.source_field || ""}
                                        onChange={(e) => updateForm("source_field", e.target.value)}
                                    />
                                </Grid>
                            )}
                            {form.computation_method === "count" && (
                                <Grid item xs={12}>
                                    <TextField select label="Time Range" fullWidth value={form.time_range || ""}
                                        onChange={(e) => updateForm("time_range", e.target.value)}>
                                        {timeRanges.map(tr => (
                                            <MenuItem key={tr.value} value={tr.value}>{tr.label}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}
                        </Grid>
                        <Box><Typography variant="subtitle1">🔁 Trigger Configuration</Typography></Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField select label="Event Type" fullWidth value={safeTrigger.event_type}
                                    onChange={(e) => updateTrigger("event_type", e.target.value)}>
                                    {eventTypes.map(e => (
                                        <MenuItem key={e} value={e}>{e}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Event Name" fullWidth value={safeTrigger.event_name}
                                    onChange={(e) => updateTrigger("event_name", e.target.value)} />
                            </Grid>
                        </Grid>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>Conditions</Typography>
                        {safeTrigger.conditions.map((cond, i) => (
                            <Grid container spacing={2} alignItems="center" key={i} sx={{ mb: 1 }}>
                                <Grid item xs={3}>
                                    <TextField label="Field" fullWidth value={cond.field}
                                        onChange={(e) => updateCondition(i, "field", e.target.value)} />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField select label="Operator" fullWidth value={cond.operator}
                                        onChange={(e) => updateCondition(i, "operator", e.target.value)}>
                                        {conditionOperators.map(op => (
                                            <MenuItem key={op} value={op}>{op}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField label="Value" fullWidth value={cond.value}
                                        onChange={(e) => updateCondition(i, "value", e.target.value)} />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton color="error" onClick={() => removeCondition(i)}>
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={addCondition} startIcon={<Add />} sx={{ mt: 1 }}>
                            Add Condition
                        </Button>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {step === 1 && <Button variant="contained" onClick={() => setStep(2)} disabled={isNextButtonDisabled}>Next</Button>}
                {step === 2 && (
                    <>
                        <Button onClick={() => setStep(1)}>Back</Button>
                        <Button variant="contained" onClick={handleFinalSubmit}>Create</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddEnrichmentRuleModal;