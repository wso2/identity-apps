/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment, ResourceTab } from "@wso2is/react-components";
import get from "lodash-es/get";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Menu, SemanticShorthandItem, TabPaneProps } from "semantic-ui-react";
import { AuthenticatorFormFactory } from "./forms/factories";
import {
    AuthenticatorExtensionsConfigInterface,
    ComponentExtensionPlaceholder,
    identityProviderConfig
} from "../../../extensions";
import { updateMultiFactorAuthenticatorDetails } from "../api";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorInterface, MultiFactorAuthenticatorInterface } from "../models";

/**
 * Proptypes for the Multi-factor Authenticator edit component.
 */
interface EditMultiFactorAuthenticatorPropsInterface extends TestableComponentInterface, LoadableComponentInterface {

    /**
     * Editing Multi-factor Authenticator.
     */
    authenticator: MultiFactorAuthenticatorInterface | AuthenticatorInterface;
    /**
     * Callback to be triggered after deleting the idp.
     */
    onDelete: () => void;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
    /**
     * Default active tab index.
     */
    defaultActiveIndex?: number;
    /**
     * Callback to see if tab extensions are available
     */
    isTabExtensionsAvailable: (isAvailable: boolean) => void;
    /**
     * Type of the authenticator.
     * @see {@link IdentityProviderManagementConstants } Use one of `IDP_TEMPLATE_IDS`.
     */
    type: string;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
}

/**
 * Identity Provider edit component.
 *
 * @param {EditIdentityProviderPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const EditMultiFactorAuthenticator: FunctionComponent<EditMultiFactorAuthenticatorPropsInterface> = (
    props: EditMultiFactorAuthenticatorPropsInterface
): ReactElement => {

    const {
        authenticator,
        isLoading,
        defaultActiveIndex,
        isTabExtensionsAvailable,
        onUpdate,
        type,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<any>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    /**
     * Check for tab extensions.
     */
    useEffect(() => {

        if (tabPaneExtensions || !authenticator) {
            return;
        }

        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(identityProviderConfig.authenticators,
            authenticator.id);

        if (!authenticatorConfig?.content?.quickStart) {
            return;
        }

        // Resolve the quick-start tab.
        const extensions: any[] = ComponentExtensionPlaceholder({
            component: "identityProvider",
            props: {
                content: authenticatorConfig.content.quickStart
            },
            subComponent: "edit",
            type: "tab"
        });

        if (Array.isArray(extensions) && extensions.length > 0) {
            isTabExtensionsAvailable(true);
        }

        setTabPaneExtensions(extensions);
    }, [ authenticator, tabPaneExtensions ]);

    /**
     * Handles authenticator configurations submit action.
     * @param {MultiFactorAuthenticatorInterface} values - Form values.
     */
    const handleAuthenticatorConfigFormSubmit = (values: MultiFactorAuthenticatorInterface): void => {
        setIsSubmitting(true);

        updateMultiFactorAuthenticatorDetails(authenticator.id, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider" +
                        ".notifications.updateEmailOTPAuthenticator.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "updateEmailOTPAuthenticator.success.message")
                }));

                onUpdate(authenticator.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider" +
                            ".notifications.updateEmailOTPAuthenticator.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider" +
                            ".notifications.updateEmailOTPAuthenticator.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications" +
                        ".updateEmailOTPAuthenticator.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications" +
                        ".updateEmailOTPAuthenticator.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Authenticator settings tab content.
     * @return {React.ReactElement}
     */
    const AuthenticatorSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            {
                !isLoading
                    ? (
                        <div className="authentication-section">
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        <EmphasizedSegment padded="very">
                                            <AuthenticatorFormFactory
                                                metadata={ null }
                                                showCustomProperties={ false }
                                                initialValues={ authenticator }
                                                onSubmit={ handleAuthenticatorConfigFormSubmit }
                                                type={ type }
                                                data-testid={ `${ testId }-${ authenticator.name }-content` }
                                                isReadOnly={ isReadOnly }
                                                isSubmitting={ isSubmitting }
                                            />
                                        </EmphasizedSegment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    )
                    : <ContentLoader />
            }
        </ResourceTab.Pane>
    );

    /**
     * Get Tab panes.
     * @return {{pane?: SemanticShorthandItem<TabPaneProps>; menuItem?: any; render?: () => React.ReactNode}[]}
     */
    const getPanes = (): ({
        pane?: SemanticShorthandItem<TabPaneProps>;
        menuItem?: any;
        render?: () => React.ReactNode;
    })[] => {

        const panes: {
            pane?: SemanticShorthandItem<TabPaneProps>;
            menuItem?: any;
            render?: () => ReactNode;
        }[] = [];

        if (tabPaneExtensions && tabPaneExtensions.length > 0) {
            panes.push(...tabPaneExtensions);
        }

        // If the MFA is TOTP/FIDO/Magic Link skip the settings tab.
        if (
            ![
                IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID,
                IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID,
                IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID
            ].includes(authenticator.id)
        ) {
            panes.push({
                menuItem: t("console:develop.features.authenticationProvider.edit.common.settings.tabName"),
                render: AuthenticatorSettingsTabPane
            });
        }

        // If the MFA is Email OTP, add the Email Template tab.
        if (authenticator.id === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID) {
            panes.push({
                menuItem: (
                    <Menu.Item disabled key="messages" className="upcoming-item">
                        <Trans
                            i18nKey={
                                "console:develop.features.authenticationProvider.edit.emailOTP.emailTemplate.tabName"
                            }
                        >
                            Email Template <span className="coming-soon-label">(Coming Soon)</span>
                        </Trans>
                    </Menu.Item>
                ),
                render: null
            });
        }

        // If the MFA is SMS OTP, add the SMS Provider tab.
        if (authenticator.id === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID) {
            panes.push({
                menuItem: (
                    <Menu.Item disabled key="messages" className="upcoming-item">
                        <Trans
                            i18nKey={
                                "console:develop.features.authenticationProvider.edit.smsOTP.smsProvider.tabName"
                            }
                        >
                            SMS Provider <span className="coming-soon-label">(Coming Soon)</span>
                        </Trans>
                    </Menu.Item>
                ),
                render: null
            });
        }
        return panes;
    };

    /**
     * Resolves the active index of the tabs.
     *
     * @param {number} activeIndex - Active index of the tabs.
     * @return {number}
     */
    const resolveDefaultActiveIndex = (activeIndex: number): number => {

        if (![
            IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID,
            IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID,
            IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID
        ].includes(authenticator.id)) {
            return activeIndex;
        }

        return 0;
    };

    return (
        authenticator
            ? (
                <ResourceTab
                    data-testid={ `${ testId }-resource-tabs` }
                    panes={ getPanes() }
                    defaultActiveIndex={ resolveDefaultActiveIndex(defaultActiveIndex) }
                />
            )
            : null
    );
};

/**
 * Default proptypes for the component.
 */
EditMultiFactorAuthenticator.defaultProps = {
    "data-testid": "multi-factor-authenticator-edit",
    defaultActiveIndex: 1
};
