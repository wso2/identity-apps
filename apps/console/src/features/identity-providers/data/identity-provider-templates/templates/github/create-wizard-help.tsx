/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Button, Code, CopyInputField, Message } from "@wso2is/react-components";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Progress, Segment, SemanticCOLORS, Sidebar } from "semantic-ui-react";
import { ConfigReducerStateInterface } from "../../../../../core/models";
import { AppState } from "../../../../../core/store";

/**
 * Props for the Github authentication provider create wizard help component.
 */
interface GithubIdentityProviderCreateWizardHelpProps {
    /**
     * Current step of the wizard.
     * @see [GithubIdentityProviderCreateWizardHelp.defaultProps]
     */
    current: number;
}
const GithubIdentityProviderCreateWizardHelp = ({ current } : GithubIdentityProviderCreateWizardHelpProps) => {
    const { t } = useTranslation();
    const [ useNewConnectionsView ] = useState<boolean>(undefined);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const [ currentState, setCurrentState ] = useState<any>();

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
                    <Message
                        type="info"
                        header={
                            t("console:develop.features.authenticationProvider.templates.github.wizardHelp." +
                            "preRequisites.heading")
                        }
                        content={
                            (<>
                                <p>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.authenticationProvider.templates.github.wizardHelp." +
                                        "preRequisites.getCredentials"
                                        }
                                    >
                                        Before you begin, create an <strong>OAuth application</strong> <a
                                            href="https://github.com/"
                                            target="_blank"
                                            rel="noopener noreferrer">
                                        on GitHub
                                        </a>, and obtain a <strong>client ID & secret</strong>.
                                    </Trans>
                                </p>
                                <p>

                                    <Trans
                                        i18nKey={
                                            "console:develop.features.authenticationProvider.templates.github.wizardHelp" +
                                        ".preRequisites.configureHomePageURL"
                                        }
                                    >
                                        Use the following URL as the <strong>Homepage URL</strong>.
                                    </Trans>

                                    <CopyInputField
                                        className="copy-input-dark spaced"
                                        value={ config?.deployment?.customServerHost }
                                    />
                                </p>
                                <p>
                                    <Trans
                                        i18nKey={
                                            "console:develop.features.authenticationProvider.templates.github.wizardHelp" +
                                        ".preRequisites.configureRedirectURL"
                                        }
                                    >
                                        Add the following URL as the <strong>Authorization callback URL</strong>.
                                    </Trans>

                                    <CopyInputField
                                        className="copy-input-dark spaced"
                                        value={ config?.deployment?.customServerHost + "/commonauth" }
                                    />

                                    <a
                                        href={ "https://docs.github.com/en/developers/" 
                                            +"apps/building-oauth-apps/creating-an-oauth-app" }
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {
                                            t("console:develop.features.authenticationProvider.templates.github." +
                                            "wizardHelp.preRequisites.configureOAuthApps")
                                        }
                                    </a>
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
                            ? t("console:develop.features.authenticationProvider.templates.github." +
                                "wizardHelp.name.connectionDescription")
                            : t("console:develop.features.authenticationProvider.templates.github." +
                                "wizardHelp.name.idpDescription")
                    }
                </p>      
            ),
            id: 1,
            title:  t("console:develop.features.authenticationProvider.templates.github" +
            ".wizardHelp.name.heading")
        },
        {
            body:(
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.github" +
                            ".wizardHelp.clientId.description"
                        }
                    >
                        Provide the <Code>Client ID</Code> obtained from GitHub.
                    </Trans>
                </p>
            ),
            id: 2,
            title: t("console:develop.features.authenticationProvider." +
            "templates.github.wizardHelp.clientId.heading")
        },
        {
            body: (
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.github" +
                            ".wizardHelp.clientSecret.description"
                        }
                    >
                        Provide the <Code>Client Secret</Code> obtained from GitHub.
                    </Trans>
                </p>
            ),
            id: 3,
            title: t("console:develop.features.authenticationProvider.templates.github" +
            ".wizardHelp.clientSecret.heading")
        }
    ];
    const handleClickPrevious = () => {
        setCurrentState(currentState === 0 ?  0 : currentState - 1);
    };
    const handleClickNext = () =>{
        setCurrentState(currentState === 3 ?  3 : currentState + 1);
    };
    const isPreviousButtonDisabled:boolean = currentState === 0;
    const isNextButtonDisabled:boolean = currentState === 3;
    const previousButtonColor:SemanticCOLORS = isPreviousButtonDisabled ? "grey" : "orange";
    const nextButtonColor:SemanticCOLORS = isNextButtonDisabled ? "grey" : "orange";
    const progress:number = (currentState / (3)) * 100;

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
GithubIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "github-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GithubIdentityProviderCreateWizardHelp;
