import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Button, Grid
} from "@mui/material";
import axios from "axios";

const scopeOptions = [
    { label: "Identity Attribute", value: "identity_attributes" },
    { label: "Application Data", value: "application_data" },
    { label: "Trait", value: "traits" }
];

const ResolutionRuleModal = ({ open, onClose, onSubmitSuccess }) => {
    const [form, setForm] = useState({
        rule_name: "",
        scope: "identity_attributes",
        attribute: "",
        priority: 1,
        is_active: true
    });

    const [attributeOptions, setAttributeOptions] = useState<string[]>([]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (field === "scope") {
            setForm(prev => ({ ...prev, attribute: "", scope: value }));
        }
    };

    const fetchAttributes = async (scope: string) => {
        try {
            const response = await axios.get(
                `http://localhost:8900/api/v1/enrichment-rules?filter=property_name+sw+${scope}`
            );

            const names = (response.data || []).map(rule => {
                const traitName = rule.property_name || "";
                const parts = traitName.split(".");
                return parts.length > 1 ? parts[1] : traitName;
            });

            setAttributeOptions(names);
        } catch (error) {
            console.error("Failed to fetch attributes", error);
            setAttributeOptions([]);
        }
    };

    useEffect(() => {
        fetchAttributes(form.scope);
    }, [form.scope]);

    useEffect(() => {
        if (open) {
            fetchAttributes("identity_attributes");
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!form.attribute || form.priority <= 0) return;

        const fullAttribute = `${form.scope}.${form.attribute}`;
        try {
            await axios.post("http://localhost:8900/api/v1/unification-rules", {
                rule_name: form.rule_name,
                property: fullAttribute,
                priority: form.priority,
                is_active: form.is_active
            });
            onSubmitSuccess();
        } catch (err) {
            console.error("Failed to create rule", err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Resolution Rule</DialogTitle>
            <DialogContent>
                <TextField
                    label="Rule Name"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={form.rule_name}
                    onChange={(e) => handleChange("rule_name", e.target.value)}
                />

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Scope"
                            fullWidth
                            value={form.scope}
                            onChange={(e) => handleChange("scope", e.target.value)}
                        >
                            {scopeOptions.map(scope => (
                                <MenuItem key={scope.value} value={scope.value}>
                                    {scope.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Attribute Name"
                            fullWidth
                            value={form.attribute}
                            onChange={(e) => handleChange("attribute", e.target.value)}
                        >
                            {attributeOptions.length > 0 ? (
                                attributeOptions.map((attr, index) => (
                                    <MenuItem key={index} value={attr}>
                                        {attr}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No attributes found</MenuItem>
                            )}
                        </TextField>
                    </Grid>
                </Grid>

                <TextField
                    label="Priority (must be > 0)"
                    type="number"
                    fullWidth
                    sx={{ mt: 2 }}
                    value={form.priority}
                    onChange={(e) =>
                        handleChange("priority", Math.max(1, parseInt(e.target.value) || 1))
                    }
                    inputProps={{ min: 1 }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!form.rule_name || !form.attribute || form.priority <= 0}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResolutionRuleModal;
