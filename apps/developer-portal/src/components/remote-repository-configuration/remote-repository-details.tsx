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

import { Heading, LinkButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid, Modal } from "semantic-ui-react";
import { DeploymentStatus } from "./remote-deployment-status";
import { getConfigDeploymentDetails } from "../../api";
import { ApplicationWizardStepIcons } from "../../configs";
import { InterfaceConfigDetails, InterfaceRemoteRepoConfig } from "../../models";

interface InterfaceRemoteRepoDetailProps {
    repoObject: InterfaceRemoteRepoConfig;
    onCloseHandler: () => void;
}

export const RemoteRepoDetails: FunctionComponent<InterfaceRemoteRepoDetailProps> = (
    props: InterfaceRemoteRepoDetailProps
): ReactElement => {

    const [ configDetailObject, setConfigDetailObject ] = useState<InterfaceConfigDetails>(undefined)

    const {
        repoObject,
        onCloseHandler
    } = props;

    useEffect(() => {
        getConfigDeploymentDetails(repoObject.id).then((response: AxiosResponse<InterfaceConfigDetails>) => {
            if (response.status === 200) {
                setConfigDetailObject(response.data);
            }
        }).catch(() => {
            //handle error response
        })
    },[])

    const WIZARD_STEPS = [{
        content: (
            <DeploymentStatus statusObject={ configDetailObject } />
        ),
        icon: ApplicationWizardStepIcons.general
    }];
    
    return (
        <Modal
            open={ true }
            className="wizard create-template-type-wizard"
            dimmer="blurring"
            size="small"
            onClose={ onCloseHandler }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
        >
            <Modal.Header className="wizard-header template-type-wizard">
                { repoObject?.name }
                <Heading as="h6">
                    { "Depolyment details for the selected deployment configuration." }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <span><strong>Failed Deployements : </strong>
                                {configDetailObject?.failedDeployments}</span>
                        </Grid.Column>
                        <Grid.Column>
                            <span><strong>Successful Deployements : </strong>
                                {configDetailObject?.successfulDeployments}</span>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <span><strong>Last Deployed : </strong>{configDetailObject?.lastSynchronizedTime}</span>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { WIZARD_STEPS[0].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => { onCloseHandler() } }
                            >
                                { "Close" }
                            </LinkButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}
