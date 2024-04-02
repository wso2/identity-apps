/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, PrimaryButton, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Card, Divider, Grid } from "semantic-ui-react";
import { LoginPlaygroundWizard } from "./login-playground-wizard";
import { getGettingStartedCardIllustrations } from "../configs";

export type Context = "TEMPLATES" | "RECENT_APPS";

interface PlaygroundApplicationCardInterface extends IdentifiableComponentInterface {
    
    onApplicationCreate: () => void;
}

export const PlaygroundApplicationCard: FunctionComponent<PlaygroundApplicationCardInterface> = (
    props: PlaygroundApplicationCardInterface
): ReactElement => {
    const {
        onApplicationCreate
    } = props;
    

    const [ showWizardLogin, setShowWizardLogin ] = useState<boolean>(false);
    
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
                                color: "#7d7272",
                                textAlign: "center"
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
