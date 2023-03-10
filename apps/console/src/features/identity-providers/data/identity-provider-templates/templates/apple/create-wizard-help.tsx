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
                        t("console:develop.features.authenticationProvider.templates.apple." +
                    "wizardHelp.preRequisites.heading")
                    }
                    content={
                        (<>
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.apple." +
                                    "wizardHelp.preRequisites.getCredentials"
                                    }
                                >
                                Before you begin, create a <strong>Sign in With Apple</strong> enabled 
                                application on <a
                                        href="https://developer.apple.com/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                Apple Developer Portal
                                    </a> with a <strong>Services ID</strong> and a <strong>Private Key</strong>.
                                </Trans>
                            </p>
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.apple." +
                                    "wizardHelp.preRequisites.configureWebDomain"
                                    }
                                >
                            Use the following as a <strong>Web Domain</strong>.
                                </Trans>
                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ new URL(config?.deployment?.serverOrigin)?.hostname }
                                />
                            </p>
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.apple." +
                                    "wizardHelp.preRequisites.configureReturnURL"
                                    }
                                >
                            Add the following URL as a <strong>Return URL</strong>.
                                </Trans>
                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ config?.deployment?.customServerHost + "/commonauth" }
                                />
                                <a
                                    href={
                                        "https://developer.apple.com/documentation/sign_in_with_apple" + 
                                    "/configuring_your_environment_for_sign_in_with_apple"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {
                                        t("console:develop.features.authenticationProvider.templates.apple" +
                                    ".wizardHelp.preRequisites.configureAppleSignIn")
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
            title:  t("console:develop.features.authenticationProvider.templates.apple" +
            ".wizardHelp.name.heading"), 
            body:(    
                <p>
                    {
                        useNewConnectionsView
                            ? t("console:develop.features.authenticationProvider.templates.apple." +
                                "wizardHelp.name.connectionDescription")
                            : t("Provide a unique name for the selected identity provider to be easily identifiable.")
                    }
                </p>               
            )

        },
        {
            id: 2,
            title: t("console:develop.features.authenticationProvider." +
            "templates.apple.wizardHelp.clientId.heading"),
            body:(
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.apple" +
                            ".wizardHelp.clientId.description"
                        }
                    >
                    Provide the <Code>Services ID</Code> created at Apple.
                    </Trans>
                </p>
            )
        },
        {
            id: 3,
            title: t("console:develop.features.authenticationProvider.templates.apple" +
            ".wizardHelp.teamId.heading"),
            body: (
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.apple." +
                            "wizardHelp.teamId.description"
                        }
                    >
                    Provide the Apple developer <Code>Team ID</Code>.
                    </Trans>
                </p>
            )
        },
        {
            id: 4,
            title: t("console:develop.features.authenticationProvider.templates.apple" +
            ".wizardHelp.keyId.heading"),
            body:(
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.apple." +
                            "wizardHelp.keyId.description"
                        }
                    >
                    Provide the <Code>Key Identifier</Code> of the private key generated.
                    </Trans>
                </p>
            )
        },
        {
            id: 5,
            title: t("console:develop.features.authenticationProvider.templates.apple" +
            ".wizardHelp.privateKey.heading"),
            body: (
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.apple." +
                            "wizardHelp.privateKey.description"
                        }
                    >
                    Provide the <Code>Private Key</Code> generated for the application.
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
        setCurrentState(currentState === 5 ?  5 : currentState + 1);
    };

    const isLeftButtonDisabled = currentState === 0;
    const isRightButtonDisabled = currentState === 5;

    const leftButtonColor = isLeftButtonDisabled ? "grey" : "orange";
    const rightButtonColor = isRightButtonDisabled ? "grey" : "orange";

    const progress = (currentState / (5)) * 100;

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
