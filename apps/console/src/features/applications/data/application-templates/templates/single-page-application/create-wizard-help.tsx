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
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Message } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type SinglePageApplicationCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the Single page application template creation wizard.
 *
 * @param {SinglePageApplicationCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const SinglePageApplicationCreateWizardHelp: FunctionComponent<SinglePageApplicationCreateWizardHelpPropsInterface> = (
    props: SinglePageApplicationCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Name</Heading>
            <p>Provide a unique name for the application so that it can be easily identified.</p>
            <p>E.g. Zoom, Salesforce, etc.</p>

            <Divider />

            <>
                <Heading as="h5">Allowed redirect URLs</Heading>
                <p>
                    After user sign-in or sign-out, we will only redirect to these URLs. You can specify
                    multiple valid URLs. Make sure to specify the protocol ( https:// ) otherwise the
                    redirect may fail in some cases.
                </p>
                <p>E.g. https://www.conotoso.com/login</p>
                <Message warning>Note: This field is required for a functional app.</Message>
            </>
        </div>
    );
};

/**
 * Default props for the component
 */
SinglePageApplicationCreateWizardHelp.defaultProps = {
    "data-testid": "spa-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SinglePageApplicationCreateWizardHelp;
