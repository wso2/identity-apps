/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
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
    useMemo,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Grid, Icon, Message, Ref } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../admin.extensions.v1/configs/server-configuration";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../admin.core.v1";
import { getConnectorDetails, updateGovernanceConnector } from "../api/governance-connectors";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import { ConnectorFormFactory } from "../forms";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
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

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ isConnectorRequestLoading, setConnectorRequestLoading ] = useState<boolean>(false);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ categoryId, setCategoryId ] = useState<string>(undefined);
    const [ connectorId, setConnectorId ] = useState<string>(undefined);
    const [ enableForm, setEnableForm ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ enableBackButton, setEnableBackButton ] = useState<boolean>(true);

    const isReadOnly: boolean = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.governanceConnectors,
                featureConfig?.governanceConnectors?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    const path: string[] = history.location.pathname.split("/");
    const type: string = path[ path.length - 3 ];

    useEffect(() => {
        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (
            !hasRequiredScopes(
                featureConfig?.governanceConnectors,
                featureConfig?.governanceConnectors?.scopes?.read,
                allowedScopes
            )
        ) {
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
                    serverConfigurationConfig.connectorToggleName["account-recovery-username"]
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

        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ] &&
            serverConfigurationConfig.autoEnableConnectorToggleProperty
        ) {
            if (connectorId === ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID) {
                if (ServerConfigurationsConstants.RECOVERY_EMAIL_LINK_ENABLE in values
                || ServerConfigurationsConstants.RECOVERY_SMS_OTP_ENABLE in values) {
                    const emailLinkEnabled: boolean = values[ ServerConfigurationsConstants
                        .RECOVERY_EMAIL_LINK_ENABLE ] === true;
                    const smsOtpEnabled: boolean = values[ ServerConfigurationsConstants
                        .RECOVERY_SMS_OTP_ENABLE ] === true;
                    const value: string = emailLinkEnabled || smsOtpEnabled
                        ? "true"
                        : "false";

                    data.properties.push({
                        name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                            serverConfigurationConfig.connectorToggleName[ connector?.name ]
                        ),
                        value: value
                    });
                }
            }
            else {
                data.properties.push({
                    name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                        serverConfigurationConfig.connectorToggleName[ connector?.name ]
                    ),
                    value: "true"
                });
            }
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
                return "Multi Attribute Login";
            case ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID:
                return "Invite User to Set Password";
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
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>);
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return type === "username"
                    ? "Enable self-service username recovery for users on the login page." +
                        " The user will receive a username reset link via email upon request."
                    : (
                        <div style={ { whiteSpace: "pre-line" } }>
                            { t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.subHeading") }
                            <DocumentationLink link={ getLink("manage.accountRecovery.passwordRecovery.learnMore") }>
                                { t("extensions:common.learnMore") }
                            </DocumentationLink>
                        </div>
                    );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (<>
                    { t("extensions:manage.serverConfigurations.accountSecurity.botDetection.subHeading") }
                    <DocumentationLink link={ getLink("manage.loginSecurity.botDetection.learnMore") }>
                        { t("extensions:common.learnMore") }
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
                            { t("extensions:common.learnMore") }
                        </DocumentationLink>
                    </>
                );
            case ServerConfigurationsConstants.USERNAME_RECOVERY:
                return "Enable self-service username recovery for users on the login page." +
                    "The user will receive a usernmae reset link via email upon request.";
            case ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID:
                return "Manage and configure settings related configuring "
                    + "multiple attributes as the login identifier.";
            case ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID:
                return "Allow users to set their own passwords during admin-initiated onboarding" +
                    " and configure related settings.";
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
                    readOnly={ isReadOnly }
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
            { resolveConnectorToggleProperty(connector) ? connectorToggle() : null }
            { pageInfo(connector) }
            { !(connectorId === ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID) ? (
                <Ref innerRef={ pageContextRef }>
                    <Grid className={ "mt-3" }>
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
                    </Grid>
                </Ref>
            ) : null }
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
