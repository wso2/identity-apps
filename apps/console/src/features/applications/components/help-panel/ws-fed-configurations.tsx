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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Form, Grid } from "semantic-ui-react";
import { useWSFederationConfig } from "../../../wsfed-configuration/api/wsfed-configuration";
import { getHelpPanelIcons } from "../../configs/ui";
import { WSFederationApplicationConfigurationInterface } from "../../models";

/**
 * Proptypes for the WS Federation application configurations component.
 */
type WSFederationConfigurationsPropsInterface = IdentifiableComponentInterface

/**
 * WS Federation application configurations Component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Help panel WS Federation application configurations component.
 */
export const WSFederationConfigurations: FunctionComponent<WSFederationConfigurationsPropsInterface> = (
    props: WSFederationConfigurationsPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch : Dispatch<any> = useDispatch();

    const [ wsFedConfigurations, setWSFedConfigurations ] =
        useState<WSFederationApplicationConfigurationInterface>(undefined);

    const {
        data: originalWSFederationConfig,
        isLoading: isWSFederationFetchRequestLoading,
        error: wsFederationConfigFetchRequestError
    } = useWSFederationConfig();

    useEffect(() => {
        if (originalWSFederationConfig instanceof IdentityAppsApiException
            || wsFederationConfigFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalWSFederationConfig) {
            return;
        }

        setWSFedConfigurations({
            passiveStsUrl: originalWSFederationConfig.passiveSTSUrl
        });
    }, [ originalWSFederationConfig ]);

    /**
     * Displays the error banner when unable to fetch WSFederation configuration.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("wsFederationConfig:notifications." +
                "getConfiguration.error.description"),
                level: AlertLevels.ERROR,
                message: t("wsFederationConfig:notifications." +
                "getConfiguration.error.message")
            })
        );
    };

    return (
        !isWSFederationFetchRequestLoading && (
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
                            <label data-componentid={ `${ componentId }-issuer-label` }>
                                { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                    "wsFedConfigurations.labels.passiveSTSUrl") }
                            </label>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                            <CopyInputField
                                value={ wsFedConfigurations?.passiveStsUrl }
                                data-componentid={ `${ componentId }-passive-sts-readonly-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form>
        )
    );
};

/**
 * Default props for the WS Federation application Configurations component.
 */
WSFederationConfigurations.defaultProps = {
    "data-componentid": "applications-help-panel-ws-federation-configs"
};
