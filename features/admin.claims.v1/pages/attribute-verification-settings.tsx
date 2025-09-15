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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { getConnectorDetails, updateGovernanceConnector } from "@wso2is/admin.server-configurations.v1/api";
import { ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1/constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import { GovernanceConnectorUtils } from "@wso2is/admin.server-configurations.v1/utils";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { I18n } from "@wso2is/i18n";
import { ContentLoader, EmphasizedSegment, Heading, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import camelCase from "lodash-es/camelCase";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ClaimManagementConstants } from "../constants";

/**
 * Props for alternative login identifier edit page.
 */
type AttributeVerificationSettingsPage = IdentifiableComponentInterface;

/**
 * Attribute Verification Settings Form Page.
 *
 * @param props - Props injected to the component.
 * @returns Attribute Verification Settings Form Page component.
 */
const AttributeVerificationSettingsFormPage: FunctionComponent<AttributeVerificationSettingsPage> = (
    props: AttributeVerificationSettingsPage
): ReactElement => {

    const { [ "data-componentid" ]: componentId = "attribute-verification-settings-form" } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const FORM_ID: string = "governance-connectors-attribute-verification-form";
    const CONNECTOR_ID: string = ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID;
    const CATEGORY_ID: string = ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID;
    const CONNECTOR_NAMES: any = {
        EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME: "UserClaimUpdate.Email.VerificationCode.ExpiryTime",
        ENABLE_EMAIL_NOTIFICATION: "UserClaimUpdate.Email.EnableNotification",
        ENABLE_EMAIL_VERIFICATION: "UserClaimUpdate.Email.EnableVerification",
        ENABLE_MOBILE_NUMBER_VERIFICATION: "UserClaimUpdate.MobileNumber.EnableVerification",
        ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS: "UserClaimUpdate.MobileNumber." +
            "EnableVerificationByPrivilegedUser",
        INCLUDE_LOWERCASE_CHARACTERS_IN_OTP: "UserClaimUpdate.OTP.UseLowercaseCharactersInOTP",
        INCLUDE_NUMBERS_IN_OTP: "UserClaimUpdate.OTP.UseNumbersInOTP",
        INCLUDE_UPPERCASE_CHARACTERS_IN_OTP: "UserClaimUpdate.OTP.UseUppercaseCharactersInOTP",
        MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME: "UserClaimUpdate.MobileNumber.VerificationCode.ExpiryTime",
        OTP_LENGTH: "UserClaimUpdate.OTP.OTPLength",
        SEND_OTP_IN_EMAIL: "UserClaimUpdate.OTP.SendOTPInEmail"
    };
    const HIDDEN_PROPERTIES: string[] = [
        CONNECTOR_NAMES.INCLUDE_LOWERCASE_CHARACTERS_IN_OTP,
        CONNECTOR_NAMES.INCLUDE_NUMBERS_IN_OTP,
        CONNECTOR_NAMES.INCLUDE_UPPERCASE_CHARACTERS_IN_OTP,
        CONNECTOR_NAMES.OTP_LENGTH,
        CONNECTOR_NAMES.SEND_OTP_IN_EMAIL
    ];

    const [ connectorDetails, setConnectorDetails ] = useState<GovernanceConnectorInterface>(undefined);
    const [ formValues, setFormValues ] = useState<any>(undefined);
    const [ formDisplayData, setFormDisplayData ] = useState<any>(undefined);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFormInitialized, setIsFormInitialized ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const isReadOnly: boolean = !useRequiredScopes(
        featureConfig?.attributeVerification?.scopes?.update
    );

    const isMobileNumberVerificationByPrivilegedUsersSupported: boolean =
        isFeatureEnabled(featureConfig?.attributeVerification,
            ClaimManagementConstants.FEATURE_DICTIONARY.get("MOBILE_VERIFICATION_BY_PRIVILEGED_USERS"));

    if (!isMobileNumberVerificationByPrivilegedUsersSupported) {
        HIDDEN_PROPERTIES.push(CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS);
    }

    // TODO: Enable connector based on the feature flag.
    const isConnectorEnabled: boolean = true;

    /**
     * Load Attributes verification connector details on page load.
     */
    useEffect(() => {
        setIsLoading(true);

        if (!connectorDetails) {
            InitializeConnectorData();
            setIsLoading(false);
        }
    }, [ connectorDetails ]);

    /**
     * Update connector on form values update.
     */
    useEffect(() => {
        if (isFormInitialized) {
            updateConnector(formValues);
            setIsLoading(false);
        }
    }, [ formValues ]);

    /**
     * Method to attribute verification connector data.
     */
    const InitializeConnectorData = () => {
        getConnectorDetails(CATEGORY_ID, CONNECTOR_ID)
            .then((response: GovernanceConnectorInterface) => {
                setConnectorDetails(response);
                updateFormDataFromConnector(response);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
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
                    // Generic error message
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
            }).finally(() => {
                setIsFormInitialized(true);
                setIsLoading(false);
            });
    };

    /**
     * Method to update Form Data from connector.
     *
     * @param connector - Connector details.
     */
    const updateFormDataFromConnector = (connector: GovernanceConnectorInterface): void => {
        if (isEmpty(connector?.properties)) {
            return;
        }

        let resolvedFormValues: any = null;
        let resolvedFormDisplayData: any = null;

        connector.properties?.map((property: ConnectorPropertyInterface) => {

            if (HIDDEN_PROPERTIES.includes(property.name)) {
                return;
            }

            resolvedFormValues = {
                ...resolvedFormValues,
                [ property.name ]: JSON.parse(property.value)
            };
            resolvedFormDisplayData = {
                ...resolvedFormDisplayData,
                [ property.name ]: {
                    ["description"]: property.description,
                    ["displayName"]: property.displayName
                }
            };
        });

        setFormValues(resolvedFormValues);
        setFormDisplayData(resolvedFormDisplayData);
    };

    /**
     * Method to update form values.
     *
     * @param updatedValues - Updated values.
     */
    const updateFormData = (updatedValues: any): void => {
        setFormValues((formValues: any) => ({ ...formValues, ...updatedValues }));
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Record<string, unknown>) => {
        let data: any = {};

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                data = {
                    ...data,
                    [ GovernanceConnectorUtils.decodeConnectorPropertyName(key) ]: values[ key ]
                };
            }
        }

        return data;
    };

    /**
     * Handle update success.
     */
    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: t(
                    "governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate.update." +
                    "success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate.update." +
                    "success.message"
                )
            })
        );
    };

    /**
     * Handle update error.
     *
     * @param error - Error response.
     */
    const handleUpdateError = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.description) {
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate.update." +
                        "error.description", { description: error?.response?.data?.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate.update." +
                        "error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate.update." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate.update." +
                        "genericError.message"
                    )
                })
            );
        }
    };

    /**
     * Method to update the connector.
     *
     * @param updatedConnectorData - Updated connector data.
     */
    const updateConnector = (updatedConnectorData: any) => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        for (const key in updatedConnectorData) {
            if (!HIDDEN_PROPERTIES.includes(key)) {
                data.properties.push({
                    name: key,
                    value: updatedConnectorData[key]
                });
            }
        }

        setIsSubmitting(true);

        updateGovernanceConnector(data, CATEGORY_ID, CONNECTOR_ID)
            .then(() => {
                handleUpdateSuccess();
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
                setIsLoading(false);
            });
    };

    const resolveInputFieldLabel = (key: string): string => {
        let fieldLabel: string = formDisplayData?.[key]?.displayName;
        const property: string = camelCase(key);
        const fieldLabelKey: string = "governanceConnectors:connectorCategories.otherSettings.connectors" +
            `.userClaimUpdate.properties.${property}.label`;

        if (I18n.instance.exists(fieldLabelKey)) {
            fieldLabel = I18n.instance.t(fieldLabelKey);
        }

        return fieldLabel;
    };

    const resolveInputFieldHint = (key: string): string => {
        let fieldHint: string = formDisplayData?.[key]?.description;
        const property: string = camelCase(key);
        const fieldHintKey: string = "governanceConnectors:connectorCategories.otherSettings.connectors" +
            `.userClaimUpdate.properties.${property}.hint`;

        if (I18n.instance.exists(fieldHintKey)) {
            fieldHint = I18n.instance.t(fieldHintKey);
        }

        return fieldHint;
    };

    /**
     * Form content component.
     */
    const FormContent: FunctionComponent = () => {
        return (
            <Form
                id={ FORM_ID }
                uncontrolledForm
                initialValues={ formValues }
                onSubmit={ (values: Record<string, unknown>) =>
                    updateFormData(getUpdatedConfigurations(values))
                }
            >
                <Heading as="h4">
                    { t("governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate." +
                        "subHeadings.emailConfiguration") }
                </Heading>
                <Field.Checkbox
                    ariaLabel={ resolveInputFieldLabel(CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION) }
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION) }
                    className="toggle"
                    label= { resolveInputFieldLabel(CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION) }
                    defaultValue={ formValues?.[
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION ] == true }
                    readOnly={ isReadOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-componentid={ `${ componentId }-email-verification` }
                    hint={ resolveInputFieldHint(CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION) }
                />
                <Field.Input
                    ariaLabel={ resolveInputFieldLabel(CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME) }
                    inputType="number"
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME)
                    }
                    type="number"
                    width={ 16 }
                    required={ true }
                    labelPosition="top"
                    minLength={ 3 }
                    maxLength={ 100 }
                    readOnly={ isReadOnly }
                    initialValue={ formValues?.[
                        CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME ] }
                    data-componentid={ `${ componentId }-email-verification-link-expiry-time` }
                    label={ resolveInputFieldLabel(CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME) }
                    disabled={ !isConnectorEnabled }
                    hint={ resolveInputFieldHint(CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME) }
                />
                <Field.Checkbox
                    ariaLabel={ resolveInputFieldLabel(CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION) }
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION) }
                    className="toggle"
                    label={ resolveInputFieldLabel(CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION) }
                    defaultValue={ formValues?.[
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION ] == true }
                    readOnly={ isReadOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-componentid={ `${ componentId }-email-notification` }
                    hint={ resolveInputFieldHint(CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION) }
                />
                <Heading as="h4">
                    { t("governanceConnectors:connectorCategories.otherSettings.connectors.userClaimUpdate." +
                        "subHeadings.mobileConfiguration") }
                </Heading>
                <Field.Checkbox
                    ariaLabel={ resolveInputFieldLabel(CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION) }
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION) }
                    className="toggle"
                    label={ resolveInputFieldLabel(CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION) }
                    defaultValue={ formValues?.[
                        CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION ] == true }
                    readOnly={ isReadOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-componentid={ `${ componentId }-mobile-verification` }
                    hint={ resolveInputFieldHint(CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION) }
                />
                <Field.Input
                    ariaLabel={ resolveInputFieldLabel(CONNECTOR_NAMES.MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME) }
                    inputType="number"
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME)
                    }
                    type="number"
                    width={ 16 }
                    required={ true }
                    labelPosition="top"
                    minLength={ 3 }
                    maxLength={ 100 }
                    readOnly={ isReadOnly }
                    initialValue={ formValues?.[CONNECTOR_NAMES.MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME ] }
                    data-componentid={ `${ componentId }-mobile-verification-code-expiry-time` }
                    label={ resolveInputFieldLabel(CONNECTOR_NAMES.MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME) }
                    disabled={ !isConnectorEnabled }
                    hint={ resolveInputFieldHint(CONNECTOR_NAMES.MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME) }
                />
                { isMobileNumberVerificationByPrivilegedUsersSupported && (
                    <Field.Checkbox
                        ariaLabel={ resolveInputFieldLabel(
                            CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS) }
                        name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                            CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS) }
                        className="toggle"
                        label={ resolveInputFieldLabel(
                            CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS) }
                        defaultValue={ formValues?.[
                            CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS ] === true }
                        readOnly={ isReadOnly }
                        disabled={ !isConnectorEnabled }
                        width={ 16 }
                        data-componentid={ `${ componentId }-mobile-verification-by-privileged-user` }
                        hint={
                            resolveInputFieldHint(CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS)
                        }
                    />
                ) }
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Self registration update button"
                    name="update-button"
                    data-componentid={ `${componentId}-submit-button` }
                    disabled={ !isConnectorEnabled || isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    hidden={ !isConnectorEnabled || isReadOnly }
                />
            </Form>
        );
    };

    return (
        <PageLayout
            title={ t(
                "governanceConnectors:connectorCategories.otherSettings.connectors." +
                "userClaimUpdate.friendlyName"
            ) }
            pageTitle={ t(
                "governanceConnectors:connectorCategories.otherSettings.connectors." +
                "userClaimUpdate.friendlyName"
            ) }
            description={ t(
                "governanceConnectors:connectorCategories.otherSettings.connectors." +
                "userClaimUpdate.subTitle"
            ) }
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("CLAIM_DIALECTS"));
                },
                text: t("claims:local.pageLayout.local.back")
            } }
        >
            <EmphasizedSegment className="very padded">
                { !isLoading && formValues ? (
                    <FormContent />
                ) : (
                    <ContentLoader />
                ) }
            </EmphasizedSegment>
        </PageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AttributeVerificationSettingsFormPage;
