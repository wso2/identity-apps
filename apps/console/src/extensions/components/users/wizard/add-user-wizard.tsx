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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
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
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import intersection from "lodash-es/intersection";
import merge from "lodash-es/merge";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, Grid, Icon, Modal } from "semantic-ui-react";
import {
    AddAdminUserBasic,
    AddConsumerUserBasic,
    AddConsumerUserBasicProps,
    AddConsumerUserGroups,
    AddConsumerUserWizardSummary,
    AddUserWizardSummary,
    UserTypeSelection
} from "./steps";
import { AppState, UserBasicInterface, UserStoreDetails, UserStoreProperty } from "../../../../features/core";
import {
    GroupsInterface,
    PatchGroupDataInterface,
    getGroupList,
    updateGroupDetails
} from "../../../../features/groups";
import { updateRoleDetails } from "../../../../features/roles/api/roles";
import { PatchRoleDataInterface } from "../../../../features/roles/models/roles";
import { addUser } from "../../../../features/users/api/users";
import { getUserWizardStepIcons } from "../../../../features/users/configs/ui";
import {
    AddUserWizardStateInterface,
    BasicUserDetailsInterface,
    UserDetailsInterface,
    createEmptyUserDetails
} from "../../../../features/users/models/user";
import {
    generatePassword,
    getConfiguration
} from "../../../../features/users/utils/generate-password.utils";
import { getUsernameConfiguration } from "../../../../features/users/utils/user-management-utils";
import { useValidationConfigData } from "../../../../features/validation/api";
import { ValidationFormInterface } from "../../../../features/validation/models";
import { administratorConfig } from "../../../configs/administrator";
import { SCIMConfigs } from "../../../configs/scim";
import { AdminAccountTypes, CONSUMER_USERSTORE } from "../../users/constants";
import { getUserStores, sendInvite } from "../api";
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
    /**
     * On user update callback.
     *
     * @param userId - ID of the updated user.
     */
     onUserUpdate?: () => void;
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
 */
export enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    GROUP_LIST = "GroupList",
    SUMMARY = "summary",
    USER_SUMMARY = "UserSummary",
    USER_TYPE = "UserType"
}

/**
 * New User creation wizard.
 *
 * @param props - Props injected to the component.
 * @returns Add user wizard component.
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
        onUserUpdate,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitGroupList, setSubmitGroupList ] = useTrigger();
    const [ submitUserTypeSelection, setSubmitUserTypeSelection ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ isStepsUpdated, setIsStepsUpdated ] = useState(false);
    const [ isUserSummaryEnabled, setUserSummaryEnabled ] = useState(false);

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ fixedGroupList, setFixedGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ tempGroupList, setTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFirstNameRequired, setFirstNameRequired ] = useState<boolean>(true);
    const [ isLastNameRequired, setLastNameRequired ] = useState<boolean>(true);
    const [ isEmailRequired, setEmailRequired ] = useState<boolean>(false);
    const [ askPasswordFromUser, setAskPasswordFromUser ] = useState<boolean>(true);
    const [ isOfflineUser, setOfflineUser ] = useState<boolean>(false);
    const [ isBasicDetailsLoading, setBasicDetailsLoading ] = useState<boolean>(false);
    const [ isFinishButtonDisabled, setFinishButtonDisabled ] = useState<boolean>(false);
    const [ isUserStoreError, setUserStoreError ] = useState<boolean>(false);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(CONSUMER_USERSTORE);
    const [ readWriteUserStoresList, setReadWriteUserStoresList ] = useState<DropdownItemProps[]>([]);
    const [ newUserId, setNewUserId ] = useState<string>("");
    const [ hiddenFields, setHiddenFields ] = useState<AddConsumerUserBasicProps[ "hiddenFields" ]>([]);
    const [ isAlphanumericUsername, setIsAlphanumericUsername ] = useState<boolean>(false);

    const excludedAttributes: string = "members";

    const profileSchemas: ProfileSchemaInterface[] = useSelector(
        (state: AppState) => state.profile.profileSchemas);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const {
        data: validationData
    } = useValidationConfigData();

    useEffect(() => {
        getUserStoreList();
    },[]);

    useEffect(() => {
        setIsAlphanumericUsername(
            getUsernameConfiguration(validationData)?.enableValidator === "true"
                ? true
                : false
        );
    }, [ validationData ]);

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
                if (isUserSummaryEnabled) {
                    setWizardSteps(filterSteps([
                        WizardStepsFormTypes.BASIC_DETAILS,
                        WizardStepsFormTypes.USER_SUMMARY
                    ]));
                    setIsStepsUpdated(true);

                    return;
                }
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

            if (isUserSummaryEnabled) {
                setWizardSteps(filterSteps([
                    WizardStepsFormTypes.BASIC_DETAILS,
                    WizardStepsFormTypes.GROUP_LIST,
                    WizardStepsFormTypes.USER_SUMMARY
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

    }, [ fixedGroupList, wizardState && wizardState[ WizardStepsFormTypes.USER_TYPE ].userType,
        isUserSummaryEnabled ]);

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
        resolveNamefieldAttributes(profileSchemas);
    }, []);

    useEffect(() => {
        if (defaultUserTypeSelection === UserAccountTypes.USER) {
            getGroupListForDomain(null);
        } else {
            setGroupsList([]);
            setInitialGroupList([]);
            setFixedGroupsList([]);
        }
    }, [ selectedUserStore ]);

    const getUserStoreList = (): void => {
        setBasicDetailsLoading(true);

        getUserStores()
            .then((response: UserStoreDetails[]) => {
                const userStoreArray: DropdownItemProps[] = [];

                response?.forEach((item: UserStoreDetails, index: number) => {
                    // Set read/write enabled userstores based on the type.
                    if (checkReadWriteUserStore(item)) {
                        userStoreArray.push({
                            key: index,
                            text: item.name.toUpperCase(),
                            value: item.name.toUpperCase()
                        });
                    }});

                setUserStoreError(false);
                setReadWriteUserStoresList(userStoreArray);
            }).catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("userstores:notifications.fetchUserstores.genericError." +
                                "description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("userstores:notifications.fetchUserstores.genericError." +
                            "message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("userstores:notifications.fetchUserstores.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("userstores:notifications.fetchUserstores.genericError.message")
                }));

                setUserStoreError(true);

                return;
            })
            .finally(() => {
                setBasicDetailsLoading(false);
            });
    };

    /**
     * Check the given user store is Read/Write enabled
     *
     * @param userStore - Userstore
     * @returns If the given userstore is read only or not
     */
    const checkReadWriteUserStore = (userStore: UserStoreDetails): boolean => {
        if( userStore.typeName === UsersConstants.DEFAULT_USERSTORE_TYPE_NAME ) {
            return true;
        } else {
            return  userStore.enabled && userStore.properties.filter((property: UserStoreProperty)=>
                property.name===UsersConstants.USER_STORE_PROPERTY_READ_ONLY)[0].value==="false";
        }
    };

    const resolveNamefieldAttributes = (profileSchemas: ProfileSchemaInterface[]) => {
        const hiddenAttributes: AddConsumerUserBasicProps[ "hiddenFields" ] = [];
        const nameSchema: ProfileSchemaInterface = profileSchemas
            .find((schema: ProfileSchemaInterface) => schema.name === "name");
        const emailSchema: ProfileSchemaInterface = profileSchemas
            .find((schema: ProfileSchemaInterface) => (schema.name === "emails"));

        if (emailSchema) {
            hiddenAttributes.push("email");
            setEmailRequired(emailSchema.required);
        }

        if (nameSchema?.subAttributes?.length > 0) {
            // Check for presence of firstName, lastName attributes.
            const firstNameAttribute: ProfileSchemaInterface = nameSchema.subAttributes
                .find((attribute: ProfileSchemaInterface) => attribute.name === "givenName");
            const lastNameAttribute: ProfileSchemaInterface = nameSchema.subAttributes
                .find((attribute: ProfileSchemaInterface) => attribute.name === "familyName");

            if (firstNameAttribute && lastNameAttribute) {
                setFirstNameRequired(firstNameAttribute.required);
                setLastNameRequired(lastNameAttribute.required);

                return;
            }

            if (firstNameAttribute) {
                // First Name attribute is available.
                // But Last Name attribute is not available
                hiddenAttributes.push("lastName");
                setFirstNameRequired(firstNameAttribute.required);
            }

            if (lastNameAttribute) {
                // Last Name attribute is available.
                // But First Name attribute is not available
                hiddenAttributes.push("firstName");
                setLastNameRequired(lastNameAttribute.required);
            }

        } else {
            // If nameSchema is not present, firstName and lastName is set
            // to be not visible on the attributes.
            // Therefore it is hidden from the add user wizard.
            hiddenAttributes.push( "firstName", "lastName");
        }
        setHiddenFields(hiddenAttributes);
    };

    const getGroupListForDomain = (domain: string) => {
        setBasicDetailsLoading(true);
        getGroupList(domain, excludedAttributes)
            .then((response: AxiosResponse) => {
                if (response.data.totalResults == 0) {
                    setGroupsList([]);
                    setInitialGroupList([]);
                    setFixedGroupsList([]);
                } else {
                    setGroupsList(response.data.Resources);
                    setInitialGroupList(response.data.Resources);
                    setFixedGroupsList(response.data.Resources);
                }
            })
            .finally(() => setBasicDetailsLoading(false));
    };

    const handleGroupListChange = (groupList: GroupsInterface[]) => {
        setGroupsList(groupList);
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
            case WizardStepsFormTypes.USER_SUMMARY:
                closeWizard();
                onSuccessfulUserAddition(newUserId);

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
        const roleIds: string[] = [];
        const userList: {display: string, value: string}[] = [];

        if (users.length > 0) {
            users.map((user: UserBasicInterface) => {
                userList.push({
                    display: user.userName,
                    value: user.id
                });
            });
        }

        // Payload for the update role request.
        const roleData: PatchRoleDataInterface = {
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
            roles.map((role: RolesInterface) => {
                roleIds.push(role.id);
            });

            for (const roleId of roleIds) {
                setIsSubmitting(true);

                await updateRoleDetails(roleId, roleData)
                    .catch((error: AxiosError) => {
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
            onUserUpdate();
        }
    };

    /**
     * This function handles assigning the groups to the user.
     */
    const assignUserGroups = (user: any, groups: any) => {
        const groupIds: string[] = [];

        // Payload for the update group request.
        const groupData: PatchGroupDataInterface = {
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
            groups.map((group: GroupsInterface) => {
                groupIds.push(group.id);
            });

            for (const groupId of groupIds) {
                setIsSubmitting(true);

                updateGroupDetails(groupId, groupData)
                    .catch((error: AxiosError) => {
                        if (!error.response || error.response.status === 401) {
                            setAlert({
                                description: t(
                                    "users:notifications.addUser.error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "users:notifications.addUser.error.message"
                                )
                            });
                        } else if (error.response && error.response.data && error.response.data.detail) {

                            setAlert({
                                description: t(
                                    "users:notifications.addUser.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "users:notifications.addUser.error.message"
                                )
                            });
                        } else {
                            // Generic error message
                            setAlert({
                                description: t(
                                    "users:notifications.addUser.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "users:notifications.addUser.genericError.message"
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
                            "invite:notifications.sendInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "invite:notifications.sendInvite.success.message"
                        )
                    }));
                    closeWizard();
                    onInvitationSendSuccessful();
                })
                .catch((error: AxiosError) => {
                    // Axios throws a generic `Network Error` for 401 status.
                    // As a temporary solution, a check to see if a response
                    // is available has be used.
                    if (!error.response || error.response.status === 401) {
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "invite:notifications.sendInvite.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "invite:notifications.sendInvite.error.message"
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
                                "invite:notifications.sendInvite.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "invite:notifications.sendInvite.error.message"
                            )
                        }));
                    } else {
                        closeWizard();
                        // Generic error message
                        dispatch(addAlert({
                            description: t(
                                "invite:notifications.sendInvite.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "invite:notifications.sendInvite.genericError.message"
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
        let username: string = "";

        if (!isAlphanumericUsername) {
            username = userInfo.domain + "/" + userInfo.email;
        } else {
            username = userInfo.domain + "/" + userInfo.userName;
        }

        let userDetails: UserDetailsInterface = createEmptyUserDetails();
        const password: string = userInfo.newPassword;

        // Users who get invited offline are also considered as password-based users.
        // They will be assigned a randomly generated temporary password.
        // Temporary password can be changed via the offline invite link.
        if (askPasswordFromUser) {
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
                password: password,
                profileUrl: userInfo.profileUrl,
                userName: username
            };
        } else if (isOfflineUser) {
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
                password: generateRandomPassword(),
                profileUrl: userInfo.profileUrl,
                userName: username
            };
        } else {
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
                profileUrl: userInfo.profileUrl,
                [ SCIMConfigs.scim.enterpriseSchema ]: {
                    askPassword: "true"
                },
                userName: username
            };
        }

        setIsSubmitting(true);

        addUser(userDetails)
            .then((response: AxiosResponse) => {
                dispatch(addAlert({
                    description: t(
                        "users:notifications.addUser.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "users:notifications.addUser.success.message"
                    )
                }));

                // Intermittently submitted form has the groups inside `userInfo` object.
                const groups: GroupsInterface[] = wizardState?.GroupList?.groups ?? userInfo?.groups;

                if (groups) {
                    assignUserGroups(response.data, groups);
                }
                // Saving the user ID to redirect user after the summary
                setNewUserId(response.data?.id);
                // Close the wizard as the summary will not be shown
                if(!isUserSummaryEnabled) {
                    closeWizard();
                    onSuccessfulUserAddition(response.data?.id);
                } else {
                    // Once the user is created, take the user to next step which is the summary.
                    setCurrentWizardStep(currentWizardStep + 1);
                }
            })
            .catch((error: AxiosError) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    closeWizard();
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.error.message"
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
                            "users:notifications.addUser.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.error.message"
                        )
                    }));
                } else {
                    closeWizard();
                    // Generic error message
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.genericError.message"
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
        // Click next while in group list and summary enabled will take the user to summary page.
        if (isUserSummaryEnabled &&
                (formType === WizardStepsFormTypes.GROUP_LIST || formType === WizardStepsFormTypes.BASIC_DETAILS)) {
            setWizardState({ ...wizardState, [ formType ]: values });
        }

        // If the submit step is not default, and submit step is the current step, submit the form.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && submitStep === formType) {
            handleWizardFormFinish(generateWizardSummary(values));

            return;
        }

        // If the submit step is not default, and the current step is the first, evaluate if the specified submit step
        // is available. If not, submit the form at the basic details level. Useful for dynamically generated steps.
        if (submitStep !== WizardStepsFormTypes.SUMMARY &&
                formType === WizardStepsFormTypes.BASIC_DETAILS) {
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
     * @param extension - Record object.
     * @returns Summary object.
     */
    const generateWizardSummary = (extension?: Record<string, unknown>) => {
        if (!wizardState) {
            return;
        }

        const wizardData: WizardStateInterface = { ...wizardState };

        let summary: any = {};

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

    /**
     * Resolves the basic details step.
     *
     * @returns Basic details step.
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
     * @returns Step content.
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
            case WizardStepsFormTypes.USER_SUMMARY:
                return getUserSummaryWizardStep()?.content;
        }
    };

    /**
     * Filters the steps evaluating the requested steps.
     *
     * @param steps - Steps to filter.
     * @returns Filtered steps.
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
                } else if (step === WizardStepsFormTypes.USER_SUMMARY) {
                    filteredSteps.push(getUserSummaryWizardStep());
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
     * @returns User type wizard step.
     */
    const getUserSelectionWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <UserTypeSelection
                    handleTriggerSubmit={ () => setSubmitUserTypeSelection }
                    triggerSubmit={ submitUserTypeSelection }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.USER_TYPE ] }
                    onSubmit={ (values: { userType: string }) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.USER_TYPE) }
                />
            ),
            icon: getUserWizardStepIcons().user,
            name: WizardStepsFormTypes.USER_TYPE,
            title: "User Type"
        };
    };

    /**
     * Basic Wizard Step.
     * @returns Basic details wizard step.
     */
    const getAdminBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddAdminUserBasic
                    administratorType={ adminTypeSelection }
                    triggerSubmit={ submitGeneralSettings }
                    onSubmit={ (values: InternalAdminFormDataInterface | UserInviteInterface) =>
                        (adminTypeSelection === AdminAccountTypes.INTERNAL)
                            ? sendInternalInvitation(values as InternalAdminFormDataInterface)
                            : sendExternalInvitation(values as UserInviteInterface)
                    }
                    setFinishButtonDisabled={ setFinishButtonDisabled }
                />
            ),
            icon: getUserWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("user:modals.addUserWizard.steps.basicDetails")
        };
    };

    /**
     * Consumer user basic wizard Step.
     * @returns Consumer user wizard step.
     */
    const getConsumerBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUserBasic
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    emailVerificationEnabled={ emailVerificationEnabled }
                    onSubmit={ (values: BasicUserDetailsInterface) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                    hiddenFields={ hiddenFields }
                    requestedPasswordOption={ requestedPasswordOption }
                    isFirstNameRequired={ isFirstNameRequired }
                    isLastNameRequired={ isLastNameRequired }
                    isEmailRequired={ isEmailRequired }
                    setUserSummaryEnabled={ setUserSummaryEnabled }
                    setAskPasswordFromUser={ setAskPasswordFromUser }
                    setOfflineUser={ setOfflineUser }
                    setSelectedUserStore = { setSelectedUserStore }
                    isBasicDetailsLoading={ isBasicDetailsLoading }
                    setBasicDetailsLoading={ setBasicDetailsLoading }
                    validationConfig ={ validationData }
                    isUserStoreError={ isUserStoreError }
                    readWriteUserStoresList={ readWriteUserStoresList }
                />
            ),
            icon: getUserWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("user:modals.addUserWizard.steps.basicDetails")
        };
    };

    /**
     * User group wizard step.
     * @returns Group wizard step.
     */
    const getUserGroupsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUserGroups
                    triggerSubmit={ submitGroupList }
                    onSubmit={ (values: { groups : GroupsInterface[] }) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.GROUP_LIST) }
                    initialValues={
                        {
                            groupList: groupList,
                            initialGroupList: initialGroupList,
                            initialTempGroupList: initialTempGroupList,
                            tempGroupList: tempGroupList
                        }
                    }
                    handleGroupListChange={
                        (groups: GroupsInterface[]) => handleGroupListChange(groups)
                    }
                    handleTempListChange={
                        (groups: GroupsInterface[]) => handleAddedGroupListChange(groups)
                    }
                    handleInitialTempListChange={
                        (groups: GroupsInterface[]) => handleAddedGroupInitialListChange(groups)
                    }
                    handleInitialGroupListChange={
                        (groups: GroupsInterface[]) => handleInitialGroupListChange(groups)
                    }
                    handleSetGroupId={ null }
                />
            ),
            icon: getUserWizardStepIcons().groups,
            name: WizardStepsFormTypes.GROUP_LIST,
            title: t("user:modals.addUserWizard.steps.groups")
        };
    };

    /**
     * User summary wizard step.
     * @returns User summary wizard step.
     */
    const getUserSummaryWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddUserWizardSummary
                    triggerSubmit={ finishSubmit }
                    selectedUserStore = { selectedUserStore }
                    username={
                        isAlphanumericUsername
                            ? wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.userName
                            : wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.email
                    }
                    password={ wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.newPassword }
                    isPasswordBased={ askPasswordFromUser }
                />
            ),
            icon: getUserWizardStepIcons().summary,
            name: WizardStepsFormTypes.USER_SUMMARY,
            title: t("user:modals.addUserWizard.steps.invitation")
        };
    };

    /**
     * Summary wizard step.
     * @returns Summary wizard step.
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
            title: t("user:modals.addUserWizard.steps.invitation")
        };
    };

    /**
     * Returns the text on the primary button of the wizard.
     * @returns Text on the primary button.
     */
    const resolveWizardPrimaryButtonText = (): string => {
        if (!wizardState) {
            return null;
        }
        if (wizardState[ WizardStepsFormTypes.USER_TYPE ]?.userType === administratorConfig.adminRoleName) {
            return adminTypeSelection === AdminAccountTypes.INTERNAL
                ? t("extensions:manage.features.user.addUser.add")
                : t("extensions:manage.features.user.addUser.invite");
        }
        if (wizardSteps[ currentWizardStep ]?.name === WizardStepsFormTypes.USER_SUMMARY) {
            return t("extensions:manage.features.user.addUser.close");
        }

        return t("extensions:manage.features.user.addUser.finish");
    };

    /**
     * Check whether to hide step section or not.
     * @returns Show steps or not.
     */
    const showSteps = (): boolean => {
        if (defaultUserTypeSelection === UserAccountTypes.USER) {
            return true;
        }

        if (fixedGroupList?.length === 0) {
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

    /**
     * The following function generate a random password.
     */
    const generateRandomPassword = (): string => {

        const config: ValidationFormInterface = getConfiguration(validationData);

        if (config === undefined) {
            return generatePassword(10, true, true, true, true, 1, 1, 1, 1);
        } else {
            return generatePassword(Number(config.minLength), Number(config.minLowerCaseCharacters) > 0,
                Number(config.minUpperCaseCharacters) > 0, Number(config.minNumbers) > 0,
                Number(config.minSpecialCharacters) > 0, Number(config.minLowerCaseCharacters),
                Number(config.minUpperCaseCharacters), Number(config.minNumbers),
                Number(config.minSpecialCharacters), Number(config.minUniqueCharacters));
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
                    { defaultUserTypeSelection === administratorConfig.adminRoleName &&
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
                            { defaultUserTypeSelection === administratorConfig.adminRoleName
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
                                            wizardSteps.map((step: WizardStepInterface, index: number) => (
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
                                { wizardSteps[ currentWizardStep ]?.name !== WizardStepsFormTypes.USER_SUMMARY && (
                                    <LinkButton
                                        data-componentid={ `${ componentId }-cancel-button` }
                                        data-testid={ `${ testId }-cancel-button` }
                                        floated="left"
                                        onClick={ () => closeWizard() }
                                    >
                                        { t("common:cancel") }
                                    </LinkButton>
                                ) }
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { (currentWizardStep < wizardSteps?.length - 1 &&
                                    wizardSteps[ currentWizardStep ]?.name !== WizardStepsFormTypes.USER_TYPE) && (
                                    <PrimaryButton
                                        data-componentid={ `${ componentId }-next-button` }
                                        data-testid={ `${ testId }-next-button` }
                                        floated="right"
                                        onClick={ navigateToNext }
                                        loading={ isBasicDetailsLoading }
                                    >
                                        { t("user:modals.addUserWizard.buttons.next") }
                                        <Icon name="arrow right" />
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === wizardSteps?.length - 1 && (
                                    <PrimaryButton
                                        data-componentid={ `${ componentId }-finish-button` }
                                        data-testid={ `${ testId }-finish-button` }
                                        floated="right"
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting || isFinishButtonDisabled }
                                        onClick={ navigateToNext }
                                    >
                                        {
                                            resolveWizardPrimaryButtonText()
                                        }
                                    </PrimaryButton>
                                ) }
                                { (wizardSteps?.length > 1 && currentWizardStep > 0 &&
                                    wizardSteps[ currentWizardStep ]?.name !== WizardStepsFormTypes.USER_SUMMARY) && (
                                    <LinkButton
                                        data-componentid={ `${ componentId }-previous-button` }
                                        data-testid={ `${ testId }-previous-button` }
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                    >
                                        <Icon name="arrow left" />
                                        { t("user:modals.addUserWizard.buttons.previous") }
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
