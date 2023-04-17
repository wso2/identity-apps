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

import { AppState, ConfigReducerStateInterface } from "apps/console/src/features/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Progress, Segment, SemanticCOLORS, Sidebar } from "semantic-ui-react";

/**
 * Props for the Organization SSO authentication provider create wizard help component.
 */
interface OrganizationEnterpriseIdentityProviderCreateWizardHelpProps {
    /**
     * Current step of the wizard.
     */
    currentStepInSidePanelGuide: number;
}
const OrganizationEnterpriseIdentityProviderCreateWizardHelp = ({ currentStepInSidePanelGuide }: OrganizationEnterpriseIdentityProviderCreateWizardHelpProps) => {
    const { t } = useTranslation();
    const [ useNewConnectionsView ] = useState<boolean>(undefined);
    const [ currentState, setCurrentState ] = useState <any>();
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

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
                    <p>
                        {
                            t("console:develop.features.authenticationProvider.templates.organizationIDP" +
                                ".wizardHelp.name.description")
                        }
                    </p>
                    <p>E.g., MyOrgEnterpriseAuthProvider.</p>
                </>
            ),
            id: 0,
            title: t("console:develop.features.authenticationProvider.templates.organizationIDP" +
            ".wizardHelp.name.heading")
        },
        {
            body:(    
                <>
                    <p>
                        { t("console:develop.features.authenticationProvider.templates.organizationIDP" +
                        ".wizardHelp.description.description") }
                    </p>
                    <p>
                        { t("console:develop.features.authenticationProvider.templates.organizationIDP" +
                            ".wizardHelp.description.example") }
                    </p>
                </>      
            ),
            id: 1,
            title: t("console:develop.features.authenticationProvider.templates.organizationIDP" +
            ".wizardHelp.description.heading")
        }
    ];

    const handleClickPrevious = () => {
        setCurrentState(currentState === 0 ?  0 : currentState - 1);
    };
    const handleClickNext = () =>{
        setCurrentState(currentState === 1 ?  1 : currentState + 1);
    };
    const isPreviousButtonDisabled: boolean = currentState === 0;
    const isNextButtonDisabled: boolean = currentState === 1;
    const previousButtonColor: SemanticCOLORS = isPreviousButtonDisabled ? "grey" : "orange";
    const nextButtonColor: SemanticCOLORS = isNextButtonDisabled ? "grey" : "orange";
    const progress: number = (currentState / (1)) * 100;

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
OrganizationEnterpriseIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "organization-enterprise-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OrganizationEnterpriseIdentityProviderCreateWizardHelp;
