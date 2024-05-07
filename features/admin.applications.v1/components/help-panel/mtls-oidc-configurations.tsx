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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { getHelpPanelIcons } from "../../configs/ui";
import {
    OIDCApplicationConfigurationInterface
} from "../../models";

/**
 * Proptypes for the OIDC application configurations component.
 */
interface MtlsConfigurationsPropsInterface extends IdentifiableComponentInterface {
    /**
     * OIDC application configurations.
     */
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
export const MTLSOIDCConfigurations: FunctionComponent<MtlsConfigurationsPropsInterface> = (
    props: MtlsConfigurationsPropsInterface
): ReactElement => {

    const {
        oidcConfigurations,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <>
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
                        <label data-componentid={ `${ componentId }-mtls-pushed-authorization-request-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.pushedAuthorizationRequest") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.mtlsPushedAuthorizationRequestEndpoint  }
                            data-componentid={ `${ componentId }-mtls-pushed-authorization-request-readonly-input` }
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
                        <label data-componentid={ `${ componentId }-mtls-token-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "oidcConfigurations.labels.token") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                        <CopyInputField
                            value={ oidcConfigurations?.mtlsTokenEndpoint  }
                            data-componentid={ `${ componentId }-mtls-token-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};

/**
 * Default props for the MTLS OIDC application Configurations component.
 */
MTLSOIDCConfigurations.defaultProps = {
    "data-componentid": "applications-help-panel-mtls-oidc-configs"
};
