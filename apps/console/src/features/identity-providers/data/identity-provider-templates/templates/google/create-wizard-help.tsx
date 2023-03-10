/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable header/header */
/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Code, CopyInputField, Heading, Message } from "@wso2is/react-components";
import { AppState, ConfigReducerStateInterface } from "apps/console/src/features/core";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Progress, Segment, Sidebar } from "semantic-ui-react";

type props = {
    current: any
}
const GoogleIDPCreateWizardHelp = ({ current } : props) => {
    const { t } = useTranslation();
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const [ currentState, setCurrentState ] = useState <any>();

    useEffect(() => {
        setCurrentState(current);
    }, [ current ]);
    const CONTENTS = [
        {
            id: 0,
            body: (
                <><Message
                    type="info"
                    header={
                        t("console:develop.features.authenticationProvider.templates.google.wizardHelp." +
                        "preRequisites.heading")
                    }
                    content={
                        (<>
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.google.wizardHelp." +
                                    "preRequisites.getCredentials"
                                    }
                                >
                                Before you begin, create an <strong>OAuth credential</strong> on the <a
                                        href="https://console.developers.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    > Google developer console</a>, and obtain a <strong>Client ID & secret</strong>.
                                </Trans>
                            </p>
                            <p>

                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.google.wizardHelp" +
                                    ".preRequisites.configureRedirectURL"
                                    }
                                >
                                Use the following URL as the <strong>Authorized Redirect URI</strong>.
                                </Trans>

                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ config?.deployment?.customServerHost + "/commonauth" }
                                />

                                <a
                                    href="https://support.google.com/googleapi/answer/6158849"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {
                                        t("console:develop.features.authenticationProvider.templates.google.wizardHelp." +
                                        "preRequisites.configureOAuthApps")
                                    }
                                </a>
                            </p>
                        </>)
                    }
                />
                </>
                    
            )
        },
        {
            id: 1,
            title:  t("console:develop.features.authenticationProvider.templates.google" +
                        ".wizardHelp.name.heading"), 
            body:(    
                          
                <p>
                    { useNewConnectionsView
                        ? t("console:develop.features.authenticationProvider.templates.google." +
                                    "wizardHelp.name.connectionDescription")
                        : t("Provide a unique name for the selected identity provider to be easily identifiable.") }
                </p>                
            )

        },
        {
            id: 2,
            title: t("console:develop.features.authenticationProvider.templates.google.wizardHelp.clientId.heading"),
            body:(
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.google" +
                        ".wizardHelp.clientId.description"
                        }
                    >
                    Provide the <Code>Client ID</Code> obtained from Google.
                    </Trans>
                </p>
            )
        },
        {
            id: 3,
            title: t("console:develop.features.authenticationProvider.templates.google" +
            ".wizardHelp.clientSecret.heading"),
            body: (
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.google" +
                        ".wizardHelp.clientSecret.description"
                        }
                    >
                    Provide the <Code>Client Secret</Code> obtained from Google.
                    </Trans>
                </p>
            )
        }
    ];

    const [ currentContent, setCurrentContent ] = useState(0);

    const handleClickLeft = () => {

        setCurrentState(currentState === 0 ?  0 : currentState - 1);
        // setCurrentContent((c) => (c > 0 ? c - 1 : c));
    };
    const handleClickRight = () =>{
        // setCurrentContent((c) => (c < CONTENTS.length - 1 ? c + 1 : c));
        setCurrentState(currentState === 3 ?  3 : currentState + 1);
    };

    const isLeftButtonDisabled = currentState === 0;
    const isRightButtonDisabled = currentState === 3;

    const leftButtonColor = isLeftButtonDisabled ? "grey" : "orange";
    const rightButtonColor = isRightButtonDisabled ? "grey" : "orange";

    const progress = (currentState / (3)) * 100;

    const [ sidebarprogress, setSidebarprogress ] = useState(0);

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

                    { CONTENTS.map(({ id, title, body }) => (
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
GoogleIDPCreateWizardHelp.defaultProps = {
    "data-testid": "google-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GoogleIDPCreateWizardHelp;
