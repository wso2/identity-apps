/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DangerZone, DangerZoneGroup, EmphasizedSegment, Hint, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FC, FormEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps } from "semantic-ui-react";
import { getConnectorDetails,
    revertGovernanceConnectorProperties,
    updateGovernanceConnector
} from "../api/governance-connectors";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    RevertGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../models/governance-connectors";

/**
 * Props for the Internal Notification Sending configuration page.
 */
type InternalNotificationSendingPageInterface = IdentifiableComponentInterface;

/**
 * Internal Notification Sending configuration page.
 *
 * @param props - Props injected to the component.
 * @returns Internal Notification Sending configuration page.
 */
export const InternalNotificationSendingPage: FC<InternalNotificationSendingPageInterface> = (
    props: InternalNotificationSendingPageInterface
): ReactElement => {

    const { [ "data-componentid" ]: componentId = "internal-notification-sending" } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [
        isNotificationInternallyManaged,
        setIsNotificationInternallyManaged
    ] = useState<boolean>(false);

    useEffect(() => {
        getNotificationInternallyManaged();
    }, []);

    const getNotificationInternallyManaged = (): void => {
        setIsLoading(true);
        Promise.all([
            getConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
                ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED
            ),
            getConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID,
                ServerConfigurationsConstants.EMAIL_VERIFICATION_NOTIFICATIONS_INTERNALLY_MANAGED
            ),
            getConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID,
                ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT
            ),
            getConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID,
                ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT
            ),
            getConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID,
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
            )
        ])
            .then((response: boolean[]) => {
                let summationOfResponse: boolean = false;

                response.forEach((value: boolean | AxiosError) => {
                    // If all the values are true, then the summation will be true.
                    if (value === true) {
                        summationOfResponse = true;
                    } else {
                        summationOfResponse = false;
                    }
                });

                setIsNotificationInternallyManaged(summationOfResponse);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
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
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const updateNotificationInternallyManaged = async (value: boolean): Promise<void> => {
        try {
            const selfSignUpResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
                ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );
            const emailVerificationResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID,
                ServerConfigurationsConstants.EMAIL_VERIFICATION_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );
            const accountLockingResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID,
                ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT,
                value
            );
            const accountDisablingResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID,
                ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT,
                value
            );
            const accountRecoveryResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID,
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );

            // All the updates are successful.
            if (selfSignUpResult && emailVerificationResult && accountLockingResult &&
                accountDisablingResult && accountRecoveryResult) {
                dispatch(
                    addAlert({
                        description: t(
                            "extensions:manage.accountLogin.alternativeLoginIdentifierPage." +
                            "notification.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "governanceConnectors:notifications." +
                            "updateConnector.success.message"
                        )
                    })
                );
                setIsNotificationInternallyManaged(value);
            }
        } catch (error) {
            if (error?.response?.data?.detail) {
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
        }
    };

    /**
     * Get Connector Notification Internally Managed Value
     */
    const getConnectorNotificationInternallyManaged = (
        categoryId: string,
        connectorId: string,
        propertyName: string
    ): Promise<boolean> => {
        return getConnectorDetails(categoryId, connectorId)
            .then((response: GovernanceConnectorInterface) => {
                let isNotificationInternallyManaged: boolean = false;

                response?.properties.forEach((property: ConnectorPropertyInterface) => {
                    if (property.name === propertyName) {
                        isNotificationInternallyManaged = property.value === "true";
                    }
                });

                return isNotificationInternallyManaged;
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
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

                return false;
            });
    };

    const onConfigRevert = async (): Promise<void> => {
        const selfSignupRevertData: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED
            ]
        };
        const emailVerificationRevertData: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.EMAIL_VERIFICATION_NOTIFICATIONS_INTERNALLY_MANAGED
            ]
        };
        const accountLockingRevertData: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.ACCOUNT_LOCK_INTERNAL_NOTIFICATION_MANAGEMENT
            ]
        };
        const accountDisablingRevertData: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.ACCOUNT_DISABLE_INTERNAL_NOTIFICATION_MANAGEMENT
            ]
        };
        const accountRecoveryRevertData: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
            ]
        };

        try {
            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
                selfSignupRevertData
            );
            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID,
                emailVerificationRevertData
            );
            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID,
                accountLockingRevertData
            );
            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID,
                accountDisablingRevertData
            );
            await revertGovernanceConnectorProperties(
                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID,
                accountRecoveryRevertData
            );

            getNotificationInternallyManaged();
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                        "revertConnector.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "governanceConnectors:notifications." +
                        "revertConnector.success.message"
                    )
                })
            );
        } catch (error) {
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                            "revertConnector.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications." +
                            "revertConnector.genericError.message"
                    )
                })
            );
        }
    };

    /**
     * Update Connector Notification Internally Managed Value
     */
    const updateConnectorNotificationInternallyManaged = (
        categoryId: string,
        connectorId: string,
        propertyName: string,
        value: boolean
    ): Promise<boolean> => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: [
                {
                    "name": propertyName,
                    "value": value
                }
            ]
        };

        return updateGovernanceConnector(data, categoryId, connectorId)
            .then(() => {
                return Promise.resolve(true);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "extensions:manage.accountLogin.alternativeLoginIdentifierPage" +
                                ".notification.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.message"
                            )
                        })
                    );
                }

                return Promise.reject(false);
            });
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * Handles the checkbox toggle action.
     *
     * @param value - Checkbox values.
     */
    const handleCheckboxToggle = (value: CheckboxProps): void => {
        updateNotificationInternallyManaged(value?.checked);
    };

    return (
        <PageLayout
            title={ "Internal Notification Sending" }
            pageTitle={ "Internal Notification Sending" }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            isLoading={ isLoading }
        >
            <Grid container spacing={ 2 } direction="column">
                <Grid xs={ 12 }>
                    <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                        <Checkbox
                            ariaLabel={ t("governanceConnectors:connectorCategories." +
                                "accountManagement.connectors.accountRecovery.properties." +
                                "recoveryNotificationInternallyManage.label") }
                            name="manageInternalNotificationSending"
                            label={ t("governanceConnectors:connectorCategories." +
                                "accountManagement.connectors.accountRecovery.properties." +
                                "recoveryNotificationInternallyManage.label") }
                            width={ 16 }
                            data-componentid={
                                `${componentId}-toggle` }
                            toggle
                            onChange={ (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                                handleCheckboxToggle(data);
                            } }
                            checked={ isNotificationInternallyManaged }
                        />
                        <Hint>
                            { t("governanceConnectors:connectorCategories." +
                                "accountManagement.connectors.accountRecovery.properties." +
                                "recoveryNotificationInternallyManage.hint") }
                        </Hint>
                    </EmphasizedSegment>
                </Grid>
                <Grid xs={ 12 }>
                    <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                        <DangerZone
                            actionTitle= { t("governanceConnectors:dangerZone.actionTitle") }
                            header= { t("governanceConnectors:dangerZone.heading") }
                            subheader= { t("governanceConnectors:dangerZone.subHeading") }
                            onActionClick={ () => onConfigRevert() }
                            data-testid={ `${ componentId }-danger-zone` }
                        />
                    </DangerZoneGroup>
                </Grid>
            </Grid>
        </PageLayout>
    );
};

export default InternalNotificationSendingPage;
