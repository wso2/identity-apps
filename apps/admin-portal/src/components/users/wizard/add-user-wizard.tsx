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

import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { addUser, addUserRole, getGroupsList } from "../../../api";
import { ApplicationWizardStepIcons } from "../../../configs";
import { AlertLevels } from "../../../models";
import { addAlert } from "../../../store/actions";
import { AddUser } from "../add-user";
import { AddUserWizardSummary } from "./wizard-summary";
import { useTrigger } from "@wso2is/forms";
import { AddUserRole } from "../add-user-role";

interface AddUserWizardPropsInterface {
    closeWizard: () => void;
    currentStep?: number;
    listOffset: number;
    listItemLimit: number;
    updateList: () => void;
    rolesList: any;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    ROLE_LIST= "RoleList",
    SUMMARY = "summary"
}

/**
 * User creation wizard.
 *
 * @return {JSX.Element}
 */
export const AddUserWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        updateList,
        closeWizard,
        currentStep,
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitRoleList, setSubmitRoleList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

    const [ roleList, setRoleList ] = useState([]);
    const [ tempRoleList, setTempRoleList ] = useState([]);
    const [ initialRoleList, setInitialRoleList ] = useState([]);

    const getRolesList = (domain: string) => {
        getGroupsList(domain)
            .then((response) => {
                setRoleList(response.data.Resources);
            });
    };

    const getRoleListForDomain = (domain: string) => {
        getGroupsList(domain)
            .then((response) => {
                setRoleList([ ...roleList, ...response.data.Resources ]);
                setInitialRoleList([ ...roleList, ...response.data.Resources ]);
            });
    };

    const handleRoleListChange = (roleList) => {
        setRoleList(roleList);
    };

    const handleAddedListChange = (newRoleList) => {
        setTempRoleList(newRoleList);
    };

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    useEffect(() => {
        getRolesList("Application");
    }, []);

    useEffect(() => {
        if ( wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain) {
            getRoleListForDomain(wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain ]);

    const navigateToNext = () => {
        switch (currentWizardStep) {
            case 0:
                setSubmitGeneralSettings();
                break;
            case 1:
                setSubmitRoleList();
                break;
            case 2:
                setFinishSubmit();
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * This function handles assigning the roles to the user.
     */
    const assignUserRole = (user: any, roles: any) => {
        const roleIds = [];

        roles.map((role) => {
            roleIds.push(role.id);
        });
        const data = {
            Operations: [
                {
                    op: "add",
                    value: {
                        members: [
                            {
                                display: user.userName,
                                value: user.id
                            }
                        ]
                    }
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        };

        for (const roleId of roleIds) {
            addUserRole(data, roleId)
                .catch((error) => {
                    if (!error.response || error.response.status === 401) {
                        dispatch(addAlert({
                            description: t(
                                "devPortal:components.users.notifications.addUser.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "devPortal:components.users.notifications.addUser.error.message"
                            )
                        }));
                    } else if (error.response && error.response.data && error.response.data.detail) {

                        dispatch(addAlert({
                            description: t(
                                "devPortal:components.users.notifications.addUser.error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "devPortal:components.users.notifications.addUser.error.message"
                            )
                        }));
                    } else {
                        // Generic error message
                        dispatch(addAlert({
                            description: t(
                                "devPortal:components.users.notifications.addUser.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "devPortal:components.users.notifications.addUser.genericError.message"
                            )
                        }));
                    }
                });
        }
    };
    
    /**
     * This function handles adding the user.
     */
    const addUserBasic = (userInfo: any) => {
        let userName = "";
        userInfo.domain !== "primary" ? userName = userInfo.domain + "/" + userInfo.userName : userName =
            userInfo.userName;
        let userDetails = {};
        const password = userInfo.newPassword;

        userInfo.passwordOption && userInfo.passwordOption !== "askPw" ?
            (
                userDetails = {
                    emails:
                        [{
                            primary: true,
                            value: userInfo.email
                        }],
                    name:
                        {
                            familyName: userInfo.lastName,
                            givenName: userInfo.firstName
                        },
                    password,
                    userName
                }
            ) :
            (
                userDetails = {
                    "emails":
                        [{
                            primary: true,
                            value: userInfo.email
                        }],
                    "name":
                        {
                            familyName: userInfo.lastName,
                            givenName: userInfo.firstName
                        },
                    "password": "password",
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User":
                        {
                            askPassword: "true"
                        },
                    userName
                }
            );

        addUser(userDetails)
            .then((response) => {
                dispatch(addAlert({
                    description: t(
                        "devPortal:components.users.notifications.addUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "devPortal:components.users.notifications.addUser.success.message"
                    )
                }));

                if (wizardState.RoleList.roles && wizardState.RoleList.roles.length > 0) {
                    assignUserRole(response.data, wizardState.RoleList.roles)
                }
                updateList();
                closeWizard();
            })
            .catch((error) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    dispatch(addAlert({
                        description: t(
                            "devPortal:components.users.notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "devPortal:components.users.notifications.addUser.error.message"
                        )
                    }));
                } else if (error.response && error.response.data && error.response.data.detail) {

                    dispatch(addAlert({
                        description: t(
                            "devPortal:components.users.notifications.addUser.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "devPortal:components.users.notifications.addUser.error.message"
                        )
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t(
                            "devPortal:components.users.notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "devPortal:components.users.notifications.addUser.genericError.message"
                        )
                    }));
                }
            });
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {
        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
    };

    /**
     * Generates a summary of the wizard.
     *
     * @return {any}
     */
    const generateWizardSummary = () => {
        if (!wizardState) {
            return;
        }

        let summary = {};

        for (const value of Object.values(wizardState)) {
            summary = {
                ...summary,
                ...value
            };
        }

        return _.merge(_.cloneDeep(summary));
    };

    const handleWizardFormFinish = (user: any) => {
        addUserBasic(user);
    };

    const STEPS = [
        {
            content: (
                <AddUser
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Basic user details"
        },
        {
            content: (
                <AddUserRole
                    triggerSubmit={ submitRoleList }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.ROLE_LIST) }
                    initialValues={ { initialRoleList: initialRoleList, roleList: roleList, tempRoleList: tempRoleList } }
                    handleRoleListChange={ (roles) => handleRoleListChange(roles) }
                    handleTempListChange={ (roles) => handleAddedListChange(roles) }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Assign user roles"
        },
        {
            content: (
                <AddUserWizardSummary
                    triggerSubmit={ finishSubmit }
                    onSubmit={ handleWizardFormFinish }
                    summary={ generateWizardSummary() }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Summary"
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
                <Steps.Group header="Fill the following details to create the new user." current={ currentWizardStep }>
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
                                <PrimaryButton floated="right" onClick={ navigateToNext }>
                                    Next Step <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ navigateToNext }>
                                    Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ navigateToPrevious }>
                                    <Icon name="arrow left"/> Previous step
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
 * Default props for the add user wizard.
 */
AddUserWizard.defaultProps = {
    currentStep: 0
};
