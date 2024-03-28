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
    Code,
    CopyInputField,
    DocumentationLink,
    GenericIcon,
    GenericIconProps,
    Heading,
    Hint,
    Link,
    Message,
    Popup,
    SegmentedAccordion,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card, Divider, Form, Grid, Icon } from "semantic-ui-react";
import { OIDCApplicationConfigurationInterface } from "../../../../features/applications/models";
import { AppState, EventPublisher } from "../../../../features/core";

const DEFAULT_REQUESTED_SCOPES: string = "openid profile";

type TechnologyArrayPropsInterface = {
    techIcon: GenericIconProps;
    techIconTitle?: string;
}

interface MobileCustomConfigurationPropsInterface extends IdentifiableComponentInterface {
    icons: Array<GenericIconProps["icon"]> | TechnologyArrayPropsInterface[];
    documentationLink: string;
    onTriggerTabUpdate: (tabIndex: number) => void;
    infoTabIndex: number;
    protocolTabIndex: number;
    inboundProtocolConfig: any;
}

interface CustomConfigInterface {
    clientId: string;
    discoveryUrl: string;
    scope: string;
    redirectUrl: string[];
}

/**
 * Mobile application quick start custom configuration.
 *
 * @param props - Props injected to the component.
 * @returns Mobile application quick start custom configuration component component.
 */
export const MobileCustomConfiguration: FC<MobileCustomConfigurationPropsInterface> = (
    props: MobileCustomConfigurationPropsInterface
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

    const { getLink } = useDocumentation();

    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);

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
            clientId: inboundProtocolConfig.oidc.clientId,
            discoveryUrl: oidcConfigurations?.wellKnownEndpoint,
            redirectUrl: configuredCallbacks,
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
                                Protocol
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
                                            t("applications:confirmations." +
                                                "clientSecretHashDisclaimer.forms.clientIdSecretForm.clientId.label")
                                        }
                                        <Hint className="mt-0 mb-0" popup>
                                            {
                                                t("extensions:develop.applications.quickstart.spa.integrate" +
                                                    ".common.sdkConfigs.clientId.hint")
                                            }
                                        </Hint>
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.clientId }
                                        data-componentid={ `${ componentId }-client-id-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:develop.applications.quickstart.mobileApp" +
                                                ".configurations.redirectURI.label")
                                        }
                                        <Hint
                                            popup
                                            popupOptions={ {
                                                wide: true
                                            } }
                                            warning={ sdkConfig?.redirectUrl?.length > 1 }
                                            className="mt-0 mb-0"
                                        >
                                            {
                                                (sdkConfig?.redirectUrl?.length > 1) && (
                                                    <>
                                                        <Message attached="top" warning>
                                                            <Icon name="warning sign" />
                                                            {
                                                                t("extensions:develop.applications.quickstart" +
                                                                    ".spa.integrate.common.sdkConfigs." +
                                                                    "signInRedirectURL.hint.multipleWarning")
                                                            }
                                                        </Message>
                                                        <Divider hidden />
                                                    </>
                                                )
                                            }
                                            <Trans
                                                i18nKey={
                                                    "extensions:develop.applications.quickstart.spa.integrate.common" +
                                                        ".sdkConfigs.signInRedirectURL.hint.content"
                                                }
                                            >
                                                The URL that determines where the authorization 
                                                code is sent to upon user authentication.
                                                <Divider hidden />
                                                If your application is hosted on a different URL, go to the 
                                                <Link
                                                    link={ `#tab=${ protocolTabIndex }` }
                                                    target="_self"
                                                    external={ false }
                                                >
                                                    Protocol
                                                </Link> 
                                                tab and configure the correct URL from the
                                                <Code>
                                                    Authorized redirect URLs
                                                </Code> 
                                                field.
                                            </Trans>
                                        </Hint>
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.redirectUrl.join(", ").toString() }
                                        data-testid={ `${ componentId }-redirect-url-readonly-input` }
                                        className="mt-2"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:develop.applications.quickstart.mobileApp" +
                                            ".configurations.discoveryURI.label")
                                        }
                                        <Hint className="mt-0 mb-0" popup>
                                            {
                                                t("extensions:develop.applications.quickstart.mobileApp" +
                                                ".configurations.discoveryURI.info")
                                            }
                                        </Hint>
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.discoveryUrl }
                                        data-componentid={ `${ componentId }-redirect-url-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:develop.applications.quickstart.mobileApp" +
                                                ".configurations.scope.label")
                                        }
                                        <Hint className="mt-0 mb-0" popup>
                                            <Trans
                                                i18nKey={
                                                    "extensions:develop.applications.quickstart" +
                                                    ".spa.integrate.common.sdkConfigs.scope.hint"
                                                }
                                            >
                                                These are the set of scopes that are used to request
                                                user attributes.
                                                <Divider hidden />
                                                If you need to add more scopes other than <Code>openid</Code> &
                                                <Code>profile</Code>, you can append them to the array.
                                                <Divider hidden />
                                                Read through our 
                                                <Link
                                                    link={
                                                        getLink("develop.applications.editApplication.oidcApplication" +
                                                            ".quickStart.applicationScopes.learnMore")
                                                    }>documentation
                                                </Link>
                                                to learn  more.
                                            </Trans>
                                        </Hint>
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
            <Card.Content textAlign="left">
                <Text muted>
                    <Trans
                        i18nKey={
                            "extensions:develop.applications.quickstart" +
                            ".mobileApp.configurations.heading"
                        }
                    >
                        Follow 
                        <DocumentationLink
                            link={ documentationLink }
                            showEmptyLinkText
                        >
                            this guide
                        </DocumentationLink> to learn the OIDC Authorization Code Flow with PKCE 
                        and use below details to configure any third-party OIDC SDK 
                        for mobile applications.
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
                    { t("extensions:develop.applications.quickstart.mobileApp.configurations.anyTechnology") }
                </div>
            </Card.Content>
            <Card.Content>
                <SegmentedAccordion
                    fluid
                    data-componentid={ `${ componentId }-accordion` }
                >
                    <SegmentedAccordion.Title
                        active={ isConfigOpen }
                        data-componentid={ `${ componentId }-headings-accordion-item` }
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
                        data-componentid={ `${ componentId }-headings-accordion-content` }
                        className="spa-config-accordion-content"
                    >
                        { renderConfigurationFields() }
                    </SegmentedAccordion.Content>
                </SegmentedAccordion>
            </Card.Content>
        </Card>
    );
};
