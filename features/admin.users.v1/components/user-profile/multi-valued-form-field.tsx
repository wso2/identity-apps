/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import TableContainer from "@mui/material/TableContainer";
import { AutocompleteRenderGetTagProps } from "@oxygen-ui/react/Autocomplete";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Paper from "@oxygen-ui/react/Paper";
import Table from "@oxygen-ui/react/Table";
import TableBody from "@oxygen-ui/react/TableBody";
import TableCell from "@oxygen-ui/react/TableCell";
import TableRow from "@oxygen-ui/react/TableRow";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { commonConfig } from "@wso2is/admin.extensions.v1/configs/common";
import { ProfileConstants } from "@wso2is/core/constants";
import {
    AlertInterface,
    AlertLevels,
    ClaimDataType,
    IdentifiableComponentInterface,
    PatchOperationRequest,
    ProfileInfoInterface,
    ProfileSchemaInterface,
    SharedProfileValueResolvingMethod
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AutocompleteFieldAdapter, FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { Popup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import { FormApi } from "final-form";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactNode, useCallback, useState } from "react";
import { FormSpy, useField, useForm } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Icon } from "semantic-ui-react";
import { updateUserInfo } from "../../api/users";
import {
    EMAIL_ADDRESSES_ATTRIBUTE,
    EMAIL_ATTRIBUTE,
    MOBILE_ATTRIBUTE,
    MOBILE_NUMBERS_ATTRIBUTE,
    VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE,
    VERIFIED_MOBILE_NUMBERS_ATTRIBUTE
} from "../../constants/user-management-constants";
import { useMultiValuedFieldConfig } from "../../hooks/use-multi-valued-field-config";
import { AccountConfigSettingsInterface, PatchUserOperationValue } from "../../models/user";
import "./multi-valued-form-field.scss";

interface MultiValuedFormFieldProps extends IdentifiableComponentInterface {
    /**
     * The schema of the profile.
     */
    schema: ProfileSchemaInterface;
    /**
     * The name of the field.
     */
    fieldName: string;
    /**
     * The key for the field.
     */
    key: number;
    /**
     * Is user managed by parent organization.
     */
    isUserManagedByParentOrg?: boolean
    /**
     * Profile information.
     */
    profileInfo: Map<string, string>;
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * Is the field read only.
     */
    isReadOnly: boolean;
    /**
     * Multi valued attribute values.
     */
    multiValuedAttributeValues: Record<string, string[]>;
    /**
     * Set multi valued attribute values.
     */
    setMultiValuedAttributeValues: (values: Record<string, string[]> | any) => void;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    primaryValues: Record<string, string>;
    setPrimaryValues: (values: Record<string, string> | any) => void;
    multiValuedInputFieldValue: Record<string, string>;
    setMultiValuedInputFieldValue: (values: Record<string, string> | { [x: string]: any }) => void;
    profileSchema: ProfileSchemaInterface[];
    configSettings: AccountConfigSettingsInterface
}

const MultiValuedFormField = (props: MultiValuedFormFieldProps) => {
    const {
        ["data-componentid"]: componentId = "user-mgt-user-profile",
        schema,
        fieldName,
        key,
        profileInfo,
        profileSchema,
        configSettings,
        user,
        isUserManagedByParentOrg,
        multiValuedAttributeValues,
        setMultiValuedAttributeValues,
        handleUserUpdate,
        primaryValues,
        setPrimaryValues,
        multiValuedInputFieldValue,
        setMultiValuedInputFieldValue,
        isReadOnly
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const form: FormApi<Record<string, any>, Partial<Record<string, any>>> = useForm();
    const { input: { value: inputFieldValue } } = useField(schema.name);

    const {
        fetchedPrimaryAttributeValue,
        maxAllowedLimit,
        primaryAttributeSchema,
        primaryAttributeValue,
        resolvedMutabilityValue,
        resolvedPrimarySchemaRequiredValue,
        resolvedRequiredValue,
        sharedProfileValueResolvingMethod,
        showAttributes,
        verificationEnabled,
        verificationPendingValue,
        verifiedAttributeValueList
    } = useMultiValuedFieldConfig(
        user,
        schema,
        profileInfo,
        primaryValues,
        profileSchema,
        multiValuedAttributeValues,
        configSettings
    );

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const resolvedComponentId: string = `${ componentId }-${ schema.name }-input`;

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    /**
     * Verify an email address or mobile number.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleVerify: (schema: ProfileSchemaInterface, attributeValue: string) => void = useCallback((
        schema: ProfileSchemaInterface,
        attributeValue: string
    ) => {
        setIsSubmitting(true);

        const data: PatchOperationRequest<PatchUserOperationValue> = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        let translationKey: string = "";

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            translationKey = "user:profile.notifications.verifyEmail.";
            const verifiedEmailList: string[] = profileInfo?.get(
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES")
            )?.split(",") || [];

            verifiedEmailList.push(attributeValue);
            data.Operations[0].value = {
                [schema.schemaId]: {
                    [VERIFIED_EMAIL_ADDRESSES_ATTRIBUTE]: verifiedEmailList
                }
            };
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            translationKey = "user:profile.notifications.verifyMobile.";
            const verifiedMobileList: string[] = profileInfo?.get(
                ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS")
            )?.split(",") || [];

            verifiedMobileList.push(attributeValue);
            data.Operations[0].value = {
                [schema.schemaId]: {
                    [VERIFIED_MOBILE_NUMBERS_ATTRIBUTE]: verifiedMobileList
                }
            };
        }

        updateUserInfo(user.id, data)
            .then(() => {
                handleAlerts({
                    description: t(`${translationKey}success.description`),
                    level: AlertLevels.SUCCESS,
                    message: t(`${translationKey}success.message`)
                });

                handleUserUpdate(user.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail || error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.detail || error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: `${translationKey}error.message`
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t(`${translationKey}genericError.description`),
                    level: AlertLevels.ERROR,
                    message: t(`${translationKey}genericError.message`)
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }, [
        profileInfo,
        user.id,
        handleAlerts,
        handleUserUpdate
    ]);

    /**
     * Assign primary email address or mobile number the multi-valued attribute.
     *
     * @param schemaName - Name of the primary attribute schema.
     * @param attributeValue - Value of the attribute
     */
    const handleMakePrimary: (schemaName: string, attributeValue: string) => void = useCallback((
        schemaName: string,
        attributeValue: string
    ) => {
        setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
            ...prevPrimaryValues,
            [schemaName]: attributeValue
        }));

        // Trigger form change to mark it as dirty
        form.change("multiValuedStateTracker", new Date().toISOString());
    }, [ setPrimaryValues, form ]);


    /**
     * Delete a multi-valued item.
     *
     * @param schema - schema of the attribute
     * @param attributeValue - value of the attribute
     */
    const handleMultiValuedItemDelete: (schema: ProfileSchemaInterface, attributeValue: string) => void = useCallback((
        schema: ProfileSchemaInterface,
        attributeValue: string
    ): void => {
        const filteredValues: string[] =
            multiValuedAttributeValues[schema?.name]?.filter((value: string) => value !== attributeValue) || [];

        setMultiValuedAttributeValues((prevValues: Record<string, string[]>) => ({
            ...prevValues,
            [schema.name]: filteredValues
        }));

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            if (primaryValues[EMAIL_ATTRIBUTE] === attributeValue) {
                setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
                    ...prevPrimaryValues,
                    [EMAIL_ATTRIBUTE]: ""
                }));
            }
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            if (primaryValues[MOBILE_ATTRIBUTE] === attributeValue) {
                setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
                    ...prevPrimaryValues,
                    [MOBILE_ATTRIBUTE]: ""
                }));
            }
        }

        form.change("multiValuedStateTracker", new Date().toISOString());
        form.change(schema.name, "");
    }, [
        multiValuedAttributeValues,
        primaryValues,
        setMultiValuedAttributeValues,
        setPrimaryValues,
        form
    ]);

    /**
     * Handle the add multi-valued attribute item.
     *
     * @param schema - Schema of the attribute
     * @param attributeValue - Value of the attribute
     */
    const handleAddMultiValuedItem: (schema: ProfileSchemaInterface, attributeValue: string) => void = useCallback((
        schema: ProfileSchemaInterface,
        attributeValue: string
    ) => {
        if (isEmpty(attributeValue)) return;

        setMultiValuedAttributeValues((prevValues: Record<string, string[]>) => ({
            ...prevValues,
            [schema.name]: [ ...(prevValues[schema.name] || []), attributeValue ]
        }));

        const updatePrimaryValue = (primaryKey: string) => {
            if (isEmpty(primaryValues[primaryKey])) {
                setPrimaryValues((prevPrimaryValues: Record<string, string>) => ({
                    ...prevPrimaryValues,
                    [primaryKey]: attributeValue
                }));
            }
        };

        if (schema.name === EMAIL_ADDRESSES_ATTRIBUTE) {
            updatePrimaryValue(EMAIL_ATTRIBUTE);
        } else if (schema.name === MOBILE_NUMBERS_ATTRIBUTE) {
            updatePrimaryValue(MOBILE_ATTRIBUTE);
        }

        form.change("multiValuedStateTracker", new Date().toISOString());
        form.change(schema.name, "");
    }, [
        setMultiValuedAttributeValues,
        primaryValues,
        setPrimaryValues,
        form
    ]);

    const showVerifiedPopup: (value: string) => boolean = useCallback((value: string): boolean => {
        return verificationEnabled &&
            (verifiedAttributeValueList.includes(value) || value === fetchedPrimaryAttributeValue);
    }, [ verificationEnabled, verifiedAttributeValueList, fetchedPrimaryAttributeValue ]);

    const showVerifyButton: (value: string) => boolean = useCallback((value: string): boolean => {
        return schema.name === EMAIL_ADDRESSES_ATTRIBUTE &&
            verificationEnabled &&
            !(verifiedAttributeValueList.includes(value) || value === primaryAttributeValue);
    }, [
        schema.name,
        verificationEnabled,
        verifiedAttributeValueList,
        primaryAttributeValue
    ]);

    const showPendingVerificationPopup: (value: string) => boolean = useCallback((value: string): boolean => {
        return verificationEnabled &&
            !isEmpty(verificationPendingValue) &&
            !verifiedAttributeValueList.includes(value) &&
            verificationPendingValue === value;
    }, [
        verificationEnabled,
        verificationPendingValue,
        verifiedAttributeValueList
    ]);

    const showPrimaryPopup: (value: string) => boolean = useCallback((value: string): boolean => {
        if (isEmpty(primaryAttributeValue)) {
            return false;
        }

        if (verificationEnabled && !verifiedAttributeValueList.includes(value)) {
            return value === fetchedPrimaryAttributeValue;
        }

        return value === primaryAttributeValue;
    }, [
        primaryAttributeValue,
        verificationEnabled,
        verifiedAttributeValueList,
        fetchedPrimaryAttributeValue
    ]);

    const showMakePrimaryButton: (value: string) => boolean = useCallback((value: string): boolean => {
        if (isEmpty(primaryAttributeValue)) {
            return false;
        }

        if (verificationEnabled) {
            return verifiedAttributeValueList.includes(value) && value !== primaryAttributeValue;
        }

        return value !== primaryAttributeValue;
    }, [ primaryAttributeValue, verificationEnabled, verifiedAttributeValueList ]);

    const showDeleteButton: (value: string) => boolean = useCallback((value: string): boolean => {
        return !(value === primaryAttributeValue && resolvedPrimarySchemaRequiredValue);
    }, [ primaryAttributeValue, resolvedPrimarySchemaRequiredValue ]);

    /**
     * Form validator to validate the value against the schema regex.
     * @param value - Input value.
     */
    const validateInput = (value: string): Promise<string | undefined> => {
        if (resolvedRequiredValue &&
            isEmpty(multiValuedAttributeValues[schema.name]) &&
            isEmpty(value)) {
            return(t("user:profile.forms.generic.inputs.validations.empty", { fieldName }));
        }

        if (isEmpty(value)) {

            return undefined;
        }

        if (!RegExp(primaryAttributeSchema?.regEx).test(value)) {
            return(t("users:forms.validation.formatError", { field: fieldName }));
        }

        return undefined;
    };

    const validateInputSync = (value: string): boolean => {
        if (resolvedRequiredValue &&
            isEmpty(multiValuedAttributeValues[schema.name]) &&
            isEmpty(value)) {

            return false;
        }

        if (isEmpty(value)) {
            return true;
        }

        if (!RegExp(primaryAttributeSchema?.regEx).test(value)) {
            return false;
        }

        return true;
    };

    const debouncedUpdateInputFieldValue: DebouncedFunc<(fieldName: string, value: string) => void> = useCallback(
        debounce((fieldName: string, value: string) => {
            setMultiValuedInputFieldValue((prev: Record<string, string>) => ({
                ...prev,
                [fieldName]: value
            }));
        }, 300),
        [ setMultiValuedInputFieldValue ]
    );

    const resolvedMultiValuedInputField = (): ReactNode => {
        const claimType: string = schema.type.toLowerCase();
        const resolvedReadOnlyValue: boolean =  (isUserManagedByParentOrg &&
            sharedProfileValueResolvingMethod == SharedProfileValueResolvingMethod.FROM_ORIGIN)
            || isReadOnly
            || resolvedMutabilityValue === ProfileConstants.READONLY_SCHEMA;
        const resolvedDisabledValue: boolean = isSubmitting
            || isReadOnly
            || multiValuedAttributeValues[schema?.name]?.length >= maxAllowedLimit;
        const resolvedMaxLengthValue: number =  fieldName.toLowerCase().includes("uri") ||
            fieldName.toLowerCase().includes("url")
            ? ProfileConstants.URI_CLAIM_VALUE_MAX_LENGTH
            : (
                schema.maxLength
                    ? schema.maxLength
                    : ProfileConstants.CLAIM_VALUE_MAX_LENGTH
            );

        const keyDownEvent = (event: React.KeyboardEvent<HTMLInputElement>): void => {
            if (event.key === "Enter") {
                event.preventDefault();
                const attributeValue: string = inputFieldValue;
                const isValid: boolean = validateInputSync(attributeValue);

                if (!isValid ||
                    multiValuedAttributeValues[schema.name]?.includes(attributeValue)) {
                    return;
                }

                handleAddMultiValuedItem(schema, attributeValue);
            }
        };

        const resolvedEndAdornment: ReactNode = (
            <InputAdornment position="end">
                <Tooltip title="Add">
                    <IconButton
                        data-componentid={ `${ componentId }-multivalue-add-icon` }
                        size="large"
                        onClick={ () => {
                            const attributeValue: string = multiValuedInputFieldValue[schema.name];
                            const isValid: boolean = validateInputSync(attributeValue);

                            if (!isValid ||
                                multiValuedAttributeValues[schema.name]?.includes(attributeValue)) {
                                return;
                            }

                            setMultiValuedInputFieldValue({
                                ...multiValuedInputFieldValue,
                                [schema.name]: ""
                            });
                        } }
                    >
                        <PlusIcon />
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        );

        if (claimType === ClaimDataType.STRING) {
            const options: string[] = schema["canonicalValues"] ?? [];

            // This is a multi valued dropdown field.
            if (options.length > 0) {
                return (
                    <>
                        <FinalFormField
                            key={ key }
                            component={ AutocompleteFieldAdapter }
                            data-componentid={ componentId }
                            initialValue={ profileInfo.get(schema.name) }
                            value={ profileInfo.get(schema.name) }
                            ariaLabel={ fieldName }
                            name={ schema.name }
                            label={ fieldName }
                            placeholder={
                                t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                                    { fieldName })
                            }
                            options={ options }
                            readOnly={ resolvedReadOnlyValue }
                            required={ resolvedRequiredValue }
                            clearable={ !resolvedRequiredValue }
                            displayEmpty={ true }
                            multipleValues={ true }
                            renderTags={ (value: readonly any[], getTagProps: AutocompleteRenderGetTagProps) => {
                                return value.map((option: any, index: number) => (
                                    <Chip
                                        key={ index }
                                        size="small"
                                        label={ option }
                                        { ...getTagProps({ index }) }
                                    />
                                ));
                            } }
                        />
                        <Divider hidden/>
                    </>
                );
            }

            return (
                <FinalFormField
                    key={ key }
                    component={ TextFieldAdapter }
                    data-componentid={ resolvedComponentId }
                    ariaLabel={ fieldName }
                    type="text"
                    name={ schema.name }
                    label={ schema.name === "profileUrl" ? "Profile Image URL" :
                        (  (!commonConfig.userEditSection.showEmail && schema.name === "userName")
                            ? fieldName +" (Email)"
                            : fieldName
                        )
                    }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    validate={ validateInput }
                    onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => keyDownEvent(event) }
                    endAdornment={ resolvedEndAdornment }
                    maxLength={ resolvedMaxLengthValue }
                    readOnly={ resolvedReadOnlyValue }
                    required={ resolvedRequiredValue }
                    disabled={ resolvedDisabledValue }
                />
            );
        }

        if (claimType === ClaimDataType.DECIMAL ||
            claimType === ClaimDataType.INTEGER) {
            return (
                <FinalFormField
                    key={ key }
                    component={ TextFieldAdapter }
                    data-componentid={ resolvedComponentId }
                    ariaLabel={ fieldName }
                    type="number"
                    name={ schema.name }
                    label={ fieldName }
                    placeholder={
                        t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                            { fieldName })
                    }
                    validate={ validateInput }
                    onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => keyDownEvent(event) }
                    endAdornment={ resolvedEndAdornment }
                    maxLength={ resolvedMaxLengthValue }
                    readOnly={ resolvedReadOnlyValue }
                    required={ resolvedRequiredValue }
                    disabled={ resolvedDisabledValue }
                />
            );
        }

        // Fallback to text field for other types.
        return (
            <FinalFormField
                key={ key }
                component={ TextFieldAdapter }
                data-componentid={ resolvedComponentId }
                ariaLabel={ fieldName }
                type="text"
                name={ schema.name }
                label={ schema.name === "profileUrl" ? "Profile Image URL" :
                    (  (!commonConfig.userEditSection.showEmail && schema.name === "userName")
                        ? fieldName +" (Email)"
                        : fieldName
                    )
                }
                placeholder={
                    t("user:profile.forms.generic.inputs.dropdownPlaceholder",
                        { fieldName })
                }
                validate={ validateInput }
                onKeyDown={ (event: React.KeyboardEvent<HTMLInputElement>) => keyDownEvent(event) }
                endAdornment={ resolvedEndAdornment }
                maxLength={ resolvedMaxLengthValue }
                readOnly={ resolvedReadOnlyValue }
                required={ resolvedRequiredValue }
                disabled={ resolvedDisabledValue }
            />
        );
    };

    return (
        <Grid direction="row">
            <Grid>
                <FormSpy subscription={ { values: true } }>
                    { ({ values }: { values: Record<string, any> }) => {
                        const fieldValue: string = values?.[schema.name];

                        if (!isEmpty(fieldValue) &&
                            multiValuedInputFieldValue[schema.name] !== fieldValue) {
                            debouncedUpdateInputFieldValue(schema.name, fieldValue);
                        }

                        return null;
                    } }
                </FormSpy>
                { resolvedMultiValuedInputField() }
            </Grid>
            {
                showAttributes ? (
                    <Grid xs={ 12 }>
                        <TableContainer
                            component={ Paper }
                            elevation={ 0 }
                            className="multi-valued-table-container"
                        >
                            <Table
                                className="multi-value-table"
                                size="small"
                                aria-label="multi-attribute value table"
                            >
                                <TableBody>
                                    { multiValuedAttributeValues[schema?.name]?.map(
                                        (value: string, index: number) => (
                                            <TableRow key={ index } className="multi-value-table-data-row">
                                                <TableCell align="left">
                                                    <Grid
                                                        direction="row"
                                                        gap={ 1 }
                                                        container
                                                        justifyContent="flex-start"
                                                        alignItems="center"
                                                    >
                                                        <label
                                                            data-componentid={
                                                                `${componentId}-${schema.name}` +
                                                                        `-value-${index}`
                                                            }
                                                            className="multi-value-table-label"
                                                        >
                                                            { value }
                                                        </label>
                                                        {
                                                            showVerifiedPopup(value)
                                                                && (
                                                                    <div
                                                                        className="verified-icon"
                                                                        data-componentid={
                                                                            `${componentId}-profile-form-${
                                                                                schema.name}-verified-icon-${index}`
                                                                        }
                                                                    >
                                                                        <Popup
                                                                            name="verified-popup"
                                                                            size="tiny"
                                                                            trigger={
                                                                                (
                                                                                    <Icon
                                                                                        name="check"
                                                                                        color="green"
                                                                                    />
                                                                                )
                                                                            }
                                                                            header= { t("common:verified") }
                                                                            inverted
                                                                        />
                                                                    </div>
                                                                )
                                                        }
                                                        {
                                                            showPrimaryPopup(value)
                                                                && (
                                                                    <div
                                                                        data-componentid={
                                                                            `${componentId}-profile-form-${
                                                                                schema.name}-primary-icon-${index}`
                                                                        }
                                                                    >
                                                                        <Chip
                                                                            label={ t("common:primary") }
                                                                            size="medium"
                                                                        />
                                                                    </div>
                                                                )
                                                        }
                                                        {
                                                            showPendingVerificationPopup(value)
                                                                && (
                                                                    <div
                                                                        className="verified-icon"
                                                                        data-componentid={
                                                                            `${componentId}-profile-form-${
                                                                                schema.name}-pending-verification` +
                                                                                `-icon-${index}`
                                                                        }
                                                                    >
                                                                        <Popup
                                                                            name="pending-verification-popup"
                                                                            size="tiny"
                                                                            trigger={
                                                                                (
                                                                                    <Icon
                                                                                        name="info circle"
                                                                                        color="yellow"
                                                                                    />
                                                                                )
                                                                            }
                                                                            header= { t("user:profile.tooltips." +
                                                                                "confirmationPending") }
                                                                            inverted
                                                                        />
                                                                    </div>
                                                                )
                                                        }
                                                    </Grid>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Grid
                                                        direction="row"
                                                        gap={ 1 }
                                                        justifyContent="flex-end"
                                                        container
                                                    >
                                                        { showVerifyButton(value) && (
                                                            <Button
                                                                variant="text"
                                                                size="small"
                                                                className="text-btn"
                                                                onClick={ () => handleVerify(schema, value) }
                                                                data-componentid={
                                                                    `${componentId}-profile-form` +
                                                                            `-${schema.name}-verify-button-${index}`
                                                                }
                                                                disabled={ isSubmitting || isReadOnly }
                                                            >
                                                                { t("common:verify") }
                                                            </Button>
                                                        ) }
                                                        { showMakePrimaryButton(value) && (
                                                            <Button
                                                                variant="text"
                                                                size="small"
                                                                className="text-btn"
                                                                onClick={ () =>
                                                                    handleMakePrimary(
                                                                        primaryAttributeSchema?.name, value)
                                                                }
                                                                data-componentid={
                                                                    `${componentId}-profile-form-${
                                                                        schema.name}-make-primary-button-${index}`
                                                                }
                                                                disabled={ isSubmitting || isReadOnly }
                                                            >
                                                                { t("common:makePrimary") }
                                                            </Button>
                                                        ) }
                                                        {
                                                            showDeleteButton(value) && (
                                                                <Tooltip title={ t("common:delete") }>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={ () => {
                                                                            handleMultiValuedItemDelete(schema, value);
                                                                        } }
                                                                        data-componentid={
                                                                            `${componentId}-profile-form` +
                                                                                `-${schema.name}-delete-button-${index}`
                                                                        }
                                                                        disabled={ isSubmitting || isReadOnly }
                                                                    >
                                                                        <TrashIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )
                                                        }
                                                    </Grid>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    ) }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                ) : <Divider hidden />
            }
        </Grid>
    );
};

export default MultiValuedFormField;
