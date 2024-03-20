/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment, ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import { authenticatorConfig } from "../../../extensions/configs/authenticator";
import get from "lodash-es/get";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, SemanticShorthandItem, TabPaneProps } from "semantic-ui-react";
import { AuthenticatorFormFactory } from "./forms/factories";
import {
    AuthenticatorExtensionsConfigInterface,
    identityProviderConfig
} from "../../../extensions";
import { updateMultiFactorAuthenticatorDetails } from "../api";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorInterface, AuthenticatorSettingsFormModes, MultiFactorAuthenticatorInterface } from "../models";

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
 * @param props - Props injected to the component.
 * @returns Functional Component
 */
export const EditMultiFactorAuthenticator: FunctionComponent<EditMultiFactorAuthenticatorPropsInterface> = (
    props: EditMultiFactorAuthenticatorPropsInterface
): ReactElement => {

    const {
        authenticator,
        isLoading,
        defaultActiveIndex,
        onUpdate,
        type,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const [ tabPaneExtensions, setTabPaneExtensions ] = useState<ResourceTabPaneInterface[]>(undefined);
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

        const extensions: ResourceTabPaneInterface[] = identityProviderConfig
            .editIdentityProvider.getTabExtensions({
                content: authenticatorConfig.content.quickStart
            });

        setTabPaneExtensions(extensions);
    }, [ authenticator, tabPaneExtensions ]);

    /**
     * Handles authenticator configurations submit action.
     * @param values - Form values.
     */
    const handleAuthenticatorConfigFormSubmit = (values: MultiFactorAuthenticatorInterface): void => {
        setIsSubmitting(true);

        const i18nKeyForMFAAuthenticator: string = getI18nKeyForMultiFactorAuthenticator(authenticator);

        updateMultiFactorAuthenticatorDetails(authenticator.id, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider" +
                        ".notifications." + i18nKeyForMFAAuthenticator + ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        i18nKeyForMFAAuthenticator + ".success.message")
                }));

                onUpdate(authenticator.id);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider" +
                            ".notifications." + i18nKeyForMFAAuthenticator + ".error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider" +
                            ".notifications." + i18nKeyForMFAAuthenticator + ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("authenticationProvider:notifications." +
                        i18nKeyForMFAAuthenticator + ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications." +
                        i18nKeyForMFAAuthenticator + ".genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const getI18nKeyForMultiFactorAuthenticator =
        (authenticator: MultiFactorAuthenticatorInterface | AuthenticatorInterface) => {
            if (authenticator.id === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID) {
                return "updateSMSOTPAuthenticator";
            } else if (authenticator.id === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID) {
                return "updateEmailOTPAuthenticator";
            } else {
                return "updateGenericAuthenticator";
            }
        };

    const displayExternalResourcesButton = () => {
        if (authenticator.id === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID) {
            return true;
        }

        return false;
    };

    /**
     * Authenticator settings tab content.
     * @returns Functional Component
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
                                                mode={ AuthenticatorSettingsFormModes.EDIT }
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
                                        {
                                            displayExternalResourcesButton() &&
                                            authenticatorConfig.externalResourceButton
                                        }
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
     * @returns Tab panes as an array
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

        // If the MFA is TOTP/Magic Link skip the settings tab.
        if (
            ![
                IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID,
                IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR_ID
            ].includes(authenticator.id)
        ) {
            panes.push({
                menuItem: t("authenticationProvider:edit.common.settings.tabName"),
                render: AuthenticatorSettingsTabPane
            });
        }

        return panes;
    };

    /**
     * Resolves the active index of the tabs.
     *
     * @param activeIndex - Active index of the tabs.
     * @returns Active index as a number
     */
    const resolveDefaultActiveIndex = (activeIndex: number): number => {

        if (![
            IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID,
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
