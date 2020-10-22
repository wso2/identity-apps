/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { CodeEditor, Hint, LinkButton, PrimaryButton, SegmentedAccordion } from "@wso2is/react-components"
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react"
import { Grid, Icon, Modal } from "semantic-ui-react"
import { 
    InterfaceConfigDetails, 
    InterfaceRemoteConfigDetails, 
    InterfaceRemoteFetchStatus, 
    getConfigDeploymentDetails
} from "../../../remote-repository-configuration";

interface RemoteFetchDetailsProps extends TestableComponentInterface {
    isOpen: boolean;
    onClose: () => void;
    remoteDeployment: InterfaceRemoteConfigDetails;
}

export const RemoteFetchDetails: FunctionComponent<RemoteFetchDetailsProps> = (
    props: RemoteFetchDetailsProps
): ReactElement => {

    const {
        isOpen,
        onClose,
        remoteDeployment,
        [ "data-testid" ]: testId
    } = props;

    const [ activeIndex, setActiveIndex ] = useState<number[]>([]);
    const [ deploymentStatus, setDeploymentStatus ] = useState<InterfaceConfigDetails>(undefined);

    useEffect(() => {
        getConfigDeploymentDetails(remoteDeployment.id).then((response: AxiosResponse<InterfaceConfigDetails>) => {
            if (response.status === 200) {
                setDeploymentStatus(response.data);
            }
        }).catch((error: AxiosError) => {
            console.log(error)
        })
    }, [])

    const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {
        const newIndexes = [ ...activeIndex ];

        if (newIndexes.includes(index)) {
            const removingIndex = newIndexes.indexOf(index);
            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(index);
        }

        setActiveIndex(newIndexes);
    };

    return (
        <Modal
            open={ isOpen }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            className="wizard"
            data-testid={ `${ testId }-modal` }
        >
            <Modal.Header className="wizard-header">
                Application Fetch Status
                <Hint icon="linkify" className="mt-0 mb-1">
                    { remoteDeployment?.repositoryManagerAttributes?.uri }
                </Hint>
            </Modal.Header>
            <Modal.Content
                scrolling
            >
                <Grid className="wizard-summary" data-testid={ testId }>
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                        <SegmentedAccordion
                            fluid
                            data-testid={ testId }
                        >
                            {
                                deploymentStatus && deploymentStatus?.remoteFetchRevisionStatuses.length > 0 &&
                                    deploymentStatus?.remoteFetchRevisionStatuses.map((
                                        value: InterfaceRemoteFetchStatus, index: number
                                    ) => (
                                        value.deployedStatus === "FAIL" &&
                                        <>
                                            <SegmentedAccordion.Title
                                                id={ value.itemName }
                                                key={ index }
                                                data-testid={ `${ testId }-title` }
                                                active={ activeIndex.includes(index) }
                                                index={ index }
                                                onClick={ handleAccordionOnClick }
                                                content={ (
                                                    <div className="floated left text-left">
                                                        <Icon.Group className="mr-2" size="large">
                                                            <Icon name="fork" />
                                                            <Icon 
                                                                color="red"
                                                                corner="bottom right" 
                                                                name="cancel"
                                                            />
                                                        </Icon.Group>
                                                        { value.itemName }
                                                        <Hint icon="info circle" className="mt-1 mb-1">
                                                            { value.deployedTime }
                                                        </Hint>
                                                    </div>
                                                ) }
                                                hideChevron={ false }
                                            />
                                            <SegmentedAccordion.Content
                                                active={ activeIndex.includes(index) }
                                                data-testid={ `${ testId }-content` }
                                            >
                                                <CodeEditor
                                                    lint
                                                    language="htmlmixed"
                                                    sourceCode={ value.deploymentErrorReport }
                                                    options={ {
                                                        lineWrapping: true
                                                    } }
                                                    readOnly={ true }
                                                    theme={ "dark" }
                                                />
                                            </SegmentedAccordion.Content>
                                        </>
                                    ))
                            }
                        </SegmentedAccordion>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>
                                close
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                data-testid={ `${ testId }-import-button` }
                            >
                                Refetch Applications
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}
