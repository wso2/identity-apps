/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    EmphasizedSegment,
    GridLayout,
    PageLayout,
    Text,
    Hint,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useRef, useState, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, CheckboxProps, Grid, Icon, Message, Ref } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../../../features/core";
import { GovernanceConnectorUtils, ServerConfigurationsConstants } from "../../../../features/server-configurations";
import { getConnectorDetails, updateGovernanceConnector } from "../../../../features/server-configurations/api";
import { GovernanceConnectorInterface } from "../../../../features/server-configurations/models";
import { ConnectorFormFactory } from "../forms";
import { serverConfigurationConfig } from "../../../configs";

/**
 * Props for the Server Configurations page.
 */
type ConnectorEditPageInterface = TestableComponentInterface;

/**
 * Governance connector edit page.
 *
 * @param {ConnectorEditPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ConnectorEditPage: FunctionComponent<ConnectorEditPageInterface> = (
    props: ConnectorEditPageInterface
): ReactElement => {
    const { ["data-testid"]: testId } = props;

    const dispatch = useDispatch();
    const pageContextRef = useRef(null);

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

    const isReadOnly = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    useEffect(() => {

        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (!hasRequiredScopes(featureConfig?.governanceConnectors,
            featureConfig?.governanceConnectors?.scopes?.read,
            allowedScopes)) {
            return;
        }

        loadConnectorDetails();
    }, []);

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths()
            .get("GOVERNANCE_CONNECTOR")
            .replace(":id", categoryId));
    };

    const handleUpdateSuccess = () => {
        dispatch(
            addAlert({
                description: resolveConnectorUpdateSuccessMessage(),
                level: AlertLevels.SUCCESS,
                message: t(
                    "console:manage.features.governanceConnectors.notifications." +
                    "updateConnector.success.message"
                )
            })
        );
    };

    const handleUpdateError = (error) => {
        if (error.response && error.response.data && error.response.data.detail) {
            dispatch(
                addAlert({
                    description: resolveConnectorUpdateErrorMessage(error),
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

    const handleToggle = (e: SyntheticEvent, data: CheckboxProps) => {
        setEnableForm(data.checked);

        const updateData = {
            operation: "UPDATE",
            properties: []
        };

        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ]
            && serverConfigurationConfig.autoEnableConnectorToggleProperty
        ) {
            updateData.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]
                ),
                value: data.checked.toString()
            });
        }

        updateGovernanceConnector(updateData, categoryId, connectorId)
            .then(() => {
                handleUpdateSuccess();
            })
            .catch((error) => {
                handleUpdateError(error);
            });
    };

    const handleBotDetectionToggle = (e: SyntheticEvent, data: CheckboxProps) => {
        setEnableForm(data.checked);

        const updateSSOCaptchaData = {
            operation: "UPDATE",
            properties: []
        };

        const updateSelfSignUpCaptchaData = {
            operation: "UPDATE",
            properties: []
        };

        const updateRecoveryCaptchaData = {
            operation: "UPDATE",
            properties: []
        };

        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ]
            && serverConfigurationConfig.autoEnableConnectorToggleProperty
        ) {
            // Update reCaptcha settings for single sign-on.
            updateSSOCaptchaData.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]
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
        }

        updateGovernanceConnector(updateSSOCaptchaData, categoryId, connectorId)
            .then(() => {
                updateGovernanceConnector(updateSelfSignUpCaptchaData,
                    ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                    ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID)
                    .then(() => {
                        updateGovernanceConnector(updateRecoveryCaptchaData,
                            ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID,
                            ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID)
                            .then(() => {
                                handleUpdateSuccess();
                            });
                    });
            })
            .catch((error) => {
                handleUpdateError(error);
            });
    };

    const handleSubmit = (values) => {
        const data = {
            operation: "UPDATE",
            properties: []
        };
        for (const key in values) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(key),
                value: values[key]
            });
        }

        if (serverConfigurationConfig.connectorToggleName[ connector?.name ]
            && serverConfigurationConfig.autoEnableConnectorToggleProperty) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]),
                value: "true"
            });
        }

        setIsSubmitting(true);

        updateGovernanceConnector(data, categoryId, connectorId)
            .then(() => {
                handleUpdateSuccess();
                loadConnectorDetails();
            })
            .catch((error) => {
                handleUpdateError(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const loadConnectorDetails = () => {
        const path = history.location.pathname.split("/");
        const categoryId = path[path.length - 2];
        const connectorId = path[path.length - 1];

        setCategoryId(categoryId);
        setConnectorId(connectorId);
        setConnectorRequestLoading(true);

        getConnectorDetails(categoryId, connectorId)
            .then((response: GovernanceConnectorInterface) => {
                setConnector(response);
                const enableProperty = response.properties.find(
                    (property) => property.name === resolveConnectorToggleProperty(response));
                setEnableForm(enableProperty ? enableProperty?.value === "true" : true);
            })
            .catch((error) => {
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
            })
            .finally(() => {
                setConnectorRequestLoading(false);
            });
    };

    const resolveConnectorTitle = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.heading")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.heading")
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.botDetection.heading")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration.heading")
                );
            default:
                return connector?.friendlyName;
        }
    };

    const resolveConnectorDescription = (connector: GovernanceConnectorInterface): string | React.ReactNode => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.subHeading")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    <div style={ { whiteSpace: "pre-line" } }>
                        {
                            t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery.subHeading")
                        }
                        <DocumentationLink
                            link={ getLink("manage.accountRecovery.passwordRecovery.learnMore") }
                        >
                            { t("extensions:common.learnMore") }
                        </DocumentationLink>
                    </div>
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.botDetection.subHeading")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                        <>
                            <Trans
                                i18nKey={
                                    "extensions:manage.serverConfigurations.userOnboarding.selfRegistration.subHeading"
                                }
                            >
                                When self registration is enabled, users can register via the
                                <strong>Create an account</strong> link on the application’s Login page. This creates
                                a new <strong>customer</strong> account in the organization.
                            </Trans>
                            <DocumentationLink
                                link={ getLink("manage.selfRegistration.learnMore") }
                            >
                                { t("extensions:common.learnMore") }
                            </DocumentationLink>
                        </>
                );
            default:
                return (
                    connector?.description
                        ? connector.description
                        : connector?.friendlyName
                        && t("console:manage.features.governanceConnectors.connectorSubHeading", {
                            name: connector?.friendlyName
                        })
                );
        }
    };

    const resolveBackButtonText = (connector: GovernanceConnectorInterface): string => {
        switch (connector.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.backButton")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.backButton")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.backButton")
                );
            default:
                return (
                    t("extensions:manage.serverConfigurations.generalBackButton")
                );
        }
    };

    const resolveConnectorUpdateSuccessMessage = (): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity." +
                        "notification.success.description")
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.botDetection." +
                        "notification.success.description")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration." +
                        "notification.success.description")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery." +
                        "notification.success.description")
                );
            default:
                return (
                   t("console:manage.features.governanceConnectors.notifications.updateConnector.success.description",
                    { name: connector.friendlyName })
                );
        }
    };

    const resolveConnectorUpdateErrorMessage = (error: any): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity." +
                        "notification.error.description")
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountSecurity.botDetection." +
                        "notification.error.description")
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.userOnboarding.selfRegistration." +
                        "notification.error.description")
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    t("extensions:manage.serverConfigurations.accountRecovery.passwordRecovery." +
                        "notification.error.description")
                );
            default:
                return (
                    t("console:manage.features.governanceConnectors.notifications.updateConnector.error.description",
                        { description: error.response.data.description })
                );
        }
    };

    /**
     * This renders the enable toggle.
     */
    const connectorToggle = (): ReactElement => {
        let ssoLoginConnectorId: boolean = false;
        if (connectorId=== ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID){
            ssoLoginConnectorId = true;
        }
        return (
            <>
                <Checkbox
                    label={ enableForm ? t("extensions:manage.serverConfigurations.generalEnabledLabel") :
                        t("extensions:manage.serverConfigurations.generalDisabledLabel") }
                    toggle
                    onChange={
                        ssoLoginConnectorId ? handleBotDetectionToggle : handleToggle
                    }
                    checked={ enableForm }
                    readOnly={
                        ssoLoginConnectorId ? true : isReadOnly
                    }
                    data-testId={ `${ testId }-${ connectorId }-enable-toggle` }
                />
                {
                    ssoLoginConnectorId &&
                    <Hint
                        warning
                        popup
                    >
                        This feature is enabled by default for all the organizations in Asgardeo.
                        You will not be able to disable this for your organization at present.
                    </Hint>
                }
            </>
        );
    };

    const resolveConnectorToggleProperty = (connector: GovernanceConnectorInterface): string => {
        switch (connector?.id) {
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                return (
                    ServerConfigurationsConstants.ACCOUNT_LOCK_ENABLE
                );
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                return (
                    ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE
                );
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                return (
                    ServerConfigurationsConstants.RE_CAPTCHA_ALWAYS_ENABLE
                );
            case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
                return (
                    ServerConfigurationsConstants.PASSWORD_RECOVERY_NOTIFICATION_BASED_ENABLE
                );
            default:
                return null;
        }
    };

    const pageInfo = (connector: GovernanceConnectorInterface) => {
        let content = null;
        switch (connector?.id) {
            case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
                content = "";
                break;
            case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
                content = t("extensions:manage.serverConfigurations.accountSecurity.loginAttemptSecurity.info") ;
                break;
            case ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID:
                content =
                (
                    <>
                        { t("extensions:manage.serverConfigurations.accountSecurity." +
                            "botDetection.info.heading") }
                        <ul>
                            <li>{ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "botDetection.info.subSection1") }</li>
                            <li>{ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "botDetection.info.subSection2") }</li>
                            <li>{ t("extensions:manage.serverConfigurations.accountSecurity." +
                                "botDetection.info.subSection3") }</li>
                        </ul>
                    </>
                );
                break;
        }

        return (
            content?
                <Grid className={ "mt-2" } >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 10 }>
                            <Message
                                info
                                content={ <><Icon name="info circle"/> { content } </> }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                : null
        );
    };

    return (!isConnectorRequestLoading && connectorId ?
            <PageLayout
                title={ resolveConnectorTitle(connector) }
                description={ resolveConnectorDescription(connector) }
                backButton={ {
                    "data-testid": `${ testId }-${ connectorId }-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: resolveBackButtonText(connector)
                } }
                bottomMargin={ false }
                contentTopMargin={ true }
                pageHeaderMaxWidth={ true }
                data-testid={ `${ testId }-${ connectorId }-page-layout` }
            >
                {
                    resolveConnectorToggleProperty(connector)
                        ? connectorToggle()
                        : null
                }
                {
                    pageInfo(connector)
                }
                {
                    !(connectorId ===
                        ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID)
                        ? <Ref innerRef={ pageContextRef }>
                            <Grid className={ "mt-3" } >
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 16 }>
                                        <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                            <ConnectorFormFactory
                                                onSubmit={ handleSubmit }
                                                initialValues={ connector }
                                                connectorId={ connectorId ? connectorId
                                                    : connector?.categoryId }
                                                isConnectorEnabled={ enableForm }
                                                isSubmitting={ isSubmitting }
                                        />
                                        </EmphasizedSegment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Ref>
                        : null
                }
            </PageLayout> :
            <GridLayout
                isLoading={ isConnectorRequestLoading }
                className={ "pt-5" }
            />
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
