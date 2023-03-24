/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
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

import { Button } from "@wso2is/react-components";
import { identityProviderConfig } from "apps/console/src/extensions";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Progress, Segment, SemanticCOLORS, Sidebar } from "semantic-ui-react";

/**
 * Props for the Expert mode authentication provider create wizard help component.
 */
interface ExpertModeIdPCreateWizardHelpProps {
    /**
     * Current step of the wizard.
     * @see [ExpertModeIdPCreateWizardHelp.defaultProps]
     */
    current: number;
}
const ExpertModeIdPCreateWizardHelp = ({ current } : ExpertModeIdPCreateWizardHelpProps) => {
    const { t } = useTranslation();
    const [ currentState, setCurrentState ] = useState<any>();
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);
    /**
     * Checks if the listing view defined in the config is the new connections view.
     */
    useEffect(() => {
        if (useNewConnectionsView !== undefined) {
            return;
        }
        setUseNewConnectionsView(identityProviderConfig.useNewConnectionsView);
    }, [ identityProviderConfig ]);

    useEffect(() => {
        setCurrentState(current);
    }, [ current ]);
    interface Content {
        id: number;
        title?: string;
        body: JSX.Element;
      } 
    const quickHelpContent: Content[] = [
        {
            body: (
                <>
                    <p>
                        {
                            useNewConnectionsView
                                ? t("console:develop.features.authenticationProvider.templates.expert." +
                            "wizardHelp.name.connectionDescription")
                                : t("console:develop.features.authenticationProvider.templates.expert." +
                            "wizardHelp.name.idpDescription")
                        }
                    </p>
                </>
            ),
            id: 0,
            title: t("console:develop.features.authenticationProvider.templates.expert" +
            ".wizardHelp.name.heading")
        },
        {
            body:(    
                <>
                    <p>
                        {
                            t("console:develop.features.authenticationProvider.templates.organizationIDP" +
                                ".wizardHelp.description.description")
                        }
                    </p>
                    <p>
                        {
                            t("console:develop.features.authenticationProvider.templates.organizationIDP" +
                                ".wizardHelp.description.example")
                        }
                    </p>
                </>      
            ),
            id: 1,
            title:  t("console:develop.features.authenticationProvider.templates.organizationIDP" +
            ".wizardHelp.description.heading")
        }
    ];
    const handleClickPrevious = () => {
        setCurrentState(currentState === 0 ?  0 : currentState - 1);
    };
    const handleClickNext = () =>{
        setCurrentState(currentState === 1 ?  1 : currentState + 1);
    };
    const isPreviousButtonColor:boolean = currentState === 0;
    const isNextButtonColor:boolean = currentState === 1;
    const previousButtonColor:SemanticCOLORS = isPreviousButtonColor ? "grey" : "orange";
    const nextButtonColor:SemanticCOLORS = isNextButtonColor ? "grey" : "orange";
    const progress:number = (currentState / (1)) * 100;

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
                            disabled={ isPreviousButtonColor }
                        />
                        <Button
                            icon="chevron right"
                            color={ nextButtonColor }
                            onClick={ handleClickNext }
                            className="idp-sidepanel-button"
                            disabled={ isNextButtonColor }
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
ExpertModeIdPCreateWizardHelp.defaultProps = {
    "data-componentid": "expert-mode-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ExpertModeIdPCreateWizardHelp;
