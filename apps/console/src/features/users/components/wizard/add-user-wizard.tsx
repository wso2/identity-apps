/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import cloneDeep from "lodash-es/cloneDeep";
import merge from "lodash-es/merge";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { RolePermissions } from "./user-role-permissions";
import { AddUserWizardSummary } from "./wizard-summary";
// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { SCIMConfigs } from "../../../../extensions/configs/scim";
import { AppConstants } from "../../../core/constants";
import { history } from "../../../core/helpers";
import { AppState } from "../../../core/store";
import { getGroupList, updateGroupDetails } from "../../../groups/api";
import { getOrganizationRoles } from "../../../organizations/api";
import { OrganizationRoleManagementConstants } from "../../../organizations/constants";
import { OrganizationResponseInterface, OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface } from "../../../organizations/models";
import { OrganizationUtils } from "../../../organizations/utils";
import { getRolesList, updateRoleDetails } from "../../../roles/api";
import { addUser } from "../../api";
import { getUserWizardStepIcons } from "../../configs";
import { AddUserWizardStateInterface, PayloadInterface, UserDetailsInterface,
    WizardStepInterface, createEmptyUserDetails } from "../../models";
import { AddUser } from "../add-user";
import { AddUserGroup } from "../add-user-groups";
import { AddUserRole } from "../add-user-role";

interface AddUserWizardPropsInterface extends TestableComponentInterface {
    closeWizard: () => void;
    currentStep?: number;
    listOffset: number;
    listItemLimit: number;
    updateList: () => void;
    rolesList: any;
    emailVerificationEnabled: boolean;
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
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    ROLE_LIST= "RoleList",
    GROUP_LIST= "GroupList",
    SUMMARY = "summary"
}

/**
 * User creation wizard.
 *
 * @returns User creation wizard.
 */
export const AddUserWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        emailVerificationEnabled,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitRoleList, setSubmitRoleList ] = useTrigger();
    const [ submitGroupList, setSubmitGroupList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

    const [ roleList, setRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>([]);
    const [ tempRoleList, setTempRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>(
        []);
    const [ initialRoleList, setInitialRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>(
        []);
    const [ initialTempRoleList, setInitialTempRoleList ] = useState<RolesInterface[]
        | OrganizationRoleListItemInterface[]>([]);

    const [ groupList, setGroupsList ] = useState<RolesInterface[]>([]);
    const [ tempGroupList, setTempGroupList ] = useState<RolesInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<RolesInterface[]>([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState<RolesInterface[]>([]);

    const [ viewRolePermissions, setViewRolePermissions ] = useState<boolean>(false);
    const [ selectedRoleId,  setSelectedRoleId ] = useState<string>();
    const [ isRoleSelected, setRoleSelection ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ viewNextButton, setViewNextButton ] = useState<boolean>(true);

    const currentOrganization: OrganizationResponseInterface = useSelector((state: AppState) =>
        state.organization.organization);
    const isRootOrganization: boolean = useMemo(() =>
        OrganizationUtils.isRootOrganization(currentOrganization), [ currentOrganization ]);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {
        if (currentWizardStep != 3) {
            setViewRolePermissions(false);
        }
        setViewNextButton(true);
    }, [ currentWizardStep ]);

    useEffect(() => {
        if (!selectedRoleId) {
            return;
        }

        if (isRoleSelected) {
            setViewRolePermissions(true);
        }
    }, [ isRoleSelected ]);

    useEffect(() => {
        if (initialRoleList.length === 0) {
            if (isRootOrganization) {
                // Get Roles from the SCIM API
                getRolesList(null)
                    .then((response: AxiosResponse) => {
                        setRoleList(response.data.Resources);
                        setInitialRoleList(response.data.Resources);
                    });
            } else {
                // Get Roles from the Organization API
                getOrganizationRoles(currentOrganization.id, null, 100, null)
                    .then((response: OrganizationRoleListResponseInterface) => {
                        if (!response.Resources) {
                            return;
                        }

                        const roles: OrganizationRoleListItemInterface[] = response.Resources
                            .filter((role: OrganizationRoleListItemInterface) =>
                                role.displayName !== OrganizationRoleManagementConstants.ORG_CREATOR_ROLE_NAME);

                        setRoleList(roles);
                        setInitialRoleList(roles);
                    });
            }
        }

    }, []);

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
        if ( wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain) {
            getGroupListForDomain(wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain ]);

    const getGroupListForDomain = (domain: string) => {
        getGroupList(domain)
            .then((response: AxiosResponse) => {
                setGroupsList(response.data.Resources);
                setInitialGroupList(response.data.Resources);
            });
    };

    const handleViewRolePermission = () => {
        setViewRolePermissions(!viewRolePermissions);
        setRoleSelection(false);
    };

    const handleViewNextButton = (show: boolean) => {
        setViewNextButton(show);
    };

    const handleRoleIdSet = (roleId: string) => {
        setSelectedRoleId(roleId);
        setRoleSelection(true);
    };

    const handleRoleListChange = (roleList: RolesInterface[] | OrganizationRoleListItemInterface[]) => {
        setRoleList(roleList);
    };

    const handleInitialRoleListChange = (roleList: RolesInterface[] | OrganizationRoleListItemInterface[]) => {
        setInitialRoleList(roleList);
    };

    const handleAddedListChange = (newRoleList: RolesInterface[] | OrganizationRoleListItemInterface[]) => {
        setTempRoleList(newRoleList);
    };

    const handleAddedRoleInitialListChange = (newRoleList: RolesInterface[] | OrganizationRoleListItemInterface[]) => {
        setInitialTempRoleList(newRoleList);
    };

    const handleGroupListChange = (groupList: RolesInterface[]) => {
        setGroupsList(groupList);
    };

    const handleInitialGroupListChange = (groupList: RolesInterface[]) => {
        setInitialGroupList(groupList);
    };

    const handleAddedGroupListChange = (newGroupList: RolesInterface[]) => {
        setTempGroupList(newGroupList);
    };

    const handleAddedGroupInitialListChange = (newGroupList: RolesInterface[]) => {
        setInitialTempGroupList(newGroupList);
    };

    const navigateToNext = () => {
        switch (currentWizardStep) {
            case 0:
                setSubmitGeneralSettings();

                break;
            case 1:
                setSubmitGroupList();

                break;
            case 2:
                OrganizationUtils.isCurrentOrganizationRoot()
                    ? setSubmitRoleList()
                    : setFinishSubmit();

                break;
            case 3:
                setFinishSubmit();
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * This function handles assigning the roles to the user.
     */
    const assignUserRole = (user: any, roles: any, groups: any) => {
        const roleIds: string[] = [];
        const groupIds: string[] = [];

        // Payload for the update role request.
        const roleData: PayloadInterface = {
            Operations: [
                {
                    op: "add",
                    value: {
                        users: [
                            {
                                display: user.userName,
                                value: user.id
                            }
                        ]
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        // Payload for the update group request.
        const groupData: PayloadInterface = {
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
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (roles.length > 0) {
            roles.map((role: RolesInterface | OrganizationRoleListItemInterface) => {
                roleIds.push(role.id);
            });

            for (const roleId of roleIds) {
                updateRoleDetails(roleId, roleData)
                    .catch((error: AxiosError) => {
                        if (!error.response || error.response.status === 401) {
                            setAlert({
                                description: t(
                                    "console:manage.features.users.notifications.addUser.error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.users.notifications.addUser.error.message"
                                )
                            });
                        } else if (error.response && error.response.data && error.response.data.detail) {

                            setAlert({
                                description: t(
                                    "console:manage.features.users.notifications.addUser.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.users.notifications.addUser.error.message"
                                )
                            });
                        } else {
                            // Generic error message
                            setAlert({
                                description: t(
                                    "console:manage.features.users.notifications.addUser.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.users.notifications.addUser.genericError.message"
                                )
                            });
                        }
                    });
            }
        }

        if (groups.length > 0) {
            groups.map((group: RolesInterface) => {
                groupIds.push(group.id);
            });

            for (const groupId of groupIds) {
                updateGroupDetails(groupId, groupData)
                    .catch((error: AxiosError) => {
                        if (!error.response || error.response.status === 401) {
                            setAlert({
                                description: t(
                                    "console:manage.features.users.notifications.addUser.error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.users.notifications.addUser.error.message"
                                )
                            });
                        } else if (error.response && error.response.data && error.response.data.detail) {

                            setAlert({
                                description: t(
                                    "console:manage.features.users.notifications.addUser.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.users.notifications.addUser.error.message"
                                )
                            });
                        } else {
                            // Generic error message
                            setAlert({
                                description: t(
                                    "console:manage.features.users.notifications.addUser.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.users.notifications.addUser.genericError.message"
                                )
                            });
                        }
                    });
            }
        }
    };

    /**
     * This function handles adding the user.
     */
    const addUserBasic = (userInfo: AddUserWizardStateInterface) => {
        let userName: string = "";

        userInfo.domain !== "primary"
            ? userName = userInfo.domain + "/" + userInfo.userName
            : userName = userInfo.userName;

        let userDetails: UserDetailsInterface = createEmptyUserDetails();
        const password: string = userInfo.newPassword;

        userInfo.passwordOption && userInfo.passwordOption !== "ask-password"
            ? (
                userDetails = {
                    emails:[
                        {
                            primary: true,
                            value: userInfo.email
                        }
                    ],
                    name: {
                        familyName: userInfo.lastName,
                        givenName: userInfo.firstName
                    },
                    password,
                    profileUrl: userInfo.profileUrl,
                    userName
                }
            )
            : (
                userDetails = {
                    emails: [
                        {
                            primary: true,
                            value: userInfo.email
                        }
                    ],
                    name: {
                        familyName: userInfo.lastName,
                        givenName: userInfo.firstName
                    },
                    password: userInfo.newPassword,
                    profileUrl: userInfo.profileUrl,
                    [SCIMConfigs.scim.enterpriseSchema] : {
                        askPassword: "true"
                    },
                    userName
                }
            );

        setIsSubmitting(true);

        addUser(userDetails)
            .then((response: AxiosResponse) => {
                if (response.status === 202) {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.users.notifications.addUserPendingApproval.success.description"
                        ),
                        level: AlertLevels.WARNING,
                        message: t(
                            "console:manage.features.users.notifications.addUserPendingApproval.success.message"
                        )
                    }));
                } else { 
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.users.notifications.addUser.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.users.notifications.addUser.success.message"
                        )
                    }));

                    if (wizardState?.RoleList?.roles && wizardState?.GroupList?.groups) {
                        assignUserRole(response.data, wizardState.RoleList.roles, wizardState.GroupList.groups);
                    }
                    history.push(AppConstants.getPaths().get("USER_EDIT").replace(":id", response.data.id));
                }

                closeWizard();
            })
            .catch((error: AxiosError) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    closeWizard();
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.users.notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.users.notifications.addUser.error.message"
                        )
                    }));
                } else if (error.response && error.response.data && error.response.data.detail) {
                    closeWizard();
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.users.notifications.addUser.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.users.notifications.addUser.error.message"
                        )
                    }));
                } else {
                    closeWizard();
                    // Generic error message
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.users.notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.users.notifications.addUser.genericError.message"
                        )
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {
        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
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

        const wizardData: WizardStateInterface = { ...wizardState };

        let summary: WizardStateInterface = {};

        for (const value of Object.values(wizardData)) {
            summary = {
                ...summary,
                ...value
            };
        }

        return merge(cloneDeep(summary));
    };

    const handleWizardFormFinish = (user: AddUserWizardStateInterface) => {
        addUserBasic(user);
    };

    /**
     * Persists the profile image change done from the summary view in wizard state.
     *
     * @param url - Profile URL.
     */
    const handleProfileImageChange = (url: string): void => {
        setWizardState({
            ...wizardState,
            [ WizardStepsFormTypes.BASIC_DETAILS ]: {
                ...wizardState[ WizardStepsFormTypes.BASIC_DETAILS ],
                profileUrl: url
            }
        });
    };

    const ALL_STEPS: WizardStepInterface[] = [
        {
            content: (
                <AddUser
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    emailVerificationEnabled={ emailVerificationEnabled }
                    onSubmit={ (values: AddUserWizardStateInterface) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                />
            ),
            icon: getUserWizardStepIcons().general,
            title: t("console:manage.features.user.modals.addUserWizard.steps.basicDetails")
        },
        {
            content: (
                <AddUserGroup
                    triggerSubmit={ submitGroupList }
                    onSubmit={ (values: AddUserWizardStateInterface) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.GROUP_LIST) }
                    initialValues={
                        {
                            groupList: groupList,
                            initialGroupList: initialGroupList,
                            initialTempGroupList: initialTempGroupList,
                            tempGroupList: tempGroupList
                        }
                    }
                    handleGroupListChange={ (groups: RolesInterface[]) => handleGroupListChange(groups) }
                    handleTempListChange={ (groups: RolesInterface[]) => handleAddedGroupListChange(groups) }
                    handleInitialTempListChange={ (groups: RolesInterface[]) =>
                        handleAddedGroupInitialListChange(groups) }
                    handleInitialGroupListChange={ (groups: RolesInterface[]) => handleInitialGroupListChange(groups) }
                    handleSetGroupId={ null }
                />
            ),
            icon: getUserWizardStepIcons().groups,
            title: t("console:manage.features.user.modals.addUserWizard.steps.groups")
        },
        {
            content: (
                viewRolePermissions
                    ? (<RolePermissions
                        data-testid={ `${ testId }-role-permission` }
                        handleNavigateBack={ handleViewRolePermission }
                        handleViewNextButton={ handleViewNextButton }
                        roleId={ selectedRoleId }
                    />)
                    : (<AddUserRole
                        triggerSubmit={ submitRoleList }
                        onSubmit={ (values: AddUserWizardStateInterface) =>
                            handleWizardFormSubmit(values, WizardStepsFormTypes.ROLE_LIST) }
                        initialValues={
                            {
                                initialRoleList: initialRoleList,
                                initialTempRoleList: initialTempRoleList,
                                roleList: roleList,
                                tempRoleList: tempRoleList
                            }
                        }
                        handleRoleListChange={ (roles: RolesInterface[] |
                             OrganizationRoleListItemInterface[]) => handleRoleListChange(roles) }
                        handleTempListChange={ (roles: RolesInterface[] |
                             OrganizationRoleListItemInterface[]) => handleAddedListChange(roles) }
                        handleInitialTempListChange={ (roles: RolesInterface[] |
                             OrganizationRoleListItemInterface[]) => handleAddedRoleInitialListChange(roles) }
                        handleInitialRoleListChange={ (roles: RolesInterface[] |
                             OrganizationRoleListItemInterface[]) => handleInitialRoleListChange(roles) }
                        handleSetRoleId={ (roleId: string) => handleRoleIdSet(roleId) }
                    />)
            ),
            icon: getUserWizardStepIcons().roles,
            title: t("console:manage.features.user.modals.addUserWizard.steps.roles")
        },
        {
            content: (
                <AddUserWizardSummary
                    triggerSubmit={ finishSubmit }
                    onSubmit={ handleWizardFormFinish }
                    summary={ generateWizardSummary() }
                    onProfileImageChange={ handleProfileImageChange }
                />
            ),
            icon: getUserWizardStepIcons().summary,
            title: t("console:manage.features.user.modals.addUserWizard.steps.summary")
        }
    ];

    const STEPS: WizardStepInterface[] = OrganizationUtils.isCurrentOrganizationRoot()
        ? [ ...ALL_STEPS ]
        : [ ...ALL_STEPS.slice(0, 2), ...ALL_STEPS.slice(3) ];


    return (
        <Modal
            data-testid={ testId }
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { t("console:manage.features.user.modals.addUserWizard.title") }
                {
                    wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName
                        ? " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName
                        : ""
                }
                <Heading as="h6">{ t("console:manage.features.user.modals.addUserWizard.subTitle") }</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { STEPS.map((step: WizardStepInterface, index: number) => (
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
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${ testId }-cancel-button` }
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && viewNextButton && (
                                <PrimaryButton
                                    data-testid={ `${ testId }-next-button` }
                                    floated="right"
                                    onClick={ navigateToNext }
                                >
                                    { t("console:manage.features.user.modals.addUserWizard.buttons.next") }
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    data-testid={ `${ testId }-finish-button` }
                                    floated="right"
                                    onClick={ navigateToNext }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    data-testid={ `${ testId }-previous-button` }
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                >
                                    <Icon name="arrow left"/>
                                    { t("console:manage.features.user.modals.addUserWizard.buttons.previous") }
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
    currentStep: 0,
    emailVerificationEnabled: false
};
