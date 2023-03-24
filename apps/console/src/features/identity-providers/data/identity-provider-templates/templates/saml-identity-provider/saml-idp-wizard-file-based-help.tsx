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

import { Button, Code, CopyInputField, DocumentationLink, Message, useDocumentation } from "@wso2is/react-components";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Icon, Progress, Segment, SemanticCOLORS, Sidebar } from "semantic-ui-react";
import { ConfigReducerStateInterface } from "../../../../../core/models";
import { AppState } from "../../../../../core/store";

const SAMLIdPWizardFileBasedHelp = () => {
    const { t } = useTranslation();
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { getLink } = useDocumentation();

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
                        size="tiny"
                        type="info"
                        content={
                            (<>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.enterprise.saml." +
                                "preRequisites.configureRedirectURL"
                                    }
                                >
                            Use the following URL as the <strong>Authorized Redirect URI</strong>.
                                </Trans>
                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ config?.deployment?.customServerHost + "/commonauth" }
                                />
                                <Icon name="info circle" />
                                {
                                    t("console:develop.features.authenticationProvider.templates.enterprise.saml." +
                                "preRequisites.hint", {
                                        productName: config.ui.productName
                                    })
                                }
                                { getLink("develop.connections.newConnection.enterprise.samlLearnMore") === undefined
                                    ? null
                                    : <Divider hidden/>
                                }
                                <DocumentationLink
                                    link={ getLink("develop.connections.newConnection.enterprise.samlLearnMore") }
                                >
                                    {
                                        t("console:develop.features.authenticationProvider.templates.enterprise.saml." +
                                    "preRequisites.configureIdp")
                                    }
                                </DocumentationLink>
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
                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests initiated from
                    { " " }{ config.ui.productName } to external Identity Provider (IdP). 
                    You need to provide a unique value as the service provider entity ID.
                </p>     
            ),
            id: 1,
            title:  t("Service provider entity ID")
        },
        {
            body:(    
                <p>
                    { config.ui.productName } allows you to upload SAML configuration data using a
                metadata <Code>XML</Code> file that contains all the required configurations to exchange authentication
                information between entities in a standard way.
                </p>      
            ),
            id: 2,
            title:  t("Metadata file")            
        }
    ];
    const [ currentContent, setCurrentContent ] = useState(0);
    const handleClickPrevious = () => setCurrentContent((c:number) => (c > 0 ? c - 1 : c));
    const handleClickNext = () =>
        setCurrentContent((c:number) => (c < quickHelpContent.length - 1 ? c + 1 : c));
    const isPreviousButtonDisabled:boolean = currentContent === 0;
    const isNextButtonDisabled:boolean = currentContent === quickHelpContent.length - 1;
    const previousButtonColor:SemanticCOLORS = isPreviousButtonDisabled ? "grey" : "orange";
    const nextButtonColor:SemanticCOLORS = isNextButtonDisabled ? "grey" : "orange";
    const progress:number = (currentContent / (quickHelpContent.length - 1)) * 100;

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
                    { quickHelpContent.map(({ id, title, body }: Content) => (
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
SAMLIdPWizardFileBasedHelp.defaultProps = {
    "data-testid": "saml-idp-wizard-file-based-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SAMLIdPWizardFileBasedHelp;
