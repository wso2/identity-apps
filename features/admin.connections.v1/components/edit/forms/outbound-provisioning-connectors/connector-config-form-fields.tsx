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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CheckboxFieldAdapter,
    FinalFormField,
    FormApi,
    FormSpy,
    RadioGroupFieldAdapter,
    TextFieldAdapter,
    __DEPRECATED__SelectFieldAdapter
} from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import {
    AuthenticationModeDropdownOption,
    OutboundProvisioningAuthenticationMode,
    SCIM2_AUTHENTICATION_MODES,
    SCIM2_AUTH_PROPERTIES,
    SCIM2_CONNECTOR_NAME,
    SCIM2_URL_PROPERTIES
} from "../../../../constants/outbound-provisioning-constants";
import {
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../../models/connection";
import { isFieldRequiredForAuthMode } from "../../../../utils/provisioning-utils";

/**
 * Props for the ConnectorConfigFormFields component.
 */
interface ConnectorConfigFormFieldsProps extends IdentifiableComponentInterface {
    /**
     * Connector metadata containing property definitions.
     */
    metadata: OutboundProvisioningConnectorMetaInterface;
    /**
     * Initial values for the connector properties.
     */
    initialValues?: OutboundProvisioningConnectorInterface;
    /**
     * Prefix for field names (e.g., "connector_" for wizard, "" for edit).
     */
    fieldNamePrefix?: string;
    /**
     * Whether the fields should be read-only.
     */
    readOnly?: boolean;
    /**
     * Whether we're in edit mode (updating existing connector).
     * Used to show helper text on confidential fields.
     */
    isEditMode?: boolean;
    /**
     * Callback to notify parent of validation state.
     */
    onValidationChange?: (hasErrors: boolean) => void;
    /**
     * Final Form API instance for programmatic form control.
     */
    formApi?: FormApi;
}

/**
 * Shared metadata-driven field renderer for outbound provisioning connector config.
 *
 * @param props - ConnectorConfigFormFieldsProps.
 * @returns ReactElement.
 */
/**
 * Helper function to get initial authentication mode value.
 */
const getInitialAuthMode = (
    initialValues: OutboundProvisioningConnectorInterface | undefined,
    metadata: OutboundProvisioningConnectorMetaInterface
): string | undefined => {
    // Try to get from initial values first.
    const authModeProp: CommonPluggableComponentPropertyInterface | undefined = initialValues?.properties?.find(
        (prop: CommonPluggableComponentPropertyInterface) =>
            prop.key === SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE
    );

    if (authModeProp?.value) {
        return authModeProp.value as string;
    }

    // Fall back to metadata default value if available.
    const authModeMetadata: CommonPluggableComponentMetaPropertyInterface | undefined = metadata?.properties?.find(
        (prop: CommonPluggableComponentMetaPropertyInterface) =>
            prop.key === SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE
    );

    return authModeMetadata?.defaultValue as string | undefined;
};

export const ConnectorConfigFormFields: FunctionComponent<ConnectorConfigFormFieldsProps> = (
    props: ConnectorConfigFormFieldsProps
): ReactElement => {

    const {
        metadata,
        initialValues,
        fieldNamePrefix = "",
        readOnly = false,
        isEditMode = false,
        onValidationChange,
        formApi,
        ["data-componentid"]: componentId = "connector-config-form-fields"
    } = props;

    const { t } = useTranslation();

    // Store initial auth mode (never changes, used for reset).
    const initialAuthMode: string | undefined = useMemo(
        () => getInitialAuthMode(initialValues, metadata),
        [ initialValues, metadata ]
    );

    // Track current authentication mode for conditional rendering.
    const [ currentAuthMode, setCurrentAuthMode ] = useState<string | undefined>(initialAuthMode);

    // Track HTTP (non-secure) URLs for showing warnings.
    const [ httpUrlWarnings, setHttpUrlWarnings ] = useState<Record<string, boolean>>({});

    // Track if user is in "edit authentication" mode (for SCIM2 in edit mode).
    const [ isAuthenticationUpdateMode, setIsAuthenticationUpdateMode ] = useState<boolean>(!isEditMode);

    // Track the latest form values for validation.
    const formValuesRef: React.MutableRefObject<Record<string, any>> = useRef<Record<string, any>>({});

    /**
     * Get the value of a property from initialValues.
     */
    const getPropertyValue = (key: string | undefined): string | undefined => {
        if (!key) {
            return undefined;
        }

        const property: CommonPluggableComponentPropertyInterface | undefined = initialValues?.properties?.find(
            (prop: CommonPluggableComponentPropertyInterface) => prop.key === key
        );

        return property?.value as string | undefined;
    };

    /**
     * Determine if a field should be visible based on authentication mode.
     * This implements the authentication mode visibility logic for SCIM2 connector.
     *
     * @param propertyKey - The property key to check.
     * @param authMode - The authentication mode to check against (defaults to currentAuthMode).
     */
    const isFieldVisibleForAuthMode = (
        propertyKey: string | undefined,
        authMode: string | undefined = currentAuthMode
    ): boolean => {
        if (!propertyKey) {
            return true;
        }

        // Always show the authentication mode dropdown itself.
        if (propertyKey === SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE) {
            return true;
        }

        // Non-auth fields are always visible.
        if (!Object.values(SCIM2_AUTH_PROPERTIES).includes(propertyKey)) {
            return true;
        }

        // Authentication-specific fields visibility based on selected mode.
        switch (authMode) {
            case OutboundProvisioningAuthenticationMode.BASIC:
                return propertyKey === SCIM2_AUTH_PROPERTIES.USERNAME
                    || propertyKey === SCIM2_AUTH_PROPERTIES.PASSWORD;

            case OutboundProvisioningAuthenticationMode.BEARER:
                return propertyKey === SCIM2_AUTH_PROPERTIES.ACCESS_TOKEN;

            case OutboundProvisioningAuthenticationMode.API_KEY:
                return propertyKey === SCIM2_AUTH_PROPERTIES.API_KEY_HEADER
                    || propertyKey === SCIM2_AUTH_PROPERTIES.API_KEY_VALUE;

            case OutboundProvisioningAuthenticationMode.NONE:
                // Hide all auth credential fields when mode is NONE.
                return false;

            default:
                // If no auth mode is set, hide auth credential fields as a safety fallback.
                return false;
        }
    };

    /**
     * Check if a property is a URL field that needs validation.
     */
    const isUrlField = (propertyKey: string | undefined): boolean => {
        return !!propertyKey && Object.values(SCIM2_URL_PROPERTIES).includes(propertyKey);
    };

    /**
     * Validate a field value based on property metadata.
     *
     * @param value - The field value to validate.
     * @param propertyMetadata - The property metadata.
     * @param authMode - The authentication mode to validate against (defaults to currentAuthMode).
     */
    const validateField = (
        value: string,
        propertyMetadata: CommonPluggableComponentMetaPropertyInterface,
        authMode: string | undefined = currentAuthMode
    ): string | undefined => {
        // Determine if field is required based on auth mode (for SCIM2) or metadata
        const isRequired: boolean = isFieldRequiredForAuthMode(
            propertyMetadata.key,
            propertyMetadata,
            metadata?.name,
            authMode
        );

        // Skip validation if no value and not required.
        if (!value && !isRequired) {
            return undefined;
        }

        // Required field validation for mandatory fields.
        if (isRequired) {
            // In edit mode, for confidential fields, special handling:
            if (isEditMode && propertyMetadata.isConfidential) {
                // If we're not in authentication update mode and this is an auth field,
                // skip validation (field is hidden and not being edited)
                if (!isAuthenticationUpdateMode && isAuthenticationProperty(propertyMetadata.key)) {
                    return undefined;
                }

                // Allow masked value (preserves existing value) or new value.
                // Reject empty/null/undefined (would clear mandatory field).
                if (!value || value.trim() === "") {
                    return t("common:required");
                }
            } else {
                // For non-confidential fields or create mode, standard required validation.
                // Check for empty, null, undefined, or whitespace-only strings
                if (!value || (typeof value === "string" && value.trim() === "")) {
                    return t("common:required");
                }
            }
        }

        // URL validation for endpoint fields.
        if (isUrlField(propertyMetadata.key) && value) {
            if (!FormValidation.url(value)) {
                return t("idp:forms.outboundProvisioningConnector.validations.invalidURL");
            }
        }

        // Max length validation.
        if (propertyMetadata.maxLength && value && value.length > propertyMetadata.maxLength) {
            return t("common:maxValidation", { max: propertyMetadata.maxLength });
        }

        return undefined;
    };

    /**
     * Check if the connector is SCIM2.
     */
    const isScim2Connector = (): boolean => {
        return metadata?.name?.toLowerCase() === SCIM2_CONNECTOR_NAME;
    };

    /**
     * Check if a property is a SCIM2 authentication-related property.
     */
    const isAuthenticationProperty = (propertyKey: string | undefined): boolean => {
        if (!propertyKey) {
            return false;
        }

        return Object.values(SCIM2_AUTH_PROPERTIES).includes(propertyKey);
    };

    /**
     * Sort properties by displayOrder.
     */
    const getSortedProperties = (
        properties: CommonPluggableComponentMetaPropertyInterface[]
    ): CommonPluggableComponentMetaPropertyInterface[] => {
        if (!properties) {
            return [];
        }

        return [ ...properties ]
            .filter((property: CommonPluggableComponentMetaPropertyInterface) =>
                !isEmpty(property?.displayName)
            )
            .sort((a: CommonPluggableComponentMetaPropertyInterface,
                b: CommonPluggableComponentMetaPropertyInterface) =>
                (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
            );
    };

    /**
     * Field types enum.
     */
    enum FieldType {
        CHECKBOX = "CheckBox",
        RADIO = "Radio",
        DROPDOWN = "DropDown",
        TEXT = "Text",
        PASSWORD = "Password"
    }

    /**
     * Determine the field type based on property metadata.
     */
    const getFieldType = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): FieldType => {
        if (propertyMetadata?.type?.toUpperCase() === "BOOLEAN") {
            return FieldType.CHECKBOX;
        } else if (propertyMetadata?.type?.toUpperCase() === "RADIO") {
            return FieldType.RADIO;
        } else if (propertyMetadata?.options && propertyMetadata?.options.length > 0) {
            return FieldType.DROPDOWN;
        } else if (propertyMetadata?.isConfidential) {
            return FieldType.PASSWORD;
        }

        return FieldType.TEXT;
    };

    /**
     * Check whether provided property is a checkbox and contains sub-properties.
     */
    const isCheckboxWithSubProperties = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): boolean => {
        return (propertyMetadata?.subProperties?.length ?? 0) > 0
            && getFieldType(propertyMetadata) === FieldType.CHECKBOX;
    };

    /**
     * Check whether provided property is a radio button and contains sub-properties.
     */
    const isRadioButtonWithSubProperties = (
        propertyMetadata: CommonPluggableComponentMetaPropertyInterface
    ): boolean => {
        return (propertyMetadata?.subProperties?.length ?? 0) > 0
            && getFieldType(propertyMetadata) === FieldType.RADIO;
    };

    /**
     * Get sorted property fields as ReactElements.
     * Recursively handles sub-properties for checkboxes and radio buttons.
     */
    const getSortedPropertyFields = (
        metaProperties: CommonPluggableComponentMetaPropertyInterface[]
    ): ReactElement[] => {
        const bucket: ReactElement[] = [];
        const sortedProperties: CommonPluggableComponentMetaPropertyInterface[] = getSortedProperties(metaProperties);

        sortedProperties.forEach((metaProperty: CommonPluggableComponentMetaPropertyInterface) => {
            if (isEmpty(metaProperty?.displayName)) {
                return;
            }

            // Skip fields that should be hidden based on current authentication mode.
            if (!isFieldVisibleForAuthMode(metaProperty.key)) {
                return;
            }

            let field: ReactElement;

            // Handle different property types.
            if (isCheckboxWithSubProperties(metaProperty)) {
                // Checkbox with sub-properties: render parent checkbox and sub-properties.
                const subFields: ReactElement[] = (metaProperty?.subProperties ?? [])
                    .filter((subProp: CommonPluggableComponentMetaPropertyInterface) =>
                        !isEmpty(subProp?.displayName)
                    )
                    .sort((a: CommonPluggableComponentMetaPropertyInterface,
                        b: CommonPluggableComponentMetaPropertyInterface) =>
                        (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                    )
                    .map((subProp: CommonPluggableComponentMetaPropertyInterface) =>
                        renderField(subProp)
                    );

                field = (
                    <React.Fragment key={ metaProperty?.key }>
                        { renderField(metaProperty) }
                        { subFields }
                    </React.Fragment>
                );
            } else if (isRadioButtonWithSubProperties(metaProperty)) {
                // Radio button with sub-properties: render parent radio button.
                field = (
                    <React.Fragment key={ metaProperty?.key }>
                        { renderField(metaProperty) }
                    </React.Fragment>
                );
            } else {
                // Regular field without sub-properties.
                field = renderField(metaProperty);
            }

            bucket.push(field);
        });

        return bucket;
    };



    /**
     * Render a single field based on property metadata, wrapped in Grid for proper spacing.
     */
    const renderField = (
        propertyMetadata: CommonPluggableComponentMetaPropertyInterface
    ): ReactElement => {
        const fieldName: string = `${ fieldNamePrefix }${ propertyMetadata.key }`;
        const existingValue: string | undefined = getPropertyValue(propertyMetadata.key);
        const isReadOnly: boolean = readOnly || propertyMetadata.readOnly || false;
        const fieldType: FieldType = getFieldType(propertyMetadata);
        const isRequired: boolean = isFieldRequiredForAuthMode(
            propertyMetadata.key,
            propertyMetadata,
            metadata?.name,
            currentAuthMode
        );

        // Render field content based on type.
        const renderFieldContent = (): ReactElement => {
            // Boolean type → Checkbox.
            if (fieldType === FieldType.CHECKBOX) {
                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        label={ propertyMetadata.displayName }
                        component={ CheckboxFieldAdapter }
                        disabled={ isReadOnly }
                        required={ isRequired }
                        initialValue={ existingValue === "true" || propertyMetadata.defaultValue === "true" }
                        hint={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Radio button type → Render a single radio group with options.
            if (fieldType === FieldType.RADIO) {
                // Build radio options from sub-properties.
                const radioOptions: Array<{ label: string; value: string }> = (
                    propertyMetadata.subProperties ?? []
                ).map((subProp: CommonPluggableComponentMetaPropertyInterface) => ({
                    label: subProp.displayName ?? "",
                    value: (subProp.defaultValue ?? subProp.key) || ""
                }));

                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        label={ propertyMetadata.displayName }
                        component={ RadioGroupFieldAdapter }
                        initialValue={ existingValue ?? propertyMetadata.defaultValue }
                        readOnly={ isReadOnly }
                        required={ isRequired }
                        options={ radioOptions }
                        hint={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Dropdown for properties with options.
            if (fieldType === FieldType.DROPDOWN) {
                const dropdownOptions: Array<{
                    key: string;
                    text: string;
                    value: string;
                }> = (propertyMetadata.options ?? []).map((option: string) => ({
                    key: option,
                    text: option,
                    value: option
                }));

                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        type="dropdown"
                        label={ propertyMetadata.displayName }
                        component={ __DEPRECATED__SelectFieldAdapter }
                        initialValue={ existingValue ?? propertyMetadata.defaultValue }
                        readOnly={ isReadOnly }
                        required={ isRequired }
                        options={ dropdownOptions }
                        helperText={
                            propertyMetadata.description ? (
                                <Hint compact>
                                    { propertyMetadata.description }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Confidential → Password input.
            if (fieldType === FieldType.PASSWORD) {
                const confidentialHelperText: string = t(
                    "idp:forms.outboundProvisioningConnector.fields.confidential.helperText"
                );
                const helperTextContent: string = isEditMode
                    ? propertyMetadata.description
                        ? `${propertyMetadata.description} Note: ${confidentialHelperText}`
                        : confidentialHelperText
                    : propertyMetadata.description || "";

                const placeholder: string = propertyMetadata.defaultValue
                    ? t("idp:forms.outboundProvisioningConnector.fields.placeholder.default",
                        { defaultValue: propertyMetadata.defaultValue })
                    : t("idp:forms.outboundProvisioningConnector.fields.placeholder.enter",
                        { displayName: propertyMetadata.displayName });

                return (
                    <FinalFormField
                        key={ propertyMetadata.key }
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ propertyMetadata.displayName }
                        data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                        name={ fieldName }
                        type="password"
                        label={ propertyMetadata.displayName }
                        placeholder={ placeholder }
                        component={ TextFieldAdapter }
                        initialValue={ existingValue ?? propertyMetadata.defaultValue }
                        readOnly={ isReadOnly }
                        required={ isRequired }
                        maxLength={ propertyMetadata.maxLength ?? 1000 }
                        validation={ (value: string) => validateField(value, propertyMetadata) }
                        helperText={
                            helperTextContent ? (
                                <Hint compact>
                                    { helperTextContent }
                                </Hint>
                            ) : null
                        }
                    />
                );
            }

            // Default → Text input.
            const placeholder: string = propertyMetadata.defaultValue
                ? t("idp:forms.outboundProvisioningConnector.fields.placeholder.default",
                    { defaultValue: propertyMetadata.defaultValue })
                : t("idp:forms.outboundProvisioningConnector.fields.placeholder.enter",
                    { displayName: propertyMetadata.displayName });

            return (
                <FinalFormField
                    key={ propertyMetadata.key }
                    fullWidth
                    FormControlProps={ {
                        margin: "dense"
                    } }
                    aria-label={ propertyMetadata.displayName }
                    data-componentid={ `${ componentId }-${ propertyMetadata.key }` }
                    name={ fieldName }
                    type="text"
                    label={ propertyMetadata.displayName }
                    placeholder={ placeholder }
                    component={ TextFieldAdapter }
                    initialValue={ existingValue ?? propertyMetadata.defaultValue }
                    readOnly={ isReadOnly }
                    required={ isRequired }
                    maxLength={ propertyMetadata.maxLength ?? 1000 }
                    validation={ (value: string) => validateField(value, propertyMetadata) }
                    helperText={
                        propertyMetadata.description ? (
                            <Hint compact>
                                { propertyMetadata.description }
                            </Hint>
                        ) : null
                    }
                />
            );
        };

        /**
         * Render HTTP warning alert for URL fields if they use HTTP instead of HTTPS.
         */
        const renderHttpWarningAlert = (): ReactElement | null => {
            if (!isUrlField(propertyMetadata.key) || !httpUrlWarnings[propertyMetadata.key]) {
                return null;
            }

            return (
                <Alert
                    severity="warning"
                    sx={ { marginBottom: "0.5em", marginTop: "0.5em" } }
                    data-componentid={ `${ componentId }-${ propertyMetadata.key }-http-alert` }
                >
                    { t("idp:forms.outboundProvisioningConnector.warnings.insecureURL") }
                </Alert>
            );
        };

        return (
            <Grid.Row columns={ 1 } key={ propertyMetadata.key }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                    { renderFieldContent() }
                    { renderHttpWarningAlert() }
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * Get display name for authentication mode.
     */
    const resolveAuthModeDisplayName = (): string => {
        switch (currentAuthMode) {
            case OutboundProvisioningAuthenticationMode.NONE:
                return t("idp:forms.outboundProvisioningConnector.authentication.modes.none.name");
            case OutboundProvisioningAuthenticationMode.BASIC:
                return t("idp:forms.outboundProvisioningConnector.authentication.modes.basic.name");
            case OutboundProvisioningAuthenticationMode.BEARER:
                return t("idp:forms.outboundProvisioningConnector.authentication.modes.bearer.name");
            case OutboundProvisioningAuthenticationMode.API_KEY:
                return t("idp:forms.outboundProvisioningConnector.authentication.modes.apiKey.name");
            default:
                return "";
        }
    };

    /**
     * Handle change authentication button click.
     */
    const handleAuthenticationChange = (): void => {
        setIsAuthenticationUpdateMode(true);
    };

    /**
     * Handle cancel authentication change.
     * Resets the auth mode field and state to initial values.
     */
    const handleAuthenticationChangeCancel = (): void => {
        // Reset auth mode state to initial value.
        setCurrentAuthMode(initialAuthMode);

        // Reset form field to initial value if form API is available.
        if (formApi && initialAuthMode) {
            const authModeFieldName: string = `${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE}`;

            formApi.change(authModeFieldName, initialAuthMode);
        }

        // Exit authentication update mode.
        setIsAuthenticationUpdateMode(false);
    };

    /**
     * Render authentication info box (edit mode, already configured).
     */
    const renderAuthenticationInfoBox = (): ReactElement => {
        return (
            <Grid.Row>
                <Grid.Column width={ 16 }>
                    <Alert
                        icon={ false }
                        sx={ {
                            backgroundColor: "var(--oxygen-palette-grey-100)"
                        } }
                    >
                        <AlertTitle
                            sx={ {
                                fontWeight: 500
                            } }
                            data-componentid={ `${ componentId }-authentication-info-box-title` }
                        >
                            <Trans
                                i18nKey={
                                    currentAuthMode === OutboundProvisioningAuthenticationMode.NONE
                                        ? t("idp:forms.outboundProvisioningConnector.authentication.info." +
                                            "title.noneAuthType")
                                        : t("idp:forms.outboundProvisioningConnector.authentication.info." +
                                            "title.otherAuthType", {
                                            authType: resolveAuthModeDisplayName()
                                        })
                                }
                                components={ { strong: <strong /> } }
                            />
                        </AlertTitle>
                        <Trans i18nKey={ t("idp:forms.outboundProvisioningConnector.authentication.info.message") }>
                            If you are changing the authentication, be aware that the authentication credentials of the
                            external endpoint need to be updated.
                        </Trans>
                        <Box sx={ { my: 1 } }>
                            <Button
                                onClick={ handleAuthenticationChange }
                                variant="outlined"
                                size="small"
                                data-componentid={ `${ componentId }-change-authentication-button` }
                                disabled={ readOnly }
                            >
                                { t("idp:forms.outboundProvisioningConnector.authentication.buttons." +
                                    "changeAuthentication") }
                            </Button>
                        </Box>
                    </Alert>
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * Render authentication update widget (create mode or edit mode when editing).
     */
    const renderAuthenticationUpdateWidget = (): ReactElement => {
        // Get authentication-related properties.
        const authProperties: CommonPluggableComponentMetaPropertyInterface[] = getSortedProperties(
            metadata?.properties ?? []
        ).filter((prop: CommonPluggableComponentMetaPropertyInterface) =>
            isAuthenticationProperty(prop.key)
        );

        // Get the authentication mode property.
        const authModeProperty: CommonPluggableComponentMetaPropertyInterface | undefined = authProperties.find(
            (prop: CommonPluggableComponentMetaPropertyInterface) => prop.key ===
                SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE
        );

        // Get authentication credential properties (username, password, token, etc.)
        const authCredentialProperties: CommonPluggableComponentMetaPropertyInterface[] = authProperties.filter(
            (prop: CommonPluggableComponentMetaPropertyInterface) => prop.key !==
                SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE
        );

        return (
            <>
                { authModeProperty && (
                    <Grid.Row columns={ 1 } style={ { marginTop: "1em" } }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <FinalFormField
                                key={ authModeProperty.key }
                                fullWidth
                                FormControlProps={ {
                                    margin: "dense"
                                } }
                                aria-label={ authModeProperty.displayName }
                                data-componentid={ `${ componentId }-${ authModeProperty.key }` }
                                name={ `${ fieldNamePrefix }${ authModeProperty.key }` }
                                type="dropdown"
                                label={ authModeProperty.displayName }
                                component={ __DEPRECATED__SelectFieldAdapter }
                                initialValue={
                                    getPropertyValue(authModeProperty.key) || authModeProperty.defaultValue
                                }
                                readOnly={ readOnly }
                                required={ authModeProperty.isMandatory }
                                options={ SCIM2_AUTHENTICATION_MODES.map(
                                    (option: AuthenticationModeDropdownOption) => ({
                                        key: option.key,
                                        text: t(option.text),
                                        value: option.value
                                    })) }
                                helperText={
                                    authModeProperty.description ? (
                                        <Hint compact>
                                            { authModeProperty.description }
                                        </Hint>
                                    ) : null
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { authCredentialProperties.map((property: CommonPluggableComponentMetaPropertyInterface) => {
                    // Only render if visible for current auth mode.
                    if (!isFieldVisibleForAuthMode(property.key)) {
                        return null;
                    }

                    return renderField(property);
                }) }
                { isEditMode && (
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Button
                                onClick={ handleAuthenticationChangeCancel }
                                variant="outlined"
                                size="small"
                                data-componentid={ `${ componentId }-cancel-edit-authentication-button` }
                            >
                                { t("idp:forms.outboundProvisioningConnector.authentication.buttons.cancel") }
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </>
        );
    };

    /**
     * Render the SCIM2 authentication section with heading, divider, and conditional content.
     */
    const renderScim2AuthenticationSection = (): ReactElement | null => {
        if (!isScim2Connector()) {
            return null;
        }

        return (
            <>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Divider sx={ { mt: 1 } } />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Typography variant="h6">
                            { t("idp:forms.outboundProvisioningConnector.authentication.label") }
                        </Typography>
                    </Grid.Column>
                </Grid.Row>
                { !isAuthenticationUpdateMode && isEditMode && currentAuthMode
                    ? renderAuthenticationInfoBox()
                    : renderAuthenticationUpdateWidget() }
            </>
        );
    };

    /**
     * Clear authentication fields that are not relevant to the selected auth mode.
     */
    const clearIrrelevantAuthFields = (
        values: Record<string, any>,
        authMode: string
    ): void => {
        switch (authMode) {
            case OutboundProvisioningAuthenticationMode.BASIC:
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.ACCESS_TOKEN}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.API_KEY_HEADER}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.API_KEY_VALUE}`] = "";

                break;

            case OutboundProvisioningAuthenticationMode.BEARER:
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.USERNAME}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.PASSWORD}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.API_KEY_HEADER}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.API_KEY_VALUE}`] = "";

                break;

            case OutboundProvisioningAuthenticationMode.API_KEY:
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.USERNAME}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.PASSWORD}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.ACCESS_TOKEN}`] = "";

                break;

            case OutboundProvisioningAuthenticationMode.NONE:
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.USERNAME}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.PASSWORD}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.ACCESS_TOKEN}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.API_KEY_HEADER}`] = "";
                values[`${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.API_KEY_VALUE}`] = "";

                break;

            default:
                break;
        }
    };

    /**
     * Check URL fields for HTTP vs HTTPS and update warnings.
     */
    const updateHttpUrlWarnings = (values: Record<string, any>): void => {
        const newHttpWarnings: Record<string, boolean> = {};

        Object.values(SCIM2_URL_PROPERTIES).forEach((urlPropertyKey: string) => {
            const urlFieldName: string = `${fieldNamePrefix}${urlPropertyKey}`;
            const urlValue: string = values[urlFieldName];

            if (urlValue && typeof urlValue === "string" && urlValue.startsWith("http://")) {
                newHttpWarnings[urlPropertyKey] = true;
            } else {
                newHttpWarnings[urlPropertyKey] = false;
            }
        });

        // Only update state if warnings actually changed.
        const hasChanged: boolean = Object.keys(newHttpWarnings).some(
            (key: string) => newHttpWarnings[key] !== httpUrlWarnings[key]
        );

        if (hasChanged) {
            setHttpUrlWarnings(newHttpWarnings);
        }
    };

    /**
     * Validate all form fields and notify parent of validation state.
     *
     * @param values - The form values to validate.
     * @param authMode - The authentication mode to validate against (defaults to currentAuthMode).
     */
    const performValidation = (
        values: Record<string, any>,
        authMode: string | undefined = currentAuthMode
    ): void => {
        if (!onValidationChange) {
            return;
        }

        let hasValidationErrors: boolean = false;

        metadata?.properties?.forEach((property: CommonPluggableComponentMetaPropertyInterface) => {
            // Skip validation for fields not visible for the specified auth mode.
            if (!isFieldVisibleForAuthMode(property.key, authMode)) {
                return;
            }

            // In edit mode, when not in authentication update mode, skip validation
            // for authentication credential fields (user is not changing auth).
            if (isEditMode && !isAuthenticationUpdateMode) {
                const isAuthCredentialField: boolean = isAuthenticationProperty(property.key)
                    && property.key !== SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE;

                if (isAuthCredentialField) {
                    return;
                }
            }

            const fieldName: string = `${fieldNamePrefix}${property.key}`;
            const fieldValue: string = values[fieldName];
            const isFieldInForm: boolean = Object.hasOwn(values, fieldName);

            // Only skip validation if field is not in form AND not required.
            if (!isFieldInForm) {
                const isRequired: boolean = isFieldRequiredForAuthMode(
                    property.key,
                    property,
                    metadata?.name,
                    authMode
                );

                if (!isRequired) {
                    return;
                }
            }

            const validationError: string | undefined = validateField(fieldValue, property, authMode);

            if (validationError) {
                hasValidationErrors = true;
            }
        });

        onValidationChange(hasValidationErrors);
    };

    /**
     * Run initial validation on mount and when dependencies change.
     * This ensures validation runs even if FormSpy doesn't fire initially.
     */
    useEffect(() => {
        // Only run if we have the validation callback.
        if (onValidationChange) {
            // Use form values from ref if available, otherwise create empty object.
            // This ensures validation runs on mount even before FormSpy fires.
            const valuesToValidate: Record<string, any> = Object.keys(formValuesRef.current).length > 0
                ? formValuesRef.current
                : {};

            performValidation(valuesToValidate, currentAuthMode);
        }
    }, [ metadata, currentAuthMode, isAuthenticationUpdateMode, onValidationChange ]);

    /**
     * Render non-authentication properties for SCIM2 or all properties for other connectors.
     */
    const renderGeneralProperties = (): ReactElement[] => {
        if (isScim2Connector()) {
            // For SCIM2, filter out authentication properties.
            const nonAuthProperties: CommonPluggableComponentMetaPropertyInterface[] = getSortedProperties(
                metadata?.properties ?? []
            ).filter((prop: CommonPluggableComponentMetaPropertyInterface) =>
                !isAuthenticationProperty(prop.key)
            );

            return getSortedPropertyFields(nonAuthProperties);
        }

        // For other connectors, render all properties as before.
        return getSortedPropertyFields(metadata?.properties ?? []);
    };

    return (
        <Grid padded>
            { renderGeneralProperties() }
            { renderScim2AuthenticationSection() }
            <FormSpy
                subscription={ { values: true } }
                onChange={ ({ values }: { values: Record<string, any> }) => {
                    // Store latest form values in ref for useEffect validation.
                    formValuesRef.current = values;

                    const authModeFieldName: string =
                        `${fieldNamePrefix}${SCIM2_AUTH_PROPERTIES.AUTHENTICATION_MODE}`;
                    const newAuthMode: string = values[authModeFieldName];

                    // Update current auth mode state if it changed.
                    if (newAuthMode && newAuthMode !== currentAuthMode) {
                        setCurrentAuthMode(newAuthMode);
                    }

                    // Clear irrelevant authentication properties based on selected mode.
                    clearIrrelevantAuthFields(values, newAuthMode);

                    // Check URL fields for HTTP vs HTTPS.
                    updateHttpUrlWarnings(values);

                    // Validate all fields and notify parent of validation state.
                    // Use newAuthMode from form values instead of currentAuthMode state
                    // to ensure validation happens against the latest selected mode.
                    performValidation(values, newAuthMode || currentAuthMode);
                } }
            />
        </Grid>
    );
};
