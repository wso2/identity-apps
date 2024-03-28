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
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { GenericIconProps, Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import intersection from "lodash-es/intersection";
import merge from "lodash-es/merge";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AddConsumerUser, AddConsumerUserProps } from "./steps/add-consumer-user";
import { AddConsumerUserWizardSummary } from "./steps/add-consumer-user-wizard-summary";
import { AddConsumerUserGroups } from "./steps/consumer-user-groups";
import { SCIMConfigs } from "../../../../extensions/configs/scim";
import { userstoresConfig } from "../../../../extensions/configs/userstores";
import { UserBasicInterface } from "../../../admin-core-v1";
import {
    GroupsInterface,
    PatchGroupDataInterface,
    getGroupList,
    updateGroupDetails
} from "../../../admin-groups-v1";
import { addUser } from "../../../admin-users-v1/api/users";
import { getUserWizardStepIcons } from "../../../admin-users-v1/configs/ui";
import {
    AddUserWizardStateInterface,
    UserDetailsInterface,
    createEmptyUserDetails
} from "../../../admin-users-v1/models/user";
import { getUsernameConfiguration } from "../../../admin-users-v1/utils";
import { useValidationConfigData } from "../../../admin-validation-v1/api";
import { ValidationFormInterface } from "../../../admin-validation-v1/models";

interface AddUserWizardPropsInterface extends TestableComponentInterface {
    closeWizard: () => void;
    compact?: boolean;
    currentStep?: number;
    listOffset?: number;
    listItemLimit?: number;
    updateList?: () => void;
    rolesList?: any;
    emailVerificationEnabled: boolean;
    hiddenFields?: AddConsumerUserProps[ "hiddenFields" ];
    requiredSteps?: WizardStepsFormTypes[] | string[];
    submitStep?: WizardStepsFormTypes | string;
    showStepper?: boolean;
    requestedPasswordOption?: AddConsumerUserProps[ "requestedPasswordOption" ];
    onSuccessfulUserAddition?: (id: string) => void;
    title?: string;
    description?: string;
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
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    GROUP_LIST= "GroupList",
    SUMMARY = "summary"
}

/**
 * Consumer User creation wizard.
 *
 * @returns AddConsumerUserWizard component.
 */
export const AddConsumerUserWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        compact,
        closeWizard,
        currentStep,
        emailVerificationEnabled,
        hiddenFields,
        requiredSteps,
        showStepper,
        submitStep,
        requestedPasswordOption,
        onSuccessfulUserAddition,
        title,
        description,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitGroupList, setSubmitGroupList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>(undefined);
    const [ isStepsAvailable, setIsStepsAvailable ] = useState(false);
    const [ submitting, setSubmitting ] = useState(false);

    const [ groupList, setGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ fixedGroupList, setFixedGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ tempGroupList, setTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState<GroupsInterface[]>([]);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const { data: validationData } = useValidationConfigData();

    useEffect(() => {
        if (!fixedGroupList) {
            return;
        }

        if (wizardSteps?.length > 0) {
            setIsStepsAvailable(true);
        }
    }, [ fixedGroupList, wizardSteps ]);

    useEffect(() => {
        setWizardSteps(filterSteps([
            WizardStepsFormTypes.BASIC_DETAILS,
            WizardStepsFormTypes.GROUP_LIST,
            WizardStepsFormTypes.SUMMARY ]));
    }, []);

    useEffect(() => {
        if (!fixedGroupList) {
            return;
        }

        if (fixedGroupList.length === 0) {
            setWizardSteps(filterSteps([ WizardStepsFormTypes.BASIC_DETAILS, WizardStepsFormTypes.SUMMARY ]));

            return;
        }

        setWizardSteps(filterSteps([
            WizardStepsFormTypes.BASIC_DETAILS,
            WizardStepsFormTypes.GROUP_LIST,
            WizardStepsFormTypes.SUMMARY ]));
    }, [ fixedGroupList ]);

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

    const handleEnterKeyDown = (event: KeyboardEvent) => {
        if (event.keyCode === 13) {
            const nextButton: HTMLElement = document.getElementById(`${ testId }-next-button`);
            const finishButton: HTMLElement = document.getElementById(`${ testId }-finish-button`);

            if (nextButton)
                document.getElementById(`${ testId }-next-button`).click();
            else if (finishButton) {
                document.getElementById(`${ testId }-finish-button`).click();
            }
        }
    };

    useEffect(() => {
        getGroupListForDomain(userstoresConfig.primaryUserstoreName);
        document.addEventListener("keydown", handleEnterKeyDown);
    }, []);

    const getGroupListForDomain = (domain: string) => {
        getGroupList(domain)
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
            });
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
        switch (wizardSteps[currentWizardStep]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                setSubmitGeneralSettings();

                break;
            case WizardStepsFormTypes.GROUP_LIST:
                setSubmitGroupList();

                break;
            case WizardStepsFormTypes.SUMMARY:
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
    const assignUserGroups = (user: UserBasicInterface, groups: GroupsInterface[]) => {
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
        let userName: string = "";

        const config: ValidationFormInterface = getUsernameConfiguration(validationData);
        const isAlphanumericUsername: boolean = config?.enableValidator === "true" ? true : false;

        if (!isAlphanumericUsername) {
            userName = userInfo.domain + "/" + userInfo.email;
        } else {
            userName = userInfo.domain + "/" + userInfo.userName;
        }

        let userDetails: UserDetailsInterface = createEmptyUserDetails();
        const password: string = userInfo.newPassword;

        (requestedPasswordOption && requestedPasswordOption !== "ask-password")
        || (userInfo.passwordOption && userInfo.passwordOption !== "ask-password")
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
                    userName: userName
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
                    [SCIMConfigs.scim.enterpriseSchema]: {
                        askPassword: "true"
                    },
                    userName: userName
                }
            );

        setSubmitting(true);
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

                setSubmitting(false);
                if (wizardState?.GroupList?.groups) {
                    assignUserGroups(response.data, wizardState.GroupList.groups);
                }

                onSuccessfulUserAddition && onSuccessfulUserAddition(response.data?.id);
            })
            .catch((error: IdentityAppsApiException) => {
                setSubmitting(false);
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {

                    dispatch(addAlert({
                        description: t(
                            "users:notifications.addUser.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "users:notifications.addUser.error.message"
                        )
                    }));
                } else if (error.response && error.response.data && error.response.data.detail) {

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
                closeWizard();
            });
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {

        // If the submit step is not default, and submit step is the current step, submit the form.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && submitStep === formType) {
            handleWizardFormFinish(values);

            return;
        }

        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
    };

    /**
     * Generates a summary of the wizard.
     *
     * @returns Wizard summary.
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

    /**
     * Resolves the step content.
     *
     * @returns Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (wizardSteps[currentWizardStep]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                return getBasicDetailsWizardStep()?.content;
            case WizardStepsFormTypes.GROUP_LIST:
                return getUserGroupsWizardStep()?.content;
            case WizardStepsFormTypes.SUMMARY:
                return getSummaryWizardStep()?.content;
        }
    };

    /**
     * Filters the steps evaluating the requested steps.
     *
     * @param steps - Steps to filter.
     * @returns filtered steps.
     */
    const filterSteps = (steps: WizardStepsFormTypes[]): WizardStepInterface[] => {

        const getStepContent = (stepsToFilter: WizardStepsFormTypes[] | string[]) => {

            const filteredSteps: any[] = [];

            stepsToFilter.forEach((step: WizardStepsFormTypes) => {
                if (step === WizardStepsFormTypes.BASIC_DETAILS) {
                    filteredSteps.push(getBasicDetailsWizardStep());
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
     * Basic Wizard Step.
     * @returns Basic details wizard step.
     */
    const getBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUser
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    emailVerificationEnabled={ emailVerificationEnabled }
                    onSubmit={ (values: Map<string, FormValue>) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                    hiddenFields={ hiddenFields }
                    requestedPasswordOption={ requestedPasswordOption }
                />
            ),
            icon: getUserWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("user:modals.addUserWizard.steps.basicDetails")
        };
    };

    /**
     * User group wizard step.
     * @returns Group Wizard Step.
     */
    const getUserGroupsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddConsumerUserGroups
                    triggerSubmit={ submitGroupList }
                    onSubmit={ (values: Map<string, FormValue>) =>
                        handleWizardFormSubmit(values, WizardStepsFormTypes.GROUP_LIST) }
                    initialValues={
                        {
                            groupList: groupList,
                            initialGroupList: initialGroupList,
                            initialTempGroupList: initialTempGroupList,
                            tempGroupList: tempGroupList
                        }
                    }
                    handleGroupListChange={ (groups: GroupsInterface[]) => handleGroupListChange(groups) }
                    handleTempListChange={ (groups: GroupsInterface[]) => handleAddedGroupListChange(groups) }
                    handleInitialTempListChange={ (groups: GroupsInterface[]) =>
                        handleAddedGroupInitialListChange(groups) }
                    handleInitialGroupListChange={ (groups: GroupsInterface[]) => handleInitialGroupListChange(groups) }
                    handleSetGroupId={ null }
                />
            ),
            icon: getUserWizardStepIcons().groups,
            name: WizardStepsFormTypes.GROUP_LIST,
            title: t("user:modals.addUserWizard.steps.groups")
        };
    };

    /**
     * Summary wizard step.
     * @returns Summary wizard Step.
     */
    const getSummaryWizardStep = (): WizardStepInterface => {

        return  {
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

    return (
        wizardSteps && isStepsAvailable ? (
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
                    {
                        title
                            ? title
                            : (
                                <>
                                    { "Create New Business User" }
                                    {
                                        wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName
                                            ? " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.firstName
                                            : ""
                                    }
                                </>
                            )
                    }
                    <Heading as="h6">
                        {
                            description
                                ? description
                                : "Follow the steps to create a new business user"
                        }
                    </Heading>
                </Modal.Header>
                {
                    showStepper && (
                        <Modal.Content className="steps-container">
                            <Steps.Group
                                current={ currentWizardStep }
                            >
                                { wizardSteps?.map((step: WizardStepInterface, index: number) => (
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
                <Modal.Content className={ "content-container" + compact ? " height-auto" : "" } scrolling>
                    { alert && alertComponent }
                    { resolveStepContent() }
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
                                { currentWizardStep < wizardSteps?.length - 1 && (
                                    <PrimaryButton
                                        id={ `${ testId }-next-button` }
                                        data-testid={ `${ testId }-next-button` }
                                        floated="right"
                                        onClick={ navigateToNext }
                                    >
                                        { t("user:modals.addUserWizard.buttons.next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === wizardSteps?.length - 1 && (
                                    <PrimaryButton
                                        id={ `${ testId }-finish-button` }
                                        data-testid={ `${ testId }-finish-button` }
                                        disabled={ submitting }
                                        floated="right"
                                        loading={ submitting }
                                        onClick={ navigateToNext }
                                    >
                                        Finish</PrimaryButton>
                                ) }
                                { (wizardSteps?.length > 1 && currentWizardStep > 0) && (
                                    <LinkButton
                                        data-testid={ `${ testId }-previous-button` }
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                    >
                                        <Icon name="arrow left"/>
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
AddConsumerUserWizard.defaultProps = {
    currentStep: 0,
    emailVerificationEnabled: false,
    showStepper: true,
    submitStep: WizardStepsFormTypes.SUMMARY
};
