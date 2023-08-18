/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, PrimaryButton, Text } from "@wso2is/react-components";
import { GenericIcon } from "@wso2is/react-components";
import React, { FC, FunctionComponent, ReactElement, useState } from "react";
import { Card, Divider, Grid, Label } from "semantic-ui-react";
import { LoginPlaygroundWizard } from "./login-playground-wizard";
import { EventPublisher } from "../../../../features/core";
import { getGettingStartedCardIllustrations } from "../configs";

export type Context = "TEMPLATES" | "RECENT_APPS";

interface PlaygroundApplicationCardInterface extends IdentifiableComponentInterface {
    
    onApplicationCreate: () => void;
}

export const PlaygroundApplicationCard: FunctionComponent<PlaygroundApplicationCardInterface> = (
    props: PlaygroundApplicationCardInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId,
        onApplicationCreate
    } = props;
    

    const [ showWizardLogin, setShowWizardLogin ] = useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    
    return (
        <Card
            data-componentid="application-integration-card"
            data-testid="application-integration-card"
            className="basic-card no-hover context-card try-it-app-card"
        >
            { /*Card Heading*/ }
            <Card.Content extra className="no-borders mb-0 pb-0 pt-4" textAlign="center">
                <div className="card-heading">
                    <Heading bold="500" as="h2">
                        Try Login with the Try It app
                    </Heading>
                </div>
            </Card.Content>
            <Divider className="0.5x" hidden/>
            { /*Card Body*/ }
            <Card.Content className="no-borders">
                <Grid centered padded>
                    <Grid.Row columns={ 2 } style={ { rowGap: "20px" } }>
                        <GenericIcon
                            transparent
                            size="small"
                            icon={ getGettingStartedCardIllustrations().tryItApplication }
                            fill="secondary" />
                    </Grid.Row>
                    <Grid.Row>
                        <Text
                            className="pl-5 pr-5"
                            styles={ {
                                textAlign: "center",
                                color: "#7d7272"
                            } }>
                            Let&apos;s use the Try It application to try out the login flows of Asgardeo.
                        </Text>
                    </Grid.Row>
                    <Grid.Row>
                        <PrimaryButton
                            onClick={ () => setShowWizardLogin(true) }>
                            Try Login with Asgardeo
                        </PrimaryButton>
                    </Grid.Row>
                </Grid>
            </Card.Content>
            {
                showWizardLogin && (
                    <LoginPlaygroundWizard
                        data-componentId="login-playground-wizard-modal"
                        closeWizard={ () => setShowWizardLogin(false) }
                        applicationName="Asgardeo Login Playground"
                        onApplicationCreate={ onApplicationCreate }
                    />
                )
            }
        </Card> 
    );

};

/**
 * Default props of {@link DynamicApplicationContextCard}
 */
PlaygroundApplicationCard.defaultProps = {
    "data-componentid": "dynamic-application-context-card"
};
