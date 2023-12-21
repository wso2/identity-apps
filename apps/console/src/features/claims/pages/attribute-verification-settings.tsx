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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import { ContentLoader, EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import { ServerConfigurationsConstants } from "apps/console/src/features/server-configurations/constants";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AppConstants, history } from "../../core";
import { getConnectorDetails, updateGovernanceConnector } from "../../server-configurations/api";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../../server-configurations/models/governance-connectors";
import { GovernanceConnectorUtils } from "../../server-configurations/utils";

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

    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const FORM_ID: string = "governance-connectors-attribute-verification-form";
    const CATEGORY_NAME: string = "Attribute Verification Settings";
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
        CONNECTOR_NAMES.MOBILE_NUMBER_VERIFICATION_CODE_EXPIRY_TIME,
        CONNECTOR_NAMES.OTP_LENGTH,
        CONNECTOR_NAMES.SEND_OTP_IN_EMAIL,
        CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION,
        CONNECTOR_NAMES.ENABLE_MOBILE_NUMBER_VERIFICATION_BY_PRIVILEGED_USERS
    ];

    const [ connectorDetails, setConnectorDetails ] = useState<GovernanceConnectorInterface>(undefined);
    const [ formValues, setFormValues ] = useState<any>(undefined);
    const [ formDisplayData, setFormDisplayData ] = useState<any>(undefined);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFormInitialized, setIsFormInitialized ] = useState<boolean>(false);

    // TODO: Enable connector based on the feature flag.
    const isConnectorEnabled: boolean = true;
    const readOnly: boolean = false;

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
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
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
                    "extensions:manage.accountLogin.alternativeLoginIdentifierPage.notification.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.governanceConnectors.notifications." + "updateConnector.success.message"
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
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: t(
                        "extensions:manage.accountLogin.alternativeLoginIdentifierPage.notification.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.governanceConnectors.notifications.updateConnector.error.message"
                    )
                })
            );
        } else {
            // Generic error message
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.governanceConnectors.notifications." +
                        "updateConnector.genericError.message"
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
                <Field.Checkbox
                    ariaLabel={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION,
                        formDisplayData?.[CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION]?.displayName)
                    }
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION) }
                    className="toggle"
                    label={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION,
                        formDisplayData?.[CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION]?.displayName)
                    }
                    defaultValue={ formValues?.[
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION ] == true }
                    readOnly={ readOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-componentid={ `${ componentId }-enable-auto-login` }
                    hint={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION,
                        formDisplayData?.[CONNECTOR_NAMES.ENABLE_EMAIL_VERIFICATION]?.description)
                    }
                />
                <Field.Input
                    ariaLabel={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME,
                        formDisplayData?.
                            [CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME]?.displayName)
                    }
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
                    readOnly={ readOnly }
                    initialValue={ formValues?.[
                        CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME ] }
                    data-componentId={ `${ componentId }-otp-length` }
                    label={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME,
                        formDisplayData?.
                            [CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME]?.displayName)
                    }
                    disabled={ !isConnectorEnabled }
                    hint={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME,
                        formDisplayData?.
                            [CONNECTOR_NAMES.EMAIL_VERIFICATION_ON_UPDATE_LINK_EXPIRY_TIME]?.description)
                    }
                />
                <Field.Checkbox
                    ariaLabel={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION,
                        formDisplayData?.[CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION]?.displayName)
                    }
                    name={ GovernanceConnectorUtils.encodeConnectorPropertyName(
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION) }
                    className="toggle"
                    label={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION,
                        formDisplayData?.[CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION]?.displayName)
                    }
                    defaultValue={ formValues?.[
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION ] == true }
                    readOnly={ readOnly }
                    disabled={ !isConnectorEnabled }
                    width={ 16 }
                    data-componentid={ `${ componentId }-enable-auto-login` }
                    hint={ GovernanceConnectorUtils.resolveFieldLabel(
                        CATEGORY_NAME,
                        CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION,
                        formDisplayData?.[CONNECTOR_NAMES.ENABLE_EMAIL_NOTIFICATION]?.description)
                    }
                />
                <Field.Button
                    form={ FORM_ID }
                    size="small"
                    buttonType="primary_btn"
                    ariaLabel="Self registration update button"
                    name="update-button"
                    data-componentId={ `${componentId}-submit-button` }
                    disabled={ !isConnectorEnabled || isSubmitting }
                    loading={ isSubmitting }
                    label={ t("common:update") }
                    hidden={ !isConnectorEnabled || readOnly }
                />
            </Form>
        );
    };

    return (
        <PageLayout
            title={ t(
                "console:manage.features.governanceConnectors.connectorCategories.otherSettings.connectors." +
                "userClaimUpdate.friendlyName"
            ) }
            pageTitle={ t(
                "console:manage.features.governanceConnectors.connectorCategories.otherSettings.connectors." +
                "userClaimUpdate.friendlyName"
            ) }
            description={ t(
                "console:manage.features.governanceConnectors.connectorSubHeading",
                { name: t(
                    "console:manage.features.governanceConnectors.connectorCategories.otherSettings.connectors." +
                    "userClaimUpdate.friendlyName"
                ) }
            ) }
            data-componentid={ `${componentId}-page-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("CLAIM_DIALECTS"));
                },
                text: t("console:manage.features.claims.local.pageLayout.local.back")
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
 * Default props for the component.
 */
AttributeVerificationSettingsFormPage.defaultProps = {
    "data-componentid": "attribute-verification-settings-form"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AttributeVerificationSettingsFormPage;
