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
import {
    Code,
    CopyInputField,
    DocumentationLink,
    Heading,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Icon, Progress, Segment, SemanticCOLORS, Sidebar } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";

const SamlIDPWizardHelp = () => {
    const { t } = useTranslation();
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);
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
                        type="info"
                        header="Prerequisite"
                        content={
                            <>
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
                            </>
                        }
                    />
                </>
            ),
            id: 0
        },
        {
            body:(    
                <>
                    <p>
                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests initiated from
                        { " " }{ config.ui.productName } to external Identity Provider (IdP). You need to provide a unique value
                as the service provider entity ID.
                    </p>
                </>      
            ),
            id: 1,
            title:  t("Service provider entity ID")
        },
        {
            body:(    
                <>
                    <p>
                Single Sign-On URL of the external IdP. { config.ui.productName } will send SAML authentication
                requests to this endpoint.
                    </p>
                    <p>E.g., https://enterprise_domain/samlsso</p>
                </>      
            ),
            id: 2,
            title:  t("Identity provider Single Sign-On URL")
        },
        {
            body:(    
                <>
                    <p>
                This is the <Code>&lt;saml2:Issuer&gt;</Code> value specified in the SAML responses issued by the
                external IdP. Also, this needs to be a unique value to identify the external IdP within your
                organization.
                    </p>
                    <p>E.g., https://enterprise_domain</p>
                </>      
            ),
            id: 3,
            title:  t("Identity provider entity ID")
        }
    ];

    const [ currentContent, setCurrentContent ] = useState(0);

    const handleClickPrevious = () => {
        setCurrentContent((c) => (c > 0 ? c - 1 : c));
    };
    const handleClickNext = () =>{
        setCurrentContent((c) => (c < quickHelpContent.length - 1 ? c + 1 : c));
    };
    const isPreviousButtonDisabled: boolean = currentContent === 0;
    const isNextButtonDisabled: boolean = currentContent === quickHelpContent.length - 1;
    const previousButtonColor: SemanticCOLORS = isPreviousButtonDisabled ? "grey" : "orange";
    const nextButtonColor: SemanticCOLORS = isNextButtonDisabled ? "grey" : "orange";
    const progress: number = (currentContent / (quickHelpContent.length - 1)) * 100;

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
                    { quickHelpContent.map(({ id, title, body }) => (
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
 * Default props of {@link SamlIDPWizardHelp}
 */
SamlIDPWizardHelp.defaultProps = {
    "data-testid": "saml-idp-create-wizard-help"
};

export default SamlIDPWizardHelp;
