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
import { AnimatedAvatar, EmphasizedSegment, Heading, Text } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider, Grid } from "semantic-ui-react";
import { FeatureConfigInterface } from "../../../../core";
import { ProtocolCard } from "../../../../core/components";
import { getInboundProtocolLogos } from "../../../configs";
import { SAMLConfigModes, SupportedAuthProtocolTypes } from "../../../models";
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
    setSAMLProtocol: (protocol: SAMLConfigModes) => void;
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
        setSAMLProtocol,
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

        availableProtocols.map(
            (protocol: string)=> {
                if (protocol !== SupportedAuthProtocolTypes.OIDC && protocol !== SupportedAuthProtocolTypes.SAML
                 && protocol !== SupportedAuthProtocolTypes.WS_FEDERATION) {
                    const protocolContent: ProtocolContentInterface = {
                        description: protocol,
                        image: <AnimatedAvatar
                            name={ protocol }
                            size="tiny"
                            data-testid={ `${ testId }-item-image-inner` }
                        />,
                        name: protocol,
                        protocol: protocol
                    };

                    protocolContentList.push(protocolContent);
                }

            });

        return protocolContentList;
    };

    const resolveContent = (): ReactElement => {

        const protocolContentList: ProtocolContentInterface[] = resolveProtocols();

        return (
            <Grid.Row className="protocol-selection-wrapper check" textAlign="center">
                <Grid.Column width={ 16 }>
                    <div data-testid={ testId }>
                        <Heading as="h2" className="mb-1" compact>
                            { t("console:develop.features.applications.edit.sections.access.protocolLanding.heading") }
                        </Heading>
                        <Text muted>
                            {
                                t("console:develop.features.applications.edit.sections.access" +
                                    ".protocolLanding.subHeading")
                            }
                        </Text>
                        <Divider hidden/>
                        {
                            (!isEmpty(protocolContentList) && Array.isArray(protocolContentList)
                                && protocolContentList.length > 0) && (
                                <Card.Group
                                    centered
                                    className="tech-selection-cards mt-3"
                                    itemsPerRow={ 9 }
                                >
                                    {
                                        protocolContentList.map((protocol: ProtocolContentInterface, index: number) => (
                                            <ProtocolCard
                                                key={ index }
                                                raised={ false }
                                                data-testid={
                                                    protocol[ "data-testid" ]
                                                    ?? `technology-card-${ kebabCase(protocol.name) }`
                                                }
                                                onClick={
                                                    protocol.protocol === SupportedAuthProtocolTypes.SAML ?
                                                        setSAMLProtocol : () =>  setProtocol(protocol.protocol) }
                                                displayName={ protocol.name }
                                                overlayOpacity={ 0.6 }
                                                image={ protocol.image }
                                                className={ "protocol-card" }
                                                showOption={ protocol.protocol === SupportedAuthProtocolTypes.SAML }
                                            />
                                        ))
                                    }
                                </Card.Group>
                            )
                        }
                    </div>
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <EmphasizedSegment
            basic
            data-testid={ testId }
        >
            <Grid>
                { resolveContent() }
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
