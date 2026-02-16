/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";
import MenuItem from "@oxygen-ui/react/MenuItem";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Switch from "@oxygen-ui/react/Switch";
import Step from "@oxygen-ui/react/Step";
import StepContent from "@oxygen-ui/react/StepContent";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { createUnificationRule } from "../api/unification-rules";
import { useUnificationRules } from "../hooks/use-unification-rules";

type UnificationRuleCreatePageProps = IdentifiableComponentInterface;

interface FormData {
    ruleName: string;
    scope: string;
    attribute: string;
    priority: number;
    isActive: boolean;
}

const SCOPE_OPTIONS = [
    { value: "identity_attributes", label: "Identity Attribute" },
    { value: "application_data", label: "Application Data" },
    { value: "traits", label: "Trait" }
];

const UnificationRuleCreatePage: FunctionComponent<UnificationRuleCreatePageProps> = (
    props: UnificationRuleCreatePageProps
): ReactElement => {
    const { ["data-componentid"]: componentId = "create-unification-rule" } = props;

    const dispatch: Dispatch = useDispatch();
    const { mutate: refreshRules } = useUnificationRules(false);

    const [activeStep, setActiveStep] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        ruleName: "",
        scope: "identity_attributes",
        attribute: "",
        priority: 1,
        isActive: true
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    /**
     * Validate Step 1
     */
    const validateStep1 = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.ruleName.trim()) {
            newErrors.ruleName = "Rule name is required";
        }
        if (!formData.attribute.trim()) {
            newErrors.attribute = "Attribute is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Validate Step 2
     */
    const validateStep2 = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (formData.priority < 1) {
            newErrors.priority = "Priority must be at least 1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handle field change
     */
    const handleChange = (field: keyof FormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === "isActive" 
            ? event.target.checked 
            : field === "priority"
            ? parseInt(event.target.value, 10) || 1
            : event.target.value;

        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    /**
     * Handle next button
     */
    const handleNext = (): void => {
        if (validateStep1()) {
            setActiveStep(1);
        }
    };

    /**
     * Handle back button
     */
    const handleBack = (): void => {
        setActiveStep(0);
    };

    /**
     * Handle cancel
     */
    const handleCancel = (): void => {
        history.push(AppConstants.getPaths().get("UNIFICATION_RULES"));
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (): Promise<void> => {
        if (!validateStep2()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await createUnificationRule({
                rule_name: formData.ruleName,
                property_name: `${formData.scope}.${formData.attribute}`,
                priority: formData.priority,
                is_active: formData.isActive
            });

            dispatch(
                addAlert({
                    description: "Unification rule has been created successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Rule Created"
                })
            );

            refreshRules();
            history.push(AppConstants.getPaths().get("UNIFICATION_RULES"));
        } catch (error) {
            dispatch(
                addAlert({
                    description:
                        error?.response?.data?.message ||
                        error?.message ||
                        "Failed to create unification rule.",
                    level: AlertLevels.ERROR,
                    message: "Creation Failed"
                })
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout
            title="Create Unification Rule"
            contentTopMargin={true}
            description="Define a new profile unification rule to automatically resolve and merge customer identities."
            className="unification-rule-create-page-layout"
            data-componentid={`${componentId}-page-layout`}
            backButton={{
                onClick: handleCancel,
                text: "Back to Unification Rules"
            }}
            titleTextAlign="left"
            bottomMargin={false}
            showBottomDivider
        >
            <EmphasizedSegment padded="very" data-componentid={`${componentId}-segment`}>
                <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    className="unification-rule-create-stepper"
                    data-componentid={`${componentId}-stepper`}
                >
                    {/* Step 1: Basic Details */}
                    <Step data-componentid={`${componentId}-step-1`}>
                        <StepLabel
                            optional={
                                <Typography variant="body2">
                                    Define the rule name and select the attribute to unify on
                                </Typography>
                            }
                        >
                            <Typography variant="h4">Basic Details</Typography>
                        </StepLabel>
                        <StepContent>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <TextField
                                    fullWidth
                                    label="Rule Name"
                                    placeholder="Enter a descriptive name for this rule"
                                    value={formData.ruleName}
                                    onChange={handleChange("ruleName")}
                                    error={!!errors.ruleName}
                                    helperText={errors.ruleName}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    select
                                    label="Scope"
                                    value={formData.scope}
                                    onChange={handleChange("scope")}
                                    helperText="Select the scope of the attribute"
                                >
                                    {SCOPE_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    fullWidth
                                    label="Attribute"
                                    placeholder="Enter the attribute name (e.g., email, phone)"
                                    value={formData.attribute}
                                    onChange={handleChange("attribute")}
                                    error={!!errors.attribute}
                                    helperText={errors.attribute || "The specific attribute to use for unification"}
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                <Button variant="outlined" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            </div>
                        </StepContent>
                    </Step>

                    {/* Step 2: Configuration */}
                    <Step data-componentid={`${componentId}-step-2`}>
                        <StepLabel
                            optional={
                                <Typography variant="body2">
                                    Set the priority and activation status for this rule
                                </Typography>
                            }
                        >
                            <Typography variant="h4">Configuration</Typography>
                        </StepLabel>
                        <StepContent>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Priority"
                                    value={formData.priority}
                                    onChange={handleChange("priority")}
                                    error={!!errors.priority}
                                    helperText={
                                        errors.priority ||
                                        "Lower numbers = higher priority. Rules with higher priority are evaluated first."
                                    }
                                    inputProps={{ min: 1 }}
                                    required
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={handleChange("isActive")}
                                        />
                                    }
                                    label="Enable this rule immediately"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                                <Button
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    onClick={handleBack}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create Rule"}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                </Stepper>
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default UnificationRuleCreatePage;
