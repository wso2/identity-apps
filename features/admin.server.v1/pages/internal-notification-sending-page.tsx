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

import Grid from "@oxygen-ui/react/Grid";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Hint, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FC, FormEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps } from "semantic-ui-react";
import { AppConstants, history } from "../../admin.core.v1";
import { getConnectorDetails, updateGovernanceConnector } from "../../admin.server-configurations.v1/api";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../../admin.server-configurations.v1/models";
import { ServerConstants } from "../constants/server";

/**
 * Props for the Admin Session Advisory Banner page.
 */
type InternalNotificationSendingPageInterface = IdentifiableComponentInterface;

/**
 * Admin Advisory Banner Edit page.
 *
 * @param props - Props injected to the component.
 * @returns Admin Advisory Banner Edit page.
 */
export const InternalNotificationSendingPage: FC<InternalNotificationSendingPageInterface> = (
    props: InternalNotificationSendingPageInterface
): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

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
                ServerConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConstants.SELF_SIGN_UP_CONNECTOR_ID,
                ServerConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED
            ),
            getConnectorNotificationInternallyManaged(
                ServerConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID,
                ServerConstants.USER_EMAIL_VERIFICATION_NOTIFICATIONS_INTERNALLY_MANAGED
            ),
            getConnectorNotificationInternallyManaged(
                ServerConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID,
                ServerConstants.ACCOUNT_LOCKING_CONNECTOR_ID,
                ServerConstants.ACCOUNT_LOCKING_NOTIFICATIONS_INTERNALLY_MANAGED
            ),
            getConnectorNotificationInternallyManaged(
                ServerConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConstants.ACCOUNT_DISABLING_CONNECTOR_ID,
                ServerConstants.ACCOUNT_DISABLING_NOTIFICATIONS_INTERNALLY_MANAGED
            ),
            getConnectorNotificationInternallyManaged(
                ServerConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConstants.ACCOUNT_RECOVERY_CONNECTOR_ID,
                ServerConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED
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
                ServerConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConstants.SELF_SIGN_UP_CONNECTOR_ID,
                ServerConstants.SELF_SIGN_UP_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );
            const emailVerificationResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConstants.USER_ONBOARDING_CONNECTOR_ID,
                ServerConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID,
                ServerConstants.USER_EMAIL_VERIFICATION_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );
            const accountLockingResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID,
                ServerConstants.ACCOUNT_LOCKING_CONNECTOR_ID,
                ServerConstants.ACCOUNT_LOCKING_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );
            const accountDisablingResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConstants.ACCOUNT_DISABLING_CONNECTOR_ID,
                ServerConstants.ACCOUNT_DISABLING_NOTIFICATIONS_INTERNALLY_MANAGED,
                value
            );
            const accountRecoveryResult: boolean = await updateConnectorNotificationInternallyManaged(
                ServerConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                ServerConstants.ACCOUNT_RECOVERY_CONNECTOR_ID,
                ServerConstants.ACCOUNT_RECOVERY_NOTIFICATIONS_INTERNALLY_MANAGED,
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
        history.push(AppConstants.getPaths().get("SERVER"));
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
                text: t("pages:rolesEdit.backButton", { type: "Server" })
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            isLoading={ isLoading }
        >
            <Grid className={ "mt-5" }>
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
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
InternalNotificationSendingPage.defaultProps = {
    "data-componentid": "internal-notification-sending"
};

export default InternalNotificationSendingPage;
