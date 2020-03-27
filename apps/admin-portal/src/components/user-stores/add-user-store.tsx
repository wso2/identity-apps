/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useState } from "react";
import { Modal, Grid, Icon } from "semantic-ui-react";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { FormValue, useTrigger } from "@wso2is/forms";
import { ApplicationWizardStepIcons } from "../../configs";
import { BasicDetailsUserStore, ConnectionDetails } from "./wizards";
import { SummaryUserStores } from "./wizards";
import { Type, UserStorePostData, AlertLevels } from "../../models";
import { addUserStore } from "../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "../../store/actions";

/**
 * Prop types of the `AddUserStore` component
 */
interface AddUserStoreProps {
    /**
     * Open modal
     */
    open: boolean;
    /**
     * Called when the modal is closed
     */
    onClose: () => void;

}

/**
 * This component renders the Add User Store Wizard
 * @param {AddUserStoreProps} props
 * @return {React.ReactElement}
 */
export const AddUserStore = (props: AddUserStoreProps): React.ReactElement => {

    const { open, onClose } = props;

    const [currentWizardStep, setCurrentWizardStep] = useState(0);
    const [basicDetailsData, setBasicDetailsData] = useState<Map<string, FormValue>>(null);
    const [connectionDetailsData, setConnectionDetailsData] = useState<Map<string, FormValue>>(null);
    const [type, setType] = useState<Type>(null);
    const [userStore, setUserStore] = useState<UserStorePostData>(null);

    const [firstStep, setFirstStep] = useTrigger();
    const [secondStep, setSecondStep] = useTrigger();

    const dispatch = useDispatch();

    /**
     * Adds the user store
     */
    const handleSubmit = () => {
        addUserStore(userStore).then(() => {
            dispatch(addAlert({
                message: "User Store added successfully!",
                description: "The user store has been added successfully!",
                level: AlertLevels.SUCCESS
            }))
            dispatch(addAlert({
                message: "Updating User Store list takes time",
                description: "It may take a while for the user store list to be updated. " +
                    "Refresh in a few seconds to get the updated user store list.",
                level: AlertLevels.WARNING
            }));
            onClose();
        }).catch(error => {
                dispatch(addAlert({
                    message: error?.message ?? "Something went wrong!",
                    description: error?.description ?? "There was an error while creating the user store",
                    level: AlertLevels.ERROR
                }))
            })
    };

    /**
     * This saves the Basic Details values
     * @param {Map<string, FormValue>} values Basic Details Values to be submitted
     */
    const onSubmitBasicDetails = (values: Map<string, FormValue>) => {
        setBasicDetailsData(values);
        setCurrentWizardStep(1);
    }

    /**
     * This saves the Connection Details values along with the te Type
     * @param {Map<string, FormValue>} values Connection Details Values
     * @param {Type} type 
     */
    const onSubmitConnectionDetails = (values: Map<string, FormValue>, type: Type) => {
        setConnectionDetailsData(values);
        setType(type);

        const data = new Map([...Array.from(basicDetailsData ?? []), ...Array.from(values ?? [])]);
        const userStore: UserStorePostData = {
            typeId: data.get("type")?.toString(),
            description: data.get("description")?.toString(),
            name: data.get("name")?.toString(),
            properties: type?.properties?.Mandatory?.map(property => {
                return {
                    name: property.name,
                    value: data.get(property.name)?.toString()
                }
            })
        };

        setUserStore(userStore);
        setCurrentWizardStep(2);
    }

    /**
     * This contains the wizard steps
     */
    const STEPS = [
        {
            content: (
                <BasicDetailsUserStore
                    submitState={ firstStep }
                    onSubmit={ onSubmitBasicDetails }
                    values={ basicDetailsData }
                />
            ),
            title: "Basic User Store Details",
            icon: ApplicationWizardStepIcons.general
        },
        {
            content: (
                <ConnectionDetails
                    submitState={ secondStep }
                    onSubmit={ onSubmitConnectionDetails }
                    values={ connectionDetailsData }
                    typeId={ basicDetailsData?.get("type").toString() }
                />
            ),
            title: "Connection Details",
            icon: ApplicationWizardStepIcons.general
        },
        {
            content: (
                <SummaryUserStores
                    data={ userStore }
                    properties={ type?.properties?.Mandatory }
                    type={ type?.name }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Summary"

        }
    ];

    /**
     * Moves to teh next step in the wizard
     */
    const next = () => {
        switch (currentWizardStep) {
            case 0:
                setFirstStep();
                break;
            case 1:
                setSecondStep();
                break;
            case 2:
                handleSubmit();
                break;
        }
    }

    /**
     * Moves to the previous step in the wizard
     */
    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    }

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
        >
            <Modal.Header className="wizard-header">
                Add a User Store
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    header="Fill in the following details to create a user store."
                    current={ currentWizardStep }
                >
                    {STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    ))}
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                {STEPS[currentWizardStep].content}
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            {currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Next Step <Icon name="arrow right" />
                                </PrimaryButton>
                            )}
                            {currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Finish</PrimaryButton>
                            )}
                            {currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ previous }>
                                    <Icon name="arrow left" /> Previous step
                                </LinkButton>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}
