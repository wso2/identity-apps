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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, Markdown, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Header, Segment } from "semantic-ui-react";
import { store } from "../../../core";
import { getInboundProtocolConfig } from "../../api";
import { DocumentationConstants } from "../../constants";
import { ApplicationInterface, SupportedAuthProtocolTypes } from "../../models";

/**
 * Proptypes for the applications help panel samples guide component.
 */
interface SamplesGuideComponentPropsInterface extends TestableComponentInterface {
    sampleType: string;
    application: ApplicationInterface;
    markDownSource: any;
}

/**
 * Applications Help Panel Samples Guide Component.
 *
 * @param {SamplesGuideComponentPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SamplesGuideComponent: FunctionComponent<SamplesGuideComponentPropsInterface> = (
    props: SamplesGuideComponentPropsInterface
): ReactElement => {

    const {
        application,
        markDownSource,
        sampleType,
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const deploymentConfigs = store.getState().config.deployment;
    const [ inboundProtocolConfigs, setInboundProtocolConfigs ] = useState(undefined);
    const [ authConfig, setAuthConfig ] = useState(undefined);

    useEffect(() => {
        let protocolConfigs: any = {};
        const selectedProtocolList: string[] = [];

        application.inboundProtocols.map((protocol) => {

            const protocolName = mapProtocolTypeToName(protocol.type);

            getInboundProtocolConfig(application.id, protocolName)
                .then((response) => {
                    protocolConfigs = {
                        ...protocolConfigs,
                        [protocolName]: response
                    };

                    selectedProtocolList.push(protocolName);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                                ".error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.getInboundProtocolConfig" +
                            ".genericError.message")
                    }));
                })
                .finally(() => {
                    setInboundProtocolConfigs(protocolConfigs);
                });
        });
    },  []);

    useEffect(() => {
        if (inboundProtocolConfigs == undefined) {
            return;
        }

        const configs = {
            clientHost: deploymentConfigs.clientHost,
            clientID: inboundProtocolConfigs.oidc.clientId,
            loginCallbackURL: inboundProtocolConfigs.oidc.callbackURLs[0],
            logoutCallbackURL: inboundProtocolConfigs.oidc.callbackURLs[0],
            serverOrigin: deploymentConfigs.serverOrigin,
            tenant: deploymentConfigs.tenant,
            tenantPath: deploymentConfigs.tenantPath
        };

        setAuthConfig(configs);
    }, [ inboundProtocolConfigs ]);

    /**
     * Todo Remove this mapping and fix the backend.
     */
    const mapProtocolTypeToName = ((type: string): string => {
        let protocolName = type;

        if (protocolName === "oauth2") {
            protocolName = SupportedAuthProtocolTypes.OIDC;
        } else if (protocolName === "passivests") {
            protocolName = SupportedAuthProtocolTypes.WS_FEDERATION;
        } else if (protocolName === "wstrust") {
            protocolName = SupportedAuthProtocolTypes.WS_TRUST;
        } else if (protocolName === "samlsso") {
            protocolName = SupportedAuthProtocolTypes.SAML;
        }

        return protocolName;
    });

    const downloadConfigFile = (): void => {
        const blob = new Blob(
            [ JSON.stringify(authConfig, null, 2) ],
            { type: "application/json" }
        );
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.style.display = "none";
        a.href = url;
        a.download = "config.json";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>
            {
                sampleType && sampleType == "react"
                    ? (
                        <Grid>
                            <Grid.Row>
                                <Grid.Column>
                                    <Heading as="h5">
                                        <strong>
                                            {
                                                t("console:develop.features.applications.helpPanel.tabs" +
                                                    ".samples.content.sample.downloadSample.title")
                                            }
                                        </strong>
                                    </Heading>
                                    <Header.Subheader>
                                        { t("console:develop.features.applications.helpPanel.tabs.samples.content." +
                                        "sample.downloadSample.subTitle") }
                                    </Header.Subheader>
                                    <Divider hidden/>
                                    <PrimaryButton
                                        onClick={ () => window.open(
                                            DocumentationConstants.Samples_Catalog.get("JS_SPA_SAMPLE"),
                                            ""
                                        ) }
                                    >
                                        { t("console:develop.features.applications.helpPanel.tabs.samples.content." +
                                        "sample.downloadSample.btn") }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Heading as="h5">
                                        <strong>
                                            {
                                                t("console:develop.features.applications.helpPanel.tabs" +
                                                    ".samples.content.sample.configurations.title")
                                            }
                                        </strong>
                                    </Heading>
                                    <Header.Subheader>
                                        { t("console:develop.features.applications.helpPanel.tabs.samples.content." +
                                        "sample.configurations.subTitle") }
                                    </Header.Subheader>
                                    <Segment secondary padded>
                                        <pre>
                                            { authConfig ? JSON.stringify(authConfig, null, 2) : null }
                                        </pre>
                                        <Divider hidden/>
                                        <PrimaryButton basic onClick={ downloadConfigFile }>
                                            {
                                                t("console:develop.features.applications.helpPanel.tabs" +
                                                    ".samples.content.sample.configurations.btn")
                                            }
                                        </PrimaryButton>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                    : null
            }
            <Markdown
                source={ markDownSource }
                data-testid={ `${ testId }-help-panel-configs-tab-markdown-renderer` }
            />
        </>
    );
};
