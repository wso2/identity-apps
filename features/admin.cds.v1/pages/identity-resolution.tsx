import React, { useEffect, useState } from "react";
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Switch, FormControlLabel
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { Card, CardContent } from "@oxygen-ui/react";
import axios from "axios";
import ResolutionRuleModal from "../components/modals/resolution-rule-add-modal";

const IdentityResolutionPage = () => {
    const [rules, setRules] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const fetchRules = async () => {
        try {
            const res = await axios.get("http://localhost:8900/api/v1/unification-rules");
            setRules(res.data || []);
        } catch (err) {
            console.error("Failed to fetch resolution rules", err);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleDelete = async (ruleId: string) => {
        try {
            await axios.delete(`http://localhost:8900/api/v1/unification-rules/${ruleId}`);
            fetchRules();
        } catch (err) {
            console.error("Failed to delete rule", err);
        }
    };

    const toggleRuleStatus = async (ruleId: string, current: boolean) => {
        try {
            await axios.patch(`http://localhost:8900/api/v1/unification-rules/${ruleId}`, {
                is_active: !current
            });
            fetchRules();
        } catch (err) {
            console.error("Failed to toggle rule status", err);
        }
    };

    return (
    
                <><Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
                <Typography variant="h4" gutterBottom>Unification Rules</Typography>
                <Typography variant="body1">
                    Helps merge separate profiles based on a defined set of rules.
                </Typography>
            </Box>

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenModal(true)}
            >
                Add Rule
            </Button>
        </Box><Card>
                <CardContent>
                    {rules.length === 0 ? (
                        <Typography>No resolution rules found.</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Rule Name</strong></TableCell>
                                        <TableCell><strong>Attribute Scope</strong></TableCell>
                                        <TableCell><strong>Attribute</strong></TableCell>
                                        <TableCell><strong>Priority</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {rules.map(rule => {
                                        const attribute = rule.attribute || "";
                                        let scopeLabel = "Unknown";
                                        let attributeSuffix = attribute;

                                        if (attribute.startsWith("identity_attributes.")) {
                                            scopeLabel = "Identity Attribute";
                                            attributeSuffix = attribute.replace("identity_attributes.", "");
                                        } else if (attribute.startsWith("application_data.")) {
                                            scopeLabel = "Application Data";
                                            attributeSuffix = attribute.replace("application_data.", "");
                                        } else if (attribute.startsWith("traits.")) {
                                            scopeLabel = "Trait";
                                            attributeSuffix = attribute.replace("traits.", "");
                                        }

                                        return (
                                            <TableRow key={rule.rule_id}>
                                                <TableCell>{rule.rule_name}</TableCell>
                                                <TableCell>{scopeLabel}</TableCell>
                                                <TableCell>{attributeSuffix}</TableCell>
                                                <TableCell>{rule.priority}</TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={<Switch
                                                            checked={rule.is_active}
                                                            onChange={() => toggleRuleStatus(rule.rule_id, rule.is_active)} />}
                                                        label={rule.is_active ? "Active" : "Inactive"} />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton color="error" onClick={() => handleDelete(rule.rule_id)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card><ResolutionRuleModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmitSuccess={() => {
                    setOpenModal(false);
                    fetchRules();
                } } /></>
            
    );
};

export default IdentityResolutionPage;
