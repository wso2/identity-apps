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
import { Grid } from "semantic-ui-react";
import { HelpPanelIcons } from "../../configs";
import { OIDCApplicationConfigurationInterface } from "../../models";

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
    const {
        oidcConfigurations,
        [ "data-testid" ]: testId
    } = props;

    return (
        <>
            <Grid verticalAlign="middle">
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ HelpPanelIcons.endpoints.authorize }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-authorize-label` }>
                            { t("devPortal:components.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.authorize") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.authorizeEndpoint }
                            className="panel-url-input"
                            data-testid={ `${ testId }-authorize-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ HelpPanelIcons.endpoints.token }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-token-label` }>
                            { t("devPortal:components.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.token") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.tokenEndpoint }
                            className="panel-url-input"
                            data-testid={ `${ testId }-token-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ HelpPanelIcons.endpoints.userInfo }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-userInfo-label` }>
                            { t("devPortal:components.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.userInfo") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.userEndpoint }
                            className="panel-url-input"
                            data-testid={ `${ testId }-userInfo-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ HelpPanelIcons.endpoints.jwks }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-jwks-label` }>
                            { t("devPortal:components.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.keystore") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.jwksEndpoint }
                            className="panel-url-input"
                            data-testid={ `${ testId }-jwks-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ HelpPanelIcons.endpoints.introspect }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-introspection-label` }>
                            { t("devPortal:components.applications.helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.introspection") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ oidcConfigurations?.introspectionEndpoint }
                            className="panel-url-input"
                            data-testid={ `${ testId }-introspection-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
};

/**
 * Default props for the OIDC application Configurations component.
 */
OIDCConfigurations.defaultProps = {
    "data-testid": "applications-help-panel-oidc-configs"
};
