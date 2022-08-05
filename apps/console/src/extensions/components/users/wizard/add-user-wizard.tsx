/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

 import {
    AlertLevels,
    IdentifiableComponentInterface,
    ProfileSchemaInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { GenericIconProps, Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import intersection from "lodash-es/intersection";
import merge from "lodash-es/merge";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import {
    AddAdminUserBasic,
    AddConsumerUserBasic,
    AddConsumerUserBasicProps,
    AddConsumerUserGroups,
    AddConsumerUserWizardSummary,
    UserTypeSelection
} from "./steps";
import { AppState, UserBasicInterface } from "../../../../features/core";
import { GroupsInterface, getGroupList, updateGroupDetails } from "../../../../features/groups";
import { updateRoleDetails } from "../../../../features/roles";
import {
    AddUserWizardStateInterface,
    UserDetailsInterface,
    addUser,
    createEmptyUserDetails,
    getUserWizardStepIcons
} from "../../../../features/users";
import { SCIMConfigs } from "../../../configs/scim";
import { AdminAccountTypes, CONSUMER_USERSTORE } from "../../users/constants";
import { sendInvite } from "../api";
import { UserAccountTypes, UsersConstants } from "../constants";
import { InternalAdminFormDataInterface, UserInviteInterface } from "../models";

interface AddUserWizardPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    closeWizard: () => void;
    compact?: boolean;
    currentStep?: number;
    updateList?: () => void;
    rolesList?: any;
    emailVerificationEnabled: boolean;
    requiredSteps?: WizardStepsFormTypes[] | string[];
    submitStep?: WizardStepsFormTypes | string;
    showStepper?: boolean;
    requestedPasswordOption?: AddConsumerUserBasicProps[ "requestedPasswordOption" ];
    onSuccessfulUserAddition?: (id: string) => void;
    onInvitationSendSuccessful?: () => void;
    defaultUserTypeSelection?: string;
    conditionallyShowStepper?: boolean;
    adminTypeSelection? :string;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Interface for wizard step.
 */
interface WizardStepInterface {
    content: ReactElement;
    icon: GenericIconProps | any;
    name: string;
    title: string;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
export enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    GROUP_LIST = "GroupList",
    SUMMARY = "summary",
    USER_TYPE = "UserType"
}

/**
 * New User creation wizard.
 *
 * @return {JSX.Element}
 */
export const AddUserWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        adminTypeSelection,
        defaultUserTypeSelection,
        closeWizard,
        currentStep,
        emailVerificationEnabled,
        conditionallyShowStepper,
        requiredSteps,
        showStepper,
        submitStep,
        requestedPasswordOption,
        onSuccessfulUserAddition,
        onInvitationSendSuccessful,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitGroupList, setSubmitGroupList ] = useTrigger();
    const [ submitUserTypeSelection, setSubmitUserTypeSelection ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ isStepsUpdated, setIsStepsUpdated ] = useState(false);

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ fixedGroupList, setFixedGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ tempGroupList, setTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFirstNameRequired, setFirstNameRequired ] = useState<boolean>(true);
    const [ isLastNameRequired, setLastNameRequired ] = useState<boolean>(true);
    const [ hiddenFields, setHiddenFields ] = useState<AddConsumerUserBasicProps[ "hiddenFields" ]>([]);

    const profileSchemas: ProfileSchemaInterface[] = useSelector(
        (state: AppState) => state.profile.profileSchemas);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {

        if (!defaultUserTypeSelection) {
            return;
        }

        setWizardState({
            ...wizardState,
            [ WizardStepsFormTypes.USER_TYPE ]: {
                userType: defaultUserTypeSelection
            }
        });
    }, [ defaultUserTypeSelection ]);

    useEffect(() => {
        if (!(wizardState && wizardState[ WizardStepsFormTypes.USER_TYPE ])) {
            return;
        }

        if (!fixedGroupList) {
            return;
        }

        if (wizardState[ WizardStepsFormTypes.USER_TYPE ].userType === UserAccountTypes.USER) {

            if (fixedGroupList?.length === 0) {
                setWizardSteps(filterSteps([
                    // Temporarily disable the USER_TYPE step.
                    // WizardStepsFormTypes.USER_TYPE,
                    WizardStepsFormTypes.BASIC_DETAILS
                    // Commented to temporarily disable the summary step.
                    // ,
                    // WizardStepsFormTypes.SUMMARY
                ]));
                setIsStepsUpdated(true);

                return;
            }

            setWizardSteps(filterSteps([
                // Temporarily disable the USER_TYPE step.
                // WizardStepsFormTypes.USER_TYPE,
                WizardStepsFormTypes.BASIC_DETAILS,
                WizardStepsFormTypes.GROUP_LIST
                // Commented to temporarily disable the summary step.
                // ,
                // WizardStepsFormTypes.SUMMARY
            ]));
            setIsStepsUpdated(true);
        } else {
            setWizardSteps(filterSteps([
                // Temporarily disable the USER_TYPE step.
                // WizardStepsFormTypes.USER_TYPE,
                WizardStepsFormTypes.BASIC_DETAILS ]));
            setIsStepsUpdated(true);
        }

    }, [ fixedGroupList && wizardState && wizardState[ WizardStepsFormTypes.USER_TYPE ].userType ]);

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
        getGroupListForDomain(CONSUMER_USERSTORE);
        resolveNamefieldAttributes(profileSchemas);
    }, []);

    const resolveNamefieldAttributes = (profileSchemas: ProfileSchemaInterface[]) => {        
        const nameSchema = profileSchemas
            .find(schema => schema.name === "name");

        if (nameSchema?.subAttributes?.length > 0) {
            // Check for presence of firstName, lastName attributes.
            const firstNameAttribute = nameSchema.subAttributes
                .find(attribute => attribute.name === "givenName");
            const lastNameAttribute = nameSchema.subAttributes
                .find(attribute => attribute.name === "familyName");
            
            if (firstNameAttribute && lastNameAttribute) {
                setFirstNameRequired(firstNameAttribute.required);
                setLastNameRequired(lastNameAttribute.required);

                return;
            }
            
            if (firstNameAttribute) {
                // First Name attribute is available.
                // But Last Name attribute is not available
                setHiddenFields([ "lastName" ]);
                setFirstNameRequired(firstNameAttribute.required);
            }

            if (lastNameAttribute) {
                // Last Name attribute is available.
                // But First Name attribute is not available
                setHiddenFields([ "firstName" ]);
                setLastNameRequired(lastNameAttribute.required);
            }
            

        } else {
            // If nameSchema is not present, firstName and lastName is set
            // to be not visible on the attributes.
            // Therefore it is hidden from the add user wizard.
            setHiddenFields([ "firstName", "lastName" ]);
        }
    };

    const getGroupListForDomain = (domain: string) => {
        getGroupList(domain)
            .then((response) => {
                if (response.data.totalResults == 0) {
                    setGroupsList([]);
                    setInitialGroupList([]);
                    setFixedGroupsList([]);
                } else {
                    setGroupsList(response.data.Resources);
                    setInitialGroupList(response.data.Resources);
                    setFixedGroupsList(response.data.Resources);
                }
            });
    };

    const handleGroupListChange = (groupList) => {
        setGroupsList(groupList);
    };

    const handleInitialGroupListChange = (groupList) => {
        setInitialGroupList(groupList);
    };

    const handleAddedGroupListChange = (newGroupList) => {
        setTempGroupList(newGroupList);
    };

    const handleAddedGroupInitialListChange = (newGroupList) => {
        setInitialTempGroupList(newGroupList);
    };

    const navigateToNext = () => {
        switch (wizardSteps[ currentWizardStep ]?.name) {
            case WizardStepsFormTypes.USER_TYPE:
                setSubmitUserTypeSelection();

                break;
            case WizardStepsFormTypes.BASIC_DETAILS:
                setSubmitGeneralSettings();

                break;
            // Commented to temporarily disable summary step.
            // case WizardStepsFormTypes.GROUP_LIST:
            //     setSubmitGroupList();
            //     break;
            // case WizardStepsFormTypes.SUMMARY:
            //     setFinishSubmit();
            //     break;
            // Group List case updated on temporary disabling of summary step.
            case WizardStepsFormTypes.GROUP_LIST:
                setSubmitGroupList();
                setFinishSubmit();

                break;
            default:
                break;
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * This function handles assigning the roles to the user.
     */
    const assignUserRoles = async (users: UserBasicInterface[], roles: RolesInterface[]) => {
        const roleIds = [];
        const userList = [];

        if (users.length > 0) {
            users.map((user) => {
                userList.push({
                    display: user.userName,
                    value: user.id
                });
            });
        }

        // Payload for the update role request.
        const roleData = {
            Operations: [
                {
                    op: "add",
                    value: {
                        users: userList
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (roles.length > 0) {
            roles.map((role) => {
                roleIds.push(role.id);
            });

            for (const roleId of roleIds) {
                setIsSubmitting(true);
                
                await updateRoleDetails(roleId, roleData)
                    .catch((error) => {
                        if (!error.response || error.response.status === 401) {
                            setAlert({
                                description: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.message"
                                )
                            });
                        } else if (error.response && error.response.data && error.response.data.detail) {
                            setAlert({
                                description: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.message"
                                )
                            });
                        } else {
                            // Generic error message
                            setAlert({
                                description: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.genericError" + 
                                    ".description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.genericError.message"
                                )
                            });
                        }
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            }
            dispatch(addAlert({
                description: t(
                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.success.message"
                )
            }));
            closeWizard();
        }
    };

    /**
     * This function handles assigning the groups to the user.
     */
    const assignUserGroups = (user: any, groups: any) => {
        const groupIds = [];

        // Payload for the update group request.
        const groupData = {
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

        if (groups.length > 0) {
            groups.map((group) => {
                groupIds.push(group.id);
            });

            for (const groupId of groupIds) {
                setIsSubmitting(true);

                updateGroupDetails(groupId, groupData)
                    .catch((error) => {
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
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            }
        }
    };

    /**
     * This function handles sending the invitation to the external admin user.
     */
    const sendExternalInvitation = (invite: UserInviteInterface) => {
        if (invite != null) {
            setIsSubmitting(true);

            sendInvite(invite)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.invite.notifications.sendInvite.success.message"
                        )
                    }));
                    closeWizard();
                    onInvitationSendSuccessful();
                })
                .catch((error) => {
                    // Axios throws a generic `Network Error` for 401 status.
                    // As a temporary solution, a check to see if a response
                    // is available has be used.
                    if (!error.response || error.response.status === 401) {
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.error.message"
                            )
                        }));
                    } else if (error.response.status === 403 &&
                        error?.response?.data?.code === UsersConstants.ERROR_COLLABORATOR_USER_LIMIT_REACHED) {
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "extensions:manage.invite.notifications.sendInvite.limitReachError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "extensions:manage.invite.notifications.sendInvite.limitReachError.message"
                            )
                        }));
                    } else if (error?.response?.data?.description) {
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.error.message"
                            )
                        }));
                    } else {
                        closeWizard();
                        // Generic error message
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.genericError.message"
                            )
                        }));
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    /**
     * This function handles sending the invitation to the external admin user.
     */
    const sendInternalInvitation = (data: InternalAdminFormDataInterface) => {
        assignUserRoles(data?.checkedUsers, data?.selectedRoles);
    };

    /**
     * This function handles adding the user.
     */
    const addUserBasic = (userInfo: AddUserWizardStateInterface) => {
        const userName = CONSUMER_USERSTORE + "/" + userInfo.email;

        let userDetails: UserDetailsInterface = createEmptyUserDetails();
        const password = userInfo.newPassword;

        userInfo.passwordOption && userInfo.passwordOption !== "ask-password"
            ? (
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
                    password: userInfo.newPassword ? userInfo.newPassword : "password",
                    profileUrl: userInfo.profileUrl,
                    [ SCIMConfigs.scim.enterpriseSchema ]: {
                        askPassword: "true"
                    },
                    userName
                }
            );

        setIsSubmitting(true);

        addUser(userDetails)
            .then((response) => {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.users.notifications.addUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.users.notifications.addUser.success.message"
                    )
                }));

                // Intermittently submitted form has the groups inside `userInfo` object.
                const groups: GroupsInterface[] = wizardState?.GroupList?.groups ?? userInfo?.groups;

                if (groups) {
                    assignUserGroups(response.data, groups);
                }

                closeWizard();
                onSuccessfulUserAddition(response.data?.id);
            })
            .catch((error) => {
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
                } else if (error.response && error.response.status === 403 &&
                    error.response.data && error.response.data.scimType === UsersConstants.ERROR_USER_LIMIT_REACHED) {
                    closeWizard();
                    dispatch(addAlert({
                        description: t(
                            "extensions:manage.users.notifications.addUser.customerUser.limitReachError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.users.notifications.addUser.customerUser.limitReachError.message"
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
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {

        // If the submit step is not default, and submit step is the current step, submit the form.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && submitStep === formType) {
            handleWizardFormFinish(generateWizardSummary(values));

            return;
        }

        // If the submit step is not default, and the current step is the first, evaluate if the specified submit step
        // is available. If not, submit the form at the basic details level. Useful for dynamically generated steps.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && formType === WizardStepsFormTypes.BASIC_DETAILS) {
            if (!wizardSteps.some((step: WizardStepInterface) => step.name === submitStep)) {
                handleWizardFormFinish(generateWizardSummary(values));
                
                return;
            }
        }

        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
    };

    /**
     * Generates a summary of the wizard.
     *
     * @param {object} extension
     */
    const generateWizardSummary = (extension?: Record<string, unknown>) => {
        if (!wizardState) {
            return;
        }

        const wizardData: WizardStateInterface = { ...wizardState };

        let summary = {};

        if (extension) {
            summary = { ...extension };
        }

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
     * @param {string} url - Profile URL.
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

    /**
     * Resolves the basic details step.
     *
     * @return {React.ReactElement} Basic details step.
     */
    const resolveBasicDetailsStep = (): WizardStepInterface => {
        if (wizardState && wizardState[ WizardStepsFormTypes.USER_TYPE ].userType === UserAccountTypes.USER) {
            return getConsumerBasicDetailsWizardStep();
        } else {
            return getAdminBasicDetailsWizardStep();
        }
    };

    /**
     * Resolves the step content.
     *
     * @return {React.ReactElement} Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (wizardSteps[ currentWizardStep ]?.name) {
            case WizardStepsFormTypes.USER_TYPE:
                return getUserSelectionWizardStep()?.content;
            case WizardStepsFormTypes.BASIC_DETAILS:
                return resolveBasicDetailsStep()?.content;
            case WizardStepsFormTypes.GROUP_LIST:
                return getUserGroupsWizardStep()?.content;
            case WizardStepsFormTypes.SUMMARY:
                return getSummaryWizardStep()?.content;
        }
    };

    /**
     * Filters the steps evaluating the requested steps.
     *
     * @param {WizardStepsFormTypes[]} steps - Steps to filter.
     * @return {WizardStepInterface[]}
     */
    const filterSteps = (steps: WizardStepsFormTypes[]): WizardStepInterface[] => {

        const getStepContent = (stepsToFilter: WizardStepsFormTypes[] | string[]) => {

            const filteredSteps: any[] = [];

            stepsToFilter.forEach((step: WizardStepsFormTypes) => {
                if (step === WizardStepsFormTypes.USER_TYPE) {
                    filteredSteps.push(getUserSelectionWizardStep());
                } else if (step === WizardStepsFormTypes.BASIC_DETAILS) {
                    filteredSteps.push(resolveBasicDetailsStep());
                } else if (step === WizardStepsFormTypes.GROUP_LIST) {
                    filteredSteps.push(getUserGroupsWizardStep());
                } else if (step === WizardStepsFormTypes.SUMMARY) {
                    filteredSteps.push(getSummaryWizardStep());
                }
            });

            return filteredSteps;
        };

        if (!requiredSteps) {
            return getStepContent(steps);
        }

        return getStepContent(intersection(steps, requiredSteps));
    };

    /**
     * User Type Selection Wizard Step.
     * @return {WizardStepInterface}
     */
    const getUserSelectionWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <UserTypeSelection
                    handleTriggerSubmit={ () => setSubmitUserTypeSelection }
                    triggerSubmit={ submitUserTypeSelection }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.USER_TYPE ] }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.USER_TYPE) }
                />
            ),
            icon: getUserWizardStepIcons().user,
            name: WizardStepsFormTypes.USER_TYPE,
            title: "User Type"
        };
    };

    /**
     * Basic Wizard Step.
     * @return {WizardStepInterface}
     */
    const getAdminBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddAdminUserBasic
                    administratorType={ adminTypeSelection }
                    triggerSubmit={ submitGeneralSettings }
                    onSubmit={ (values) => 
                        (adminTypeSelection === AdminAccountTypes.INTERNAL)
                            ? sendInternalInvitation(values)
                            : sendExternalInvitation(values)
                    }
                />
            ),
            icon: getUserWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("console:manage.features.user.modals.addUserWizard.steps.basicDetails")
        };
    };

    /**
     * Consumer user basic wizard Step.
     * @return {WizardStepInterface}
     */
    const getConsumerBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUserBasic
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    emailVerificationEnabled={ emailVerificationEnabled }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                    hiddenFields={ hiddenFields }
                    requestedPasswordOption={ requestedPasswordOption }
                    isFirstNameRequired={ isFirstNameRequired }
                    isLastNameRequired={ isLastNameRequired }
                />
            ),
            icon: getUserWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("console:manage.features.user.modals.addUserWizard.steps.basicDetails")
        };
    };

    /**
     * User group wizard step.
     * @return {WizardStepInterface}
     */
    const getUserGroupsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUserGroups
                    triggerSubmit={ submitGroupList }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.GROUP_LIST) }
                    initialValues={
                        {
                            groupList: groupList,
                            initialGroupList: initialGroupList,
                            initialTempGroupList: initialTempGroupList,
                            tempGroupList: tempGroupList
                        }
                    }
                    handleGroupListChange={ (groups) => handleGroupListChange(groups) }
                    handleTempListChange={ (groups) => handleAddedGroupListChange(groups) }
                    handleInitialTempListChange={ (groups) => handleAddedGroupInitialListChange(groups) }
                    handleInitialGroupListChange={ (groups) => handleInitialGroupListChange(groups) }
                    handleSetGroupId={ null }
                />
            ),
            icon: getUserWizardStepIcons().groups,
            name: WizardStepsFormTypes.GROUP_LIST,
            title: t("console:manage.features.user.modals.addUserWizard.steps.groups")
        };
    };

    /**
     * Summary wizard step.
     * @return {WizardStepInterface}
     */
    const getSummaryWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUserWizardSummary
                    triggerSubmit={ finishSubmit }
                    onSubmit={ handleWizardFormFinish }
                    summary={ generateWizardSummary() }
                    onProfileImageChange={ handleProfileImageChange }
                />
            ),
            icon: getUserWizardStepIcons().summary,
            name: WizardStepsFormTypes.SUMMARY,
            title: t("console:manage.features.user.modals.addUserWizard.steps.summary")
        };
    };

    /**
     * Check whether to hide step section or not.
     * @return show steps or not
     */
    const showSteps = (): boolean => {
        if (defaultUserTypeSelection === UserAccountTypes.USER && fixedGroupList?.length === 0) {
            return false;
        }
        if (!conditionallyShowStepper) {
            return showStepper;
        } else {
            if (fixedGroupList?.length) {
                return showStepper && ((defaultUserTypeSelection !== UserAccountTypes.USER ||
                    fixedGroupList?.length !== 0));
            }

            return false;
        }
    };

    return (
        wizardSteps && isStepsUpdated ? (
            <Modal
                data-componentid={ componentId }
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
                    { defaultUserTypeSelection === UserAccountTypes.USER &&
                        t("extensions:manage.users.wizard.addUser.title") }
                    { defaultUserTypeSelection === UserAccountTypes.ADMINISTRATOR &&
                        (
                            adminTypeSelection === AdminAccountTypes.INTERNAL
                                ? t("extensions:manage.users.wizard.addAdmin.internal.title")
                                : t("extensions:manage.users.wizard.addAdmin.external.title")
                        )
                    }
                    {
                        wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName
                            ? " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName
                            : ""
                    }
                    <Heading as="h6">
                        { defaultUserTypeSelection === UserAccountTypes.USER && 
                            t("extensions:manage.users.wizard.addUser.subtitle") }
                    </Heading>
                </Modal.Header>
                { showSteps() &&
                    (
                        <Modal.Content className="steps-container">
                            { defaultUserTypeSelection === UserAccountTypes.ADMINISTRATOR
                                ? (
                                    <Heading className={ "invite-sub-heading" } as="h6">
                                        { (
                                            adminTypeSelection === AdminAccountTypes.INTERNAL
                                                ? t("extensions:manage.users.wizard.addAdmin.internal.subtitle")
                                                : t("extensions:manage.users.wizard.addAdmin.external.subtitle")
                                        ) }
                                    </Heading>
                                ) : (
                                    <Steps.Group
                                        current={ currentWizardStep }
                                    >
                                        {
                                            wizardSteps.map((step, index) => (
                                                <Steps.Step
                                                    key={ index }
                                                    icon={ step.icon }
                                                    title={ step.title }
                                                />
                                            ))
                                        }
                                    </Steps.Group>
                                )
                            }
                        </Modal.Content>
                    )
                }
                <Modal.Content className={ "content-container" } scrolling>
                    { alert && alertComponent }
                    { resolveStepContent() }
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    data-componentid={ `${ componentId }-cancel-button` }
                                    data-testid={ `${ testId }-cancel-button` }
                                    floated="left"
                                    onClick={ () => closeWizard() }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { (currentWizardStep < wizardSteps?.length - 1 &&
                                    wizardSteps[ currentWizardStep ]?.name !== WizardStepsFormTypes.USER_TYPE) && (
                                    <PrimaryButton
                                        data-componentid={ `${ componentId }-next-button` }
                                        data-testid={ `${ testId }-next-button` }
                                        floated="right"
                                        onClick={ navigateToNext }
                                    >
                                        { t("console:manage.features.user.modals.addUserWizard.buttons.next") }
                                        <Icon name="arrow right" />
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === wizardSteps?.length - 1 && (
                                    <PrimaryButton
                                        data-componentid={ `${ componentId }-finish-button` }
                                        data-testid={ `${ testId }-finish-button` }
                                        floated="right"
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                        onClick={ navigateToNext }
                                    >
                                        {
                                            wizardState && wizardState[
                                                WizardStepsFormTypes.USER_TYPE
                                            ]?.userType === UserAccountTypes.ADMINISTRATOR
                                                ? "Invite" : "Finish"
                                        }
                                    </PrimaryButton>
                                ) }
                                { (wizardSteps?.length > 1 && currentWizardStep > 0) && (
                                    <LinkButton
                                        data-componentid={ `${ componentId }-previous-button` }
                                        data-testid={ `${ testId }-previous-button` }
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                    >
                                        <Icon name="arrow left" />
                                        { t("console:manage.features.user.modals.addUserWizard.buttons.previous") }
                                    </LinkButton>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        ) : null
    );
};

/**
 * Default props for the add user wizard.
 */
AddUserWizard.defaultProps = {
    compact: false,
    conditionallyShowStepper: false,
    currentStep: 0,
    emailVerificationEnabled: false,
    showStepper: true,
    // Submit Step changed to temporarily disable the summary step.
    // submitStep: WizardStepsFormTypes.SUMMARY
    submitStep: WizardStepsFormTypes.GROUP_LIST
};
