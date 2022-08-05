/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { Code, Hint, Link, Message, MessageWithIcon, useDocumentation } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, DropdownItemProps, DropdownProps, Form, Icon, Table } from "semantic-ui-react";
import { IntegrateStepGeneratorFactory } from "./integrate-step-generator-factory";
import {
    ApplicationInterface,
    ApplicationTemplateInterface
} from "../../../../../features/applications";
import { AppState, ConfigReducerStateInterface } from "../../../../../features/core";
import { Config } from "../../../../../features/core/configs";
import { SDKInitConfig } from "../../../shared";
import { AddUserStepContent } from "../../../shared/components";
import { SupportedSPATechnologyTypes } from "../models";

/**
 * Interface for the SDK Integration component.
 */
interface IntegrateSDKsPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    technology: SupportedSPATechnologyTypes;
    template: ApplicationTemplateInterface;
    inboundProtocolConfig: any;
}

/**
 * Index of the protocol tab.
 */
const PROTOCOL_TAB_INDEX = 2;

/**
 * The set of scopes requested to have a smooth UX. If `profile` is not requested, the `username` etc.
 * claims will not return with the ID Token.
 */
const DEFAULT_REQUESTED_SCOPES: string[] = [ "openid", "profile" ];

/**
 * Integrate SDKs to Single Page Applications.
 *
 * @param {IntegrateSDKsPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
export const IntegrateSDKs: FunctionComponent<IntegrateSDKsPropsInterface> = (
    props: IntegrateSDKsPropsInterface
): ReactElement => {

    const {
        inboundProtocolConfig,
        technology,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ SDKInitConfig, setSDKInitConfig ] = useState<SDKInitConfig>(undefined);
    const [ configuredCallbacks, setConfiguredCallbacks ] = useState<DropdownItemProps[]>([]);
    const [ selectedLoginCallBack, setSelectedLoginCallBack ] = useState<string>("");
    const [ selectedLogoutCallBack, setSelectedLogoutCallBack ] = useState<string>("");

    /**
     * Runs when `inboundProtocolConfig` changes and sets the callback URLs.
     */
    useEffect(() => {

        if (!inboundProtocolConfig?.oidc?.callbackURLs
            || !Array.isArray(inboundProtocolConfig.oidc.callbackURLs)
            || inboundProtocolConfig.oidc.callbackURLs.length < 1) {

            return;
        }

        const callbacks: string[] = EncodeDecodeUtils.decodeURLRegex(inboundProtocolConfig.oidc.callbackURLs[ 0 ]);

        if (callbacks && Array.isArray(callbacks) && callbacks.length > 1) {
            callbacks.forEach((url: string) => {
                setConfiguredCallbacks((prevItems) => [
                    ...prevItems,
                    {
                        key: url,
                        text: url,
                        value: url
                    }
                ]);
            });

            setSelectedLoginCallBack(callbacks[0]);
            setSelectedLogoutCallBack(callbacks[0]);
        }
    }, [ inboundProtocolConfig ]);

    /**
     * Runs when `inboundProtocolConfig` changes and sets the SDK init configs.
     */
    useEffect(() => {
        if (!inboundProtocolConfig?.oidc) {
            return;
        }

        const configs = {
            clientID: inboundProtocolConfig.oidc.clientId,
            scope: DEFAULT_REQUESTED_SCOPES,
            baseUrl: Config.getDeploymentConfig().serverHost,
            signInRedirectURL: (configuredCallbacks.length > 1)
                ? selectedLoginCallBack
                : inboundProtocolConfig.oidc.callbackURLs[ 0 ],
            signOutRedirectURL: (configuredCallbacks.length > 1)
                ? selectedLogoutCallBack
                : inboundProtocolConfig.oidc.callbackURLs[ 0 ]
        };

        setSDKInitConfig(configs);
    }, [ inboundProtocolConfig, configuredCallbacks, selectedLoginCallBack, selectedLogoutCallBack ]);

    const renderConfigurationOptions = (heading: ReactNode): ReactElement => {

        if (isEmpty(SDKInitConfig)) {
            return null;
        }

        return  (
            <Message>
                { heading }
                <div>
                    <Table basic="very" celled collapsing>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Code>clientID</Code>
                                    <Hint popup>
                                        {
                                            t("extensions:develop.applications.quickstart.spa.integrate" +
                                                ".common.sdkConfigs.clientId.hint")
                                        }
                                    </Hint>
                                </Table.Cell>
                                <Table.Cell>
                                    <Code withBackground={ false }>
                                        { SDKInitConfig.clientID }
                                    </Code>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Code>baseUrl</Code>
                                    <Hint popup>
                                        {
                                            t("extensions:develop.applications.quickstart.spa.integrate" +
                                                ".common.sdkConfigs.serverOrigin.hint")
                                        }
                                    </Hint>
                                </Table.Cell>
                                <Table.Cell>
                                    <Code withBackground={ false }>
                                        { SDKInitConfig.baseUrl }
                                    </Code>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Code>signInRedirectURL</Code>
                                    <Hint
                                        popup
                                        popupOptions={ {
                                            wide: true
                                        } }
                                        warning={ configuredCallbacks.length > 1 }
                                    >
                                        {
                                            (configuredCallbacks.length > 1) && (
                                                <>
                                                    <Message attached="top" warning>
                                                        <Icon name="warning sign" />
                                                        {
                                                            t("extensions:develop.applications.quickstart" +
                                                                ".spa.integrate.common.sdkConfigs.signInRedirectURL" +
                                                                ".hint.multipleWarning")
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
                                            The URL that determines where the authorization code is sent to upon user
                                            authentication.

                                            <Divider hidden />

                                            If your application is hosted on a different URL, go to the <Link
                                                link={ `#tab=${ PROTOCOL_TAB_INDEX }` }
                                                target="_self"
                                                external={ false }
                                            >
                                                protocol
                                            </Link> tab and configure the correct URL from the <Code>
                                            Authorized redirect URLs</Code> field.
                                        </Trans>
                                    </Hint>
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        (configuredCallbacks.length > 1)
                                            ? (
                                                <>
                                                    <Form.Select
                                                        fluid
                                                        onChange={
                                                            (
                                                                value: SyntheticEvent<HTMLElement>,
                                                                data: DropdownProps
                                                            ) => {
                                                                setSelectedLoginCallBack(data.value as string);
                                                            }
                                                        }
                                                        defaultValue={ configuredCallbacks[0].value }
                                                        options={ configuredCallbacks }
                                                    />
                                                </>
                                            )
                                            : (
                                                <Code withBackground={ false }>
                                                    { SDKInitConfig.signInRedirectURL }
                                                </Code>
                                            )
                                    }
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Code>signOutRedirectURL</Code>
                                    <Hint
                                        popup
                                        popupOptions={ {
                                            wide: true
                                        } }
                                        warning={ configuredCallbacks.length > 1 }
                                    >
                                        {
                                            (configuredCallbacks.length > 1) && (
                                                <>
                                                    <Message attached="top" warning>
                                                        <Icon name="warning sign" />
                                                        {
                                                            t("extensions:develop.applications.quickstart" +
                                                                ".spa.integrate.common.sdkConfigs.signOutRedirectURL" +
                                                                ".hint.multipleWarning")
                                                        }
                                                    </Message>
                                                    <Divider hidden />
                                                </>
                                            )
                                        }

                                        <Trans
                                            i18nKey={
                                                "extensions:develop.applications.quickstart.spa.integrate.common" +
                                                ".sdkConfigs.signOutRedirectURL.hint.content"
                                            }
                                        >
                                            The URL that determines where the user is redirected to upon logout.

                                            <Divider hidden />

                                            If your application is hosted on a different URL, go to the <Link
                                                link={ `#tab=${ PROTOCOL_TAB_INDEX }` }
                                                target="_self"
                                                external={ false }
                                            >
                                                protocol
                                            </Link> tab and configure the correct URL from the <Code>
                                            Authorized redirect URLs</Code> field.
                                        </Trans>
                                    </Hint>
                                </Table.Cell>
                                <Table.Cell>
                                    {
                                        (configuredCallbacks.length > 1)
                                            ? (
                                                <Form.Select
                                                    fluid
                                                    onChange={
                                                        (value: SyntheticEvent<HTMLElement>, data: DropdownProps) => {
                                                            setSelectedLogoutCallBack(data.value as string);
                                                        }
                                                    }
                                                    defaultValue={ configuredCallbacks[0].value }
                                                    options={ configuredCallbacks }
                                                    placeholder="Sign-out Redirect URL"
                                                />
                                            )
                                            : (
                                                <Code withBackground={ false }>
                                                    { SDKInitConfig.signOutRedirectURL }
                                                </Code>
                                            )
                                    }
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Code>scope</Code>
                                    <Hint popup>
                                        <Trans
                                            i18nKey={
                                                "extensions:develop.applications.quickstart" +
                                                ".spa.integrate.common.sdkConfigs.scope.hint"
                                            }
                                        >
                                            These are the set of scopes that are used to request
                                            user attributes.
                                            <Divider hidden />
                                            If you need to to add more scopes other than <Code>openid</Code> &
                                            <Code>profile</Code>, you can append them to the array.
                                            <Divider hidden />
                                            Read through our <Link link={
                                                getLink("develop.applications.editApplication.oidcApplication" +
                                                    ".quickStart.applicationScopes.learnMore")
                                            }>documentation</Link> to learn  more.
                                        </Trans>
                                    </Hint>
                                </Table.Cell>
                                <Table.Cell>
                                    <Code withBackground={ false }>
                                        {
                                            `[${
                                                SDKInitConfig?.scope?.map((item: string) => {
                                                return `"${ item }"`;
                                                })
                                            }]`
                                        }
                                    </Code>
                                </Table.Cell>
                            </Table.Row>
                            
                        </Table.Body>
                    </Table>
                </div>
            </Message>
        );
    };

    return (
        <Fragment data-componentid={ componentId }>
            <IntegrateStepGeneratorFactory
                technology={ technology }
                configurationOptions={ (heading: ReactNode) => renderConfigurationOptions(heading) }
                productName={ config.ui.productName }
                sdkConfig={ {
                    clientID: SDKInitConfig?.clientID,
                    scope: SDKInitConfig?.scope,
                    baseUrl: SDKInitConfig?.baseUrl,
                    signInRedirectURL: (configuredCallbacks.length > 1)
                        ? selectedLoginCallBack
                        : SDKInitConfig?.signInRedirectURL,
                    signOutRedirectURL: (configuredCallbacks.length > 1)
                        ? selectedLogoutCallBack
                        : SDKInitConfig?.signOutRedirectURL
                } }
            />
            <Divider hidden className="x2"/>
            <div className="mt-3 mb-6">
                <MessageWithIcon
                    type="info"
                    header={ t("extensions:develop.applications.quickstart.spa.common.addTestUser.title") }
                    content={ <AddUserStepContent/> }
                />
            </div>
        </Fragment>
    );
};

/**
 * Default props for the component
 */
IntegrateSDKs.defaultProps = {
    "data-componentid": "integrate-sdks"
};
