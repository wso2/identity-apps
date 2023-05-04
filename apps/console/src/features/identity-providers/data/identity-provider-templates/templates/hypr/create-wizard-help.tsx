/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Code, Message } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Progress, Segment, SemanticCOLORS, Sidebar } from "semantic-ui-react";

/**
 * Props for the Apple authentication provider create wizard help component.
 */
interface HyprIDPCreateWizardHelpProps {
    /**
     * Current step of the wizard.
     */
    currentStepInSidePanelGuide: number;
}
const HyprIDPCreateWizardHelp = ({ currentStepInSidePanelGuide }: HyprIDPCreateWizardHelpProps):any => {
    const { t } = useTranslation();
    const [ useNewConnectionsView ] = useState<boolean>(undefined);
    const [ currentState, setCurrentState ] = useState <any>();
    const hyprControlCentreDocUrl: string = 
        "https://docs.hypr.com/installinghypr/docs/getting-started-with-fido-control-center";

    const hyprTokenDocUrl: string = 
        "https://docs.hypr.com/installinghypr/docs/access-token";

    useEffect(() => {
        setCurrentState(currentStepInSidePanelGuide);
    }, [ currentStepInSidePanelGuide ]);

    interface Content {
        id: number;
        title?: string;
        body: JSX.Element;
      }
    const quickHelpContent: Content[] = [
        {
            body: (
                <>
                    <Message
                        type="info"
                        header={
                            t("console:develop.features.authenticationProvider.templates.hypr.wizardHelp." +
                        "preRequisites.heading")
                        }
                        content={
                            (<>
                                <p>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.authenticationProvider.templates.hypr." +
                                    "wizardHelp.preRequisites.rpDescription"
                                        }
                                    >
                                Before you begin, create a RP application in <a
                                            href={ hyprControlCentreDocUrl }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        > HYPR control centre</a>, and obtain the application ID.
                                    </Trans>
                                </p>
                                <p>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.authenticationProvider.templates.hypr." +
                                    "wizardHelp.preRequisites.tokenDescription"
                                        }
                                    >
                                You also have to obtain an <a
                                            href={ hyprTokenDocUrl }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        > API Token</a> for the application you have created.
                                    </Trans>
                                </p>
                            </>)
                        }
                    />
                </>
            ),
            id: 0
        },
        {
            body:(    
                <p>
                    {
                        useNewConnectionsView
                            ? t("console:develop.features.authenticationProvider.templates.hypr." +
                            "wizardHelp.name.connectionDescription")
                            : t("console:develop.features.authenticationProvider.templates.hypr." +
                            "wizardHelp.name.idpDescription")
                    }
                </p>  
            ),
            id: 1,
            title: t("console:develop.features.authenticationProvider.templates.hypr" +
            ".wizardHelp.name.heading")
        },
        {
            body:(
                <>
                    <p>
                        <Trans
                            i18nKey={
                                "console:develop.features.authenticationProvider.templates.hypr" +
                        ".wizardHelp.appId.description"
                            }
                        >
                    Provide the <Code>Application ID</Code> of the application registerd in HYPR control center.
                        </Trans>
                    </p>
                </>
            ),
            id: 2,
            title: t("console:develop.features.authenticationProvider.templates.hypr.wizardHelp.appId.heading")
        },
        {
            body: (
                <>
                    <p>
                        <Trans
                            i18nKey={
                                "console:develop.features.authenticationProvider.templates.hypr" +
                        ".wizardHelp.baseUrl.description"
                            }
                        >
                    Provide the <Code>base URL</Code> of your HYPR server deployment. 
                        </Trans>
                    </p>
                </>
            ),
            id: 3,
            title: t("console:develop.features.authenticationProvider.templates.hypr" +
            ".wizardHelp.baseUrl.heading")
        },
        {
            body: (
                <>
                    <p>
                        <Trans
                            i18nKey={
                                "console:develop.features.authenticationProvider.templates.hypr" +
                        ".wizardHelp.apiToken.description"
                            }
                        >
                    Provide the <Code>API Token</Code> obtained from HYPR. 
                    This will be used to access HYPR&apos;s APIs.
                        </Trans>
                    </p>
                </>
            ),
            id: 4,
            title: t("console:develop.features.authenticationProvider.templates.hypr" +
            ".wizardHelp.apiToken.heading")    
        }
    ];

    const handleClickPrevious = () => {
        setCurrentState(currentState === 0 ?  0 : currentState - 1);
    };
    const handleClickNext = () =>{
        setCurrentState(currentState === 4 ?  4 : currentState + 1);
    };
    const isPreviousButtonDisabled: boolean = currentState === 0;
    const isNextButtonDisabled: boolean = currentState === 4;
    const previousButtonColor: SemanticCOLORS = isPreviousButtonDisabled ? "grey" : "orange";
    const nextButtonColor: SemanticCOLORS = isNextButtonDisabled ? "grey" : "orange";
    const progress: number = (currentState / (4)) * 100;

    return (
        <Sidebar.Pushable>
            <Sidebar
                as={ Segment }
                animation="overlay"
                direction="left"
                visible
                icon="labeled"
                vertical
                className="idp-sidepanel-sidebar"
            >
                <div className="idp-sidepanel-content">
                    { quickHelpContent.map(({ id, title, body }: Content) => (
                        <div key={ id } style={ { display: currentState === id ? "block" : "none" } }>
                            <Segment
                                className="idp-sidepanel-segment">
                                <h2>{ title }</h2>
                                <p>{ body }</p>
                            </Segment>
                        </div>
                    )) }
                </div>
                <div className="idp-sidepanel-footer">
                    <Progress
                        percent={ progress }
                        indicating
                        className="idp-sidepanel-progress"
                        color="orange"
                        size="tiny"
                    />
                    <div className="idp-sidepanel-buttons">
                        <Button
                            icon="chevron left"
                            color={ previousButtonColor }
                            onClick={ handleClickPrevious }
                            className="idp-sidepanel-button"
                            disabled={ isPreviousButtonDisabled }
                        />
                        <Button
                            icon="chevron right"
                            color={ nextButtonColor }
                            onClick={ handleClickNext }
                            className="idp-sidepanel-button"
                            disabled={ isNextButtonDisabled }
                        >
                        </Button>
                    </div>
                </div>
            </Sidebar>
        </Sidebar.Pushable>
    );
};

/**
 * Default props for the component
 */
HyprIDPCreateWizardHelp.defaultProps = {
    "data-componentid": "hypr-idp-create-wizard-help"
};

export default HyprIDPCreateWizardHelp;
