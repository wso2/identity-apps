/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Ref } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../extensions";
import { AppConstants, history } from "../../core";
import { ServerConfigurationsConstants } from "../../server-configurations";
import { getConfiguration } from "../../users";
import { updateValidationConfigData, useValidationConfigData } from "../api";
import { ValidationConfigConstants } from "../constants/validation-config-constants";
import { ValidationFormInterface } from "../models";

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

    const {
        data: passwordHistoryCountData,
        error: passwordHistoryCountError,
        isLoading: isPasswordCountLoading,
        mutate: mutatePasswordHistoryCount
    } = serverConfigurationConfig.usePasswordHistory();

    const {
        data: passwordExpiryData,
        error: passwordExpiryError,
        isLoading: isPasswordExpiryLoading,
        mutate: mutatePasswordExpiry
    } = serverConfigurationConfig.usePasswordExpiry();

    const {
        data: validationData,
        isLoading: isValidationLoading,
        error: ValidationConfigStatusFetchRequestError,
        mutate: mutateValidationConfigFetchRequest
    } = useValidationConfigData();

    useEffect(() => {
        if (isValidationLoading || isPasswordCountLoading || isPasswordExpiryLoading) {
            return;
        }

        initializeForm();
    }, [
        validationData,
        passwordHistoryCountData,
        isValidationLoading,
        isPasswordCountLoading,
        validationData,
        passwordExpiryData,
        isValidationLoading,
        isPasswordExpiryLoading
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

        if (
            ValidationConfigStatusFetchRequestError.response &&
            ValidationConfigStatusFetchRequestError.response.data &&
            ValidationConfigStatusFetchRequestError.response.data.description
        ) {
            if (
                ValidationConfigStatusFetchRequestError.response.status === 404
            ) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "console:manage.features.validation.fetchValidationConfigData.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.validation.fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        if (
            passwordHistoryCountError.response &&
            passwordHistoryCountError.response.data &&
            passwordHistoryCountError.response.data.description
        ) {
            if (passwordHistoryCountError.response.status === 404) {
                return;
            }
            dispatch(
                addAlert({
                    description:
                        ValidationConfigStatusFetchRequestError.response.data
                            .description ??
                        t(
                            "console:manage.features.validation.fetchValidationConfigData.error.description"
                        ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.validation.fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        if (
            passwordExpiryError?.response?.data?.description
        ) {
            if (passwordExpiryError.response.status === 404) {
                return;
            }
            dispatch(
                addAlert({
                    description: passwordExpiryError.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.validation.fetchValidationConfigData.error.message"
                    )
                })
            );

            return;
        }

        dispatch(
            addAlert({
                description: t(
                    "console:manage.features.validation.fetchValidationConfigData" +
                    ".genericError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.validation.fetchValidationConfigData" +
                    ".genericError.message"
                )
            })
        );
    }, [ ValidationConfigStatusFetchRequestError, passwordHistoryCountError, passwordExpiryError ]);

    /**
     * Initialize the initial form values.
     */
    const initializeForm = (): void => {
        let updatedInitialFormValues: ValidationFormInterface = serverConfigurationConfig.processInitialValues(
            getConfiguration(validationData),
            passwordHistoryCountData,
            setPasswordHistoryEnabled
        );

        updatedInitialFormValues = serverConfigurationConfig.processPasswordExpiryInitialValues(
            updatedInitialFormValues,
            passwordExpiryData,
            setPasswordExpiryEnabled
        );

        setInitialFormValues(
            updatedInitialFormValues
        );
    };

    /**
     * Handle back button click.
     */
    const handleBackButtonClick = () => {
        history.push(
            AppConstants.getPaths()
                .get("GOVERNANCE_CONNECTOR")
                .replace(
                    ":id",
                    ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                )
        );
    };

    const validateForm = (values: ValidationFormInterface): boolean => {
        let error: boolean = false;
        let description: string = "";

        if (isRuleType) {
            if (Number(values.minLength) < 8) {
                error = true;
                description = t(
                    "console:manage.features.validation.validationError.minLimitError"
                );
            } else if (Number(values.maxLength) > 30) {
                error = true;
                description = t(
                    "console:manage.features.validation.validationError.maxLimitError"
                );
            } else if (Number(values.minLength) > Number(values.maxLength)) {
                error = true;
                description = t(
                    "console:manage.features.validation.validationError.minMaxMismatch"
                );
            } else if (
                values.uniqueCharacterValidatorEnabled &&
                Number(values.minUniqueCharacters) > Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "console:manage.features.validation.validationError.uniqueChrMismatch"
                );
            } else if (
                values.consecutiveCharacterValidatorEnabled &&
                Number(values.maxConsecutiveCharacters) >
                Number(values.minLength)
            ) {
                error = true;
                description = t(
                    "console:manage.features.validation.validationError.consecutiveChrMismatch"
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
                    "console:manage.features.validation.validationError.invalidConfig"
                );
            }
        }

        if (error) {
            dispatch(
                addAlert({
                    description: description,
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.validation.validationError.wrongCombination"
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

        const updatePasswordHistory: Promise<any> = serverConfigurationConfig.processPasswordCountSubmitData(
            processedFormValues
        );

        const updatePasswordExpiry: Promise<any> = serverConfigurationConfig.processPasswordExpirySubmitData(
            processedFormValues
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
        Promise.all([
            updatePasswordHistory,
            updatePasswordExpiry,
            updateValidationConfigData(processedFormValues, null, validationData[0])
        ])
            .then(() => {
                mutateValidationConfigFetchRequest();
                mutatePasswordHistoryCount();
                mutatePasswordExpiry();
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.validation.notifications.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.validation.notifications.success.message"
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
                                    "console:manage.features.validation.notifications.error.description"
                                ),
                            level: AlertLevels.ERROR,
                            message:
                                error?.response?.data?.message ??
                                t(
                                    "console:manage.features.validation.notifications.error.message"
                                )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.validation.notifications.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.validation.notifications.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <PageLayout
            pageTitle={ t("console:manage.features.validation.pageTitle") }
            title={ (
                <>
                    { t("console:manage.features.validation.pageTitle") }
                </>
            ) }
            description={ (
                <>
                    { t("console:manage.features.validation.description") }
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
                text: t(
                    "console:manage.features.validation.goBackToValidationConfig"
                )
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
                                    { !isValidationLoading && !isLoading ? (
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
                                                        t
                                                    ) }
                                                    { serverConfigurationConfig.passwordHistoryCountComponent(
                                                        componentId,
                                                        passwordHistoryEnabled,
                                                        setPasswordHistoryEnabled,
                                                        t
                                                    ) }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                                            required={ true }
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
                                                            readOnly={ false }
                                                            disabled={ false }
                                                            data-testid={ `${ componentId }-min-numbers` }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                                            required={ true }
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
                                                            readOnly={ false }
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
                                            ) }
                                            <Field.Button
                                                form={ FORM_ID }
                                                size="small"
                                                buttonType="primary_btn"
                                                ariaLabel="Validation configuration update button"
                                                name="update-button"
                                                data-testid={ `${ componentId }-submit-button` }
                                                loading={ isSubmitting }
                                                label={ t("common:update") }
                                            ></Field.Button>
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
