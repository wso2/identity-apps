/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Form, Grid } from "semantic-ui-react";
import { getHelpPanelIcons } from "../../configs/ui";
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
interface OIDCConfigurationsPropsInterface extends IdentifiableComponentInterface {
    oidcConfigurations: OIDCApplicationConfigurationInterface;
    /**
     * Application template ID.
     */
    templateId?: string;
}

/**
  * MTLS OIDC application configurations Component.
  *
  * @param props - Props injected to the component.
  *
  * @returns MTLS OIDC application configurations Component.
  */
export const MTLSOIDCConfigurations: FunctionComponent<OIDCConfigurationsPropsInterface> = (
    props: OIDCConfigurationsPropsInterface
): ReactElement => {

    const {
        oidcConfigurations,
        [ "data-componentid" ]: testId
    } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
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
                            icon={ getHelpPanelIcons().endpoints.par }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-mtls-pushed-authorization-request-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.pushedAuthorizationRequest") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.mtlsPushedAuthorizationRequestEndpoint  }
                            data-testid={ `${ testId }-mtls-pushed-authorization-request-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
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
                        <label data-testid={ `${ testId }-mtls-token-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.token") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.mtlsTokenEndpoint  }
                            data-testid={ `${ testId }-mtls-token-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    );
};

/**
 * Default props for the MTLS OIDC application Configurations component.
 */
MTLSOIDCConfigurations.defaultProps = {
    "data-componentid": "applications-help-panel-mtls-oidc-configs"
};
