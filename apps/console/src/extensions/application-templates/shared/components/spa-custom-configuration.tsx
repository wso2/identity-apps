/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import {
    CopyInputField,
    DocumentationLink,
    GenericIcon,
    GenericIconProps,
    Heading,
    Popup,
    SegmentedAccordion,
    Text
} from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Card, Form, Grid } from "semantic-ui-react";
import { EventPublisher } from "../../../../features/core";
import { Config } from "../../../../features/core/configs";

const DEFAULT_REQUESTED_SCOPES: string = "openid profile";

type TechnologyArrayPropsInterface = {
    techIcon: GenericIconProps;
    techIconTitle?: string;
}

interface SPACustomConfigurationPropsInterface extends IdentifiableComponentInterface {
    icons: Array<GenericIconProps["icon"]> | TechnologyArrayPropsInterface[];
    documentationLink: string;
    onTriggerTabUpdate: (tabIndex: number) => void;
    infoTabIndex: number;
    protocolTabIndex: number;
    inboundProtocolConfig: any;
}

interface CustomConfigInterface {
    clientId: string;
    baseUrl: string;
    scope: string;
    redirectUrl: string;
}

export const SPACustomConfiguration: FC<SPACustomConfigurationPropsInterface> = (
    props: SPACustomConfigurationPropsInterface
): ReactElement => {

    const {
        icons,
        onTriggerTabUpdate,
        documentationLink,
        infoTabIndex,
        protocolTabIndex,
        inboundProtocolConfig,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ isConfigOpen, setConfigOpen ] = useState<boolean>(true);
    const [ sdkConfig, setSdkConfig ] = useState<CustomConfigInterface>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Runs when `inboundProtocolConfig` changes and sets the SDK init configs.
     */
    useEffect(() => {
        if (!inboundProtocolConfig?.oidc) {
            return;
        }

        const configuredCallbacks: string[] = [];
        
        if (inboundProtocolConfig?.oidc?.callbackURLs.length > 0) {
            const callbacks: string[] = EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ]);
    
            if (callbacks.length > 0) {
                callbacks.forEach((url: string) => {
                    configuredCallbacks.push(url);
                });
            }
        }

        const configs: CustomConfigInterface = {
            baseUrl: Config.getDeploymentConfig().customServerHost,
            clientId: inboundProtocolConfig.oidc.clientId,
            redirectUrl: configuredCallbacks.length > 0 ? configuredCallbacks[0] : null,
            scope: DEFAULT_REQUESTED_SCOPES
        };

        setSdkConfig(configs);
    }, []);

    const onServerEndpointConfigTabClick = (): void => {
        eventPublisher.publish(
            "application-quick-start-visit-info-section"
        );
        onTriggerTabUpdate(infoTabIndex);
    };

    const onProtocolTabClick = (): void => {
        onTriggerTabUpdate(protocolTabIndex);
    };

    const renderConfigurationFields = (): ReactElement => {
        return (
            <>
                <div className="custom-config-message">
                    <Heading as="h6" compact>                     
                        <Trans
                            i18nKey={
                                "extensions:console.application.quickStart" +
                                ".spa.customConfig.protocolConfig"
                            }
                        >
                            Use the following configurations to integrate your application with Asgardeo. 
                            For more details on configurations, go to the 
                            <a
                                className="link pointing"
                                onClick={ onProtocolTabClick }
                            >
                                Protocols
                            </a> tab.
                        </Trans>
                    </Heading>
                </div>
                <Grid className="custom-config-message mt-4 mb-4" >
                    <Grid.Row>
                        <Grid.Column computer={ 14 } widescreen={ 10 }>
                            <Form>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".spa.customConfig.clientId")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.clientId }
                                        data-componentid={ `${ componentId }-client-id-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".spa.customConfig.baseUrl")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.baseUrl }
                                        data-componentid={ `${ componentId }-base-url-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".spa.customConfig.redirectUrl")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.redirectUrl }
                                        data-componentid={ `${ componentId }-redirect-url-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".spa.customConfig.scope")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.scope }
                                        data-componentid={ `${ componentId }-scope-readonly-input` }
                                    />
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <div className="custom-config-message mb-4">
                    <Heading as="h6" compact>
                        <Trans
                            i18nKey={
                                "extensions:console.application.quickStart" +
                                ".spa.customConfig.serverEndpoints"
                            }
                        >
                            Details on the server endpoints are available in the 
                            <a
                                className="link pointing"
                                onClick={ onServerEndpointConfigTabClick }
                            >
                                Info
                            </a> tab.
                        </Trans>
                    </Heading>
                </div>
            </>
        );
    };

    return (
        <Card
            fluid
            className="basic-card no-hover quick-start-custom-config-message no-background"
        >
            <Card.Content textAlign="center">
                <Text muted>
                    <Trans
                        i18nKey={
                            "extensions:console.application.quickStart" +
                            ".spa.customConfig.heading"
                        }
                    >
                        You can implement login using 
                        <DocumentationLink
                            link={ documentationLink }
                            showEmptyLinkText
                        >
                            Authorization Code flow with PKCE
                        </DocumentationLink> with Asgardeo for any SPA technology.
                    </Trans>
                </Text>  
            </Card.Content>
            <Card.Content>
                <div className="tech-array">
                    { icons.map((icon: TechnologyArrayPropsInterface, index: number) => (
                        <Popup
                            basic
                            inverted
                            position="top center"
                            key={ `extended-tech-icon-popup-${ index }` }
                            content={ icon.techIconTitle }
                            trigger={
                                (<div>
                                    <GenericIcon
                                        key={ `extended-tech-icon-${ index }` }
                                        transparent
                                        size="x30"
                                        icon={ icon.techIcon }
                                    />
                                </div>)
                            }
                        />
                    )) }
                </div>
                <div>
                    { t("extensions:console.application.quickStart.spa.customConfig.anySPATechnology") }
                </div>
            </Card.Content>
            <Card.Content>
                <SegmentedAccordion
                    fluid
                    data-componentid={ `${componentId}-accordion` }
                >
                    <SegmentedAccordion.Title
                        active={ isConfigOpen }
                        data-componentid={ `${componentId}-headings-accordion-item` }
                        onClick={ () => setConfigOpen(!isConfigOpen) }
                        className="spa-config-accordion-title"
                    >
                        <Heading as="h5">
                            { t("extensions:console.application.quickStart.spa.customConfig.configurations") }
                        </Heading>
                    </SegmentedAccordion.Title>
                    <SegmentedAccordion.Content
                        secondary={ false }
                        active={ isConfigOpen }
                        data-componentid={ `${componentId}-headings-accordion-content` }
                        className="spa-config-accordion-content"
                    >
                        { renderConfigurationFields() }
                    </SegmentedAccordion.Content>
                </SegmentedAccordion>
            </Card.Content>
        </Card>
    );
};
