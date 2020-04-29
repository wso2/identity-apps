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

import { FormValue, useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { BasicDetailsUserStore, ConnectionDetails, GroupDetails, SummaryUserStores, UserDetails } from "./wizards";
import { addUserStore } from "../../api";
import { ApplicationWizardStepIcons } from "../../configs";
import { USER_STORES_PATH } from "../../constants";
import { history } from "../../helpers";
import {
    AlertLevels,
    CategorizedProperties,
    UserStorePostData,
    UserStoreProperty,
    UserstoreType
} from "../../models";
import { addAlert } from "../../store/actions";
import { reOrganizeProperties } from "../../utils";

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
    /**
     * The userstore type.
     */
    type: UserstoreType;
}

/**
 * This component renders the Add Userstore Wizard
 * @param {AddUserStoreProps} props
 * @return {ReactElement}
 */
export const AddUserStore = (props: AddUserStoreProps): ReactElement => {

    const { open, onClose, type } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ basicDetailsData, setBasicDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ connectionDetailsData, setConnectionDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ userDetailsData, setUserDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ groupDetailsData, setGroupDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ userStore, setUserStore ] = useState<UserStorePostData>(null);
    const [ properties, setProperties ] = useState<CategorizedProperties>(null);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();
    const [ thirdStep, setThirdStep ] = useTrigger();
    const [ fourthStep, setFourthStep ] = useTrigger();

    const dispatch = useDispatch();

    useEffect(() => {
        type && setProperties(reOrganizeProperties(type.properties));
    }, [ type ]);

    useEffect(() => {
        userStore && setCurrentWizardStep(4);
    }, [ userStore ]);

    useEffect(() => {
        groupDetailsData && serializeData();
    }, [ groupDetailsData ]);

    /**
     * Adds the userstore
     */
    const handleSubmit = () => {
        addUserStore(userStore).then(() => {
            dispatch(addAlert({
                description: "The userstore has been added successfully!",
                level: AlertLevels.SUCCESS,
                message: "Userstore added successfully!"
            }))
            dispatch(addAlert({
                description: "It may take a while for the userstore list to be updated. " +
                    "Refresh in a few seconds to get the updated userstore list.",
                level: AlertLevels.WARNING,
                message: "Updating Userstore list takes time"
            }));
            onClose();
            history.push(USER_STORES_PATH);
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description ?? "There was an error while creating the userstore",
                level: AlertLevels.ERROR,
                message: error?.message ?? "Something went wrong!"
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
     */
    const onSubmitConnectionDetails = (values: Map<string, FormValue>) => {
        setConnectionDetailsData(values);
        setCurrentWizardStep(2);
    }

    const onSubmitUserDetails = (values: Map<string, FormValue>) => {
        setUserDetailsData(values);
        setCurrentWizardStep(3);
    }

    const onSubmitGroupDetails = (values: Map<string, FormValue>) => {
        setGroupDetailsData(values);
    }

    const serializeData = () => {
        const userStore: UserStorePostData = {
            description: basicDetailsData?.get("description")?.toString(),
            name: basicDetailsData?.get("name")?.toString(),
            properties: serializeProperties(),
            typeId: type?.typeId
        };

        setUserStore(userStore);
    }

    const serializeProperties = (): UserStoreProperty[] => {
        const connectionProperties: UserStoreProperty[] = properties.connection.required.map(property => {
            return {
                name: property.name,
                value: connectionDetailsData.get(property.name).toString()
            }
        });

        const userProperties: UserStoreProperty[] = properties.user.required.map(property => {
            return {
                name: property.name,
                value: userDetailsData.get(property.name).toString()
            }
        });

        const groupProperties: UserStoreProperty[] = properties.group.required.map(property => {
            return {
                name: property.name,
                value: groupDetailsData.get(property.name).toString()
            }
        });

        return [ ...connectionProperties, ...userProperties, ...groupProperties ];
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
            icon: ApplicationWizardStepIcons.general,
            title: "Basic userstore details"
        },
        {
            content: (
                <ConnectionDetails
                    submitState={ secondStep }
                    onSubmit={ onSubmitConnectionDetails }
                    values={ connectionDetailsData }
                    type={ type }
                    properties={ properties?.connection?.required }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Connection details"
        },
        {
            content: (
                <UserDetails
                    submitState={ thirdStep }
                    onSubmit={ onSubmitUserDetails }
                    values={ userDetailsData }
                    properties={ properties?.user?.required }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "User details"
        },
        {
            content: (
                <GroupDetails
                    submitState={ fourthStep }
                    onSubmit={ onSubmitGroupDetails }
                    values={ groupDetailsData }
                    properties={ properties?.group?.required }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Group details"
        },
        {
            content: (
                <SummaryUserStores
                    data={ userStore }
                    connectionProperties={ properties?.connection?.required }
                    userProperties={ properties?.user?.required }
                    groupProperties={ properties?.group?.required }
                    type={ type?.typeName }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Summary"
        }
    ];

    /**
     * Moves to the next step in the wizard
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
                setThirdStep();
                break;
            case 3:
                setFourthStep();
                break;
            case 4:
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
            size="large"
            className="wizard application-create-wizard"
        >
            <Modal.Header className="wizard-header">
                Add Userstore
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    header="Fill in the following details to create a userstore."
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Next <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ previous }>
                                    <Icon name="arrow left" /> Previous
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}
