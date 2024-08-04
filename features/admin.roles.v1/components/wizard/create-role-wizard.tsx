/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants";
import { history } from "@wso2is/admin.core.v1/helpers";
import { getGroupList } from "@wso2is/admin.groups.v1/api";
import { CreateGroupMemberInterface, GroupsInterface } from "@wso2is/admin.groups.v1/models";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Grid, Icon, Modal } from "semantic-ui-react";
import { AssignGroupsUsers } from "./assign-groups-users";
import { RoleBasics } from "./role-basics";
import { PermissionList } from "./role-permission";
import { CreateRoleSummary } from "./role-sumary";
import { createRole } from "../../api/roles";
import { getRolesWizardStepIcons } from "../../configs/ui";
import { TreeNode } from "../../models/permission";
import { CreateRoleInterface, CreateRoleMemberInterface } from "../../models/roles";

/**
 * Interface which captures create role props.
 */
interface CreateRoleProps extends TestableComponentInterface {
    closeWizard: () => void;
    updateList: () => void;
    onCreateRoleRequested?: (role: CreateRoleInterface) => void;
    isAddGroup: boolean;
    initStep?: number;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    PERM_LIST = "PermissionList",
    USER_LIST = "UserList",
    GROUP_LIST = "GroupList",
    SUMMARY = "summary"
}

/**
 * Interface to capture current wizard state
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Component to handle addition of a new role to the system.
 *
 * @param props - props related to the create role wizard
 */
export const CreateRoleWizard: FunctionComponent<CreateRoleProps> = (props: CreateRoleProps): ReactElement => {

    const {
        closeWizard,
        initStep,
        updateList,
        isAddGroup,
        onCreateRoleRequested,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ selectedUserStore, setSelectedUserStrore ] = useState<string>("");

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitPermissionList, setSubmitPermissionList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ groupList, setGroupList ] = useState<GroupsInterface[]>([]);
    const [ tempGroupList, setTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState<GroupsInterface[]>([]);

    const [ tempUsersList, setTempUsersList ] = useState<UserBasicInterface[]>([]);
    const [ isEnded, setEnded ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    useEffect(() => {
        if (groupList.length < 1) {
            getGroupList(null)
                .then((response: AxiosResponse) => {
                    const groups: GroupsInterface[] = response.data.Resources.filter(
                        (group: GroupsInterface) => group.displayName.split("/").length === 1);

                    setGroupList(groups);
                });
        }
    }, []);

    useEffect(() => {
        if(!isEnded) {
            return;
        }

        if (wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]) {
            addRole(wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] ]);

    /**
     * Method to handle create role action when create role wizard finish action is triggered.
     *
     * @param basicData - basic data required to create role.
     */
    const addRole = (basicData: WizardStateInterface): void => {

        const users: CreateRoleMemberInterface[] = [];
        const groups: CreateGroupMemberInterface[] = [];
        const permissions: string[] = [];

        if (basicData?.UserList?.length > 0) {
            //TODO: [Fix Type] Type of the `UserList` needs to be defined in `WizardStateInterface`.
            basicData?.UserList?.forEach((user: any) => {
                users?.push({
                    display: user?.userName,
                    value: user?.id
                });
            });
        }

        if (basicData?.GroupList?.length > 0) {
            //TODO: [Fix Type] Type of the `GroupList` needs to be defined in `WizardStateInterface`.
            basicData?.GroupList?.forEach((group: any) => {
                groups?.push({
                    display: group.displayName,
                    value: group.id
                });
            });
        }

        if (basicData?.PermissionList?.length > 0) {
            basicData?.PermissionList?.forEach((permission: TreeNode) => {
                permissions?.push(permission?.key.toString());
            });
        }

        const roleData: CreateRoleInterface = {
            "displayName": basicData?.BasicDetails ? basicData?.BasicDetails?.roleName : basicData?.roleName,
            "groups": groups,
            "permissions": permissions,
            "schemas": [
                "urn:ietf:params:scim:schemas:extension:2.0:Role"
            ],
            "users": users
        };

        setIsSubmitting(true);

        if (onCreateRoleRequested) {
            onCreateRoleRequested(roleData);
        } else {
            // Create Role API Call.
            createRole(roleData).then((response: AxiosResponse) => {
                if (response.status === 201) {
                    dispatch(
                        addAlert({
                            description: t("roles:notifications.createRole." +
                                "success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("roles:notifications.createRole.success.message")
                        })
                    );

                    closeWizard();
                    history.push(AppConstants.getPaths().get("ROLE_EDIT").replace(":id", response.data.id));
                }

            }).catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    closeWizard();
                    dispatch(
                        addAlert({
                            description: t("roles:notifications.createRole.error.description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:notifications.createRole.error.message")
                        })
                    );
                } else if (error.response && error.response.data.detail) {
                    closeWizard();
                    dispatch(
                        addAlert({
                            description: t("roles:notifications.createRole.error.description",
                                { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:notifications.createRole.error.message")
                        })
                    );
                } else {
                    closeWizard();
                    dispatch(addAlert({
                        description: t("roles:notifications.createRole." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("roles:notifications.createRole.genericError.message")
                    }));
                }
            }).finally(() => {
                setIsSubmitting(false);
            });
        }
    };

    /**
     * Method to handle the create role wizard finish action.
     *
     */
    const handleRoleWizardFinish = () => {
        addRole(wizardState);
    };

    /**
     * Generates a summary of the wizard.
     *
     * @returns Summary of the wizard.
     */
    const generateWizardSummary = () => {
        if (!wizardState) {
            return;
        }

        return wizardState;
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param formType - Type of the form.
     */
    const handleWizardSubmit = (values: any, formType: WizardStepsFormTypes) => {
        if (WizardStepsFormTypes.BASIC_DETAILS === formType) {
            setSelectedUserStrore(values.domain);
        }
        setCurrentWizardStep(currentStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
    };

    const handleGroupUserSubmit = (value: {
            [ WizardStepsFormTypes.USER_LIST ]: any;
            [ WizardStepsFormTypes.GROUP_LIST ]: any;
        }
    ): void => {
        setCurrentWizardStep(currentStep + 1);
        setWizardState({ ...wizardState, ...value });
    };

    const handleGroupListChange = (groupList: GroupsInterface[]) => {
        setGroupList(groupList);
    };

    const handleInitialGroupListChange = (groupList: GroupsInterface[]) => {
        setInitialGroupList(groupList);
    };

    const handleAddedGroupListChange = (newGroupList: GroupsInterface[]) => {
        setTempGroupList(newGroupList);
    };

    const handleAddedGroupInitialListChange = (newGroupList: GroupsInterface[]) => {
        setInitialTempGroupList(newGroupList);
    };

    // Create role wizard steps
    const WIZARD_STEPS: ({
        content: JSX.Element;
        icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
        title: string;
    } | {
        content: JSX.Element;
        icon: JSX.Element;
        title: string;
    })[] = [ {
        content: (
            <RoleBasics
                data-testid="add-role-form"
                isAddGroup={ isAddGroup }
                triggerSubmit={ submitGeneralSettings }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                onSubmit={ (values: any) => handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
            />
        ),
        icon: getRolesWizardStepIcons().general,
        title: t("roles:addRoleWizard.wizardSteps.0")
    },{
        content: (
            <PermissionList
                data-testid="new-role-permissions"
                isEdit={ false }
                triggerSubmit={ submitPermissionList }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.PERM_LIST ] }
                onSubmit={ (values: TreeNode[]) => handleWizardSubmit(values, WizardStepsFormTypes.PERM_LIST) }
                isSubmitting={ isSubmitting }
            />
        ),
        icon: <Icon name="key" inverted size="large" />,
        title: t("roles:addRoleWizard.wizardSteps.1")
    },{
        content: (
            <AssignGroupsUsers
                data-testid="role-mgt-assign-users-and-groups"
                initialUsersList={ tempUsersList }
                initialGroupList={
                    {
                        groupList: groupList,
                        initialGroupList: initialGroupList,
                        initialTempGroupList: initialTempGroupList,
                        tempGroupList: tempGroupList
                    }
                }
                onRoleUpdate={ updateList }
                selectedUserStore={ selectedUserStore }
                handleAddedGroupInitialListChange={
                    (groups: GroupsInterface[]) => handleAddedGroupInitialListChange(groups)
                }
                handleAddedGroupListChange={ (groups: GroupsInterface[]) => handleAddedGroupListChange(groups) }
                handleGroupListChange={ (groups: GroupsInterface[]) => handleGroupListChange(groups) }
                handleInitialGroupListChange={ (groups: GroupsInterface[]) => handleInitialGroupListChange(groups) }
                handleTempUsersListChange={ (list: UserBasicInterface[]) => {
                    setTempUsersList(list);
                } }
            />
        ),
        icon: getRolesWizardStepIcons().assignUser,
        title: t("roles:addRoleWizard.wizardSteps.4")
    },{
        content: (
            <CreateRoleSummary
                data-testid="add-role-summary"
                isAddGroup={ isAddGroup }
                triggerSubmit={ finishSubmit }
                onSubmit={ handleRoleWizardFinish }
                summary={ generateWizardSummary() }
            />
        ),
        icon: getRolesWizardStepIcons().summary,
        title: t("roles:addRoleWizard.wizardSteps.3")
    } ];

    /**
     * Function to change the current wizard step to next.
     */
    const changeStepToNext = (): void => {
        switch(currentStep) {
            case 0:
                setSubmitGeneralSettings();

                break;
            case 1:
                setSubmitPermissionList();

                break;
            case 2:
                handleGroupUserSubmit({
                    [ WizardStepsFormTypes.USER_LIST ]: tempUsersList,
                    [ WizardStepsFormTypes?.GROUP_LIST ]: tempGroupList
                });

                break;
            case 3:
                setFinishSubmit();

                break;

        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentStep);
    };

    const handleFinishFlow = () => {
        setEnded(true);
        setSubmitGeneralSettings();
    };

    return (
        <Modal
            open={ true }
            className="wizard create-role-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape= { false }
            data-testid={ testId }
        >
            <Modal.Header className="wizard-header">
                { t("roles:addRoleWizard.heading", { type: "Role" }) }
                {
                    wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.roleName
                        ? " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.roleName
                        : ""
                }
                <Heading as="h6">
                    {
                        t("roles:addRoleWizard.subHeading", { type: "role" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentStep }
                >
                    { WIZARD_STEPS.map((
                        step: {
                            content: JSX.Element;
                            icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
                            title: string;
                        } | {
                            content: JSX.Element;
                            icon: JSX.Element;
                            title: string;
                        },
                        index: number
                    ) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { WIZARD_STEPS[ currentStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-testid={ `${ testId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentStep < WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("roles:addRoleWizard.buttons.next") }
                                    <Icon name="arrow right" data-testid={ `${ testId }-next-button-icon` }/>
                                </PrimaryButton>
                            ) }
                            { currentStep === 0 && (
                                <Button
                                    basic
                                    color="orange"
                                    floated="right"
                                    onClick={ handleFinishFlow }
                                    data-testid={ `${ testId }-initial-finish-button` }
                                >
                                    { t("roles:addRoleWizard.buttons.finish") }
                                </Button>
                            ) }
                            { currentStep === WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    data-testid={ `${ testId }-finish-button` }
                                >
                                    { t("roles:addRoleWizard.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { currentStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" data-testid={ `${ testId }-previous-button-icon` }/>
                                    { t("roles:addRoleWizard.buttons.previous") }
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
 * Default props for Create role wizard component.
 * NOTE : Current step is set to 0 in order to start from
 *        beginning of the wizard.
 */
CreateRoleWizard.defaultProps = {
    initStep: 0
};
