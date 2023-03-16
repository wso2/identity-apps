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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Progress, Segment, Sidebar } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../../../extensions/configs";


/**
 * Help content for the Apple IDP template creation wizard.
 *
 * @param props - Props injected into the component.
 *
 *  @returns React Element
 */
type props = {
    current: any
}

const ExpertModeIdPCreateWizardHelp = ({ current } : props) => {
    const { t } = useTranslation();
    const [ currentState, setCurrentState ] = useState <any>();

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
      
    const CONTENTS: Content[] = [
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

    const handleClickLeft = () => {

        setCurrentState(currentState === 0 ?  0 : currentState - 1);
        // setCurrentContent((c) => (c > 0 ? c - 1 : c));
    };
    const handleClickRight = () =>{
        // setCurrentContent((c) => (c < CONTENTS.length - 1 ? c + 1 : c));
        setCurrentState(currentState === 1 ?  1 : currentState + 1);
    };

    const isLeftButtonDisabled:boolean = currentState === 0;
    const isRightButtonDisabled:boolean = currentState === 1;

    const leftButtonColor:any = isLeftButtonDisabled ? "grey" : "orange";
    const rightButtonColor:any = isRightButtonDisabled ? "grey" : "orange";

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

                    { CONTENTS.map(({ id, title, body }: Content) => (
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
                            color={ leftButtonColor }
                            onClick={ handleClickLeft }
                            className="idp-sidepanel-button"
                            disabled={ isLeftButtonDisabled }
                        />
                        <Button
                            icon="chevron right"
                            color={ rightButtonColor }
                            onClick={ handleClickRight }
                            className="idp-sidepanel-button"
                            disabled={ isRightButtonDisabled }
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
