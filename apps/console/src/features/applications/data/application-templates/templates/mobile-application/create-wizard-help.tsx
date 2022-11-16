/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
type MobileApplicationCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the mobile application template creation wizard.
 *
 * @param props - Props injected into the component.
 * @returns Mobile Application Create Wizard Help
 */
const MobileApplicationCreateWizardHelp: FunctionComponent<MobileApplicationCreateWizardHelpPropsInterface> = (
    props: MobileApplicationCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Name</Heading>
            <p>A unique name to identify your application.</p>
            <p>E.g., My App</p>

            <Divider />

            <React.Fragment>
                <Heading as="h5">Authorized redirect URIs</Heading>
                <p>
                    The URI to which the authorization code is sent to upon authentication and where the user
                    is redirected to upon logout.
                </p>
                <p>
                    E.g., https://myapp.io/login, <br></br>
                    &emsp;&emsp;
                    myapp://oauth2
                </p>
            </React.Fragment>
        </div>
    );
};

/**
 * Default props for the component
 */
MobileApplicationCreateWizardHelp.defaultProps = {
    "data-testid": "mobile-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default MobileApplicationCreateWizardHelp;
