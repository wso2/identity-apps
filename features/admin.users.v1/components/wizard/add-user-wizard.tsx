/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { AppState } from "@wso2is/admin.core.v1/store";
import { userConfig } from "@wso2is/admin.extensions.v1";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { SCIMConfigInterface } from "@wso2is/admin.extensions.v1/configs/models/scim";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { updateGroupDetails, useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    MultiValueAttributeInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import intersection from "lodash-es/intersection";
import isEmpty from "lodash-es/isEmpty";
import merge from "lodash-es/merge";
import omit from "lodash-es/omit";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AddUserUpdated } from "./steps/add-user-basic";
import { AddUserGroups } from "./steps/add-user-groups";
import { AddUserWizardSummary } from "./user-wizard-summary";
import { addUser } from "../../api";
import { getUserWizardStepIcons } from "../../configs";
import {
    PasswordOptionTypes,
    UserManagementConstants,
    WizardStepsFormTypes
} from "../../constants";
import {
    AddUserWizardStateInterface,
    EmailsInterface,
    PayloadInterface,
    UserDetailsInterface,
    WizardStepInterface
} from "../../models/user";
import { generatePassword, getConfiguration, getUsernameConfiguration } from "../../utils";

interface AddUserWizardPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    closeWizard: () => void;
    compact?: boolean;
    currentStep?: number;
    listOffset: number;
    listItemLimit: number;
    updateList: () => void;
    onSuccessfulUserAddition?: (id: string) => void;
    rolesList?: any;
    emailVerificationEnabled: boolean;
    isAdminUser?: boolean;
    userTypeSelection?: string
    defaultUserTypeSelection?: string;
    adminTypeSelection? :string;
    isSubOrg?: boolean
    showStepper?: boolean;
    conditionallyShowStepper?: boolean;
    requiredSteps?: WizardStepsFormTypes[] | string[];
    userStore?: string;
    requestedPasswordOption?: PasswordOptionTypes;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    [ key: string ]: any;
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
        defaultUserTypeSelection,
        emailVerificationEnabled,
        onSuccessfulUserAddition,
        userStore,
        requiredSteps,
        [ "data-testid" ]: testId,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const { isSubOrganization } = useGetCurrentOrganizationType();
    const { userStoresList } = useUserStores();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitGroupList, setSubmitGroupList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const userFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.users);

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isBasicDetailsLoading, setBasicDetailsLoading ] = useState<boolean>(false);
    const [ isStepsUpdated, setIsStepsUpdated ] = useState<boolean>(false);
    const [ askPasswordFromUser, setAskPasswordFromUser ] = useState<boolean>(true);
    const [ passwordOption, setPasswordOption ] = useState<PasswordOptionTypes>(userConfig.defaultPasswordOption);
    const [ isOfflineUser, setOfflineUser ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ selectedUserStore, setSelectedUserStore ] =
        useState<string>(userStore ?? userstoresConfig.primaryUserstoreName);
    const [ isUserSummaryEnabled, setUserSummaryEnabled ] = useState(true);
    const [ newUserId, setNewUserId ] = useState<string>("");
    const [ submitStep, setSubmitStep ] = useState<WizardStepsFormTypes>(undefined);
    const [ selectedGroupsList, setSelectedGroupList ] = useState<GroupsInterface[]>([]);

    const isAttributeProfileForUserCreationEnabled: boolean = isFeatureEnabled(
        userFeatureConfig,
        UserManagementConstants.ATTRIBUTE_PROFILES_FOR_USER_CREATION_FEATURE_FLAG
    );

    const excludedAttributes: string = "members";

    const {
        data: validationData
    } = useValidationConfigData();

    const {
        data: originalGroupList,
        error: groupListFetchRequestError
    } = useGroupList(
        null,
        null,
        null,
        selectedUserStore,
        excludedAttributes
    );

    const fixedGroupList: GroupsInterface[] = useMemo(() => {
        if (!originalGroupList?.Resources) {
            return [];
        }

        return originalGroupList.Resources;
    }, [ originalGroupList ]);

    const isAlphanumericUsername: boolean = useMemo(() => {
        return getUsernameConfiguration(validationData)?.enableValidator === "true";
    }, [ validationData ]);

    /**
     * Set user type in wizard state based on defaultUserTypeSelection
     */
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

    /**
     * Fetch group list based on domain in basic details of wizardState
     */
    useEffect(() => {
        if ( wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain) {
            setSelectedUserStore(wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.domain ]);

    useEffect(() => {
        if (!wizardState) {
            return;
        }

        if (!fixedGroupList) {
            return;
        }

        if (!isSubOrganization() && !userStoresList) {
            return;
        }

        const wizardStepArray: WizardStepInterface[] = [];

        // The user is created in the organization.
        wizardStepArray.push(...filterSteps([ WizardStepsFormTypes.BASIC_DETAILS ]));
        setSubmitStep(WizardStepsFormTypes.BASIC_DETAILS);
        // If groups are present, show the group selection step.
        if (fixedGroupList?.length > 0) {
            wizardStepArray.push(...filterSteps([ WizardStepsFormTypes.GROUP_LIST ]));
            setSubmitStep(WizardStepsFormTypes.GROUP_LIST);
        }

        // If the summary step is enabled, show the summary step.
        if (isUserSummaryEnabled) {
            wizardStepArray.push(...filterSteps([
                WizardStepsFormTypes.USER_SUMMARY
            ]));
        }

        setWizardSteps(wizardStepArray);
        setIsStepsUpdated(true);
    }, [
        fixedGroupList,
        isUserSummaryEnabled
    ]);

    /**
     * Handles the group list fetch request error.
     */
    useEffect(() => {
        if (!groupListFetchRequestError) {
            return;
        }

        if (groupListFetchRequestError.response
            && groupListFetchRequestError.response.data
            && groupListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: groupListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.groups.notifications." +
                    "fetchGroups.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.groups.notifications." +
                "fetchGroups.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
        }));
    }, [ groupListFetchRequestError ]);

    const resolveSelectedUserstoreId = (): string => {
        let selectedUserstoreId: string = userstoresConfig.primaryUserstoreId;

        if (selectedUserStore) {
            const selected: UserStoreListItem = userStoresList?.find(
                (store: UserStoreListItem) => store.name === selectedUserStore);

            if (selected) {
                selectedUserstoreId = selected.id;
            }
        }

        return selectedUserstoreId;
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
                if (step === WizardStepsFormTypes.BASIC_DETAILS) {
                    filteredSteps.push(getUserBasicWizardStep());
                } else if (step === WizardStepsFormTypes.GROUP_LIST) {
                    filteredSteps.push(getUserGroupsWizardStep());
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

    const navigateToNext = () => {
        if (wizardSteps[ currentWizardStep ]?.name === WizardStepsFormTypes.USER_MODE) {
            handleWizardFormSubmit(wizardState[ WizardStepsFormTypes.USER_MODE ], WizardStepsFormTypes.USER_MODE);
        }

        if (wizardSteps[ currentWizardStep ]?.name === WizardStepsFormTypes.BASIC_DETAILS) {
            setSubmitGeneralSettings();
        }

        if (wizardSteps[ currentWizardStep ]?.name === WizardStepsFormTypes.GROUP_LIST) {
            setSubmitGroupList();
        }

        if (wizardSteps[ currentWizardStep ]?.name === WizardStepsFormTypes.USER_SUMMARY) {
            setFinishSubmit();
            onSuccessfulUserAddition(newUserId);
            closeWizard();
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * This function handles assigning the groups to the user.
     */
    const assignUserGroups = (user: any, groups: any) => {
        const groupIds: string[] = [];

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
                    });
            }
        }
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

        let userDetails: UserDetailsInterface = {
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
            userName: username
        };

        const password: string = userInfo.newPassword;

        // Users who get invited offline are also considered as password-based users.
        // They will be assigned a randomly generated temporary password.
        // Temporary password can be changed via the offline invite link.
        if (askPasswordFromUser) {
            userDetails.password = password;
        } else if (isOfflineUser) {
            userDetails.password = generateRandomPassword();
        } else {
            userDetails[ SCIMConfigs.scim.systemSchema ] = {
                askPassword: "true"
            };
        }

        if (isAttributeProfileForUserCreationEnabled) {
            const mergedSCIMSchema: SCIMConfigInterface = {
                ...userDetails[SCIMConfigs.scim.systemSchema],
                ...userInfo[SCIMConfigs.scim.systemSchema]
            };

            const combinedUserDetails: UserDetailsInterface = omit({
                ...userInfo,
                ...userDetails,
                [SCIMConfigs.scim.systemSchema]: mergedSCIMSchema
            }, "passwordOption", "newPassword", "userType", "domain", "firstName", "lastName");

            // If email value is not present, use the emails value.
            if (isEmpty(userInfo?.email) && userInfo?.emails?.length > 0) {
                delete combinedUserDetails.email;

                // Primary will be the string value in the emails array.
                const primaryEmail: string = userInfo.emails.find(
                    (subAttribute: (string | MultiValueAttributeInterface | EmailsInterface)) =>
                        typeof subAttribute === "string") as string;

                if (primaryEmail) {
                    combinedUserDetails.emails = [
                        {
                            primary: true,
                            value: primaryEmail
                        },
                        ...userInfo?.emails
                    ];
                }
                else {
                    // This means that the user has not provided any email value.
                    // This is an invalid case. Therefore, we need to throw an error.
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.genericError.message"
                        )
                    }));

                    return;
                }
            }

            userDetails = { ...combinedUserDetails };
        }

        setIsSubmitting(true);

        addUser(userDetails)
            .then((response: AxiosResponse) => {
                if (response.status === 202) {
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUserPendingApproval.success.description"
                        ),
                        level: AlertLevels.WARNING,
                        message: t(
                            "users:notifications.addUserPendingApproval.success.message"
                        )
                    }));
                } else {
                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "users:notifications.addUser.success.message"
                        )
                    }));
                }

                if (userInfo?.groups) {
                    assignUserGroups(response.data, userInfo?.groups);
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
                    error.response.data && error.response.data.scimType ===
                        UserManagementConstants.ERROR_USER_LIMIT_REACHED) {
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
            (
                formType === WizardStepsFormTypes.BASIC_DETAILS ||
                formType === WizardStepsFormTypes.GROUP_LIST
            )) {
            setWizardState({ ...wizardState, [ formType ]: values });
        }

        // If the submit step is the current step, submit the form.
        if (submitStep === formType) {
            handleWizardFormFinish(generateWizardSummary(values));

            return;
        }

        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
    };

    /**
     * Generates a summary of the wizard.
     *
     * @returns Summary of the wizard.
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
     * Returns the text on the wizard title.
     * @returns Text on the wizard title.
     */
    const resolveWizardTitle = (): string => {
        let wizardTitle: string = t("extensions:manage.users.wizard.addUser.title");

        if (wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName) {
            wizardTitle += " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName;
        } else {
            wizardTitle += "";
        }

        return wizardTitle;
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
            t("extensions:manage.features.user.addUser.add");
        }
        if (wizardSteps[ currentWizardStep ]?.name === WizardStepsFormTypes.USER_SUMMARY) {
            return t("extensions:manage.features.user.addUser.close");
        }

        return t("extensions:manage.features.user.addUser.finish");
    };

    /**
     * Basic Wizard Step.
     * @returns Basic details wizard step.
     */
    const getUserBasicWizardStep = (): WizardStepInterface => {
        return {
            content: (
                <AddUserUpdated
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    emailVerificationEnabled={ emailVerificationEnabled }
                    onSubmit={ (values: AddUserWizardStateInterface) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                    requestedPasswordOption={ wizardState &&
                    wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.passwordOption }
                    isUserstoreRequired={ false }
                    passwordOption={ passwordOption }
                    setPasswordOption={ setPasswordOption }
                    setUserSummaryEnabled={ setUserSummaryEnabled }
                    setAskPasswordFromUser={ setAskPasswordFromUser }
                    setOfflineUser={ setOfflineUser }
                    selectedUserStore={ selectedUserStore }
                    setSelectedUserStore = { setSelectedUserStore }
                    isBasicDetailsLoading={ isBasicDetailsLoading }
                    setBasicDetailsLoading={ setBasicDetailsLoading }
                    validationConfig ={ validationData }
                    selectedUserStoreId={ resolveSelectedUserstoreId() }
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
                <AddUserGroups
                    triggerSubmit={ submitGroupList }
                    onSubmit={ (values: { groups : GroupsInterface[] }) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.GROUP_LIST) }
                    selectedGroupsList={ selectedGroupsList }
                    setSelectedGroupList={ setSelectedGroupList }
                    selectedUserStore={ selectedUserStore }
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
                            ? wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.userName
                            : wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.email
                    }
                    password={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.newPassword }
                    isPasswordBased={ askPasswordFromUser }
                />
            ),
            icon: getUserWizardStepIcons().summary,
            name: WizardStepsFormTypes.USER_SUMMARY,
            title: t("user:modals.addUserWizard.steps.invitation")
        };
    };

    /**
     * Resolves the step content.
     *
     * @returns Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (wizardSteps[ currentWizardStep ]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                return getUserBasicWizardStep()?.content;
            case WizardStepsFormTypes.GROUP_LIST:
                return getUserGroupsWizardStep()?.content;
            case WizardStepsFormTypes.USER_SUMMARY:
                return getUserSummaryWizardStep()?.content;
        }
    };

    const handleModalContent = (): ReactElement => {
        return (
            <>
                <Modal.Content className="steps-container">
                    <Steps.Group
                        current={ currentWizardStep }
                    >
                        { wizardSteps.map((step: WizardStepInterface, index: number) => (
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
                    { resolveStepContent() }
                </Modal.Content>
            </>
        );
    };

    const handleModalAction = (): ReactElement => {
        return (
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            {
                                wizardSteps[ currentWizardStep ]?.name !== WizardStepsFormTypes.USER_SUMMARY && (
                                    <LinkButton
                                        data-testid={ `${ testId }-cancel-button` }
                                        data-componentid={ `${ componentId }-cancel-button` }
                                        floated="left"
                                        onClick={ () => {
                                            closeWizard();
                                        } }
                                    >
                                        { t("common:cancel") }
                                    </LinkButton>
                                )
                            }
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < wizardSteps.length - 1 && (
                                <PrimaryButton
                                    data-testid={ `${ testId }-next-button` }
                                    data-componentid={ `${ componentId }-next-button` }
                                    floated="right"
                                    onClick={ navigateToNext }
                                    loading={ isBasicDetailsLoading }
                                    disabled = { isBasicDetailsLoading }
                                >
                                    { currentWizardStep === wizardSteps.length - 2
                                        ? t("user:modals.addUserWizard.buttons.saveAndContinue")
                                        : t("user:modals.addUserWizard.buttons.next")
                                    }
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === wizardSteps.length - 1 && (
                                <PrimaryButton
                                    data-testid={ `${ testId }-finish-button` }
                                    data-componentid={ `${ componentId }-finish-button` }
                                    floated="right"
                                    onClick={ navigateToNext }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { resolveWizardPrimaryButtonText() }
                                </PrimaryButton>
                            ) }
                            { (wizardSteps?.length > 1
                                && currentWizardStep > 0
                                && (wizardSteps[ currentWizardStep ]?.name !== WizardStepsFormTypes.USER_SUMMARY))
                                && (
                                    <LinkButton
                                        data-testid={ `${ testId }-previous-button` }
                                        data-componentid={ `${ componentId }-previous-button` }
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                    >
                                        <Icon name="arrow left"/>
                                        { t("user:modals.addUserWizard.buttons.previous") }
                                    </LinkButton>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        );
    };

    return (
        wizardSteps && isStepsUpdated ? (
            <Modal
                data-testid={ testId }
                data-componentid={ componentId }
                open={ true }
                className="wizard application-create-wizard"
                dimmer="blurring"
                size="small"
                onClose={ closeWizard }
                closeOnDimmerClick={ false }
                closeOnEscape
            >
                <Modal.Header className="wizard-header">
                    { resolveWizardTitle() }
                    <Heading as="h6">
                        { t("extensions:manage.users.wizard.addUser.subtitle") }
                    </Heading>
                </Modal.Header>
                { handleModalContent() }
                { handleModalAction() }
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
    showStepper: true
};
