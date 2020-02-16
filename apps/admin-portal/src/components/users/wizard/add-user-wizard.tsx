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

import React, { FunctionComponent, useState } from "react";
import { history } from "../../../helpers";
import { UserBasicWizard } from "../../../models";
import { ApplicationWizardStepIcons } from "../../../configs";
import { AddUser } from "../add-user";
import { Grid, Modal } from "semantic-ui-react";
import { Heading, LinkButton, Steps } from "@wso2is/react-components";
import { AddUserWizardSummary } from "./wizard-summary";

interface AddUserWizardPropsInterface {
    closeWizard: () => void;
    currentStep?: number;
    listOffset: number;
    listItemLimit: number;
    getUserList: (listOffset: number, listItemLimit: number) => void;
}

/**
 * User creation wizard.
 *
 * @return {JSX.Element}
 */
export const AddUserWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): JSX.Element => {

    const {
        closeWizard,
        currentStep,
        listOffset,
        listItemLimit,
        getUserList
    } = props

    const [ creationStep, setCreationStep ] = useState("GeneralDetails");
    const [ completedStep, setCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);

    const [ generalSettingsData, setGeneralSettingsData ] = useState();
    const [ user, setUser ] = useState<UserBasicWizard>();

    const updateMainUserData = (userData: UserBasicWizard) => {
        if (userData !== user) {
            setUser(userData);
        }
    };

    const setGeneralSettings = (userGeneral: UserBasicWizard) => {
        setGeneralSettingsData(userGeneral);
    };

    // Stages order for application creation.
    const steps = [ "GeneralDetails", "Summary" ];

    // Advance to next step defined in the steps array.
    const stepForward = () => {
        const currentStep = creationStep;
        const currentIndex = steps.indexOf(currentStep);
        if ((currentIndex + 1) < steps.length) {
            const newstep = steps[ currentIndex + 1 ];
            setCreationStep(newstep);
        } else {
            history.push("/users");
        }
    };

    // Rollback to previous step defined in the steps array.
    const stepBackward = () => {
        const currentStep = creationStep;
        const currentIndex = steps.indexOf(currentStep);
        if ((currentIndex - 1) >= 0) {
            const newstep = steps[ currentIndex - 1 ];
            setCreationStep(newstep);
        } else if (currentStep === "GeneralDetails") {
            // clean up all the states.
            // setApplication({ name: "" });
            // setGeneralSettings({  } )
            // setOIDCProtocolSetting({ grantTypes: [] })
            history.push("/users");
        } else {
            history.push("/users");
        }
    };

    const navigateToNext = () => {
        setCurrentWizardStep(currentWizardStep + 1);
    };

    const navigateToPrevious = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    const STEPS = [
        {
            content: (
                <AddUser
                    userData={ generalSettingsData }
                    setUserData={ setGeneralSettings }
                    next={ navigateToNext }
                    isRoleModalOpen={ null }
                    handleRoleModalClose={ null }
                    handleRoleModalOpen={ null }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Basic user details"
        }
    ];

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                Add user
                <Heading as="h6">Create a new user in the system</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group header="Fill the following mandatory details of the user." current={ currentWizardStep }>
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => closeWizard() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <LinkButton floated="right" onClick={ navigateToNext }>Next Step</LinkButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ navigateToPrevious }>Previous step</LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the add user wizard.
 */
AddUserWizard.defaultProps = {
    currentStep: 0
};
