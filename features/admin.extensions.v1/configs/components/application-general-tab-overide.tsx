/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { ApplicationDangerZoneComponent } from "@wso2is/admin.applications.v1/components/application-danger-zone";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    ResourceTab
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement  } from "react";
import { Trans } from "react-i18next";
import { Divider } from "semantic-ui-react";

interface ApplicationGeneralTabOverridePropsInterface extends IdentifiableComponentInterface {
    appId: string;
    appName: string;
    clientId?: string;
}

export const ApplicationGeneralTabOverride: FunctionComponent<ApplicationGeneralTabOverridePropsInterface> = (
    props: ApplicationGeneralTabOverridePropsInterface
): ReactElement => {

    const {
        appId,
        appName,
        clientId,
        [ "data-componentid" ]: componentId
    } = props ;

    return (
        <ResourceTab.Pane controlledSegmentation>
            <EmphasizedSegment padded="very">
                <div className="form-container with-max-width">
                    <Heading bold as="h4">Welcome to Asgardeo Try it!</Heading>
                    <Heading as="h6">Use the Try It application to experience different login flows on Asgardeo.
                    Update the Sign-in Methods and click{ " " }
                    <Heading as="h6" weight="bold" inline > Try Login</Heading>{ " " } to try out different login flows.
                    <DocumentationLink
                        link={ "develop.applications.editApplication.asgardeoTryitApplication.general.learnMore" }
                        isLinkRef = { true }
                    >
                        <Trans
                            i18nKey={ "common:learnMore" }
                        >
                            Learn More
                        </Trans>
                    </DocumentationLink>
                    </Heading>
                </div>
            </EmphasizedSegment>
            <Divider hidden/>
            <ApplicationDangerZoneComponent
                appId={ appId }
                name={ appName }
                clientId={ clientId }
                data-componentid={ componentId }
                content="Once you delete an application it cannot be restored.
                    You can create the Try It application again from the Get Started page." />
        </ResourceTab.Pane>
    );
};

/**
 * Default props for the Application application-general-tab-overide.
 */
ApplicationGeneralTabOverride.defaultProps = {
    "data-componentid": "application-general-tab-overide"
};
