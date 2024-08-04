/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

/**
 * Prop types of the component.
 */
type CustomIdentityProviderCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the custom IDP template creation wizard.
 *
 * @param {CustomIdentityProviderCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const CustomIdentityProviderCreateWizardHelp: FunctionComponent<CustomIdentityProviderCreateWizardHelpPropsInterface> = (
    props: CustomIdentityProviderCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Name</Heading>
            <p>Provide a unique name for the enterprise authentication provider so that it can be easily identified.</p>
            <p>E.g., MyEnterpriseAuthProvider.</p>
        </div>
    );
};

/**
 * Default props for the component
 */
CustomIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "custom-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CustomIdentityProviderCreateWizardHelp;
