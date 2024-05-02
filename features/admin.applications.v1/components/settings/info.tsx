/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface, LoadableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Link,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { AppConstants, AppState, history } from "../../../admin.core.v1";
import { applicationConfig } from "../../../admin.extensions.v1";
import { ApplicationManagementConstants } from "../../constants";
import CustomApplicationTemplate
    from "../../data/application-templates/templates/custom-application/custom-application.json";
import SinglePageApplication
    from "../../data/application-templates/templates/single-page-application/single-page-application.json";
import {
    InboundProtocolListItemInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "../../models";
import { MTLSOIDCConfigurations, OIDCConfigurations, SAMLConfigurations } from "../help-panel";
import { WSFederationConfigurations } from "../help-panel/ws-fed-configurations";

/**
 * Proptypes for the server endpoints details component.
 */
interface InfoPropsInterface extends LoadableComponentInterface, IdentifiableComponentInterface {
    /**
     *  Currently configured inbound protocols.
     */
    inboundProtocols: InboundProtocolListItemInterface[];
    /**
     * Is the SAML configuration still loading.
     */
    isSAMLConfigLoading: boolean;
    /**
     * Is the OIDC configuration still loading.
     */
    isOIDCConfigLoading: boolean;
    /**
     * Id of the application template
     */
    templateId: string;
    /**
     * Application id.
     */
    appId: string;
}

/**
 * Component to include server endpoints details of the application.
 *
 * @param props - Props injected to the component.
 *
 * @returns Info tab component.
 */
export const Info: FunctionComponent<InfoPropsInterface> = (
    props: InfoPropsInterface
): ReactElement => {

    const {
        appId,
        inboundProtocols,
        isOIDCConfigLoading,
        isSAMLConfigLoading,
        templateId,
        [ "data-componentid" ]: componentId
    } = props;

    const oidcConfigurations: OIDCApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.oidcConfigurations);
    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state.application.samlConfigurations);
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const [ isOIDC, setIsOIDC ] = useState<boolean>(false);
    const [ isSAML, setIsSAML ] = useState<boolean>(false);
    const [ isWSFed, setIsWSFed ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const mtlsEndpointsPresent: boolean = oidcConfigurations.mtlsTokenEndpoint !== undefined;

    /**
     * Index of the protocols tab.
     */
    const PROTOCOLS_TAB_INDEX: number = 1;

    useEffect(() => {
        if (inboundProtocols == undefined) {
            return;
        }

        if (inboundProtocols.length > 0) {
            inboundProtocols.map((protocol: InboundProtocolListItemInterface) => {
                if (protocol.type == "oauth2") {
                    setIsOIDC(true);
                    setIsLoading(isOIDCConfigLoading);
                }
                if (protocol.type == "samlsso") {
                    setIsSAML(true);
                    setIsLoading(isSAMLConfigLoading);
                }
                if (protocol.type == "passivests") {
                    setIsWSFed(true);
                }
            });
        }
    }, [ inboundProtocols ]);

    useEffect(() => {
        if (templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS) {
            setIsWSFed(true);
        }
    }, [ templateId ]);

    return (
        !isLoading
            ? (
                <EmphasizedSegment loading={ isLoading } padded="very" data-testid={ componentId }>
                    <Grid className="form-container with-max-width">
                        <Grid.Row>
                            <Grid.Column>

                                { (isOIDC || templateId === CustomApplicationTemplate.id
                                || templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC) && (
                                    <>
                                        <Heading ellipsis as="h4">
                                            { t("applications:edit.sections.info." +
                                            "oidcHeading") }
                                        </Heading>
                                        <Heading as="h6" color="grey" compact>
                                            { t("applications:edit.sections.info." +
                                            "oidcSubHeading") }
                                            <DocumentationLink
                                                link={ templateId === SinglePageApplication.id
                                                    ? getLink("develop.applications.editApplication." +
                                                    "singlePageApplication.info.learnMore")
                                                    : getLink("develop.applications.editApplication." +
                                                    "oidcApplication.info.learnMore") }
                                            >
                                                { t("common:learnMore") }
                                            </DocumentationLink>
                                        </Heading>
                                        <Divider hidden/>
                                        <OIDCConfigurations
                                            oidcConfigurations={ oidcConfigurations }
                                            templateId={ templateId }
                                        />

                                        { applicationConfig.advancedConfigurations.showMtlsAliases &&
                                        mtlsEndpointsPresent && (
                                            <>
                                                <Heading ellipsis as="h4">
                                                    { t("applications:edit.sections.info.mtlsOidcHeading") }
                                                </Heading>
                                                <Heading as="h6" color="grey" compact>
                                                    { t("applications:edit.sections.info.mtlsOidcSubHeading") }
                                                    Navigate to
                                                    <Link
                                                        external={ false }
                                                        onClick={ () => {
                                                            history.push(
                                                                AppConstants.getPaths()
                                                                    .get("APPLICATION_SIGN_IN_METHOD_EDIT")
                                                                    .replace(":id", appId)
                                                                    .replace(
                                                                        ":tabName",
                                                                        `#tab=${ PROTOCOLS_TAB_INDEX }`
                                                                    )
                                                            );
                                                        } }
                                                    > protocol </Link>
                                                    tab to configure MTLS and certificate token binding.
                                                </Heading>
                                                <Divider hidden/>
                                                <MTLSOIDCConfigurations
                                                    oidcConfigurations={ oidcConfigurations }
                                                    templateId={ templateId }
                                                />
                                            </>
                                        ) }
                                    </>
                                ) }
                                { isOIDC && isSAML ? (
                                    <>
                                        <Divider className="x2" hidden/>
                                    </>
                                ) : null }
                                { (isSAML || templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) && (
                                    <>
                                        <Heading ellipsis as="h4">
                                            { t("applications:edit.sections.info." +
                                            "samlHeading") }
                                        </Heading>
                                        <Heading as="h6" color="grey" compact>
                                            { t("applications:edit.sections.info." +
                                            "samlSubHeading") }
                                            <DocumentationLink
                                                link={ getLink("develop.applications.editApplication." +
                                                "samlApplication.info.learnMore") }
                                            >
                                                { t("common:learnMore") }
                                            </DocumentationLink>
                                        </Heading>
                                        <Divider hidden/>
                                        <SAMLConfigurations samlConfigurations={ samlConfigurations }/>
                                    </>
                                ) }
                                {
                                    isWSFed && (
                                        <>
                                            <Heading ellipsis as="h4">
                                                { t("applications:edit.sections.info." +
                                                "wsFedHeading") }
                                            </Heading>
                                            <Heading as="h6" color="grey" compact>
                                                { t("applications:edit.sections.info." +
                                                "wsFedSubHeading") }
                                                <DocumentationLink
                                                    link={ getLink("develop.applications.editApplication." +
                                                    "wsFedApplication.info.learnMore") }
                                                >
                                                    { t("common:learnMore") }
                                                </DocumentationLink>
                                            </Heading>
                                            <Divider hidden/>
                                            <WSFederationConfigurations/>
                                        </>
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>
            ) :
            (
                <EmphasizedSegment padded="very">
                    <ContentLoader inline="centered" active/>
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for the server endpoints details component.
 */
Info.defaultProps = {
    "data-componentid": "application-server-endpoints"
};
