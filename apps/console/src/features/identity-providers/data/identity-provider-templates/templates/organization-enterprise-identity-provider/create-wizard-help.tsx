/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type OrganizationEnterpriseIdentityProviderCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the custom IDP template creation wizard.
 *
 * @param {OrganizationEnterpriseIdentityProviderCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const OrganizationEnterpriseIdentityProviderCreateWizardHelp:
    FunctionComponent<OrganizationEnterpriseIdentityProviderCreateWizardHelpPropsInterface> = (
        props: OrganizationEnterpriseIdentityProviderCreateWizardHelpPropsInterface
    ): ReactElement => {

        const {
            ["data-testid"]: testId
        } = props;

        return (
            <>
                <div data-testid={ testId }>
                    <Heading as="h5">Name</Heading>
                    <p>Provide a unique name for the enterprise authentication provider so that it can be
                    easily identified.</p>
                    <p>E.g., MyOrgEnterpriseAuthProvider.</p>
                </div>

                <Divider/>

                <div data-testid={ testId }>
                    <Heading as="h5">Description</Heading>
                    <p>Provide a description for the enterprise authentication provider to explain more about it.</p>
                    <p>E.g., This is the authenticator for MyOrg, which acts as the IDP for MyApp.</p>
                </div>
            </>
        );
    };

/**
 * Default props for the component
 */
OrganizationEnterpriseIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "organization-enterprise-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OrganizationEnterpriseIdentityProviderCreateWizardHelp;
