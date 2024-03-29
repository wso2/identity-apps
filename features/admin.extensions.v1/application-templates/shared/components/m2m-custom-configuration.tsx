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
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import {
    CodeEditor,
    CopyInputField,
    DocumentationLink,
    GenericIconProps,
    Heading,
    Hint,
    SegmentedAccordion,
    Text
} from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Card, Form, Grid } from "semantic-ui-react";
import useSubscribedAPIResources  from "../../../../admin.applications.v1/api/use-subscribed-api-resources";
import { OIDCApplicationConfigurationInterface } from "../../../../admin.applications.v1/models";
import {
    AuthorizedAPIListItemInterface,
    AuthorizedPermissionListItemInterface
} from "../../../../admin.applications.v1/models/api-authorization";
import { AppState, history } from "../../../../admin.core.v1";

type TechnologyArrayPropsInterface = {
    techIcon: GenericIconProps;
    techIconTitle?: string;
}

interface M2MCustomConfigurationPropsInterface extends IdentifiableComponentInterface {
    icons: Array<GenericIconProps["icon"]> | TechnologyArrayPropsInterface[];
    documentationLink: string;
    onTriggerTabUpdate: (tabIndex: number) => void;
    APIAuthorizationTabIndex: number,
    protocolTabIndex: number;
    inboundProtocolConfig: any;
}

interface CustomConfigInterface {
    clientId: string;
    clientSecret: string;
    tokenEndpoint: string;
}

/**
 * M2M application quick start custom configuration.
 *
 * @param props - Props injected to the component.
 * @returns M2M application quick start custom configuration component component.
 */
export const M2MCustomConfiguration: FC<M2MCustomConfigurationPropsInterface> = (
    props: M2MCustomConfigurationPropsInterface
): ReactElement => {

    const {
        onTriggerTabUpdate,
        documentationLink,
        APIAuthorizationTabIndex,
        protocolTabIndex,
        inboundProtocolConfig,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];

    const {
        data: subscribedAPIResourcesListData
    } = useSubscribedAPIResources(appId);

    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);

    const [ isConfigOpen, setConfigOpen ] = useState<boolean>(true);
    const [ sdkConfig, setSdkConfig ] = useState<CustomConfigInterface>(undefined);
    const [ allAuthorizedScopes, setAllAuthorizedScopes ] = useState<AuthorizedPermissionListItemInterface[]>([]);
    const [ copyScopesValue, setCopyScopesValue ] = useState<string>(null);

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
            clientSecret: inboundProtocolConfig.oidc.clientSecret,
            tokenEndpoint: oidcConfigurations?.tokenEndpoint, 
        };

        setSdkConfig(configs);
    }, []);

    /**
     * Initalize the all authorized scopes.
     */
    useEffect(() => {
        if (subscribedAPIResourcesListData?.length > 0) {
            let authorizedScopes: AuthorizedPermissionListItemInterface[] = [];

            subscribedAPIResourcesListData.forEach((subscribedAPIResource: AuthorizedAPIListItemInterface) => {
                authorizedScopes = authorizedScopes.concat(subscribedAPIResource.authorizedScopes);
            });

            setAllAuthorizedScopes(authorizedScopes);
        }
    }, [ subscribedAPIResourcesListData ]);

    /**
     * Initalize the copy scopes value.
     */
    useEffect(() => {
        if (allAuthorizedScopes) {
            setCopyScopesValue(allAuthorizedScopes.map(
                (scope: AuthorizedPermissionListItemInterface) => scope.name).join(" ")
            );
        }
    }, [ allAuthorizedScopes ]);

    const onAPIAuthorizationTabClick = (): void => {
        onTriggerTabUpdate(APIAuthorizationTabIndex);
    };

    const onProtocolTabClick = (): void => {
        onTriggerTabUpdate(protocolTabIndex);
    };

    let tokenRequest = `curl --location '${sdkConfig?.tokenEndpoint}' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Authorization: Basic '${btoa(sdkConfig?.clientId.concat(":", sdkConfig?.clientSecret))}'' -d 'grant_type=client_credentials'`;
    
    if(copyScopesValue){
        tokenRequest = tokenRequest.concat(` -d 'scope=${copyScopesValue}'`);
    }

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
                                            t("extensions:console.application.quickStart" +
                                            ".twa.oidc.customConfig.clientSecret")
                                        }
                                        <Hint className="mt-0 mb-0" popup>
                                            {
                                                t("extensions:develop.applications.quickstart" +
                                                ".m2m.configurations.clientSecret.hint")
                                            }
                                        </Hint>
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.clientSecret }
                                        data-componentid={ `${ componentId }-base-url-readonly-input` }
                                        secret={ true }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                                ".m2m.customConfig.tokenEndpoint")
                                        }
                                        <Hint className="mt-0 mb-0" popup>
                                            {
                                                t("extensions:develop.applications.quickstart" +
                                                ".m2m.configurations.tokenEndpoint")
                                            }
                                        </Hint>
                                    </label>
                                    <CopyInputField
                                        value={ sdkConfig?.tokenEndpoint }
                                        data-testid={ `${ componentId }-redirect-url-readonly-input` }
                                        className="mt-2"
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
                                                    ".m2m.configurations.scopes"
                                                }
                                            >
                                                These are the set of scopes that are authorized.
                                                If you want to add more scopes, please authorize an API in the
                                                <a
                                                    className="link pointing"
                                                    onClick={ onAPIAuthorizationTabClick }
                                                >
                                                    API Authorization
                                                </a>
                                                tab.
                                            </Trans>
                                        </Hint>
                                    </label>
                                    <CopyInputField
                                        value={ copyScopesValue }
                                        data-componentid={ `${ componentId }-scope-readonly-input` }
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>
                                        {
                                            t("extensions:console.application.quickStart" +
                                              ".m2m.customConfig.tokenRequest")
                                        }
                                        <Hint className="mt-0 mb-0" popup>
                                            {
                                                t("extensions:develop.applications.quickstart" +
                                                ".m2m.configurations.tokenRequest")
                                            }
                                        </Hint> 
                                    </label>
                                    <CodeEditor
                                        oneLiner
                                        readOnly="nocursor"
                                        withClipboardCopy
                                        showLineNumbers={ false }
                                        language="shell"
                                        options={ {
                                            lineWrapping: true
                                        } }
                                        height="100%"
                                        theme="dark"
                                        sourceCode={
                                            tokenRequest
                                        }
                                    />
                                </Form.Field>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
                            ".m2mApp.configurations.heading"
                        }
                    >
                        A Machine-to-Machine Application represents a program that
                        interacts with an API without any user involvement.
                        Execute a { " " }
                        <DocumentationLink
                            link={ documentationLink }
                            showEmptyLinkText
                        >
                            client credentials grant
                        </DocumentationLink> flow to get an access token for authorized APIs.

                    </Trans>
                </Text>
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
