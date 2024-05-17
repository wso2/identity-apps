/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    Hint,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Ref } from "semantic-ui-react";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1/configs/server-configuration";
import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    GovernanceConnectorUtils,
    ServerConfigurationsConstants,
    getConnectorDetails
} from "@wso2is/admin.server-configurations.v1";
import { getConfiguration } from "@wso2is/admin.users.v1/utils/generate-password.utils";
import { updateValidationConfigData, useValidationConfigData } from "../api";
import { ValidationConfigConstants } from "../constants/validation-config-constants";
import { ValidationDataInterface, ValidationFormInterface } from "../models";

/**
 * Props for validation configuration page.
 */
type MyAccountSettingsEditPage = IdentifiableComponentInterface;

const FORM_ID: string = "validation-config-form";

/**
 * Validation configuration listing page.
 *
 * @param props - Props injected to the component.
 * @returns Validation configuration listing page component.
 */
export const ValidationConfigEditPage: FunctionComponent<MyAccountSettingsEditPage> = (
    props: MyAccountSettingsEditPage
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const isPasswordInputValidationEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isPasswordInputValidationEnabled);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isSubmitting, setSubmitting ] = useState<boolean>(false);
    const [ initialFormValues, setInitialFormValues ] = useState<
        ValidationFormInterface
    >(undefined);
    const [ isRuleType ] = useState<boolean>(true);
    const [
        isUniqueChrValidatorEnabled,
        setUniqueChrValidatorEnabled
    ] = useState<boolean>(false);
    const [
        isConsecutiveChrValidatorEnabled,
        setConsecutiveChrValidatorEnabled
    ] = useState<boolean>(false);
    const [ currentValues, setCurrentValues ] = useState<ValidationFormInterface>(
        undefined
    );

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ passwordHistoryEnabled, setPasswordHistoryEnabled ] = useState<
        boolean
    >(false);
    const [ passwordExpiryEnabled, setPasswordExpiryEnabled ] = useState<boolean>(false);

    // State variables required to support legacy password policies.
    const [ isLegacyPasswordPolicyEnabled, setIsLegacyPasswordPolicyEnabled ] = useState<boolean>(undefined);
    const [ legacyPasswordPolicies, setLegacyPasswordPolicies ] = useState<ConnectorPropertyInterface[]>([]);

    const isReadOnly: boolean = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.governanceConnectors,
                featureConfig?.governanceConnectors?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    const {
        data: passwordHistoryCountData,
        error: passwordHistoryCountError,
        mutate: mutatePasswordHistoryCount
    } = serverConfigurationConfig.usePasswordHistory();

    const {
        data: passwordExpiryData,
        error: passwordExpiryError,
        mutate: mutatePasswordExpiry
    } = serverConfigurationConfig.usePasswordExpiry();

    const {
        data: validationData,
        error: ValidationConfigStatusFetchRequestError,
        mutate: mutateValidationConfigFetchRequest
    } = useValidationConfigData(isPasswordInputValidationEnabled);

    useEffect(() => {
        if (!isPasswordInputValidationEnabled) {
            getLegacyPasswordPolicyProperties();
        }
    }, []);

    useEffect(() => {
        if (!passwordHistoryCountData || !passwordExpiryData ||
            (isPasswordInputValidationEnabled && !validationData) ||
            (!isPasswordInputValidationEnabled &&
            (!legacyPasswordPolicies && legacyPasswordPolicies?.length > 0))) {

            return;
        }

        initializeForm();
    }, [
        passwordHistoryCountData,
        validationData,
        passwordExpiryData,
        legacyPasswordPolicies
    ]);

    useEffect(() => {
        if (initialFormValues === undefined) {
            return;
        }
        setCurrentValues({ ...initialFormValues });
        if (initialFormValues?.uniqueCharacterValidatorEnabled) {
            setUniqueChrValidatorEnabled(true);
        }
        if (initialFormValues?.consecutiveCharacterValidatorEnabled) {
            setConsecutiveChrValidatorEnabled(true);
        }
        setIsLoading(false);
    }, [ initialFormValues ]);

    /**
     * Handles the validation configurations fetch error.
     */
    useEffect(() => {
        if (
            !ValidationConfigStatusFetchRequestError &&
            !passwordHistoryCountError &&
            !passwordExpiryError
        ) {
            return;
        }

        if (ValidationConfigStatusFetchRequestError?.response?.data?.description) {
            if (
                ValidationConfigStatusFetchRequestError?.response?.status === 404
            ) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "validation:fetchValidationConfigData.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        if (passwordHistoryCountError?.response?.data?.description) {
            if (passwordHistoryCountError?.response?.status === 404) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "validation:fetchValidationConfigData.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        if (passwordExpiryError?.response?.data?.description) {
            if (passwordExpiryError?.response?.status === 404) {
                return;
            }
            dispatch(
                addAlert({
                    description: passwordExpiryError.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "validation:fetchValidationConfigData" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "validation:fetchValidationConfigData" +
                    ".genericError.message"
                )
            })
        );
    }, [ ValidationConfigStatusFetchRequestError, passwordHistoryCountError, passwordExpiryError ]);

    /**
     * Initialize the initial form values.
     */
    const initializeForm = (): void => {
        let updatedInitialFormValues: any = serverConfigurationConfig?.processInitialValues(
            getConfiguration(validationData),
            passwordHistoryCountData,
            setPasswordHistoryEnabled
        );

        updatedInitialFormValues = serverConfigurationConfig.processPasswordExpiryInitialValues(
            updatedInitialFormValues,
            passwordExpiryData,
            setPasswordExpiryEnabled
        );

        if (!isPasswordInputValidationEnabled) {

            updatedInitialFormValues = legacyPasswordPolicies.reduce(
                (formValues: any, property: ConnectorPropertyInterface) => {
                    const encodedPropertyName: any = GovernanceConnectorUtils
                        .encodeConnectorPropertyName(property.name);

                    return {
                        ...formValues,
                        [ encodedPropertyName ]: property.value
                    };
                },
                updatedInitialFormValues
            );

            setIsLegacyPasswordPolicyEnabled(updatedInitialFormValues?.[
                GovernanceConnectorUtils.encodeConnectorPropertyName(
                    ServerConfigurationsConstants.PASSWORD_POLICY_ENABLE) ] === "true"
            );
        }

        setInitialFormValues(
            updatedInitialFormValues
        );
    };

    const getLegacyPasswordPolicyProperties = (): void => {
        getConnectorDetails(
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID,
            ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID
        )
            .then((response: GovernanceConnectorInterface) => {
                setLegacyPasswordPolicies(response?.properties);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            });
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    const validateForm = (values: ValidationFormInterface): boolean => {
        let error: boolean = false;
        let description: string = "";

        if (isRuleType) {
            if (Number(values.minLength) <
                ValidationConfigConstants.VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS.PASSWORD_MIN_VALUE) {
                error = true;
                description = t(
                    "validation:validationError.minLimitError"
                );
            } else if (Number(values.maxLength) >
                ValidationConfigConstants.VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS.PASSWORD_MAX_VALUE) {
                error = true;
                description = t(
                    "validation:validationError.maxLimitError"
                );
            } else if (Number(values.minLength) > Number(values.maxLength)) {
                error = true;
                description = t(
                    "validation:validationError.minMaxMismatch"
                );
            } else if (
                values.uniqueCharacterValidatorEnabled &&
                Number(values.minUniqueCharacters) > Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "validation:validationError.uniqueChrMismatch"
                );
            } else if (
                values.consecutiveCharacterValidatorEnabled &&
                Number(values.maxConsecutiveCharacters) >
                Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "validation:validationError.consecutiveChrMismatch"
                );
            } else if (
                Number(values.minLowerCaseCharacters) +
                Number(values.minUpperCaseCharacters) +
                Number(values.minSpecialCharacters) +
                Number(values.minNumbers) >
                Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "validation:validationError.invalidConfig"
                );
            }
        }

        if (error) {
            dispatch(
                addAlert({
                    description: description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "validation:validationError.wrongCombination"
                    )
                })
            );

            return false;
        } else {
            return true;
        }
    };

    /**
     * Update the My Account Portal Data.
     *
     * @param values - New data of the My Account portal.
     */
    const handleUpdateMyAccountData = (
        values: ValidationFormInterface
    ): void => {
        const processedFormValues: ValidationFormInterface = { ...values };

        const updatePasswordPolicies: Promise<void> = serverConfigurationConfig.processPasswordPoliciesSubmitData(
            processedFormValues,
            !isPasswordInputValidationEnabled
        );

        if (
            values.uniqueCharacterValidatorEnabled &&
            values.minUniqueCharacters === "0"
        ) {
            processedFormValues.minUniqueCharacters = "1";
        }

        if (
            values.consecutiveCharacterValidatorEnabled &&
            values.maxConsecutiveCharacters === "0"
        ) {
            processedFormValues.maxConsecutiveCharacters = "1";
        }

        if (!validateForm(processedFormValues)) {
            return;
        }

        setSubmitting(true);

        const promises: Promise<void | ValidationDataInterface[]>[] = [ updatePasswordPolicies ];

        if (isPasswordInputValidationEnabled) {
            promises.push(updateValidationConfigData(processedFormValues, null, validationData[0]));
        }

        Promise.all(promises)
            .then(() => {
                mutatePasswordHistoryCount();
                mutatePasswordExpiry();

                if (!isPasswordInputValidationEnabled) {
                    getLegacyPasswordPolicyProperties();
                } else {
                    mutateValidationConfigFetchRequest();
                }

                dispatch(
                    addAlert({
                        description: t(
                            "validation:notifications.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "validation:notifications.success.message"
                        )
                    })
                );
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(
                        addAlert({
                            description:
                                error?.response?.data?.description ??
                                error?.response?.data?.detail ??
                                t(
                                    "validation:notifications.error.description"
                                ),
                            level: AlertLevels.ERROR,
                            message:
                                error?.response?.data?.message ??
                                t(
                                    "validation:notifications.error.message"
                                )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "validation:notifications.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "validation:notifications.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const resolveLegacyPasswordValidation: () => ReactElement = (): ReactElement => {
        return (
            <>
                <Field.Checkbox
                    className="toggle mb-4"
                    ariaLabel="passwordPolicy.enable"
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.enable") }
                    required={ false }
                    checked={ isLegacyPasswordPolicyEnabled }
                    label={ GovernanceConnectorUtils.resolveFieldLabel(
                        "Password Policies",
                        "passwordPolicy.enable",
                        "Validate passwords based on a policy pattern") }
                    width={ 16 }
                    data-componentid={ `${ componentId }-enable-password-policy` }
                    listen={ (data: boolean) => setIsLegacyPasswordPolicyEnabled(data) }
                    readOnly={ isReadOnly }
                />
                <div className="validation-configurations-form mt-3 mb-3">
                    <div className="criteria">
                        <label>Must be between</label>
                        <Field.Input
                            ariaLabel="Minimum length of the password"
                            inputType="number"
                            name={
                                GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.min.length")
                            }
                            validation={ (
                                value: string,
                                allValues: Record<string, unknown>
                            ): string | undefined => {
                                const numValue: number = parseInt(value);
                                const min: number = ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE;

                                if (numValue < min) {
                                    return t("common:minValidation", { min });
                                }
                                const max: number = allValues.maxLength
                                    ? parseInt(allValues.maxLength as string)
                                    : ValidationConfigConstants
                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                        .PASSWORD_MAX_VALUE;

                                if (numValue > max) {
                                    return t("common:maxValidation", { max });
                                }
                            } }
                            min={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE
                            }
                            max={
                                currentValues.maxLength
                                    ? currentValues.maxLength
                                    : ValidationConfigConstants
                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                        .PASSWORD_MAX_VALUE
                            }
                            listen={ (
                                value: string
                            ) => {
                                setCurrentValues(
                                    {
                                        ...currentValues,
                                        [ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                            "passwordPolicy.min.length") ]: value
                                    }
                                );
                            } }
                            width={ 2 }
                            required
                            hidden={ false }
                            placeholder={ "min" }
                            maxLength={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_LENGTH
                            }
                            minLength={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_LENGTH
                            }
                            readOnly={ isReadOnly }
                            disabled={ !isLegacyPasswordPolicyEnabled }
                            data-testid={ `${ componentId }-min-length` }
                        />
                        <label>and</label>
                        <Field.Input
                            ariaLabel="Minimum length of the password"
                            inputType="number"
                            name={
                                GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.max.length")
                            }
                            validation={ (
                                value: string,
                                allValues: Record<string, unknown>
                            ): string | undefined => {
                                const numValue: number = parseInt(value);
                                const min: number = allValues.minLength
                                    ? parseInt(allValues.minLength as string)
                                    : ValidationConfigConstants
                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                        .PASSWORD_MIN_VALUE;

                                if (numValue < min) {
                                    return t("common:minValidation", { min });
                                }

                                const max: number = ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                                if (numValue > max) {
                                    return t("common:maxValidation", { max });
                                }
                            } }
                            min={
                                currentValues.minLength
                                    ? currentValues.minLength
                                    : ValidationConfigConstants
                                        .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                        .PASSWORD_MIN_VALUE
                            }
                            max={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                            }
                            width={ 2 }
                            required
                            hidden={ false }
                            placeholder={ "max" }
                            listen={ (
                                value: string
                            ) => {
                                setCurrentValues(
                                    {
                                        ...currentValues,
                                        [ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                            "passwordPolicy.max.length") ]: value
                                    }
                                );
                            } }
                            maxLength={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_LENGTH
                            }
                            labelPosition="top"
                            minLength={
                                ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_LENGTH
                            }
                            readOnly={ isReadOnly }
                            disabled={ !isLegacyPasswordPolicyEnabled  }
                            data-testid={ `${ componentId }-max-length` }
                        />
                        <label>characters</label>
                    </div>
                </div>
                <Field.Input
                    ariaLabel="passwordPolicy.pattern"
                    inputType="text"
                    name={
                        GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.pattern")
                    }
                    type="text"
                    width={ 12 }
                    required
                    placeholder={ "Enter password pattern regex" }
                    labelPosition="top"
                    minLength={ 3 }
                    maxLength={ 100 }
                    readOnly={ isReadOnly }
                    listen={ (
                        value: string
                    ) => {
                        setCurrentValues(
                            {
                                ...currentValues,
                                [ GovernanceConnectorUtils
                                    .encodeConnectorPropertyName("passwordPolicy.pattern") ]: value
                            }
                        );
                    } }
                    data-componentid={ `${ componentId }-password-pattern-regex` }
                    label={
                        GovernanceConnectorUtils.resolveFieldLabel(
                            "Password Validation",
                            "passwordPolicy.pattern",
                            "Password pattern regex")
                    }
                    disabled={ !isLegacyPasswordPolicyEnabled }
                />
                <Hint className="mb-4">
                    {
                        GovernanceConnectorUtils.resolveFieldHint(
                            "Password Validation",
                            "passwordPolicy.pattern",
                            "Length of the OTP for SMS and" +
                            " e-mail verifications. OTP length" +
                            " must be 4-10."
                        )
                    }
                </Hint>
                <Field.Input
                    ariaLabel="passwordPolicy.errorMsg"
                    inputType="text"
                    name={
                        GovernanceConnectorUtils.encodeConnectorPropertyName("passwordPolicy.errorMsg")
                    }
                    type="text"
                    width={ 12 }
                    required
                    placeholder={ "Enter password pattern regex" }
                    labelPosition="top"
                    minLength={ 3 }
                    maxLength={ 100 }
                    readOnly={ isReadOnly }
                    listen={ (
                        value: string
                    ) => {
                        setCurrentValues(
                            {
                                ...currentValues,
                                [ GovernanceConnectorUtils.encodeConnectorPropertyName(
                                    "passwordPolicy.errorMsg") ]: value
                            }
                        );
                    } }
                    data-componentid={ `${ componentId }-password-policy-error-msg` }
                    label={
                        GovernanceConnectorUtils.resolveFieldLabel(
                            "Password Validation",
                            "passwordPolicy.errorMsg",
                            "Error message on pattern violation")
                    }
                    disabled={ !isLegacyPasswordPolicyEnabled }
                />
                <Hint>
                    {
                        GovernanceConnectorUtils.resolveFieldHint(
                            "Password Validation",
                            "passwordPolicy.errorMsg",
                            "This error message will be displayed" +
                            " when a pattern violation is detected."
                        )
                    }
                </Hint>
            </>
        );
    };

    const resolvePasswordValidation: () => ReactElement = (): ReactElement => {
        return (
            <div className="validation-configurations-form">
                <div className="criteria">
                    <label>
                                Must be between
                    </label>
                    <Field.Input
                        ariaLabel="minLength"
                        inputType="number"
                        name="minLength"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }
                            const max: number = allValues.maxLength
                                ? parseInt(allValues.maxLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_VALUE
                        }
                        max={
                            currentValues.maxLength
                                ? currentValues.maxLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minLength: value
                                }
                            );
                        } }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-length` }
                    />
                    <label>and</label>
                    <Field.Input
                        ariaLabel="maxLength"
                        inputType="number"
                        name="maxLength"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MIN_VALUE
                        }
                        max={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "max" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    maxLength: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_LENGTH
                        }
                        labelPosition="top"
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-max-length` }
                    />
                    <label>
                                characters
                    </label>
                </div>
                <label
                    className={ "labelName" }
                >
                    Must contain at least
                </label>
                <div
                    className={
                        "criteria rule mt-3"
                    }
                >
                    <Field.Input
                        ariaLabel="minNumbers"
                        inputType="number"
                        name="minNumbers"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min ) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minNumbers: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-componentid={ `${ componentId }-min-numbers` }
                    ></Field.Input>
                    <label>
                        numbers (0-9).
                    </label>
                </div>
                <div className="criteria rule">
                    <Field.Input
                        ariaLabel="minUpperCaseCharacters"
                        inputType="number"
                        name="minUpperCaseCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minUpperCaseCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-upper-case-characters` }
                    />
                    <label>
                        upper-case
                        characters (A-Z).
                    </label>
                </div>
                <div className="criteria rule">
                    <Field.Input
                        ariaLabel="minLowerCaseCharacters"
                        inputType="number"
                        name="minLowerCaseCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minLowerCaseCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MAX_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-lower-case-characters` }
                    />
                    <label>
                        lower-case
                        characters (a-z).
                    </label>
                </div>
                <div className="criteria rule">
                    <Field.Input
                        ariaLabel="minSpecialCharacters"
                        inputType="number"
                        name="minSpecialCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);
                            const min: number = ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE;

                            if (numValue < min) {
                                return t("common:minValidation", { min });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_VALUE
                        }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minSpecialCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={ false }
                        data-testid={ `${ componentId }-min-special-characters` }
                    />
                    <label>
                        special characters
                        (!@#$%^&*).
                    </label>
                </div>
                <div className="criteria">
                    <Field.Checkbox
                        ariaLabel="uniqueCharacterValidatorEnabled"
                        name="uniqueCharacterValidatorEnabled"
                        required={ false }
                        label={
                            "Must contain at least"
                        }
                        listen={ (
                            value: boolean
                        ) => {
                            setUniqueChrValidatorEnabled(
                                value
                            );
                        } }
                        width={ 16 }
                        data-testid={ `${ componentId }-unique-chr-enable` }
                        readOnly={ isReadOnly }
                    />
                    <Field.Input
                        ariaLabel="minUniqueCharacters"
                        inputType="number"
                        name="minUniqueCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);

                            if (numValue < 1) {
                                return t("common:minValidation", { min: 1 });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={ 1 }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "min" }
                        value={
                            Number(
                                initialFormValues.minUniqueCharacters
                            ) > 0
                                ? initialFormValues.minUniqueCharacters
                                : 1
                        }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    minUniqueCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={
                            !isUniqueChrValidatorEnabled
                        }
                        data-testid={ `${ componentId }-min-unique-chr` }
                    />
                    <label>
                        unique characters.
                    </label>
                </div>
                <div className="criteria">
                    <Field.Checkbox
                        ariaLabel="consecutiveCharacterValidatorEnabled"
                        name="consecutiveCharacterValidatorEnabled"
                        label={
                            "Must not contain more than"
                        }
                        required={ false }
                        disabled={ false }
                        listen={ (
                            value: boolean
                        ) => {
                            setConsecutiveChrValidatorEnabled(
                                value
                            );
                        } }
                        width={ 16 }
                        data-testid={ `${ componentId }-consecutive-chr-enable` }
                        readOnly={ isReadOnly }
                    />
                    <Field.Input
                        ariaLabel="maxConsecutiveCharacters"
                        inputType="number"
                        name="maxConsecutiveCharacters"
                        validation={ (
                            value: string,
                            allValues: Record<string, unknown>
                        ): string | undefined => {
                            const numValue: number = parseInt(value);

                            if (numValue < 1) {
                                return t("common:minValidation", { min: 1 });
                            }

                            const max: number = allValues.minLength
                                ? parseInt(allValues.minLength as string)
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE;

                            if (numValue > max) {
                                return t("common:maxValidation", { max });
                            }
                        } }
                        min={ 1 }
                        max={
                            currentValues.minLength
                                ? currentValues.minLength
                                : ValidationConfigConstants
                                    .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                    .PASSWORD_MAX_VALUE
                        }
                        width={ 2 }
                        required
                        hidden={ false }
                        placeholder={ "max" }
                        value={
                            Number(
                                initialFormValues.maxConsecutiveCharacters
                            ) > 0
                                ? initialFormValues.maxConsecutiveCharacters
                                : 1
                        }
                        listen={ (
                            value: string
                        ) => {
                            setCurrentValues(
                                {
                                    ...currentValues,
                                    maxConsecutiveCharacters: value
                                }
                            );
                        } }
                        maxLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .MIN_LENGTH
                        }
                        minLength={
                            ValidationConfigConstants
                                .VALIDATION_CONFIGURATION_FORM_FIELD_CONSTRAINTS
                                .PASSWORD_MIN_LENGTH
                        }
                        readOnly={ isReadOnly }
                        disabled={
                            !isConsecutiveChrValidatorEnabled
                        }
                        data-testid={ `${ componentId }-max-consecutive-chr` }
                    />
                    <label>
                        repeated characters.
                    </label>
                </div>
            </div>
        );
    };

    return (
        <PageLayout
            pageTitle={ t("validation:pageTitle") }
            title={ (
                <>
                    { t("validation:pageTitle") }
                </>
            ) }
            description={ (
                <>
                    { t("validation:description") }
                    <DocumentationLink
                        link={ getLink("manage.validation.passwordValidation.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid className="mt-3">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment
                                className="form-wrapper"
                                padded={ "very" }
                            >
                                <div className="validation-configurations password-validation-configurations">
                                    { !isLoading ? (
                                        <Form
                                            id={ FORM_ID }
                                            initialValues={ initialFormValues }
                                            uncontrolledForm={ true }
                                            validate={ null }
                                            onSubmit={ (
                                                values: ValidationFormInterface
                                            ) =>
                                                handleUpdateMyAccountData(
                                                    values
                                                )
                                            }
                                            enableReInitialize={ true }
                                        >
                                            { isRuleType && (
                                                <div className="validation-configurations-form">
                                                    { serverConfigurationConfig.passwordExpiryComponent(
                                                        componentId,
                                                        passwordExpiryEnabled,
                                                        setPasswordExpiryEnabled,
                                                        t,
                                                        isReadOnly
                                                    ) }
                                                    <Divider className="mt-4 mb-5" />
                                                    { serverConfigurationConfig.passwordHistoryCountComponent(
                                                        componentId,
                                                        passwordHistoryEnabled,
                                                        setPasswordHistoryEnabled,
                                                        t,
                                                        isReadOnly
                                                    ) }
                                                </div>
                                            ) }
                                            { isPasswordInputValidationEnabled
                                                ? resolvePasswordValidation()
                                                : resolveLegacyPasswordValidation()
                                            }
                                            <Field.Button
                                                form={ FORM_ID }
                                                size="small"
                                                buttonType="primary_btn"
                                                ariaLabel="Validation configuration update button"
                                                name="update-button"
                                                data-testid={ `${ componentId }-submit-button` }
                                                loading={ isSubmitting }
                                                label={ t("common:update") }
                                                hidden={ isReadOnly }
                                            />
                                        </Form>
                                    ) : (
                                        <ContentLoader />
                                    ) }
                                </div>
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ValidationConfigEditPage.defaultProps = {
    "data-componentid": "validation-config-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ValidationConfigEditPage;
