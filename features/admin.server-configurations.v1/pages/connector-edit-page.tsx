/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import {  AppState  } from "@wso2is/admin.core.v1/store";
import { serverConfigurationConfig } from "@wso2is/admin.extensions.v1/configs/server-configuration";
import RegistrationFlowBuilderBanner
    from "@wso2is/admin.registration-flow-builder.v1/components/registration-flow-builder-banner";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    EmphasizedSegment,
    GridLayout,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid, Icon, Message, Ref } from "semantic-ui-react";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import {
    getConnectorDetails,
    revertGovernanceConnectorProperties,
    updateGovernanceConnector
} from "../api/governance-connectors";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import { ConnectorFormFactory } from "../forms";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    RevertGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigPropertyInterface
} from "../models/governance-connectors";
import { GovernanceConnectorUtils } from "../utils/governance-connector-utils";

/**
 * Props for the Server Configurations page.
 */
type ConnectorEditPageInterface = TestableComponentInterface;

/**
 * Governance connector edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Connector edit page.
 */
export const ConnectorEditPage: FunctionComponent<ConnectorEditPageInterface> = (
    props: ConnectorEditPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const dispatch: Dispatch = useDispatch();

    const pageContextRef: MutableRefObject<HTMLElement> = useRef(null);

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const applicationFeatureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.applications);
    const registrationFlowBuilderFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.registrationFlowBuilder);

    const [ isConnectorRequestLoading, setConnectorRequestLoading ] = useState<boolean>(false);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ categoryId, setCategoryId ] = useState<string>(undefined);
    const [ connectorId, setConnectorId ] = useState<string>(undefined);
    const [ enableForm, setEnableForm ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ enableBackButton, setEnableBackButton ] = useState<boolean>(true);

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const hasGovernanceConnectorsUpdatePermissions: boolean
        = useRequiredScopes(applicationFeatureConfig?.governanceConnectors?.scopes?.update);
    const hasRegistrationFlowBuilderViewPermissions: boolean
        = useRequiredScopes(registrationFlowBuilderFeatureConfig?.scopes?.read);
    const path: string[] = history.location.pathname.split("/");
    const type: string = path[ path.length - 3 ];

    useEffect(() => {
        // If Governance Connector update permission is not available, prevent from trying to load the connectors.
        if (!hasGovernanceConnectorsUpdatePermissions) {
            return;
        }

        loadConnectorDetails();
    }, []);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    const resolveBackButtonState = (connectorID:string) => {
        if (serverConfigurationConfig.backButtonDisabledConnectorIDs.includes(connectorID)) {
            setEnableBackButton(false);
        }
    };

    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: resolveConnectorUpdateSuccessMessage(),
                level: AlertLevels.SUCCESS,
                message: t(
                    "governanceConnectors:notifications." + "updateConnector.success.message"
                )
            })
        );
    };

    const handleRevertSuccess = () => {
        dispatch(
            addAlert({
                description: t(
                    "governanceConnectors:notifications.revertConnector.success.description"),
                level: AlertLevels.SUCCESS,
                message: t(
                    "governanceConnectors:notifications.revertConnector.success.message"
                )
            })
        );
    };

    const handleRevertError = () => {
        dispatch(
            addAlert({
                description: t(
                    "governanceConnectors:notifications.revertConnector.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "governanceConnectors:notifications.revertConnector.error.message"
                )
            })
        );
    };

    const handleUpdateError = (error: AxiosError) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: resolveConnectorUpdateErrorMessage(error),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications.updateConnector.error.message"
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
    };

    const handleToggle = (e: SyntheticEvent, data: CheckboxProps) => {
        setEnableForm(data.checked);
        setIsSubmitting(true);

        const updateData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        if (type === "username") {
            // special case for username recovery
            // TODO: remove this once the ID is fixed
            updateData.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[
                        ServerConfigurationsConstants.ACCOUNT_RECOVERY_BY_USERNAME ]
                ),
                value: data.checked.toString()
            });
        } else {
            updateData.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ] ?? connector?.name
                ),
                value: data.checked.toString()
            });
        }

        updateGovernanceConnector(updateData, categoryId, connectorId)
            .then(() => {
                loadConnectorDetails();
                handleUpdateSuccess();
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleBotDetectionToggle = (e: SyntheticEvent, data: CheckboxProps) => {
        setEnableForm(data.checked);

        const updateSSOCaptchaData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        const updateSelfSignUpCaptchaData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        const updateRecoveryCaptchaData: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        // Update reCaptcha settings for single sign-on.
        updateSSOCaptchaData.properties.push({
            name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                serverConfigurationConfig.connectorToggleName[ connector?.name ] ?? connector?.name
            ),
            value: data.checked.toString()
        });
        updateSSOCaptchaData.properties.push({
            name: ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE,
            value: data.checked.toString()
        });

        // Update reCaptcha settings for self sign-up.
        updateSelfSignUpCaptchaData.properties.push({
            name: ServerConfigurationsConstants.RE_CAPTCHA,
            value: data.checked.toString()
        });

        // Update reCaptcha settings for account recovery.
        updateRecoveryCaptchaData.properties.push({
            name: ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA,
            value: data.checked.toString()
        });
        if (ServerConfigurationsConstants.ACCOUNT_RECOVERY_BY_USERNAME in
            serverConfigurationConfig.connectorToggleName) {
            updateRecoveryCaptchaData.properties.push({
                name: ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA,
                value: data.checked.toString()
            });
        }

        updateGovernanceConnector(updateSSOCaptchaData, categoryId, connectorId)
            .then(() => {
                updateGovernanceConnector(
                    updateSelfSignUpCaptchaData,
                    ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                    ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
                ).then(() => {
                    updateGovernanceConnector(
                        updateRecoveryCaptchaData,
                        ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                        ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID
                    ).then(() => {
                        handleUpdateSuccess();
                    });
                });
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            });
    };

    const onConfigRevert = () => {
        setIsSubmitting(true);
        const revertRequest: RevertGovernanceConnectorConfigInterface = {
            properties: []
        };

        connector?.properties?.forEach((property: ConnectorPropertyInterface) => {
            revertRequest.properties.push(property.name);
        });

        revertGovernanceConnectorProperties(categoryId, connectorId, revertRequest)
            .then(() => {
                handleRevertSuccess();
            })
            .catch(() => {
                handleRevertError();
            })
            .finally(() => {
                setIsSubmitting(false);
                loadConnectorDetails();
            });
    };

    const onBotDetectionRevert = async () => {
        const ssoPropertiesToRevert: RevertGovernanceConnectorConfigInterface = {
            properties: [
                serverConfigurationConfig.connectorToggleName[ connector?.name ] ?? connector?.name,
                ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE
            ]
        };
        const selfSignUpPropertiesToRevert: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.RE_CAPTCHA
            ]
        };
        const recoveryPropertiesToRevert: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_RE_CAPTCHA
            ]
        };

        if (ServerConfigurationsConstants.ACCOUNT_RECOVERY_BY_USERNAME in
            serverConfigurationConfig.connectorToggleName) {
            recoveryPropertiesToRevert.properties.push(ServerConfigurationsConstants.USERNAME_RECOVERY_RE_CAPTCHA);
        }

        revertGovernanceConnectorProperties(categoryId, connectorId, ssoPropertiesToRevert)
            .then(() => {
                revertGovernanceConnectorProperties(
                    ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                    ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
                    selfSignUpPropertiesToRevert
                ).then(() => {
                    revertGovernanceConnectorProperties(
                        ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                        ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID,
                        recoveryPropertiesToRevert
                    ).then(() => {
                        handleRevertSuccess();
                    });
                });
            })
            .catch(() => {
                handleRevertError();
            })
            .finally(() => {
                loadConnectorDetails();
            });
    };

    const handleSubmit = (values: Record<string, unknown>) => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        for (const key in values) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(key),
                value: values[ key ]
            });
        }

        // Special case for password recovery notification based enable since the connector state
        // depends on the state of recovery options.
        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ] &&
            serverConfigurationConfig.autoEnableConnectorToggleProperty &&
            connector?.name !== "account-recovery"
        ) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]
                ),
                value: "true"
            });
        }

        setIsSubmitting(true);

        updateGovernanceConnector(data, categoryId, connectorId)
            .then(() => {
                handleUpdateSuccess();
                loadConnectorDetails();
            })
            .catch((error: AxiosError) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const loadConnectorDetails = () => {
        const categoryId: string = path[ path.length - 2 ];
        const connectorId: string = path[ path.length - 1 ];

        setCategoryId(categoryId);
        setConnectorId(connectorId);
        resolveBackButtonState(connectorId);
        setConnectorRequestLoading(true);

        getConnectorDetails(categoryId, connectorId)
            .then((response: GovernanceConnectorInterface) => {
                setConnector(response);
                const enableProperty: UpdateGovernanceConnectorConfigPropertyInterface = response.properties.find(
                    (property: ConnectorPropertyInterface) => property.name === resolveConnectorToggleProperty(response)
                );

                setEnableForm(enableProperty ? enableProperty?.value === "true" : true);
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
            })
            .finally(() => {
                setConnectorRequestLoading(false);
            });
    };

    const resolveConnectorTitle = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.heading");
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return type === "username"
                    ? "Username Recovery"
                    : t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.heading");
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return t("extensions:manage.serverConfigurations.accountSecurity.botDetection.heading");
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration.heading");
            case ServerConfigurationsConstants.ADMIN_FORCE_PASSWORD_RESET_CONNECTOR_ID:
                return "Admin Initiated Password Reset";
            case ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID:
                return "Alternative Login Identifiers";
            case ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID:
                return "Invite User to Set Password";
            case ServerConfigurationsConstants.SIFT_CONNECTOR_ID:
                return "Fraud Detection";
            default:
                return connector?.friendlyName;
        }
    };

    const resolveConnectorDescription = (connector: GovernanceConnectorInterface): string | React.ReactNode => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (<>
                    { t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.subHeading") }
                    <DocumentationLink link={ getLink("manage.loginSecurity.loginAttempts.learnMore") }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>);
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return type === "username"
                    ? t("extensions:manage.serverConfigurations.accountRecovery.usernameRecovery.heading")
                    : (
                        <div style={ { whiteSpace: "pre-line" } }>
                            { t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.subHeading") }
                            <DocumentationLink link={ getLink("manage.accountRecovery.passwordRecovery.learnMore") }>
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </div>
                    );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (<>
                    { t("extensions:manage.serverConfigurations.accountSecurity.botDetection.subHeading") }
                    <DocumentationLink link={ getLink("manage.loginSecurity.botDetection.learnMore") }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>);
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    <>
                        <Trans
                            i18nKey={
                                "extensions:manage.serverConfigurations.userOnboarding.selfRegistration.subHeading"
                            }
                        >
                            When self registration is enabled, users can register via the
                            <strong>
                                Register
                            </strong> link on the application’s Login page. This creates a new{ " " }
                            <strong>user</strong> account in the organization.
                        </Trans>
                        <DocumentationLink link={ getLink("manage.selfRegistration.learnMore") }>
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>
                );
            case ServerConfigurationsConstants.USERNAME_RECOVERY:
                return "Enable self-service username recovery for users on the login page." +
                    "The user will receive a usernmae reset link via email upon request.";
            case ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID:
                return "Configure alternative login identifiers and allow users to use username or configured" +
                    " login identifier in login and recovery flows.";
            case ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID:
                return "Allow users to set their own passwords during admin-initiated onboarding" +
                    " and configure related settings.";
            case ServerConfigurationsConstants.SIFT_CONNECTOR_ID:
                return (<>
                    Configure Sift to detect and prevent fraudulent account activities.
                    <DocumentationLink link={ getLink("manage.loginSecurity.siftConnector.learnMore") }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>);
            default:
                return connector?.description
                    ? connector.description
                    : connector?.friendlyName &&
                    t("governanceConnectors:connectorSubHeading", {
                        name: connector?.friendlyName
                    });
        }
    };

    const resolveConnectorUpdateSuccessMessage = (): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity." +
                    "notification.success.description"
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.accountSecurity.botDetection." +
                    "notification.success.description"
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.userOnboarding.selfRegistration." +
                    "notification.success.description"
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return type === "username"
                    ? "Successfully updated the username recovery configuration."
                    : t(
                        "extensions:manage.serverConfigurations.accountRecovery.passwordRecovery." +
                        "notification.success.description"
                    );
            case ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.analytics.form." +
                    "notification.success.description"
                );
            case ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.userOnboarding.inviteUserToSetPassword." +
                    "notification.success.description"
                );
            case ServerConfigurationsConstants.SIFT_CONNECTOR_ID:
                return t(
                    "governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors.siftConnector" +
                    ".notifications.configurationUpdate.success.description"
                );
            default:
                return t(
                    "governanceConnectors:notifications.updateConnector.success.description",
                    { name: connector.friendlyName }
                );
        }
    };

    const resolveConnectorUpdateErrorMessage = (error: any): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity." +
                    "notification.error.description"
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.accountSecurity.botDetection." +
                    "notification.error.description"
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.userOnboarding.selfRegistration." +
                    "notification.error.description"
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return type === "username"
                    ? "Error occurred while updating the username recovery configuration."
                    : t(
                        "extensions:manage.serverConfigurations.accountRecovery.passwordRecovery." +
                        "notification.error.description"
                    );
            case ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID:
                return t(
                    "extensions:manage.serverConfigurations.analytics.form." +
                    "notification.error.description"
                );
            case ServerConfigurationsConstants.SIFT_CONNECTOR_ID:
                return t(
                    "governanceConnectors:connectorCategories.loginAttemptsSecurity.connectors.siftConnector" +
                    ".notifications.configurationUpdate.error.description"
                );
            default:
                return t(
                    "governanceConnectors:notifications.updateConnector.error.description",
                    { description: error.response.data.description }
                );
        }
    };

    /**
     * This renders the enable toggle.
     */
    const connectorToggle = (): ReactElement => {
        let ssoLoginConnectorId: boolean = false;

        if (connectorId === ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID) {
            ssoLoginConnectorId = true;
        }

        return (
            <>
                <Checkbox
                    label={
                        enableForm
                            ? t("extensions:manage.serverConfigurations.generalEnabledLabel")
                            : t("extensions:manage.serverConfigurations.generalDisabledLabel")
                    }
                    toggle
                    onChange={ ssoLoginConnectorId ? handleBotDetectionToggle : handleToggle }
                    checked={ enableForm }
                    readOnly={ !hasGovernanceConnectorsUpdatePermissions }
                    data-testId={ `${ testId }-${ connectorId }-enable-toggle` }
                />
            </>
        );
    };

    const resolveConnectorToggleProperty = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE;
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE;
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return ServerConfigurationsConstants.RE_CAPTCHA_AFTER_MAX_FAILED_ATTEMPTS_ENABLE;
            case ServerConfigurationsConstants.ORGANIZATION_SELF_SERVICE_CONNECTOR_ID:
                return ServerConfigurationsConstants.ORGANIZATION_SELF_SERVICE_ENABLE;
            case ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID:
                return ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_ENABLE;
            default:
                return null;
        }
    };

    const pageInfo = (connector: GovernanceConnectorInterface) => {
        let content: string | ReactElement = null;

        switch (connector?.id) {
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                content = "";

                break;
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                content = t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.info");

                break;
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                content = (
                    <>
                        { t("extensions:manage.serverConfigurations.accountSecurity." + "botDetection.info.heading") }
                        <ul>
                            <li>
                                { t(
                                    "extensions:manage.serverConfigurations.accountSecurity." +
                                    "botDetection.info.subSection1"
                                ) }
                            </li>
                            <li>
                                { t(
                                    "extensions:manage.serverConfigurations.accountSecurity." +
                                    "botDetection.info.subSection2"
                                ) }
                            </li>
                            {
                                serverConfigurationConfig.connectorToggleName[
                                    ServerConfigurationsConstants.ACCOUNT_RECOVERY_BY_USERNAME ] ?
                                    (<li>
                                        { t(
                                            "extensions:manage.serverConfigurations.accountSecurity." +
                                            "botDetection.info.subSection4"
                                        ) }
                                    </li>) : <></>
                            }
                            <li>
                                { t(
                                    "extensions:manage.serverConfigurations.accountSecurity." +
                                    "botDetection.info.subSection3"
                                ) }
                            </li>
                        </ul>
                    </>
                );

                break;
        }

        return content ? (
            <Grid className={ "mt-2" }>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 10 }>
                        <Message
                            info
                            content={
                                (<>
                                    <Icon name="info circle" /> { content }{ " " }
                                </>)
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        ) : null;
    };

    /**
     * Renders a feature enhancement banner showcasing additional information about the feature.
     * @returns Feature enhancement banner.
     */
    const renderFeatureEnhancementBanner = (): ReactElement => {
        if (connector.id === ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID) {
            if (isSubOrganization() || !registrationFlowBuilderFeatureConfig?.enabled ||
                    !hasRegistrationFlowBuilderViewPermissions) {
                return null;
            }

            return <RegistrationFlowBuilderBanner />;
        }

        return null;
    };

    return !isConnectorRequestLoading && connectorId ? (
        <PageLayout
            title={ resolveConnectorTitle(connector) }
            description={ resolveConnectorDescription(connector) }
            backButton={ enableBackButton && {
                "data-testid": `${ testId }-${ connectorId }-page-back-button`,
                onClick: () => handleBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            data-testid={ `${ testId }-${ connectorId }-page-layout` }
        >
            { renderFeatureEnhancementBanner() }
            { resolveConnectorToggleProperty(connector) ? connectorToggle() : null }
            { pageInfo(connector) }
            <Ref innerRef={ pageContextRef }>
                <Grid className={ "mt-3" }>
                    { !(connectorId === ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID) ? (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                    <ConnectorFormFactory
                                        onSubmit={ handleSubmit }
                                        initialValues={ connector }
                                        connectorId={ connectorId ? connectorId : connector?.categoryId }
                                        isConnectorEnabled={ enableForm }
                                        isSubmitting={ isSubmitting }
                                    />
                                </EmphasizedSegment>
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                                <DangerZone
                                    actionTitle= { t("governanceConnectors:dangerZone.actionTitle") }
                                    header= { t("governanceConnectors:dangerZone.heading") }
                                    subheader= { t("governanceConnectors:dangerZone.subHeading") }
                                    onActionClick={ () => connectorId ===
                                        ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID ?
                                        onBotDetectionRevert() : onConfigRevert() }
                                    data-testid={ `${ testId }-${ connectorId }-danger-zone` }
                                />
                            </DangerZoneGroup>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    ) : (
        <GridLayout isLoading={ isConnectorRequestLoading } className={ "pt-5" } />
    );
};

/**
 * Default props for the component.
 */
ConnectorEditPage.defaultProps = {
    "data-testid": "governance-connectors-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectorEditPage;
