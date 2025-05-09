import React, { useEffect, useState, useCallback } from "react";
import {
    Box, Typography, Card, CardContent, Table, TableHead, TableRow, TableCell,
    TableBody, IconButton, Button, useTheme, TextField, MenuItem, Grid
} from "@mui/material";
import { Add, Delete, Edit as EditIcon, Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import axios from "axios";
import AddEnrichmentRuleModal from "../components/modals/enrichment-rule-add-modal";
import { Chip } from "@oxygen-ui/react";

// Interfaces (Condition, TraitTrigger, TraitFormData, Rule) remain the same
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
    property_name: string;
    description: string;
    property_type: "static" | "computed";
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

interface Rule extends TraitFormData {
    rule_id: string;
}
const ProfileTraitsPage: React.FC = () => {
    const theme = useTheme();
    const [rules, setRules] = useState<Rule[]>([]);
    const [openModal, setOpenModal] = useState(false);

    // defaultForm, form, propertyGroup, propertySuffix, searchTerm, selectedScopeFilter, etc. remain the same
    // ... (rest of your state and helper functions up to loadRules)

    const defaultForm: TraitFormData = {
        property_name: "",
        description: "",
        property_type: "static",
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

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedScopeFilter, setSelectedScopeFilter] = useState("");

    const allDisplayableScopeKeysMap: Record<string, string> = {
        identity_attributes: "Identity Attribute",
        application_data: "Application Data",
        personality: "Personality",
        traits: "Trait"
    };

    const filterDropdownScopeOptions = [
        { value: "identity_attributes", label: "Identity Attribute" },
        { value: "application_data", label: "Application Data" },
        { value: "traits", label: "Trait" }
    ];


    const loadRules = useCallback(async (scopeToFilter = selectedScopeFilter, termToSearch = searchTerm) => {
        let filterQuery = "";
        const effectiveScope = scopeToFilter?.trim();
        const effectiveTerm = termToSearch?.trim();

        // Your existing filter logic for property_name
        // For WSO2 style, SCIM often uses 'eq' for exact matches, 'sw' for startsWith, 'co' for contains.
        // Example: field eq value AND anotherField co anotherValue
        // The current logic seems to be building a single 'property_name' filter which is fine.
        if (effectiveScope && effectiveTerm) {
            // If you want to search within the scope's properties:
            filterQuery = `property_name co ${effectiveScope}.${effectiveTerm}`;
            // Or, if property_name *is* the full "scope.term":
            // filterQuery = `property_name sw ${effectiveScope} and property_name co ${effectiveTerm}`;
        } else if (effectiveScope) {
            filterQuery = `property_name sw ${effectiveScope}.`; // Added a dot assuming scope is a prefix
        } else if (effectiveTerm) {
            filterQuery = `property_name co ${effectiveTerm}`;
        }


        try {
            const baseUrl = "http://localhost:8900/api/v1/enrichment-rules";
            const requestUrl = filterQuery ? `${baseUrl}?filter=${encodeURIComponent(filterQuery)}` : baseUrl;
            // console.log("Fetching rules from:", requestUrl);
            const res = await axios.get(requestUrl);
            setRules(res.data || []);
        } catch (err) {
            console.error("Failed to fetch profile traits", err);
            setRules([]); // Set to empty array on error
        }
    }, [selectedScopeFilter, searchTerm]); // Dependencies are correct

    useEffect(() => {
        loadRules("", ""); // Load all rules on initial mount
    }, [loadRules]); // Include loadRules in dependency array as it's memoized

    // ... (handleDelete and other functions remain the same) ...
    const handleDelete = async (traitId: string) => {
        try {
            await axios.delete(`http://localhost:8900/api/v1/enrichment-rules/${traitId}`);
            loadRules(selectedScopeFilter, searchTerm); // Reload with current filters
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
            trigger: { ...(prev.trigger || {}), [key]: value } as TraitTrigger
        }));
    };

    const updateCondition = (index: number, field: keyof Condition, value: string) => {
        const currentConditions = form.trigger?.conditions || [];
        const updatedConditions = currentConditions.map((cond, i) =>
            i === index ? { ...cond, [field]: value } : cond
        );
        updateTrigger("conditions", updatedConditions);
    };

    const addCondition = () => {
        const currentConditions = form.trigger?.conditions || [];
        updateTrigger("conditions", [...currentConditions, { field: "", operator: "", value: "" }]);
    };

    const removeCondition = (index: number) => {
        const currentConditions = form.trigger?.conditions || [];
        const updated = currentConditions.filter((_, i) => i !== index);
        updateTrigger("conditions", updated);
    };

    const scopeStyles: Record<string, { bg: string; color: string }> = {
        "Identity Attribute": { bg: "#e8f5e9", color: "#2e7d32" },
        "Application Data": { bg: "#e3f2fd", color: "#1565c0" },
        "Personality": { bg: "#fff3e0", color: "#ef6c00" },
        "Trait": { bg: "#f3e5f5", color: "#6a1b9a" },
        "Custom": { bg: "#eeeeee", color: "#424242" },
        "N/A": { bg: "#f5f5f5", color: "#757575" }
    };


    const handleApplyFilters = () => {
        loadRules(); // loadRules will use the latest searchTerm and selectedScopeFilter from state
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedScopeFilter("");
        // Pass empty strings to loadRules to signify clearing filters
        loadRules("", "");
    };


    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                        Profile Enrichment Traits
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Create and manage rules that enrich user profiles.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setForm(defaultForm);
                        setPropertyGroup("identity_attributes");
                        setPropertySuffix("");
                        setOpenModal(true);
                    }}
                >
                    Add Trait
                </Button>
            </Box>

            {/* Filter and Search Section - With Search Button */}
            <Box
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <TextField
                            select
                            label="Filter by Scope"
                            value={selectedScopeFilter}
                            onChange={(e) => setSelectedScopeFilter(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                        >
                            <MenuItem value=""><em>Any Scope</em></MenuItem>
                            {filterDropdownScopeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={5} lg={6}> {/* Adjusted grid points */}
                        <TextField
                            label="Search by Property Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            placeholder="e.g., email or custom_field"
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon color="action" sx={{ mr: 1 }} />
                                ),
                            }}
                            // You might want to trigger search on Enter key press as well
                            onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                    handleApplyFilters();
                                    ev.preventDefault(); // Prevent form submission if it's part of a form
                                }
                            }}
                        />
                    </Grid>
                    {/* Buttons Grid Item - Modified */}
                    <Grid item xs={12} md={3} lg={3} display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Button
                            variant="contained" // Primary action
                            onClick={handleApplyFilters}
                            startIcon={<SearchIcon />}
                            sx={{ height: '40px' }} // Consistent height
                        >
                            Search
                        </Button>
                        <Button
                            variant="outlined" // Secondary action
                            onClick={handleClearFilters}
                            startIcon={<ClearIcon />}
                            sx={{ height: '40px' }} // Consistent height
                        >
                            Clear
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* ... (rest of the Table Section and AddEnrichmentRuleModal remains the same as in the previous good version) ... */}
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
                                    '& th': {
                                        fontWeight: 'bold',
                                        color: theme.palette.text.primary,
                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                        py: 1,
                                        px: 2,
                                    }
                                }}
                            >
                                <TableCell sx={{ width: '20%', pl:2 }}>Scope</TableCell>
                                <TableCell sx={{ width: '30%' }}>Property Name</TableCell>
                                <TableCell sx={{ width: '20%' }}>Event Type</TableCell>
                                <TableCell sx={{ width: '20%' }}>Event Name</TableCell>
                                <TableCell sx={{ width: '10%', pr:2, textAlign: 'right' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rules.map((rule) => {
                                const { property_name, trigger, rule_id } = rule;
                                let actualPropertyName = property_name;
                                let scopeChipLabel = "Custom";

                                if (property_name) {
                                    const parts = property_name.split('.');
                                    if (parts.length > 1) {
                                        const firstPartAsScopeKey = parts[0];
                                        if (allDisplayableScopeKeysMap[firstPartAsScopeKey]) {
                                            scopeChipLabel = allDisplayableScopeKeysMap[firstPartAsScopeKey];
                                            actualPropertyName = parts.slice(1).join('.');
                                            if (actualPropertyName === "") {
                                                actualPropertyName = "[Unnamed Property]";
                                            }
                                        } else {
                                            actualPropertyName = property_name; // Keep original if scope not in map
                                            scopeChipLabel = "Custom";
                                        }
                                    } else {
                                        actualPropertyName = property_name; // No dot, so it's the property name
                                        scopeChipLabel = "Custom"; // Or a default scope if applicable
                                    }
                                } else {
                                    actualPropertyName = "N/A";
                                    scopeChipLabel = "N/A";
                                }

                                const currentScopeStyle = scopeStyles[scopeChipLabel] || scopeStyles["Custom"];
                                const safeTrigger = trigger || { event_type: 'N/A', event_name: 'N/A', conditions: [] };

                                return (
                                    <TableRow
                                        key={rule_id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '& td': {
                                                py: 1,
                                                px: 2,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={scopeChipLabel}
                                                sx={{
                                                    backgroundColor: currentScopeStyle.bg,
                                                    color: currentScopeStyle.color,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {actualPropertyName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {safeTrigger.event_type && safeTrigger.event_type !== 'N/A' ? (
                                                <Chip
                                                    size="small"
                                                    label={safeTrigger.event_type}
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: theme.palette.info.main,
                                                        color: theme.palette.info.main,
                                                        backgroundColor: 'transparent',
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">N/A</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color={safeTrigger.event_name === 'N/A' ? "text.secondary" : "text.primary"}>
                                                {safeTrigger.event_name || "N/A"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                aria-label="edit"
                                                disabled
                                                size="small"
                                                sx={{ mr: 0.5 }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => handleDelete(rule_id)}
                                                size="small"
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {rules.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography sx={{ py: {xs:3, md:5}, color: 'text.secondary' }}>
                                            No enrichment traits match your filters. <br /> Try adjusting your search or scope.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AddEnrichmentRuleModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(finalPayload) => {
                    axios.post("http://localhost:8900/api/v1/enrichment-rules", finalPayload)
                        .then(() => {
                            setOpenModal(false);
                            loadRules(selectedScopeFilter, searchTerm);
                        })
                        .catch(err => {
                            console.error("Failed to create trait", err);
                        });
                }}
                form={form}
                initialFormState={defaultForm}
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