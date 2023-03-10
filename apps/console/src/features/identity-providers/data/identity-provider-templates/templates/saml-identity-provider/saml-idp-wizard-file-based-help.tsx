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
import { Code, CopyInputField, DocumentationLink, Heading, Message, useDocumentation } from "@wso2is/react-components";
import { AppState, ConfigReducerStateInterface } from "apps/console/src/features/core";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Icon, Progress, Segment, Sidebar } from "semantic-ui-react";

const SAMLIdPWizardFileBasedHelp = () => {
    const { t } = useTranslation();
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { getLink } = useDocumentation();


    const CONTENTS = [
        {
            id: 0,
            body: (
                <><Message
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
            )
        },
        {
            id: 1,
            title:  t("Service provider entity ID"),
    
            body:(    
                <><p>
                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests initiated from
                    { " " }{ config.ui.productName } to external Identity Provider (IdP). You need to provide a unique value
                as the service provider entity ID.
                </p>
                </>      
            )
        },
        {
            id: 2,
            title:  t("Metadata file"),
    
            body:(    
                <><p>
                    { config.ui.productName } allows you to upload SAML configuration data using a
                metadata <Code>XML</Code> file that contains all the required configurations to exchange authentication
                information between entities in a standard way.
                </p>
                </>      
            )
        }
    ];

    const [ currentContent, setCurrentContent ] = useState(0);

    const handleClickLeft = () => setCurrentContent((c) => (c > 0 ? c - 1 : c));
    const handleClickRight = () =>
        setCurrentContent((c) => (c < CONTENTS.length - 1 ? c + 1 : c));

    const isLeftButtonDisabled = currentContent === 0;
    const isRightButtonDisabled = currentContent === CONTENTS.length - 1;

    const leftButtonColor = isLeftButtonDisabled ? "grey" : "orange";
    const rightButtonColor = isRightButtonDisabled ? "grey" : "orange";

    const progress = (currentContent / (CONTENTS.length - 1)) * 100;

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
                    { CONTENTS.map(({ id, title, body }) => (
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
SAMLIdPWizardFileBasedHelp.defaultProps = {
    "data-testid": "google-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SAMLIdPWizardFileBasedHelp;
