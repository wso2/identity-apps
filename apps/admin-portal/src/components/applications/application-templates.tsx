/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AppAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, useState } from "react";
import { Button, Card } from "semantic-ui-react";
import { ApplicationWizardCreation } from "./application-wizard-creation";

interface ApplicationTemplateProps {
    name: string;
    description: string;
    templateID: string;
    protocol: string;
    example: string;
    logo?: string;
    webApp: boolean;
}

/**
 * Creates the template for each template types.
 *
 * @param props ApplicationTemplateProps.
 */
export const ApplicationTemplate: FunctionComponent<ApplicationTemplateProps> = (props) => {

    const {
        name,
        logo,
        description,
        templateID,
        example,
        webApp,
        protocol
    } = props;

    const initiateWizard = (start: boolean) => {
        if (start) {
            setWebAppOption(!showWebAppOption);
        } else {
            setWizard(true);
        }
    };

    const [showWebAppOption, setWebAppOption] = useState(false);
    const [showWizard, setWizard] = useState(false);

    const closeWizard = () => {
        setWizard(false);
    };

    const openWizard = () => {
        setWizard(true);
    };

    return (
        <>
            <Card
                className="application-card recent"
                onClick={ () => initiateWizard(webApp)
                }
                link={ false }
            >
                {/* TODO renders the image from the logo props */ }
                <AppAvatar
                    name="Google Drive"
                    image={ "https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/a3/62/4f/a3624fbc-6f28-da42-fc2e-a01a" +
                    "4c93943d/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-6.png/246x0w.jpg"
                    }
                    size="small"
                    spaced="right"
                />
                <Card.Content>
                    <Card.Header>{ name }</Card.Header>
                    <Card.Meta>
                        <span>{ description }</span>
                    </Card.Meta>
                    <Card.Description>
                        { example }
                    </Card.Description>
                </Card.Content>
                { /* show options to select different protocols for webapps*/ }
                { showWebAppOption &&
                (
                    <Card.Content extra>
                        <div className="ui two buttons">
                            <Button basic color="blue" onClick={ () => initiateWizard(false) }>
                                SAML
                            </Button>
                            <Button basic color="blue" onClick={ () => initiateWizard(false) }>
                                OIDC
                            </Button>
                        </div>
                    </Card.Content>
                ) }
            </Card>
            {
                (
                    <ApplicationWizardCreation
                        closeWizard={ closeWizard }
                        startWizard={ showWizard }
                        templateID={ templateID }
                        protocol={ protocol }
                    />
                )
            }
        </>
    );
};
