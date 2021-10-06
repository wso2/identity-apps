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

import { TestableComponentInterface } from "@wso2is/core/models";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Form, Grid, Icon } from "semantic-ui-react";
import { getHelpPanelIcons } from "../../configs";
import { OIDCDiscoveryEndpointsInterface } from "../../models";

/**
 * Proptypes for the OIDC application configurations component.
 */
interface OIDCConfigurationsPropsInterface extends TestableComponentInterface {

    /**
     * OIDC Discovery Endpoints.
     */
    endpoints: OIDCDiscoveryEndpointsInterface;
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

    const {
        endpoints,
        [ "data-testid" ]: testId
    } = props;

    return (
        <Form className="form-container with-max-width">
            <Grid verticalAlign="middle">
                {
                    endpoints?.issuer && (
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
                                <label data-testid={ `${ testId }-issuer-label` }>
                                    {
                                        t("console:develop.features.applications.helpPanel.tabs.start.content" +
                                            ".oidcConfigurations.labels.issuer")
                                    }
                                </label>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                                <CopyInputField
                                    value={ endpoints.issuer }
                                    data-testid={ `${ testId }-issuer-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints.wellKnownEndpoint && (
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
                                    value={ endpoints?.wellKnownEndpoint  }
                                    data-testid={ `${ testId }-introspection-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.authorizationEndpoint && (
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
                                    value={ endpoints.authorizationEndpoint }
                                    data-testid={ `${ testId }-authorize-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.tokenEndpoint && (
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
                                    value={ endpoints.tokenEndpoint }
                                    data-testid={ `${ testId }-token-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.userinfoEndpoint && (
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
                                    value={ endpoints.userinfoEndpoint }
                                    data-testid={ `${ testId }-userInfo-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.introspectionEndpoint && (
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
                                    value={ endpoints.introspectionEndpoint }
                                    data-testid={ `${ testId }-introspection-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.jwksUri && (
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
                                    value={ endpoints.jwksUri }
                                    data-testid={ `${ testId }-jwks-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.revocationEndpoint && (
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
                                    value={ endpoints.revocationEndpoint }
                                    data-testid={ `${ testId }-token-revoke-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                {
                    endpoints?.endSessionEndpoint && (
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
                                    value={ endpoints.endSessionEndpoint  }
                                    data-testid={ `${ testId }-logout-readonly-input` }
                                />
                            </Grid.Column>
                        </Grid.Row>
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
