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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import intersection from "lodash-es/intersection";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AddGroupUsersUpdated } from "./group-assign-users-updated";
import { commonConfig } from "../../../../extensions/configs";
import useAuthorization from "../../../authorization/hooks/use-authorization";
import { AppConstants, AppState, AssignRoles, RolePermissions, history } from "../../../core";
import { EventPublisher } from "../../../core/utils";
import { getOrganizationRoles } from "../../../organizations/api";
import { OrganizationRoleManagementConstants } from "../../../organizations/constants";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import {
    GenericOrganization,
    OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface
} from "../../../organizations/models";
import { getRolesList, updateRole } from "../../../roles/api";
import { RoleConstants } from "../../../roles/constants";
import { BasicRoleInterface, PatchRoleDataInterface, RolesV2ResponseInterface } from "../../../roles/models";
import { UserBasicInterface } from "../../../admin-users-v1/models";
import { CONSUMER_USERSTORE, PRIMARY_USERSTORE } from "../../../admin-userstores-v1/constants";
import { createGroup } from "../../api";
import { getGroupsWizardStepIcons } from "../../configs";
import {
    CreateGroupInterface,
    CreateGroupMemberInterface,
    GroupCreateBasicDetailsInterface,
    GroupCreateInterface,
    WizardStateInterface,
    WizardStepInterface,
    WizardStepsFormTypes
} from "../../models";

/**
 * Interface which captures create group props.
 */
interface CreateGroupProps extends IdentifiableComponentInterface {
    /**
     * Callback for the wizard close event.
     */
    closeWizard: () => void;
    /**
     * Callback for the group create event.
     */
    onCreate: () => void;
    /**
     * Initial step of the wizard.
     */
    initStep?: number;
    /**
     * Required steps for the wizard.
     */
    requiredSteps?: WizardStepsFormTypes[] | string[];
    /**
     * Should the wizard show the steps.
     */
    showStepper?: boolean;
}

/**
 * Component to handle addition of a new group to the system.
 *
 * @param props - props related to the create group wizard Member
 */
export const CreateGroupWizardUpdated: FunctionComponent<CreateGroupProps> =
(props: CreateGroupProps): ReactElement => {

    const {
        closeWizard,
        initStep,
        showStepper,
        requiredSteps,
        onCreate,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const { legacyAuthzRuntime } = useAuthorization();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitRoleList, setSubmitRoleList ] = useTrigger();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>(undefined);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(
        commonConfig?.primaryUserstoreOnly ? PRIMARY_USERSTORE : CONSUMER_USERSTORE);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ roleList, setRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>([]);
    const [ isWizardActionDisabled, setIsWizardActionDisabled ] = useState<boolean>(true);
    const [ selectedRoleId, setSelectedRoleId ] = useState<string>();
    const [ isRoleSelected, setRoleSelection ] = useState<boolean>(false);
    const [ viewRolePermissions, setViewRolePermissions ] = useState<boolean>(false);
    const [ submitStep, setSubmitStep ] = useState<WizardStepsFormTypes>(undefined);

    const featureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRoles);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const currentOrganization: GenericOrganization = useSelector((state: AppState) => state.organization.organization);

    const isRoleReadOnly: boolean = useMemo(() => {
        return (
            !isFeatureEnabled(
                featureConfig,
                RoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE")
            ) || !hasRequiredScopes(
                featureConfig,
                featureConfig?.scopes?.update,
                allowedScopes
            )
        );
    }, [ featureConfig, allowedScopes ]);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (!isRoleReadOnly) {
            setWizardSteps(filterSteps([
                WizardStepsFormTypes.BASIC_DETAILS,
                WizardStepsFormTypes.ROLE_LIST
            ]));

            setSubmitStep(WizardStepsFormTypes.ROLE_LIST);
        } else {
            setWizardSteps(filterSteps([
                WizardStepsFormTypes.BASIC_DETAILS
            ]));

            setSubmitStep(WizardStepsFormTypes.BASIC_DETAILS);
        }

        if (roleList?.length < 1) {
            if (isFirstLevelOrganization() || !legacyAuthzRuntime) {
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
        if (wizardState?.BasicDetails?.basic?.basicDetails?.domain) {
            setSelectedUserStore(wizardState?.BasicDetails?.basic?.basicDetails?.domain);
        }
    }, [ wizardState ]);


    const handleRoleIdSet = (roleId: string) => {
        setSelectedRoleId(roleId);
        setRoleSelection(true);
    };

    /**
     * Method to handle create group action when create group wizard finish action is triggered.
     *
     * @param groupDetails - basic data required to create group.
     */
    const addGroup = (groupDetails: GroupCreateInterface): void => {
        let groupName: string = "";

        const basicWizardData: GroupCreateBasicDetailsInterface = groupDetails.BasicDetails;

        if (selectedUserStore === PRIMARY_USERSTORE) {
            groupName = basicWizardData?.basic?.basicDetails
                ? basicWizardData?.basic?.basicDetails?.groupName
                : basicWizardData?.groupName;
        } else {
            groupName = basicWizardData?.basic?.basicDetails
                ? basicWizardData?.basic?.basicDetails?.domain + "/" + basicWizardData?.basic?.basicDetails?.groupName
                : basicWizardData?.domain + "/" + basicWizardData?.groupName;
        }

        const members: CreateGroupMemberInterface[] = [];
        const users: UserBasicInterface[] = basicWizardData?.users;

        if (users?.length > 0) {
            users?.forEach((user: UserBasicInterface) => {
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

        setIsSubmitting(true);

        /**
         * Create Group API Call.
         */
        createGroup(groupData).then((response: AxiosResponse) => {
            if (response.status === 201) {
                const createdGroup: any = response.data;
                const rolesList: string[] = [];

                if (groupDetails?.RoleList?.roles) {
                    groupDetails?.RoleList?.roles.forEach((role: BasicRoleInterface) => {
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

                if (rolesList?.length > 0) {
                    Promise.all(rolesList.map((roleId: string) => {
                        return updateRole(roleId, roleData);
                    })).then(() => {
                        dispatch(
                            addAlert({
                                description: t("console:manage.features.groups.notifications.createGroup.success." +
                                    "description"),
                                level: AlertLevels.SUCCESS,
                                message: t("console:manage.features.groups.notifications.createGroup.success." +
                                    "message")
                            })
                        );
                        closeWizard();
                        history.push(AppConstants.getPaths().get("GROUP_EDIT").replace(":id", response.data.id));
                    }).catch((error: AxiosError) => {
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
                    });
                } else {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.groups.notifications.createGroup.success." +
                                "description"),
                            level: AlertLevels.SUCCESS,
                            message: t("console:manage.features.groups.notifications.createGroup.success." +
                                "message")
                        })
                    );
                    closeWizard();
                }
            }

            onCreate();
        }).catch((error: AxiosError)  => {
            if (!error.response || error.response.status === 401) {
                dispatch(
                    addAlert({
                        description: t("console:manage.features.groups.notifications.createGroup.error.description"),
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
                    description: t("console:manage.features.groups.notifications.createGroup.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.createGroup.genericError.message")
                }));
            }
        }).finally(() => {
            closeWizard();
            setIsSubmitting(false);
        });
    };

    /**
     * Method to handle the create group wizard finish action.
     */
    const handleGroupWizardFinish = (values: any) => {
        eventPublisher.publish("manage-groups-finish-create-new-group");

        addGroup(values);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param formType - Type of the form.
     */
    const handleWizardSubmit = (values: any, formType: WizardStepsFormTypes) => {
        if (formType === submitStep) {
            handleGroupWizardFinish({ ...wizardState, [ formType ]: values });

            return;
        }

        setWizardState({ ...wizardState, [ formType ]: values });
        setCurrentWizardStep(currentStep + 1);
    };

    /**
     * Function to change the current wizard step to next.
     */
    const changeStepToNext = (): void => {
        switch(currentStep) {
            case 0:
                setSubmitGeneralSettings();

                break;
            case 1:
                setSubmitRoleList();

                break;
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentStep);
    };

    const handleViewRolePermission = () => {
        setViewRolePermissions(!viewRolePermissions);
        setRoleSelection(false);
    };

    /**
     * Filters the steps evaluating the requested steps.
     */
    const filterSteps = (steps: WizardStepsFormTypes[]): WizardStepInterface[] => {

        const getStepContent = (stepsToFilter: WizardStepsFormTypes[] | string[]) => {

            const filteredSteps: WizardStepInterface[] = [];

            stepsToFilter.forEach((step: WizardStepsFormTypes) => {
                if (step === WizardStepsFormTypes.BASIC_DETAILS) {
                    filteredSteps.push(getBasicDetailsWizardStep());
                }
                if (step === WizardStepsFormTypes.ROLE_LIST) {
                    filteredSteps.push(getRoleAssignmentWizardStep());
                }
            });

            return filteredSteps;
        };

        if (requiredSteps?.length < 1) {
            return getStepContent(steps);
        }

        return getStepContent(intersection(steps, requiredSteps));
    };

    /**
     * Get the wizard basic step.
     *
     * @returns basic details wizard step.
     */
    const getBasicDetailsWizardStep = (): WizardStepInterface => {
        return {
            content: (
                <AddGroupUsersUpdated
                    data-componentid="new-group"
                    isEdit={ false }
                    triggerSubmit={ submitGeneralSettings }
                    selectedUserStore={ selectedUserStore }
                    setSelectedUserStore={ setSelectedUserStore }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    onSubmit={ (values: any) => handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                    onUserFetchRequestFinish={ () => setIsWizardActionDisabled(false) }
                />
            ),
            icon: getGroupsWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("roles:addRoleWizard.wizardSteps.0")
        };
    };

    /**
     * Get the wizard role assignment step
     *
     * @returns wizard role assignment step.
     */
    const getRoleAssignmentWizardStep = (): WizardStepInterface => {
        return {
            content: (
                viewRolePermissions
                    ? (
                        <RolePermissions
                            data-componentid={ `${ componentId }-group-permission` }
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
            name: WizardStepsFormTypes.ROLE_LIST,
            title: t("roles:addRoleWizard.wizardSteps.5")
        };
    };

    /**
     * Resolves the step content.
     *
     * @returns step content.
     */
    const resolveStepContent = (): ReactElement => {
        if (!wizardSteps) {
            return null;
        }

        switch (wizardSteps[currentStep]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                return getBasicDetailsWizardStep()?.content;
            case WizardStepsFormTypes.ROLE_LIST:
                return getRoleAssignmentWizardStep()?.content;
        }
    };

    const WIZARD_STEPS: WizardStepInterface[] = !isRoleReadOnly
        ? [ getBasicDetailsWizardStep(), getRoleAssignmentWizardStep() ]
        : [ getBasicDetailsWizardStep() ];

    return (
        <Modal
            open
            className="wizard create-role-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape= { false }
            data-componentid={ componentId }
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
                <Heading as="h6">Create new group and add users to the group.</Heading>
            </Modal.Header>
            {
                showStepper && !isRoleReadOnly && (
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
                )
            }
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { resolveStepContent() }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentStep < wizardSteps?.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    disabled={ isWizardActionDisabled }
                                    data-componentid={ `${ componentId }-next-button` }
                                >
                                    { t("roles:addRoleWizard.buttons.next") }
                                    <Icon name="arrow right" data-componentid={ `${ componentId }-next-button-icon` }/>
                                </PrimaryButton>
                            ) }
                            { currentStep === wizardSteps?.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-componentid={ `${ componentId }-finish-button` }
                                    disabled={ isWizardActionDisabled || isSubmitting }
                                    loading={ isSubmitting }
                                >
                                    { t("roles:addRoleWizard.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { (wizardSteps?.length > 1 && currentStep > 0) && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-componentid={ `${ componentId }-previous-button` }
                                    disabled={ isWizardActionDisabled }
                                >
                                    <Icon
                                        name="arrow left"
                                        data-componentid={ `${ componentId }-previous-button-icon` }
                                    />
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

CreateGroupWizardUpdated.defaultProps = {
    initStep: 0,
    showStepper: false
};
