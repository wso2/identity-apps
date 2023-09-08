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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { 
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    PrimaryButton,
    ResourceTab
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState  } from "react";
import { Trans } from "react-i18next";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { Divider } from "semantic-ui-react";
import { ApplicationDangerZoneComponent } from "../../../features/applications/components/application-danger-zone";
import { loginPlaygroundUserTourSteps } 
    from "../../components/application/components/login-playground/playground-user-tour-modal";
import { TryItApplicationConstants } from "../../components/application/constants/try-it-constants";
import { persistPlaygroundTourViewedStatus } from "../../components/application/utils/try-it-utils";

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
        clientId
    } = props ;

    const [ isTriggered, setIsTriggered ] = useState<boolean>(false);
    
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
                            i18nKey={ "extensions:common.learnMore" }
                        >
                            Learn More
                        </Trans>
                    </DocumentationLink>
                    </Heading>
                    { TryItApplicationConstants.TRY_IT_TOUR_ENABLED &&
                         (
                             <>
                                 <Divider hidden />
                                 <PrimaryButton
                                     onClick={ () => setIsTriggered(true) }
                                 >
                                    Take a Tour?
                                 </PrimaryButton></>) }
                    <Joyride
                        continuous
                        disableOverlay
                        callback={ (data: CallBackProps) => {
                            // If the tour is `done` or `skipped`, set the viewed state in storage.
                            if ((data.status === STATUS.FINISHED) || (data.status === STATUS.SKIPPED)) {
                                persistPlaygroundTourViewedStatus(true);
                                setIsTriggered(false);
                            }
                        } }
                        showSkipButton
                        run={ isTriggered }
                        steps={ loginPlaygroundUserTourSteps }
                        styles={ {
                            buttonClose: {
                                display: "none"
                            },
                            tooltipContent: {
                                paddingBottom: 1
                            }
                        } }
                        locale={ {
                            back: "Back",
                            close: "Close",
                            last: "Done",
                            next: "Next",
                            skip: "Skip"
                        } }
                    /> 
                    { /* <PlaygroundUserTour onTakeTour={ () => setIsTriggered(true) }  /> */ }
                </div>
            </EmphasizedSegment>
            <Divider hidden/>
            <ApplicationDangerZoneComponent
                appId={ appId }
                name={ appName }
                clientId={ clientId } 
                content="Once you delete an application it cannot be restored. 
                    You can create the Try It application again from the Get Started page." />
        </ResourceTab.Pane>
    );
}; 
