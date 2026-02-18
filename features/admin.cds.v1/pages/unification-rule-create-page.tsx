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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Switch from "@oxygen-ui/react/Switch";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Hint, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { createUnificationRule } from "../api/unification-rules";
import { useProfileSchemaDropdownOptions } from "../hooks/use-profile-attributes";
import { useUnificationRules } from "../hooks/use-unification-rules";
import { APPLICATION_DATA, IDENTITY_ATTRIBUTES, TRAITS } from "../models/constants";
import { FilterAttributeOption, ProfileSchemaScope } from "../models/profile-attributes";
import { UnificationRuleModel } from "../models/unification-rules";

type UnificationRuleCreatePageProps = IdentifiableComponentInterface;

type ScopeValue = typeof IDENTITY_ATTRIBUTES | typeof TRAITS | typeof APPLICATION_DATA;

interface FormData {
    ruleName: string;
    scope: ScopeValue;
    attribute: string; // raw opt.value (e.g., "emails.home" OR "identity_attributes.emails.home")
    priority: number;
    isActive: boolean;
}

/**
 * Extended option type that carries scope metadata for the combined attribute dropdown.
 */
interface ScopedAttributeOption {
    label: string;
    value: string;        // raw value from dropdown option (opt.value)
    scope: ScopeValue;
    propertyName: string; // fully-qualified + normalized (lowercase)
    key?: string;
}

/**
 * Fully-qualified property names that must never appear as selectable options.
 * NOTE: normalized to lowercase to match comparisons.
 */
const BLOCKED_PROPERTY_NAMES: Set<string> = new Set([
    // Skip user id in unification rule.
    `${IDENTITY_ATTRIBUTES}.userid`.toLowerCase()
]);

const UnificationRuleCreatePage: FunctionComponent<UnificationRuleCreatePageProps> = (
    props: UnificationRuleCreatePageProps
): ReactElement => {
    const { ["data-componentid"]: componentId = "create-unification-rule" } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ formData, setFormData ] = useState<FormData>({
        attribute: "",
        isActive: true,
        priority: 1,
        ruleName: "",
        scope: IDENTITY_ATTRIBUTES
    });

    const [ errors, setErrors ] = useState<Partial<Record<keyof FormData, string>>>({});
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: existingRules,
        mutate: refreshRules,
        isLoading: rulesLoading,
        error: rulesError
    } = useUnificationRules(true);

    /**
     * Build a consistent, fully-qualified property name for comparisons and submission.
     * - Keeps dotted suffixes like "emails.home".
     * - Strips ONLY known-scope prefixes if present.
     * - Normalizes to lowercase for consistent comparisons.
     */
    const buildPropertyName: (scope: ScopeValue, attributeValue: string) =>
         string = useCallback((scope: ScopeValue, attributeValue: string): string => {
             const raw: string = (attributeValue ?? "").trim();

             if (!raw) return "";

             if (raw.startsWith(`${scope}.`)) {
                 return raw;
             }

             // Strip only if the raw starts with a known scope.
             const KNOWN_SCOPES: ScopeValue[] = [ IDENTITY_ATTRIBUTES, TRAITS ];

             const otherScope: ScopeValue | undefined = KNOWN_SCOPES.find(
                 (s: ScopeValue) => raw.startsWith(`${s}.`)
             );

             const suffix: string = otherScope ? raw.slice(otherScope.length + 1) : raw;

             return `${scope}.${suffix}`;
         }, []);

    const rulesArray: UnificationRuleModel[] = useMemo(() => {
        return existingRules ?? [];
    }, [ existingRules ]);

    const usedPropertyNames: Set<string> = useMemo(() => new Set(
        rulesArray
            .map((r: UnificationRuleModel) => String(r.property_name ?? "").trim().toLowerCase())
            .filter(Boolean)
    ), [ rulesArray ]);

    const usedPriorities: Set<number> = useMemo(() => new Set(
        rulesArray
            .map((r: UnificationRuleModel) => Number(r.priority))
            .filter((n: number) => Number.isFinite(n))
    ), [ rulesArray ]);

    const isRulesReady: boolean = existingRules !== undefined;

    const { dropdownOptions: identityOptions, isLoading: identityLoading } =
        useProfileSchemaDropdownOptions(IDENTITY_ATTRIBUTES as ProfileSchemaScope);

    const { dropdownOptions: traitsOptions, isLoading: traitsLoading } =
        useProfileSchemaDropdownOptions(TRAITS as ProfileSchemaScope);

    const { dropdownOptions: appDataOptions, isLoading: appDataLoading, error: schemaError } =
        useProfileSchemaDropdownOptions(APPLICATION_DATA as ProfileSchemaScope);

    const scopeOptions: { value: ScopeValue; label: string }[] = useMemo(() => ([
        { label: t("customerDataService:unificationRules.create.fields.scope.options.identity"),
            value: IDENTITY_ATTRIBUTES },
        { label: t("customerDataService:unificationRules.create.fields.scope.options.trait"), value: TRAITS }
    ]), [ t ]);

    const availableOptions: ScopedAttributeOption[] = useMemo(() => {
        const rawOptions: FilterAttributeOption[] = (() => {
            switch (formData.scope) {
                case IDENTITY_ATTRIBUTES: return identityOptions ?? [];
                case TRAITS:              return traitsOptions ?? [];
                case APPLICATION_DATA:    return appDataOptions ?? [];
                default:                  return [];
            }
        })();

        return rawOptions
            .map((opt: FilterAttributeOption): ScopedAttributeOption => {
                const value: string = opt.value;

                return {
                    key: opt.key ?? opt.value,
                    label: opt.label,
                    propertyName: buildPropertyName(formData.scope, value),
                    scope: formData.scope,
                    value
                };
            })
            .filter((opt: ScopedAttributeOption): boolean => (
                !BLOCKED_PROPERTY_NAMES.has(opt.propertyName) &&
                !usedPropertyNames.has(opt.propertyName)
            ));
    }, [
        appDataOptions,
        buildPropertyName,
        formData.scope,
        identityOptions,
        traitsOptions,
        usedPropertyNames
    ]);

    const selectedAttributeOption: ScopedAttributeOption | null = useMemo(() => {
        if (!formData.attribute) return null;

        return availableOptions.find(
            (opt: ScopedAttributeOption): boolean => opt.value === formData.attribute
        ) ?? null;
    }, [ formData.attribute, availableOptions ]);

    const isScopeLoading: boolean = useMemo((): boolean => {
        switch (formData.scope) {
            case IDENTITY_ATTRIBUTES: return identityLoading;
            case TRAITS:              return traitsLoading;
            case APPLICATION_DATA:    return appDataLoading;
            default:                  return false;
        }
    }, [ formData.scope, identityLoading, traitsLoading, appDataLoading ]);

    const priorityConflict: boolean = useMemo(() => {
        return usedPriorities.has(Number(formData.priority));
    }, [ usedPriorities, formData.priority ]);

    /**
     * Defensive duplicate check for the selected attribute.
     * Even if the dropdown hides used items, this catches concurrent updates.
     */
    const attributeAlreadyUsed: boolean = useMemo(() => {
        const propertyName: string = buildPropertyName(formData.scope, formData.attribute);

        if (!propertyName) return false;

        return usedPropertyNames.has(propertyName);
    }, [ buildPropertyName, formData.scope, formData.attribute, usedPropertyNames ]);

    const priorityHelperText: string = useMemo(() => {
        if (errors.priority) return errors.priority;

        if (priorityConflict) {
            return t(
                "customerDataService:unificationRules.create.fields.priority.errors.alreadyUsed",
                { priority: formData.priority }
            );
        }

        return "";
    }, [ errors.priority, priorityConflict, formData.priority, t ]);

    const attributeErrorText: string = useMemo(() => {
        if (schemaError) {
            return t("customerDataService:unificationRules.create.fields.attribute.errors.loadFailed");
        }
        if (attributeAlreadyUsed) {
            return t("customerDataService:unificationRules.create.fields.attribute.errors.alreadyUsed");
        }
        if (errors.attribute) return errors.attribute;

        return "";
    }, [ schemaError, attributeAlreadyUsed, errors.attribute, t ]);

    useEffect(() => {
        if (usedPriorities.has(Number(formData.priority))) {
            setErrors((prev: Partial<Record<keyof FormData, string>>) => ({
                ...prev,
                priority: t(
                    "customerDataService:unificationRules.create.fields.priority.errors.alreadyUsed",
                    { priority: formData.priority }
                )
            }));

            return;
        }

        // Clear only if it was the "already used" message.
        setErrors((prev: Partial<Record<keyof FormData, string>>) => {
            if (!prev.priority) return prev;
            if (!String(prev.priority).includes("already used")) return prev;

            return { ...prev, priority: undefined };
        });
    }, [ usedPriorities, formData.priority, t ]);

    useEffect(() => {
        if (formData.attribute && attributeAlreadyUsed) {
            setErrors((prev: Partial<Record<keyof FormData, string>>) => ({
                ...prev,
                attribute: t("customerDataService:unificationRules.create.fields.attribute.errors.alreadyUsed")
            }));

            return;
        }

        setErrors((prev: Partial<Record<keyof FormData, string>>) => {
            if (!prev.attribute) return prev;
            if (!String(prev.attribute).includes("already used")) return prev;

            return { ...prev, attribute: undefined };
        });
    }, [ attributeAlreadyUsed, formData.attribute, t ]);

    const clearFieldError = (field: keyof FormData): void => {
        if (!errors[field]) return;

        setErrors((prev: Partial<Record<keyof FormData, string>>) => ({
            ...prev,
            [field]: undefined
        }));
    };

    const handleRuleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string = event.target.value;

        setFormData((prev: FormData) => ({ ...prev, ruleName: value }));
        clearFieldError("ruleName");
    };

    const handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value: ScopeValue = event.target.value as ScopeValue;

        setFormData((prev: FormData) => ({
            ...prev,
            attribute: "",
            scope: value
        }));

        clearFieldError("attribute");
    };

    const handleAttributeChange = (
        _event: React.SyntheticEvent,
        option: ScopedAttributeOption | null
    ): void => {
        const newAttribute: string = option?.value ?? "";

        setFormData((prev: FormData) => ({
            ...prev,
            attribute: newAttribute
        }));

        if (newAttribute) {
            const propertyName: string = buildPropertyName(formData.scope, newAttribute);

            if (propertyName && usedPropertyNames.has(propertyName)) {
                setErrors((prev: Partial<Record<keyof FormData, string>>) => ({
                    ...prev,
                    attribute: t("customerDataService:unificationRules.create.fields.attribute.errors.alreadyUsed")
                }));

                return;
            }
        }

        clearFieldError("attribute");
    };

    const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const parsed: number = parseInt(event.target.value, 10);
        const priority: number = Number.isFinite(parsed) ? parsed : 1;

        setFormData((prev: FormData) => ({ ...prev, priority }));

        setErrors((prev: Partial<Record<keyof FormData, string>>) => {
            const next:  Partial<Record<keyof FormData, string>>  = { ...prev };

            if (priority < 1) {
                next.priority = t("customerDataService:unificationRules.create.fields.priority.errors.min");
            } else if (usedPriorities.has(Number(priority))) {
                next.priority = t(
                    "customerDataService:unificationRules.create.fields.priority.errors.alreadyUsed",
                    { priority }
                );
            } else {
                next.priority = undefined;
            }

            return next;
        });
    };

    const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData((prev: FormData) => ({ ...prev, isActive: event.target.checked }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.ruleName.trim()) {
            newErrors.ruleName = t("customerDataService:unificationRules.create.fields.ruleName.errors.required");
        }

        if (!formData.attribute) {
            newErrors.attribute = t("customerDataService:unificationRules.create.fields.attribute.errors.required");
        } else if (attributeAlreadyUsed) {
            newErrors.attribute = t("customerDataService:unificationRules.create.fields.attribute.errors.alreadyUsed");
        }

        if (Number(formData.priority) < 1) {
            newErrors.priority = t("customerDataService:unificationRules.create.fields.priority.errors.min");
        } else if (usedPriorities.has(Number(formData.priority))) {
            newErrors.priority = t(
                "customerDataService:unificationRules.create.fields.priority.errors.alreadyUsed",
                { priority: formData.priority }
            );
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleCancel = (): void => {
        history.push(AppConstants.getPaths().get("UNIFICATION_RULES"));
    };

    const handleSubmit = async (): Promise<void> => {
        if (isSubmitting) return;
        if (!isRulesReady) {
            dispatch(addAlert({
                description: t("customerDataService:unificationRules.create.notifications.loadingRules.description"),
                level: AlertLevels.WARNING,
                message: t("customerDataService:unificationRules.create.notifications.loadingRules.message")
            }));

            return;
        }

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await createUnificationRule({
                is_active: formData.isActive,
                priority: Number(formData.priority),
                property_name: buildPropertyName(formData.scope, formData.attribute),
                rule_name: formData.ruleName
            });

            dispatch(addAlert({
                description: t("customerDataService:unificationRules.create.notifications.created.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:unificationRules.create.notifications.created.message")
            }));

            await refreshRules();
            history.push(AppConstants.getPaths().get("UNIFICATION_RULES"));
        } catch (error: unknown) {
            const err: { response?: { data?: { message?: string } }; message?: string } =
                error as { response?: { data?: { message?: string } }; message?: string };

            dispatch(addAlert({
                description:
                    err?.response?.data?.message ??
                    err?.message ??
                    t("customerDataService:unificationRules.create.notifications.creationFailed.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.create.notifications.creationFailed.message")
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout
            title={ t("customerDataService:unificationRules.create.page.title") }
            contentTopMargin={ true }
            description={ t("customerDataService:unificationRules.create.page.description") }
            className="unification-rule-create-page-layout"
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                onClick: handleCancel,
                text: t("customerDataService:unificationRules.create.page.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            <EmphasizedSegment padded="very" data-componentid={ `${componentId}-segment` }>
                <div
                    style={ { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px" } }
                    data-componentid={ `${componentId}-form` }
                >
                    <div>
                        <Typography variant="h4">
                            { t("customerDataService:unificationRules.create.headings.ruleDetails") }
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={ { marginTop: "4px" } }>
                            { t("customerDataService:unificationRules.create.headings.ruleDetailsDescription") }
                        </Typography>
                    </div>

                    { /* ── Rule Name ── */ }
                    <div>
                        <TextField
                            fullWidth
                            required
                            label={ t("customerDataService:unificationRules.create.fields.ruleName.label") }
                            placeholder={ t("customerDataService:unificationRules.create.fields.ruleName.placeholder") }
                            value={ formData.ruleName }
                            onChange={ handleRuleNameChange }
                            error={ !!errors.ruleName }
                            helperText={ errors.ruleName ?? "" }
                            InputLabelProps={ { required: true } }
                            data-componentid={ `${componentId}-rule-name` }
                        />
                        { !errors.ruleName && (
                            <Hint>{ t("customerDataService:unificationRules.create.fields.ruleName.hint") }</Hint>
                        ) }
                    </div>

                    { /* ── Attribute (compound field: scope + attribute) ── */ }
                    <div data-componentid={ `${componentId}-attribute-group` }>
                        <Typography variant="body2" style={ { marginBottom: "6px" } }>
                            { t("customerDataService:unificationRules.create.fields.attribute.label") }{ " " }
                            <span style={ { color: "theme.palette.error.main"  } }>*</span>
                        </Typography>

                        <div style={ { display: "flex", gap: "12px" } }>
                            <TextField
                                select
                                value={ formData.scope }
                                onChange={ handleScopeChange }
                                style={ { flex: "0 0 180px", minWidth: "180px" } }
                                inputProps={ {
                                    "aria-label":
                                    t("customerDataService:unificationRules.create.fields.attribute.scopeAriaLabel")
                                } }
                                data-componentid={ `${componentId}-scope` }
                            >
                                { scopeOptions.map((option: { value: ScopeValue; label: string }) => (
                                    <MenuItem key={ option.value } value={ option.value }>
                                        { option.label }
                                    </MenuItem>
                                )) }
                            </TextField>

                            <Autocomplete
                                fullWidth
                                options={ availableOptions }
                                value={ selectedAttributeOption }
                                onChange={ handleAttributeChange }
                                getOptionLabel={ (option: ScopedAttributeOption) => option.label }
                                isOptionEqualToValue={
                                    (option: ScopedAttributeOption, val: ScopedAttributeOption) =>
                                        option.value === val.value
                                }
                                loading={ isScopeLoading }
                                disabled={
                                    rulesLoading ||
                                    isScopeLoading ||
                                    (!isScopeLoading && availableOptions.length === 0)
                                }
                                noOptionsText={
                                    t("customerDataService:unificationRules.create.fields.attribute.noOptions")
                                }
                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                    <TextField
                                        { ...params }
                                        placeholder={
                                            t("customerDataService:unificationRules.create."+
                                                "fields.attribute.placeholder")
                                        }
                                        error={ !!attributeErrorText }
                                        helperText={ attributeErrorText }
                                        InputProps={ {
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    { (rulesLoading || isScopeLoading) && (
                                                        <CircularProgress
                                                            size={ 16 }
                                                            style={ { marginRight: "8px" } }
                                                        />
                                                    ) }
                                                    { params.InputProps.endAdornment }
                                                </>
                                            )
                                        } }
                                        inputProps={ {
                                            ...params.inputProps,
                                            "aria-label":
                                            t("customerDataService:unificationRules.create."+
                                                "fields.attribute.attributeAriaLabel")
                                        } }
                                        data-componentid={ `${componentId}-attribute` }
                                    />
                                ) }
                                data-componentid={ `${componentId}-attribute-autocomplete` }
                            />
                        </div>

                        { rulesLoading && (
                            <Hint>{
                                t("customerDataService:unificationRules.create.fields.attribute.loadingRulesHint")
                            }</Hint>
                        ) }

                        { rulesError && (
                            <Hint>{
                                t("customerDataService:unificationRules.create.fields.attribute.rulesLoadFailedHint")
                            }</Hint>
                        ) }

                        { !attributeErrorText && !schemaError && (
                            <Hint>{ t("customerDataService:unificationRules.create.fields.attribute.hint") }</Hint>
                        ) }

                        { !isScopeLoading && !schemaError && availableOptions.length === 0 && (
                            <Hint>{
                                t("customerDataService:unificationRules.create.fields."+
                                    "attribute.noAvailableForScopeHint")
                            }</Hint>
                        ) }
                    </div>

                    { /* ── Priority ── */ }
                    <div>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label={ t("customerDataService:unificationRules.create.fields.priority.label") }
                            value={ formData.priority }
                            onChange={ handlePriorityChange }
                            error={ !!errors.priority || priorityConflict }
                            helperText={ priorityHelperText }
                            inputProps={ { min: 1 } }
                            InputLabelProps={ { required: true } }
                            data-componentid={ `${componentId}-priority` }
                        />
                        { !errors.priority && !priorityConflict && (
                            <Hint>{ t("customerDataService:unificationRules.create.fields.priority.hint") }</Hint>
                        ) }
                    </div>

                    { /* ── Active toggle ── */ }
                    <FormControlLabel
                        control={
                            (<Switch
                                checked={ formData.isActive }
                                onChange={ handleActiveChange }
                                data-componentid={ `${componentId}-is-active` }
                            />)
                        }
                        label={ t("customerDataService:unificationRules.create.fields.isActive.label") }
                    />

                    { /* ── Actions ── */ }
                    <div style={ { display: "flex", gap: "8px", justifyContent: "flex-start" } }>
                        <Button
                            variant="contained"
                            onClick={ handleSubmit }
                            data-componentid={ `${componentId}-submit` }
                        >
                            { isSubmitting
                                ? t("customerDataService:unificationRules.create.buttons.creating")
                                : t("customerDataService:unificationRules.create.buttons.create")
                            }
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={ handleCancel }
                            disabled={ isSubmitting }
                            data-componentid={ `${componentId}-cancel` }
                        >
                            { t("customerDataService:unificationRules.create.buttons.cancel") }
                        </Button>
                    </div>
                </div>
            </EmphasizedSegment>
        </PageLayout>
    );
};

export default UnificationRuleCreatePage;
