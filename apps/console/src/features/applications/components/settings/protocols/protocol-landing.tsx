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

import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, GenericIcon, Heading, InfoCard, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../../core";
import { getInboundProtocolLogos } from "../../../configs";
import { SupportedAuthProtocolTypes } from "../../../models";
import { ApplicationManagementUtils } from "../../../utils";


/**
 * Proptypes for the sign in methods landing component.
 */
interface ProtocolContentInterface {
    image: any;
    name: string;
    description: string;
    protocol: string;
}

/**
 * Proptypes for the sign in methods landing component.
 */
interface ProtocolLandingPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to set the selected login flow option.
     */
    setProtocol: (protocol: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Make the form read only.
     */
    availableProtocols?: string[];
}

/**
 * Landing component for Application Sign-in method configurations.
 *
 * @param {SignInMethodLandingPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ProtocolLanding: FunctionComponent<ProtocolLandingPropsInterface> = (
    props: ProtocolLandingPropsInterface
): ReactElement => {

    const {
        setProtocol,
        availableProtocols,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const resolveProtocols = (): ProtocolContentInterface[] => {
        const protocolContentList: ProtocolContentInterface[] = [];
        if (availableProtocols.includes(SupportedAuthProtocolTypes.OIDC)) {
            const protocolContent: ProtocolContentInterface = {
                description: ApplicationManagementUtils.resolveProtocolDescription(SupportedAuthProtocolTypes.OIDC),
                image: getInboundProtocolLogos().oidc,
                name: ApplicationManagementUtils.resolveProtocolDisplayName(SupportedAuthProtocolTypes.OIDC),
                protocol: SupportedAuthProtocolTypes.OIDC
            };
            protocolContentList.push(protocolContent);
        }
        if (availableProtocols.includes(SupportedAuthProtocolTypes.SAML)) {
            const protocolContent: ProtocolContentInterface = {
                description: "XML-based open security standard framework",
                image: getInboundProtocolLogos().saml,
                name: ApplicationManagementUtils.resolveProtocolDisplayName(SupportedAuthProtocolTypes.SAML),
                protocol: SupportedAuthProtocolTypes.SAML
            };
            protocolContentList.push(protocolContent);
        }
        if (availableProtocols.includes(SupportedAuthProtocolTypes.WS_FEDERATION)) {
            const protocolContent: ProtocolContentInterface = {
                description: ApplicationManagementUtils.resolveProtocolDescription(
                    SupportedAuthProtocolTypes.WS_FEDERATION),
                image: getInboundProtocolLogos()["passive-sts"],
                name: ApplicationManagementUtils.resolveProtocolDisplayName(SupportedAuthProtocolTypes.WS_FEDERATION),
                protocol: SupportedAuthProtocolTypes.WS_FEDERATION
            };
            protocolContentList.push(protocolContent);
        }
        return protocolContentList;
    };

    const resolveContent = (): ReactElement => {
        const protocolContentList: ProtocolContentInterface[] = resolveProtocols();
        return (
            <>
                {
                    protocolContentList.length === 2 ?
                        <Grid.Column
                            computer={ 3 }
                            tablet={ 16 }
                            mobile={ 16 }
                        /> :
                        <div className={ "ml-5" }/>
                }
                {

                    protocolContentList.map((protocol: ProtocolContentInterface, index) => (
                        <Grid.Column
                            computer={ 5 }
                            tablet={ 16 }
                            mobile={ 16 }
                            key={ index }
                        >
                            <InfoCard
                                fluid
                                data-testid={ `${testId}-${protocol.protocol}` }
                                image={ protocol.image }
                                imageSize="mini"
                                header={
                                    protocol.name
                                }
                                description={
                                    protocol.description
                                }
                                onClick={ () => {
                                    setProtocol(protocol.protocol);
                                } }
                            />
                            <Divider hidden/>
                        </Grid.Column>
                    ))
                }
            </>
        );

    };

    return (
        <EmphasizedSegment
            basic
            data-testid={ testId }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column
                        computer={ 16 }
                        tablet={ 16 }
                        mobile={ 16 }
                        className="default-config-column"
                        textAlign="center"
                    >
                        <div className={ "protocol-landing-title" }>
                            <GenericIcon
                                transparent
                                icon={ getInboundProtocolLogos().general }
                                size="small"
                            />
                            <Divider hidden/>

                            <div className="default-config-description">
                                <Heading as="h3">
                                    Which protocol you are using?
                                </Heading>
                                <div className="default-config-description-content">
                                    <Text subHeading muted>
                                        select the protocol for your applications to connect.
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row
                    computer={ 16 }
                    tablet={ 16 }
                    mobile={ 16 }
                >
                    { resolveContent() }
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the Application protocol landing component.
 */
ProtocolLanding.defaultProps = {
    "data-testid": "protocol-landing"
};
