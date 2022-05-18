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
import { Heading, MessageWithIcon } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../../constants";
import {
    ApplicationTemplateListItemInterface,
    DefaultTemplateGroupIds,
    SupportedAuthProtocolTypes
} from "../../../models";

/**
 * Prop types for the component.
 */
interface GenericMinimalWizardFormHelpPropsInterface extends TestableComponentInterface {
    /**
     * Template ID.
     */
    template: ApplicationTemplateListItemInterface;
    /**
     * Template ID.
     */
    parentTemplate?: ApplicationTemplateListItemInterface;
}

/**
 * Generic Help component for the minimal template wizard form.
 * TODO: Move these to a `mdx` file or something similar.
 *
 * @param {GenericMinimalWizardFormHelpPropsInterface} props Props to be injected into the component.
 */
export const GenericMinimalWizardFormHelp: FunctionComponent<GenericMinimalWizardFormHelpPropsInterface> = (
    props: GenericMinimalWizardFormHelpPropsInterface
): ReactElement => {

    const {
        parentTemplate,
        template,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Resolves to teh right help panel content.
     *
     * @return {ReactElement} The appropriate help content.
     */
    const resolveHelpContent = (): ReactElement => {
        switch (template.id) {
            case ApplicationManagementConstants.TEMPLATE_IDS.get("box"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("oidcMobile"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("samlWeb"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("spa"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("slack"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("windowsDesktop"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("workday"):
            case ApplicationManagementConstants.TEMPLATE_IDS.get("zoom"):
                return (
                    <div data-testid={ testId }>
                        <Heading as="h5">Name</Heading>
                        <p>Provide a unique name for the application so that it can be easily identified.</p>
                        <p>E.g. Zoom, Salesforce, etc.</p>

                        {
                            (parentTemplate.id === DefaultTemplateGroupIds.WEB_APPLICATION) && (
                                <>
                                    <Divider/>
                                    <Heading as="h5">Protocol</Heading>
                                    <p>
                                        The access configuration protocol which will be used to SSO (single sign-on) to
                                        the
                                        application.
                                    </p>
                                    <MessageWithIcon
                                        type="info"
                                        content={
                                            <>
                                                <a href="#" target="_blank">
                                                    Click here
                                                </a>{ " " }
                                                to learn more about supported protocols for agent-based single sign-on.
                                            </>
                                        }
                                    />
                                </>
                            )
                        }

                        <Divider/>

                        {
                            (template.authenticationProtocol === SupportedAuthProtocolTypes.OIDC) && (
                                <>
                                    <Heading as="h5">Authorized redirect URIs</Heading>
                                    <p>
                                        After user sign-in/sign-out, the user is redirected to a web page within
                                        your application. Add the list of possible redirect URLs here. You can
                                        specify multiple valid URLs. Make sure to specify the protocol (https://)
                                        otherwise the redirect may fail in some cases.
                                    </p>
                                    <p>E.g. https://sample.app/login</p>

                                    <p>
                                        You can also configure this field later under the <strong>Protocol </strong>
                                        tab in application-edit view.
                                    </p>
                                </>
                            )
                        }
                        {
                            (template.authenticationProtocol === SupportedAuthProtocolTypes.SAML) && (
                                <>
                                    <Heading as="h5">Issuer</Heading>
                                    <p>
                                        This is the saml:Issuer element that contains the unique identifier of the
                                        service
                                        provider. This is also the issuer value specified in the SAML Authentication
                                        Request
                                        issued by the service provider.
                                    </p>
                                    <p>E.g. saml2-web-app-travelocity.com</p>

                                    <Divider/>

                                    <Heading as="h5">Assertion consumer URLs</Heading>
                                    <p>
                                        This is the URL to which the browser should be redirected to after the
                                        authentication is
                                        successful. This is the Assertion Consumer Service (ACS) URL of the service
                                        provider.
                                    </p>
                                    <p>E.g. http://localhost:8080/travelocity.com/home.jsp</p>
                                </>
                            )
                        }
                    </div>
                );
            default:
                return null;
        }
    };

    return resolveHelpContent();
};

/**
 * Default props for the component
 */
GenericMinimalWizardFormHelp.defaultProps = {
    "data-testid": "generic-minimal-wizard-form-help"
};
