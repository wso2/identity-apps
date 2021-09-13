/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Code, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";

/**
 * No component specific props. Hence unnecessary
 * to implement a separate interface.
 */
type Props = TestableComponentInterface;

/**
 * Help panel content for SAML file based configuration mode.
 * @param props {Props}
 * @constructor
 */
const SAMLIdPWizardFileBasedHelp: FunctionComponent<Props> = (props: Props): ReactElement => {

    const { [ "data-testid" ]: testId } = props;
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Service provider entity ID</Heading>
            <p>
                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests initiated from
                { " " }{ config.ui.productName } to external Identity Provider (IdP). You need to provide a unique value
                as the service provider entity ID.
            </p>
            <Divider/>
            <Heading as="h5">Metadata file</Heading>
            <p>
                { config.ui.productName } allows you to upload SAML configuration data using a
                metadata <Code>XML</Code> file that contains all the required configurations to exchange authentication
                information between entities in a standard way.
            </p>
        </div>
    );

};

SAMLIdPWizardFileBasedHelp.defaultProps = {
    "data-testid": "saml-idp-wizard-file-based-help"
};

export default SAMLIdPWizardFileBasedHelp;
