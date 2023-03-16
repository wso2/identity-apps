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

import { CopyInputField, Message } from "@wso2is/react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Icon, Progress, Segment, Sidebar } from "semantic-ui-react";
import { ConfigReducerStateInterface } from "../../../../../core/models";
import { AppState } from "../../../../../core/store";


const CustomIdentityProviderCreateWizardHelp = () => {
    const { t } = useTranslation();
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    interface Content {
        id: number;
        title?: string;
        body: JSX.Element;
      }
      
    const CONTENTS: Content[] = [
        {
            body: (
                <><Message
                    type="info"
                    header="Prerequisite"
                    content={
                        (<p>Before you begin, register an application in the Identity Provider, and obtain a
                            <strong> client ID & secret</strong>. Use the following URL as the <strong>
                            Authorized Redirect URL</strong>.
                            <br />
                            <br />
                            <CopyInputField
                                className="copy-input-dark"
                                value={ config?.deployment?.customServerHost + "/commonauth" }
                            />
                            <br />
                            <Icon name="info circle" />
                        The URL to which the authorization code is sent upon authentication and where the
                        user is redirected to upon logout.
                        </p>)
                    }
                />
                </>
            ),
            id: 0
        },
        {
            body:(    
                <><p>Provide the client ID obtained from the identity provider.</p>
                </>      
            ),
            id: 1,
            title:  t("Client ID")
        },
        {
            body:(    
                <><p>Provide the client secret obtained from the identity provider.</p>
                </>      
            ),
            id: 2,
            title:  t("Client secret")            
        },
        {
            body:(    
                <>
                    <p>Provide the standard authorization endpoint URL of the identity provider.</p>
                    <p>E.g., https://enterprise_domain/authorize</p>
                </>      
            ),
            id: 3,
            title:  t("Authorization endpoint URL")
        },
        {
            body:(    
                <>
                    <p>Provide the standard token endpoint URL of the identity provider.</p>
                    <p>E.g., https://enterprise_domain/token</p>
                </>      
            ),
            id: 4,
            title:  t("Token endpoint URL")
        }
    ];

    const [ currentContent, setCurrentContent ] = useState(0);

    const handleClickLeft = () => setCurrentContent((c:number) => (c > 0 ? c - 1 : c));
    const handleClickRight = () =>
        setCurrentContent((c:number) => (c < CONTENTS.length - 1 ? c + 1 : c));

    const isLeftButtonDisabled:boolean = currentContent === 0;
    const isRightButtonDisabled:boolean = currentContent === CONTENTS.length - 1;

    const leftButtonColor:any = isLeftButtonDisabled ? "grey" : "orange";
    const rightButtonColor:any = isRightButtonDisabled ? "grey" : "orange";

    const progress:number = (currentContent / (CONTENTS.length - 1)) * 100;

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
                <div className="idp-sidepanel-content-large">
                    { CONTENTS.map(({ id, title, body }: Content) => (
                        <div key={ id } style={ { display: currentContent === id ? "block" : "none" } }>
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
CustomIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "custom-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CustomIdentityProviderCreateWizardHelp;
