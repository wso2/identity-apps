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

import { AsgardeoSPAClient, OIDCEndpoints } from "@asgardeo/auth-react";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Form, Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../admin.core.v1";
import { AppState } from "../../../admin.core.v1/store";
import { getHelpPanelIcons } from "../../configs/ui";
import { ApplicationManagementConstants } from "../../constants";
import {
    OIDCApplicationConfigurationInterface,
    OIDCEndpointsInterface
} from "../../models";

/**
 * Get an identity client instance.
 *
 */
const identityClient: AsgardeoSPAClient = AsgardeoSPAClient.getInstance();

/**
 * Proptypes for the OIDC application configurations component.
 */
interface OIDCConfigurationsPropsInterface extends TestableComponentInterface {
    oidcConfigurations: OIDCApplicationConfigurationInterface;
    /**
     * Application template ID.
     */
    templateId?: string;
}

/**
 * OIDC application configurations Component.
 *
 * @param props - Props injected to the component.
 *
 * @returns OIDC application configurations Component.
 */
export const OIDCConfigurations: FunctionComponent<OIDCConfigurationsPropsInterface> = (
    props: OIDCConfigurationsPropsInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features);

    const {
        oidcConfigurations,
        templateId,
        [ "data-testid" ]: testId
    } = props;

    const [ endpoints, setEndpoints ] = useState<OIDCEndpointsInterface>(undefined);

    useEffect(() => {
        if (endpoints !== undefined) {
            return;
        }

        // Fetch the server endpoints for OIDC applications.
        identityClient.getOIDCServiceEndpoints()
            .then((response: OIDCEndpoints) => {
                setEndpoints({
                    authorize: response?.authorizationEndpoint,
                    jwks: response?.jwksUri,
                    logout: response?.endSessionEndpoint,
                    oidcSessionIFrame: response?.checkSessionIframe,
                    revoke: response?.revocationEndpoint,
                    token: response?.tokenEndpoint
                });
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.fetchOIDCServiceEndpoints" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchOIDCServiceEndpoints." +
                        "genericError.message")
                }));
            });
    });

    return (
        <Form>
            <Grid verticalAlign="middle">
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.issuer }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-introspection-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.issuer") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenEndpoint }
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.wellKnown }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-introspection-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.wellKnown") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.wellKnownEndpoint  }
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                { (
                    templateId !== ApplicationManagementConstants.M2M_APP_TEMPLATE_ID
                ) && (
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                            <GenericIcon
                                icon={ getHelpPanelIcons().endpoints.authorize }
                                size="micro"
                                square
                                transparent
                                inline
                                className="left-icon"
                                verticalAlign="middle"
                                spaced="right"
                            />
                            <label data-testid={ `${ testId }-authorize-label` }>
                                { t("applications:helpPanel.tabs.start.content." +
                                    "oidcConfigurations.labels.authorize") }
                            </label>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <CopyInputField
                                value={ oidcConfigurations?.authorizeEndpoint }
                                data-testid={ `${ testId }-authorize-readonly-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.token }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-token-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.token") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenEndpoint }
                            data-testid={ `${ testId }-token-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                { (
                    templateId !== ApplicationManagementConstants.M2M_APP_TEMPLATE_ID
                ) && (
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                            <GenericIcon
                                icon={ getHelpPanelIcons().endpoints.userInfo }
                                size="micro"
                                square
                                transparent
                                inline
                                className="left-icon"
                                verticalAlign="middle"
                                spaced="right"
                            />
                            <label data-testid={ `${ testId }-userInfo-label` }>
                                { t("applications:helpPanel.tabs.start.content." +
                                    "oidcConfigurations.labels.userInfo") }
                            </label>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <CopyInputField
                                value={ oidcConfigurations?.userEndpoint }
                                data-testid={ `${ testId }-userInfo-readonly-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.introspect }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-introspection-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.introspection") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.introspectionEndpoint }
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                { (
                    templateId !== ApplicationManagementConstants.M2M_APP_TEMPLATE_ID
                ) && (
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                            <GenericIcon
                                icon={ getHelpPanelIcons().endpoints.jwks }
                                size="micro"
                                square
                                transparent
                                inline
                                className="left-icon"
                                verticalAlign="middle"
                                spaced="right"
                            />
                            <label data-testid={ `${ testId }-jwks-label` }>
                                { t("applications:helpPanel.tabs.start.content." +
                                    "oidcConfigurations.labels.jwks") }
                            </label>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <CopyInputField
                                value={ oidcConfigurations?.jwksEndpoint }
                                data-testid={ `${ testId }-jwks-readonly-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.revoke }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-token-revoke-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.revoke") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenRevocationEndpoint }
                            data-testid={ `${ testId }-token-revoke-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                { (
                    templateId !== ApplicationManagementConstants.M2M_APP_TEMPLATE_ID
                ) && (
                    <><Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                            <GenericIcon
                                icon={ getHelpPanelIcons().endpoints.logout }
                                size="micro"
                                square
                                transparent
                                inline
                                className="left-icon"
                                verticalAlign="middle"
                                spaced="right" />
                            <label data-testid={ `${testId}-logout-label` }>
                                { t("applications:helpPanel.tabs.start.content." +
                                    "oidcConfigurations.labels.endSession") }
                            </label>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <CopyInputField
                                value={ oidcConfigurations?.endSessionEndpoint }
                                data-testid={ `${testId}-logout-readonly-input` } />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 6 }>
                            <GenericIcon
                                icon={ getHelpPanelIcons().endpoints.par }
                                size="micro"
                                square
                                transparent
                                inline
                                className="left-icon"
                                verticalAlign="middle"
                                spaced="right" />
                            <label data-testid={ `${testId}-pushed-authorization-request-label`}>
                                { t("applications:helpPanel.tabs.start.content." +
                                        "oidcConfigurations.labels.pushedAuthorizationRequest")}
                            </label>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                            <CopyInputField
                                value={ oidcConfigurations?.pushedAuthorizationRequestEndpoint }
                                data-testid={ `${testId}-pushed-authorization-request-readonly-input` } />
                        </Grid.Column>
                    </Grid.Row></>
                ) }
                {
                    featureConfig?.server?.enabled && (
                        <>
                            { (
                                templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC ||
                                templateId === ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb") ||
                                templateId === ApplicationManagementConstants.TEMPLATE_IDS.get("spa")
                            ) && (
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column mobile={ 8 } computer={ 6 }>
                                        <GenericIcon
                                            icon={ getHelpPanelIcons().endpoints.sessionIframe }
                                            size="micro"
                                            square
                                            transparent
                                            inline
                                            className="left-icon"
                                            verticalAlign="middle"
                                            spaced="right"
                                        />
                                        <label data-testid={ `${ testId }-session-iframe-label` }>
                                            { t("applications:helpPanel.tabs.start.content." +
                                                "oidcConfigurations.labels.sessionIframe") }
                                        </label>
                                    </Grid.Column>
                                    <Grid.Column mobile={ 8 } computer={ 10 }>
                                        <CopyInputField
                                            value={ oidcConfigurations?.sessionIframeEndpoint }
                                            data-testid={ `${ testId }-session-iframe-readonly-input` }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }
                        </>
                    )
                }
            </Grid>
        </Form>
    );
};

/**
 * Default props for the OIDC application Configurations component.
 */
OIDCConfigurations.defaultProps = {
    "data-testid": "applications-help-panel-oidc-configs"
};
