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
import { Heading, Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { OIDCConfigurations } from "./oidc-configurations";
import { SAMLConfigurations } from "./saml-configurations";
import { AppState } from "../../../core";
import {
    InboundProtocolListItemInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "../../models";
import { ApplicationManagementUtils } from "../../utils";

/**
 * Proptypes for the applications help panel overview component.
 */
interface HelpPanelOverviewPropsInterface extends TestableComponentInterface {
    inboundProtocols?: InboundProtocolListItemInterface[];
    handleTabChange?: (tabId: number) => void;
    applicationType?: string;
    handleMetadataLoading?: (isMetadataLoading: boolean) => void;
}

/**
 * Applications Help Panel Overview Component.
 *
 * @param {HelpPanelOverviewPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HelpPanelOverview: FunctionComponent<HelpPanelOverviewPropsInterface> = (
    props: HelpPanelOverviewPropsInterface
): ReactElement => {

    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);
    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const { t } = useTranslation();

    const { inboundProtocols, handleMetadataLoading } = props;

    const [ isOIDC, setIsOIDC ] = useState<boolean>(false);
    const [ isSAML, setIsSAML ] = useState<boolean>(false);
    const [ isOIDCConfigsLoading, setOIDCConfigsLoading ] = useState<boolean>(false);

    useEffect(() => {
        if (inboundProtocols == undefined) {
            return;
        }

        if (inboundProtocols.length > 0) {
            inboundProtocols.map((protocol) => {
                if (protocol.type == "oauth2") {
                    setIsOIDC(true);
                } else if (protocol.type == "samlsso") {
                    setIsSAML(true);
                }
            });
        }

    }, [ inboundProtocols ]);

    useEffect(() => {
        if (oidcConfigurations !== undefined) {
            handleMetadataLoading(false);

            return;
        }
        handleMetadataLoading(true);
        setOIDCConfigsLoading(true);

        ApplicationManagementUtils.getOIDCApplicationMeta()
            .finally(() => {
                setOIDCConfigsLoading(false);
                handleMetadataLoading(false);
            });
    }, [ oidcConfigurations ]);

    return (
        <>
            {
                !isOIDCConfigsLoading ? (
                    <Grid>
                        { 
                            /* 
                                TODO : Check and remove the following if unnecssary
                                applicationType && applicationType == ApplicationManagementConstants.SPA
                                    ? (
                                        <Grid.Row textAlign="center">
                                            <Grid.Column width={ 16 }>
                                                <Heading as="h5">
                                                    <strong>
                                                        { t("console:develop.features.applications." + 
                                                            "helpPanel.tabs.start.content.trySample.title") }
                                                    </strong>
                                                </Heading>
                                                <Header.Subheader>
                                                    { t("console:develop.features.applications.helpPanel.tabs.start." +
                                                        "content.trySample.subTitle") }
                                                </Header.Subheader>
                                                <Divider hidden/>
                                                <PrimaryButton onClick={ () => { handleTabChange(2) } }>
                                                    { t("console:develop.features.applications.helpPanel.tabs.start." +
                                                        "content.trySample.btn") }
                                                </PrimaryButton>
                                                <Divider hidden/>
                                                <Divider horizontal>Or</Divider>
                                                <Heading ellipsis as="h5">
                                                    <strong>
                                                        { t("console:develop.features.applications.helpPanel.tabs." +
                                                            "start.content.useSDK.title") }
                                                    </strong>
                                                </Heading>
                                                <Header.Subheader>
                                                    { t("console:develop.features.applications.helpPanel." +
                                                        "tabs.start.content.useSDK.subTitle") }
                                                </Header.Subheader>
                                                <Divider hidden/>
                                                <Button.Group>
                                                    <SecondaryButton onClick={ () => { handleTabChange(3) } }>
                                                        { t("console:develop.features.applications." + 
                                                            "helpPanel.tabs.start.content.useSDK.btns.withSDK") }
                                                    </SecondaryButton>
                                                </Button.Group>
                                            </Grid.Column>
                                        </Grid.Row>
                                    )
                                    : null
                            */ 
                        }
                        <Grid.Row>
                            <Grid.Column>
                                <Heading ellipsis as="h5">
                                    <strong>
                                        { t("console:develop.features.applications.helpPanel.tabs.start.content" +
                                            ".endpoints.title") }
                                    </strong>
                                </Heading>
                                <Hint>
                                    { t("console:develop.features.applications.helpPanel.tabs.start.content" +
                                        ".endpoints.subTitle") }
                                </Hint>
                                <Divider hidden/>
                                {
                                    isOIDC && (
                                        <OIDCConfigurations oidcConfigurations={ oidcConfigurations }/>
                                    )
                                }
                                {
                                    isOIDC && isSAML
                                        ? (
                                            <>
                                                <Divider hidden />
                                                <Divider/>
                                                <Divider hidden />
                                            </>
                                        ) : null
                                }
                                {
                                    isSAML && (
                                        <SAMLConfigurations samlConfigurations={ samlConfigurations }/>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : null
            }
        </>
    );
};
