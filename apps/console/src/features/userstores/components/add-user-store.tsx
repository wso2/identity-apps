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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { GeneralDetailsUserstore, GroupDetails, SummaryUserStores, UserDetails } from "./wizards";
import { AppConstants, history } from "../../core";
import { addUserStore } from "../api";
import { getAddUserstoreWizardStepIcons } from "../configs";
import { USERSTORE_TYPE_DISPLAY_NAMES } from "../constants";
import {
    CategorizedProperties,
    TypeProperty,
    UserStorePostData,
    UserStoreProperty,
    UserstoreType
} from "../models";
import { reOrganizeProperties } from "../utils";

/**
 * Prop types of the `AddUserStore` component
 */
interface AddUserStoreProps extends TestableComponentInterface {
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
 * This component renders the Add Userstore Wizard.
 *
 * @param {AddUserStoreProps} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const AddUserStore: FunctionComponent<AddUserStoreProps> = (props: AddUserStoreProps): ReactElement => {

    const {
        open,
        onClose,
        type,
        [ "data-testid" ]: testId
    } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ generalDetailsData, setGeneralDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ userDetailsData, setUserDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ groupDetailsData, setGroupDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ userStore, setUserStore ] = useState<UserStorePostData>(null);
    const [ properties, setProperties ] = useState<CategorizedProperties>(null);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();
    const [ thirdStep, setThirdStep ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {
        type && setProperties(reOrganizeProperties(type.properties));
    }, [ type ]);

    useEffect(() => {
        userStore && setCurrentWizardStep(3);
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
                description: t("console:manage.features.userstores.notifications.addUserstore.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("console:manage.features.userstores.notifications.addUserstore.success.message")
            }));
            dispatch(addAlert({
                description: t("console:manage.features.userstores.notifications.delay.description"),
                level: AlertLevels.WARNING,
                message: t("console:manage.features.userstores.notifications.delay.message")
            }));

            onClose();

            history.push(AppConstants.getPaths().get("USERSTORES"));
        }).catch(error => {
            setAlert({
                description: error?.description ?? t("console:manage.features.userstores.notifications.addUserstore" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message ?? t("console:manage.features.userstores.notifications.addUserstore" +
                    ".genericError.message")
            });
        });
    };

    /**
     * This saves the General Details values along with the Type
     * @param {Map<string, FormValue>} values Connection Details Values
     */
    const onSubmitGeneralDetails = (values: Map<string, FormValue>): void => {
        setGeneralDetailsData(values);
        setCurrentWizardStep(1);
    };

    const onSubmitUserDetails = (values: Map<string, FormValue>): void => {
        setUserDetailsData(values);
        setCurrentWizardStep(2);
    };

    const onSubmitGroupDetails = (values: Map<string, FormValue>): void => {
        setGroupDetailsData(values);
    };

    const serializeData = (): void => {
        const userStore: UserStorePostData = {
            description: generalDetailsData?.get("description")?.toString(),
            name: generalDetailsData?.get("name")?.toString(),
            properties: serializeProperties(),
            typeId: type?.typeId
        };

        setUserStore(userStore);
    };

    const serializeProperties = (): UserStoreProperty[] => {
        const connectionProperties: UserStoreProperty[] = properties.connection.required.map(property => {
            return {
                name: property.name,
                value: generalDetailsData.get(property.name)?.toString()
            };
        });

        const userProperties: UserStoreProperty[] = properties.user.required.map(property => {
            return {
                name: property.name,
                value: userDetailsData.get(property.name)?.toString()
            };
        });

        const groupProperties: UserStoreProperty[] = properties.group.required.map(property => {
            return {
                name: property.name,
                value: groupDetailsData.get(property.name)?.toString()
            };
        });

        const basicProperties: UserStoreProperty[] = properties.basic.required.map(property => {
            return {
                name: property.name,
                value: generalDetailsData.get(property.name)?.toString()
            };
        });

        const allProperties: UserStoreProperty[] = type.properties.Advanced.map((property: TypeProperty) => {
            return {
                name: property.name,
                value: property.defaultValue
            };
        });

        allProperties.push(
            ...type.properties.Mandatory.map((property: TypeProperty) => {
                return {
                    name: property.name,
                    value: property.defaultValue
                };
            }),
            ...type.properties.Optional.map((property: TypeProperty) => {
                return {
                    name: property.name,
                    value: property.defaultValue
                };
            })
        );

        const updatedProperties = [
            ...connectionProperties,
            ...userProperties,
            ...groupProperties,
            ...basicProperties
        ];

        return allProperties.map((property: UserStoreProperty) => {
            const updatedProperty = updatedProperties
                .find((updatedProperty: UserStoreProperty) => updatedProperty.name === property.name);

            if (updatedProperty) {
                return updatedProperty;
            }

            return property;
        });
    };

    /**
     * This contains the wizard steps
     */
    const STEPS = [
        {
            content: (
                <GeneralDetailsUserstore
                    submitState={ firstStep }
                    onSubmit={ onSubmitGeneralDetails }
                    values={ generalDetailsData }
                    type={ type }
                    connectionProperties={ properties?.connection?.required }
                    basicProperties={ properties?.basic?.required }
                    data-testid={ `${ testId }-general-details` }
                />
            ),
            icon: getAddUserstoreWizardStepIcons().general,
            title: t("console:manage.features.userstores.wizard.steps.general")
        },
        {
            content: (
                <UserDetails
                    submitState={ secondStep }
                    onSubmit={ onSubmitUserDetails }
                    values={ userDetailsData }
                    properties={ properties?.user?.required }
                    data-testid={ `${ testId }-user-details` }
                />
            ),
            icon: getAddUserstoreWizardStepIcons().general,
            title: t("console:manage.features.userstores.wizard.steps.user")
        },
        {
            content: (
                <GroupDetails
                    submitState={ thirdStep }
                    onSubmit={ onSubmitGroupDetails }
                    values={ groupDetailsData }
                    properties={ properties?.group?.required }
                    data-testid={ `${ testId }-group-details` }
                />
            ),
            icon: getAddUserstoreWizardStepIcons().general,
            title: t("console:manage.features.userstores.wizard.steps.group")
        },
        {
            content: (
                <SummaryUserStores
                    data={ userStore }
                    connectionProperties={ properties?.connection?.required }
                    userProperties={ properties?.user?.required }
                    groupProperties={ properties?.group?.required }
                    basicProperties={ properties?.basic?.required }
                    type={ type?.typeName }
                    data-testid={ `${ testId }-summary` }
                />
            ),
            icon: getAddUserstoreWizardStepIcons().general,
            title: t("console:manage.features.userstores.wizard.steps.summary")
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
                handleSubmit();
                break;
        }
    };

    /**
     * Moves to the previous step in the wizard
     */
    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            data-testid={ testId }
            closeOnDimmerClick={ false }
        >
            <Modal.Header className="wizard-header">
                { t("console:manage.features.userstores.wizard.header",
                    {
                        type: USERSTORE_TYPE_DISPLAY_NAMES[ type.typeName ]
                    })
                }
                {
                    generalDetailsData && generalDetailsData.get("name")
                        ? " - " + generalDetailsData.get("name")
                        : ""
                }
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                            data-testid={ `${ testId }-step-${ index }` }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>{ t("common:cancel") }</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("common:next") } <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-finish-button` }
                                >
                                    { t("common:finish") }</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ previous }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" /> { t("common:previous") }
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
AddUserStore.defaultProps = {
    "data-testid": "add-userstore-wizard"
};
