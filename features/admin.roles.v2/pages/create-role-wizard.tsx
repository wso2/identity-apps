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

import Grid from "@oxygen-ui/react/Grid";
import { VerticalStepper, VerticalStepperStepInterface } from "@wso2is/admin.core.v1/components/vertical-stepper";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { createRole, createRoleUsingV3Api } from "../api/roles";
import { RoleBasics } from "../components/wizard-updated/role-basics";
import { RolePermissionsList } from "../components/wizard-updated/role-permissions/role-permissions";
import { RoleAudienceTypes } from "../constants";
import { ScopeInterface } from "../models/apiResources";
import {
    CreateRoleFormData,
    CreateRoleInterface,
    CreateRolePermissionInterface,
    CreateRoleStateInterface,
    CreateRoleStepsFormTypes,
    SelectedPermissionsInterface
} from "../models/roles";

/**
 * Interface which captures create role props.
 */
type CreateRoleProps = IdentifiableComponentInterface;

/**
 * Component to handle addition of a new role to the system.
 *
 * @param props - props related to the create role stepper
 */
const CreateRolePage: FunctionComponent<CreateRoleProps> = (props: CreateRoleProps): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization, isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const [ stepperState, setStepperState ] = useState<CreateRoleStateInterface>(undefined);
    const [ isBasicDetailsNextButtonDisabled, setIsBasicDetailsNextButtonDisabled ] = useState<boolean>(true);
    const [ isPermissionStepNextButtonDisabled, setIsPermissionStepNextButtonDisabled ] = useState<boolean>(true);
    const [ selectedPermissions, setSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const createRoleFunction: (roleData: CreateRoleInterface) => Promise<AxiosResponse> =
        userRolesV3FeatureEnabled ? createRoleUsingV3Api : createRole;

    // External trigger to submit the authorization step.
    let submitRoleBasic: () => void;

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param formType - Type of the form.
     */
    const handleWizardSubmit = (values: CreateRoleFormData, formType: CreateRoleStepsFormTypes) => {
        setStepperState({ ...stepperState, [ formType ]: values });
    };

    /**
     * Handle create role action when create role wizard finish action is triggered.
     *
     * @param basicData - basic data required to create role.
     */
    const addRole = (): void => {
        if (!isPermissionStepNextButtonDisabled) {
            setIsSubmitting(true);

            const roleAudience: string = stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ].roleAudience;
            const organizationId: string = store.getState().organization.organization.id;
            const selectedPermissionsList: CreateRolePermissionInterface[] = selectedPermissions?.flatMap(
                (permission: SelectedPermissionsInterface) => (
                    permission?.scopes?.map((scope: ScopeInterface) => ({ value: scope?.name })) || []
                )) || [];

            const roleData: CreateRoleInterface = {
                audience: roleAudience === RoleAudienceTypes.ORGANIZATION
                    ? {
                        type: roleAudience,
                        value: organizationId
                    } : {
                        type: roleAudience,
                        value: stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ].assignedApplicationId
                    },
                displayName: stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ].roleName,
                permissions: selectedPermissionsList,
                schemas: []
            };

            // If the organization is super or a first level organization,
            // no need to send the audience for Organization audience.
            if ((isSuperOrganization() || isFirstLevelOrganization()) &&
                roleAudience === RoleAudienceTypes.ORGANIZATION) {
                delete roleData.audience;
            }

            // Create Role API Call.
            createRoleFunction(roleData)
                .then((response: AxiosResponse) => {
                    if (response.status === 201) {
                        dispatch(addAlert({
                            description: t("roles:notifications.createRole.success" +
                                ".description"),
                            level: AlertLevels.SUCCESS,
                            message: t("roles:notifications.createRole.success.message")
                        }));

                        history.push(AppConstants.getPaths().get("ROLE_EDIT").replace(":id", response.data.id));
                    } else if (response.status === 202) {
                        dispatch(addAlert({
                            description: t("roles:notifications.createRolePendingApproval.success" +
                                ".description"),
                            level: AlertLevels.WARNING,
                            message: t("roles:notifications.createRolePendingApproval.success.message")
                        }));
                        history.push(AppConstants.getPaths().get("ROLES"));
                    }
                })
                .catch((error: AxiosError) => {
                    if (!error.response || error.response.status === 401) {
                        dispatch(addAlert({
                            description: t("roles:notifications.createRole.error" +
                                    ".description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:notifications.createRole.error.message")
                        }));
                    } else if (error.response && error.response.data.detail) {
                        dispatch(addAlert({
                            description: t("roles:notifications.createRole.error" +
                                ".description",
                            { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:notifications.createRole.error.message")
                        }));
                    } else {
                        dispatch(addAlert({
                            description: t("roles:notifications.createRole.genericError" +
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:notifications.createRole.genericError.message")
                        }));
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const creationFlowSteps: VerticalStepperStepInterface[] = [
        {
            preventGoToNextStep: isBasicDetailsNextButtonDisabled,
            stepAction: () => submitRoleBasic(),
            stepContent: (
                <RoleBasics
                    triggerSubmission={ (submitFunctionCb: () => void) => {
                        submitRoleBasic = submitFunctionCb;
                    } }
                    setIsNextDisabled={ setIsBasicDetailsNextButtonDisabled }
                    initialValues={ stepperState && stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ] }
                    onSubmit={ (values: CreateRoleFormData) => {
                        handleWizardSubmit(values, CreateRoleStepsFormTypes.BASIC_DETAILS);
                    } }
                />
            ),
            stepTitle: t("roles:addRoleWizard.wizardSteps.0")
        },
        {
            preventGoToNextStep: isPermissionStepNextButtonDisabled,
            stepContent: (
                <RolePermissionsList
                    selectedPermissions={ selectedPermissions }
                    setSelectedPermissions={ setSelectedPermissions }
                    setIsPermissionStepNextButtonDisabled={ setIsPermissionStepNextButtonDisabled }
                    roleAudience={
                        stepperState &&
                        stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ]?.roleAudience as RoleAudienceTypes
                    }
                    assignedApplicationId={
                        stepperState &&
                        stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ]?.assignedApplicationId
                    }
                    assignedApplicationName={
                        stepperState &&
                        stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ]?.assignedApplicationName
                    }
                />
            ),
            stepTitle: t("roles:addRoleWizard.wizardSteps.1")
        }
    ];

    return (
        <PageLayout
            title={ t("roles:addRoleWizard.heading", { type: "Role" }) }
            contentTopMargin={ true }
            description={ t("roles:addRoleWizard.subHeading", { type: "role" }) }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: () => history.push(AppConstants.getPaths().get("ROLES")),
                text: t("roles:addRoleWizard.back")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
            data-componentid={ `${componentId}-page-layout` }
        >
            <div className="remote-user-store-create-section">
                <EmphasizedSegment padded="very" loading={ isSubmitting }>
                    <Grid container>
                        <Grid>
                            <VerticalStepper
                                alwaysOpen={ false }
                                isSidePanelOpen={ false }
                                stepContent={ creationFlowSteps }
                                isNextEnabled={ true }
                                data-componentid={ `${componentId}-vertical-stepper` }
                                handleFinishAction={ addRole }
                            />
                        </Grid>
                    </Grid>
                </EmphasizedSegment>
            </div>
        </PageLayout>
    );
};

/**
 * Default props for Create role wizard component.
 */
CreateRolePage.defaultProps = {
    "data-componentid": "create-role-wizard"
};

export default CreateRolePage;
