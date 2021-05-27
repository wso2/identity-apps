/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, EmphasizedSegment, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AddUserStepContent } from "../../../../extensions/application-templates/shared/components";
import { AppState } from "../../../core";
import {
    InboundProtocolListItemInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "../../models";
import { OIDCConfigurations, SAMLConfigurations } from "../help-panel";

/**
 * Proptypes for the server endpoints details component.
 */
interface InfoPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    inboundProtocols: InboundProtocolListItemInterface[];
    isSAMLConfigLoading: boolean;
    isOIDCConfigLoading: boolean;
}
export const Info: FunctionComponent<InfoPropsInterface> = (
    props: InfoPropsInterface
): ReactElement => {

    const { inboundProtocols, isOIDCConfigLoading, isSAMLConfigLoading  } = props;
    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);
    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const { t } = useTranslation();
    const [isOIDC, setIsOIDC] = useState<boolean>(false);
    const [isSAML, setIsSAML] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect(() => {
        if (inboundProtocols == undefined) {
            return;
        }

        if (inboundProtocols.length > 0) {
            inboundProtocols.map((protocol) => {
                if (protocol.type == "oauth2") {
                    setIsOIDC(true);
                    setIsLoading(isOIDCConfigLoading);
                } else if (protocol.type == "samlsso") {
                    setIsSAML(true);
                    setIsLoading(isSAMLConfigLoading);
                }
            });
        }
    }, [inboundProtocols]);

    return (
        !isLoading ? (
            <EmphasizedSegment loading={ isLoading } padded="very">
                <Grid className="form-container with-max-width">
                    <Grid.Row>
                        <Grid.Column>
                            <Heading ellipsis as="h4">
                                <strong>
                                    { t("console:develop.features.applications.helpPanel.tabs.start.content." +
                                        "endpoints." + "title") }
                                </strong>
                            </Heading>

                            { t("console:develop.features.applications.helpPanel.tabs.start.content.endpoints." +
                                            "subTitle") }

                            <Divider hidden/>
                            { isOIDC && (
                                <OIDCConfigurations oidcConfigurations={ oidcConfigurations }/>
                            ) }
                            { isOIDC && isSAML ? (
                                <>
                                    <Divider hidden/>
                                    <Divider/>
                                    <Divider hidden/>
                                </>
                            ) : null }
                            { isSAML && (
                                <SAMLConfigurations samlConfigurations={ samlConfigurations }/>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden/>
                <Divider hidden/>
                <Grid className="form-container with-max-width">
                    <Grid.Row>
                        <Grid.Column>
                            <Heading ellipsis as="h4">
                                <strong>
                                    Try out application
                                </strong>
                            </Heading>
                            <AddUserStepContent/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>
        )
        : <ContentLoader/>
    );
};
