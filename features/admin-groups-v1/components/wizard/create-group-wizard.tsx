/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Grid, Icon, Modal } from "semantic-ui-react";
import { GroupBasics } from "./group-basics";
import { CreateGroupSummary } from "./group-summary";
import useAuthorization from "../../../admin-authorization-v1/hooks/use-authorization";
import { AppConstants, AppState, AssignRoles, RolePermissions, history } from "../../../admin-core-v1";
import { getOrganizationRoles } from "../../../admin-organizations-v1/api";
import { OrganizationRoleManagementConstants } from "../../../admin-organizations-v1/constants/organization-constants";
import { useGetCurrentOrganizationType } from "../../../admin-organizations-v1/hooks/use-get-organization-type";
import {
    GenericOrganization,
    OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface
} from "../../../admin-organizations-v1/models";
import { getRolesList, updateRolesBulk } from "../../../admin-roles-v2/api";
import { PatchRoleDataInterface, RolesV2ResponseInterface } from "../../../admin-roles-v2/models";
import { WizardStepInterface } from "../../../admin-users-v1/models";
import { createGroup } from "../../api";
import { getGroupsWizardStepIcons } from "../../configs";
import {
    CreateGroupInterface,
    CreateGroupMemberInterface,
    CreateGroupUserInterface,
    GroupsInterface
} from "../../models";


/**
 * Interface which captures create group props.
 */
interface CreateGroupProps extends TestableComponentInterface {
    closeWizard: () => void;
    updateList: () => void;
    initStep?: number;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    USER_LIST = "UserList",
    ROLE_LIST = "RoleList",
    SUMMARY = "summary"
}

/**
 * Interface to capture current wizard state
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Component to handle addition of a new group to the system.
 *
 * @param props - props related to the create group wizard
 * @deprecated This component is deprecated.
 */
export const CreateGroupWizard: FunctionComponent<CreateGroupProps> = (props: CreateGroupProps): ReactElement => {

    const {
        closeWizard,
        initStep,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitRoleList, setSubmitRoleList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ viewRolePermissions, setViewRolePermissions ] = useState<boolean>(false);
    const [ isRoleSelected, setRoleSelection ] = useState<boolean>(false);
    const [ selectedRoleId, setSelectedRoleId ] = useState<string>();

    const [ roleList, setRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>([]);
    const [ isEnded, setEnded ] = useState<boolean>(false);
    const { legacyAuthzRuntime } = useAuthorization();

    const currentOrganization: GenericOrganization = useSelector((state: AppState) => state.organization.organization);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

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
        if (!selectedRoleId) {
            return;
        }

        if (isRoleSelected) {
            setViewRolePermissions(true);
        }
    }, [ isRoleSelected ]);

    useEffect(() => {
        if (roleList.length < 1) {
            if (isSuperOrganization() || isFirstLevelOrganization() || !legacyAuthzRuntime) {
                getRolesList(null)
                    .then((response: AxiosResponse<RolesV2ResponseInterface>) => {
                        setRoleList(response?.data?.Resources);
                    });
            } else {
                getOrganizationRoles(currentOrganization.id, null, 100, null)
                    .then((response: OrganizationRoleListResponseInterface) => {
                        if (!response.Resources) {
                            return;
                        }

                        const roles: OrganizationRoleListItemInterface[] = response.Resources
                            .filter((role: OrganizationRoleListItemInterface) =>
                                role.displayName !== OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME);

                        setRoleList(roles);
                    });
            }
        }
    }, []);

    useEffect(() => {
        if(!isEnded) {
            return;
        }

        if (wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]
            && wizardState[ WizardStepsFormTypes.USER_LIST ]) {
            addGroup(wizardState);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]
        && wizardState[ WizardStepsFormTypes.USER_LIST ] ]);

    const handleRoleIdSet = (roleId: string) => {
        setSelectedRoleId(roleId);
        setRoleSelection(true);
    };

    /**
     * Method to handle create group action when create group wizard finish action is triggered.
     *
     * @param groupDetails - basic data required to create group.
     */
    const addGroup = (groupDetails: WizardStateInterface): void => {
        setIsSubmitting(true);
        let groupName: string = "";

        groupDetails?.domain !== "primary"
            ? groupName = groupDetails?.BasicDetails
                ? groupDetails?.BasicDetails?.domain + "/" + groupDetails?.BasicDetails?.groupName
                : groupDetails?.domain + "/" + groupDetails?.groupName
            : groupName = groupDetails?.BasicDetails ? groupDetails?.BasicDetails?.groupName : groupDetails?.groupName;

        const members: CreateGroupMemberInterface[] = [];
        const users: CreateGroupUserInterface[] = groupDetails?.UserList;

        if (users?.length > 0) {
            users?.forEach((user: CreateGroupUserInterface) => {
                members?.push({
                    display: user.userName,
                    value: user.id
                });
            });
        }

        const groupData: CreateGroupInterface = {
            "displayName": groupName,
            "members" : members,
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:Group"
            ]
        };

        /**
         * Create Group API Call.
         */
        createGroup(groupData)
            .then((response: AxiosResponse<GroupsInterface>) => {
                if (response.status === 201) {

                    const createdGroup: GroupsInterface = response.data;
                    const rolesList: string[] = [];

                    if (groupDetails?.RoleList?.roles) {
                        groupDetails?.RoleList?.roles.forEach((role: RolesInterface) => {
                            rolesList?.push(role.id);
                        });
                    }

                    const roleData: PatchRoleDataInterface = {
                        "Operations": [ {
                            "op": "add",
                            "value": {
                                "groups": [ {
                                    "display": createdGroup.displayName,
                                    "value": createdGroup.id
                                } ]
                            }
                        } ],
                        "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
                    };

                    if (rolesList && rolesList.length > 0) {
                        updateRolesBulk(rolesList, roleData)
                            .then(() => {
                                dispatch(
                                    addAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createGroup.success.description"),
                                        level: AlertLevels.SUCCESS,
                                        message: t("console:manage.features.groups.notifications.createGroup.success." +
                                            "message")
                                    })
                                );

                                closeWizard();
                                history.push(AppConstants.getPaths().get("GROUP_EDIT")
                                    .replace(":id", response.data.id));
                            })
                            .catch((error: AxiosError) => {
                                if (!error.response || error.response.status === 401) {
                                    setAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createPermission." +
                                            "error.description"),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.createPermission." +
                                            "error.message")
                                    });
                                } else if (error.response && error.response.data.detail) {
                                    setAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createPermission." +
                                            "error.description",
                                        { description: error.response.data.detail }),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.createPermission." +
                                            "error.message")
                                    });
                                } else {
                                    setAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createPermission." +
                                            "genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.createPermission." +
                                            "genericError." +
                                            "message")
                                    });
                                }
                            }).finally(() => {
                                setIsSubmitting(false);
                            });
                    } else {
                        dispatch(
                            addAlert({
                                description: t("console:manage.features.groups.notifications." +
                                    "createGroup.success.description"),
                                level: AlertLevels.SUCCESS,
                                message: t("console:manage.features.groups.notifications.createGroup.success." +
                                    "message")
                            })
                        );

                        setIsSubmitting(false);
                        closeWizard();
                        history.push(AppConstants.getPaths().get("GROUP_EDIT")
                            .replace(":id", response.data.id));
                    }
                }
            }).catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.groups.notifications.createGroup." +
                                "error.description"),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.groups.notifications.createGroup.error.message")
                        })
                    );
                } else if (error.response && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.groups.notifications.createGroup.error.description",
                                { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.groups.notifications.createGroup.error.message")
                        })
                    );
                } else {
                    dispatch(addAlert({
                        description: t("console:manage.features.groups.notifications.createGroup." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.groups.notifications.createGroup.genericError.message")
                    }));
                }

                closeWizard();
                setIsSubmitting(false);
            });
    };

    /**
     * Method to handle the create group wizard finish action.
     *
     */
    const handleGroupWizardFinish = () => {
        addGroup(wizardState);
    };

    /**
     * Generates a summary of the wizard.
     *
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
        if (!isEnded) {
            setCurrentWizardStep(currentStep + 1);
        }

        if (WizardStepsFormTypes.BASIC_DETAILS === formType) {
            setWizardState({
                ...wizardState,
                [ WizardStepsFormTypes.BASIC_DETAILS ]: values.basicDetails,
                [ WizardStepsFormTypes.USER_LIST ]: values.userList
            });

            return;
        }

        setWizardState({ ...wizardState, [ formType ]: values });
    };

    const handleViewRolePermission = () => {
        setViewRolePermissions(!viewRolePermissions);
        setRoleSelection(false);
    };

    // Create group wizard steps
    const ALL_WIZARD_STEPS: WizardStepInterface[]  = [ {
        content: (
            <GroupBasics
                data-testid="add-group-form"
                triggerSubmit={ submitGeneralSettings }
                initialValues={ wizardState
                    && {
                        basicDetails: wizardState[WizardStepsFormTypes.BASIC_DETAILS],
                        userList: wizardState[WizardStepsFormTypes.USER_LIST]
                    }
                }
                onSubmit={ (values: any) => handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
            />
        ),
        icon: getGroupsWizardStepIcons().general,
        title: t("roles:addRoleWizard.wizardSteps.0")
    },{
        content: (
            viewRolePermissions
                ? (
                    <RolePermissions
                        data-testid={ `${ testId }-group-permission` }
                        handleNavigateBack={ handleViewRolePermission }
                        roleId={ selectedRoleId }
                    />
                )
                : (
                    <AssignRoles
                        triggerSubmit={ submitRoleList }
                        onSubmit={ (values: any) => handleWizardSubmit(values, WizardStepsFormTypes.ROLE_LIST) }
                        initialValues={ { roleList: roleList } }
                        handleSetRoleId={ (roleId: string) => handleRoleIdSet(roleId) }
                    />
                )
        ),
        icon: getGroupsWizardStepIcons().roles,
        title: t("roles:addRoleWizard.wizardSteps.5")
    },{
        content: (
            <CreateGroupSummary
                data-testid="add-group-summary"
                triggerSubmit={ finishSubmit }
                onSubmit={ handleGroupWizardFinish }
                summary={ generateWizardSummary() }
            />
        ),
        icon: getGroupsWizardStepIcons().summary,
        title: t("roles:addRoleWizard.wizardSteps.3")
    } ];

    const WIZARD_STEPS: WizardStepInterface[] = isSuperOrganization
        ? [ ...ALL_WIZARD_STEPS ]
        : [ ...ALL_WIZARD_STEPS.slice(0, 1), ...ALL_WIZARD_STEPS.slice(2) ];

    /**
     * Function to change the current wizard step to next.
     */
    const changeStepToNext = (): void => {
        switch(currentStep) {
            case 0:
                setSubmitGeneralSettings();

                break;
            case 1:
                isSuperOrganization
                    ? setSubmitRoleList()
                    : setFinishSubmit();

                break;
            case 2:
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
                {
                    t("roles:addRoleWizard.heading", { type: "Group" })
                }
                {
                    wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.groupName
                        ? " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.groupName
                        :""
                }
                <Heading as="h6">
                    {
                        t("roles:addRoleWizard.subHeading", { type: "group" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentStep }
                >
                    { WIZARD_STEPS.map((step: WizardStepInterface, index: number) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
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
                                    data-testid={ `${testId}-initial-finish-button` }
                                >
                                    { t("roles:addRoleWizard.buttons.finish") }
                                </Button>
                            ) }
                            { currentStep === WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-testid={ `${ testId }-finish-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
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
 * Default props for Create group wizard component.
 * NOTE : Current step is set to 0 in order to start from
 *        beginning of the wizard.
 */
CreateGroupWizard.defaultProps = {
    initStep: 0
};
