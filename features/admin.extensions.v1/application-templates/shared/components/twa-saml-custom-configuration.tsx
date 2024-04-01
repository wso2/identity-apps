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
import { useSelector } from "react-redux";
import { Card, Form, Grid } from "semantic-ui-react";
import { SAMLApplicationConfigurationInterface } from "../../../../admin-applications-v1/models";
import { AppState, EventPublisher } from "../../../../admin-core-v1";

type TechnologyArrayPropsInterface = {
    techIcon: GenericIconProps;
    techIconTitle?: string;
}

interface TWASAMLCustomConfigurationPropsInterface extends IdentifiableComponentInterface {
    icons: Array<GenericIconProps["icon"]> | TechnologyArrayPropsInterface[];
    documentationLink: string;
    onTriggerTabUpdate: (tabIndex: number) => void;
    infoTabIndex: number;
    protocolTabIndex: number;
    inboundProtocolConfig: any;
}

interface CustomConfigInterface {
    issuer: string;
    acsUrl: string;
    idpEntityId: string;
    idpUrl: string;
}

/**
 * Traditional SAML web application quick start custom configuration.
 *
 * @param props - Props injected to the component.
 * @returns Traditional SAML web application quick start custom configuration component component.
 */
export const TraditionalSAMLWebApplicationCustomConfiguration: FC<TWASAMLCustomConfigurationPropsInterface> = (
    props: TWASAMLCustomConfigurationPropsInterface
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

    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);

    const [ isConfigOpen, setConfigOpen ] = useState<boolean>(true);
    const [ sdkConfig, setSdkConfig ] = useState<CustomConfigInterface>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Runs when `inboundProtocolConfig` changes and sets the SDK init configs.
     */
    useEffect(() => {
        if (!inboundProtocolConfig?.saml) {
            return;
        }
    
        const configs: CustomConfigInterface = {
            acsUrl: inboundProtocolConfig.saml.defaultAssertionConsumerUrl,
            idpEntityId: samlConfigurations?.issuer,
            idpUrl: samlConfigurations?.ssoUrl,
            issuer: inboundProtocolConfig.saml.issuer
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
                                            ".twa.saml.customConfig.issuer")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.issuer }
                                        data-componentid={ `${ componentId }-client-id-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".twa.saml.customConfig.acsUrl")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.acsUrl }
                                        data-componentid={ `${ componentId }-base-url-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".twa.saml.customConfig.idpEntityId")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.idpEntityId }
                                        data-componentid={ `${ componentId }-redirect-url-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                            ".twa.saml.customConfig.idpUrl")
                                        }
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.idpUrl }
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
                            ".twa.saml.customConfig.heading"
                        }
                    >
                        You can discover  
                        <DocumentationLink
                            link={ documentationLink }
                            showEmptyLinkText
                        >
                            SAML configurations
                        </DocumentationLink> to integrate Asgardeo with any traditional web application.
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
                    { t("extensions:console.application.quickStart.twa.common.orAnyTechnology") }
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
