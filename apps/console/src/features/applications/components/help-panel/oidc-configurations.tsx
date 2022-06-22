/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Form, Grid, Icon } from "semantic-ui-react";
import { getHelpPanelIcons } from "../../configs";
import {
    OIDCApplicationConfigurationInterface,
    OIDCEndpointsInterface
} from "../../models";

/**
 * Get an identity client instance.
 *
 */
const identityClient = AsgardeoSPAClient.getInstance();

/**
 * Proptypes for the OIDC application configurations component.
 */
interface OIDCConfigurationsPropsInterface extends TestableComponentInterface {
    oidcConfigurations: OIDCApplicationConfigurationInterface;
}

/**
 * OIDC application configurations Component.
 *
 * @param {OIDCConfigurationsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OIDCConfigurations: FunctionComponent<OIDCConfigurationsPropsInterface> = (
    props: OIDCConfigurationsPropsInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        oidcConfigurations,
        [ "data-testid" ]: testId
    } = props;

    const [ endpoints, setEndpoints ] = useState<OIDCEndpointsInterface>(undefined);

    useEffect(() => {
        if (endpoints !== undefined) {
            return;
        }

        // Fetch the server endpoints for OIDC applications.
        identityClient.getOIDCServiceEndpoints()
            .then((response) => {
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
                    description: t("console:develop.features.applications.notifications.fetchOIDCServiceEndpoints" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.fetchOIDCServiceEndpoints." +
                        "genericError.message")
                }));
            });
    });

    return (
        <Form>
            <Grid verticalAlign="middle">
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.issuer") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenEndpoint }
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.wellKnown") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.wellKnownEndpoint  }
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.authorize") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.authorizeEndpoint }
                            data-testid={ `${ testId }-authorize-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.token") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenEndpoint }
                            data-testid={ `${ testId }-token-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.userInfo") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.userEndpoint }
                            data-testid={ `${ testId }-userInfo-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.introspection") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.introspectionEndpoint }
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.jwks") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.jwksEndpoint }
                            data-testid={ `${ testId }-jwks-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
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
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.revoke") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenRevocationEndpoint }
                            data-testid={ `${ testId }-token-revoke-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ <Icon className={ "mr-0" } name="power off" /> }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-logout-label` }>
                            { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.endSession") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.endSessionEndpoint  }
                            data-testid={ `${ testId }-logout-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
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
