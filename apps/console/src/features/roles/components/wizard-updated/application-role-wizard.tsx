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

import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { EmphasizedSegment, Heading, Hint, Link, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Grid, Modal } from "semantic-ui-react";
import { AppConstants, history } from "../../../../features/core";
import { APIResourceInterface } from "../../../api-resources/models";
import useSubscribedAPIResources from "../../../applications/api/use-subscribed-api-resources";
import { AuthorizedAPIListItemInterface } from "../../../applications/models/api-authorization";
import { ApplicationInterface } from "../../../applications/models/application";
import { createRole, useRolesList } from "../../api";
import { RoleAudienceTypes, RoleConstants } from "../../constants";
import { ScopeInterface } from "../../models/apiResources";
import {
    CreateRoleFormData,
    CreateRoleInterface,
    CreateRolePermissionInterface,
    SelectedPermissionsInterface
} from "../../models/roles";
import { RoleAPIResourcesListItem } from "../edit-role/edit-role-common/role-api-resources-list-item";

interface ApplicationRoleWizardPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    closeWizard: () => void;
    setUserListRequestLoading: (value: boolean) => void;
    onRoleCreated: () => void;
}

/**
 * Application role creation wizard.
 *
 * @returns Application role creation wizard.
 */
export const ApplicationRoleWizard: FunctionComponent<ApplicationRoleWizardPropsInterface> = (
    props: ApplicationRoleWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        application,
        onRoleCreated,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ selectedPermissions, setSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ selectedAPIResources, setSelectedAPIResources ] = useState<APIResourceInterface[]>([]);
    const [ apiResourcesListOptions, setAPIResourcesListOptions ] = useState<DropdownProps[]>([]);
    const [ applicationName, setApplicationName ] = useState<string>(application?.name);
    const [ selectedApplication, setSelectedApplication ] = useState<DropdownItemProps[]>([]);
    const [ isFormError, setIsFormError ] = useState<boolean>(false);
    const [ roleNameSearchQuery, setRoleNameSearchQuery ] = useState<string>(undefined);
    const [ invalidAPIResourceFields, setInvalidAPIResourceFields ] = useState<string[]>([]);

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];
    const FORM_ID: string = "application-role-creation-form";
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const {
        data: subscribedAPIResourcesListData,
        isLoading: isSubscribedAPIResourcesListLoading,
        error: subscribedAPIResourcesFetchRequestError
    } = useSubscribedAPIResources(appId);

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        isValidating: isRolesListValidating
    } = useRolesList(undefined, undefined, roleNameSearchQuery, "users,groups,permissions,associatedApplications");

    useEffect(() => {
        const selectedApplication: DropdownItemProps[] = [];

        selectedApplication.push({
            key: selectedApplication.length,
            text: application?.name,
            value: application?.name
        });
        setSelectedApplication(selectedApplication);
    }, [ application ]);

    useEffect(() => {
        const options: DropdownProps[] = [];

        subscribedAPIResourcesListData?.map((apiResource: AuthorizedAPIListItemInterface) => {
            const isNotSelected: boolean = !selectedAPIResources
                ?.find((selectedAPIResource: APIResourceInterface) => selectedAPIResource?.id === apiResource?.id);

            if (isNotSelected) {
                options.push({
                    key: apiResource?.id,
                    text: apiResource?.displayName,
                    value: apiResource?.id
                });
            }
        });
        setAPIResourcesListOptions(options);
    }, [ subscribedAPIResourcesListData, selectedAPIResources ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (subscribedAPIResourcesFetchRequestError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message")
            }));
        }
    }, [ subscribedAPIResourcesFetchRequestError ]);

    /**
     * Handles the selection of an API resource.
     */
    const onAPIResourceSelected = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        event.preventDefault();

        setInvalidAPIResourceFields([ ...invalidAPIResourceFields, data?.value?.toString() ]);

        // Add the selected resource to selectedAPIResources
        const subscribedApiResourcesList: APIResourceInterface[] = [ ...selectedAPIResources ];

        const selectedApiResources: AuthorizedAPIListItemInterface[] = subscribedAPIResourcesListData.filter(
            (permission: AuthorizedAPIListItemInterface) =>
                permission?.id === data.value
        );

        selectedApiResources.map((selectedAPIResource: AuthorizedAPIListItemInterface) => {
            subscribedApiResourcesList.push({
                id: selectedAPIResource?.id,
                identifier: selectedAPIResource?.identifier,
                name: selectedAPIResource?.displayName,
                scopes: selectedAPIResource?.authorizedScopes
            });
        });

        setSelectedAPIResources(subscribedApiResourcesList);
    };

    const onChangeScopes = (apiResource: APIResourceInterface, scopes: ScopeInterface[]): void => {
        const selectedScopes: SelectedPermissionsInterface[] = selectedPermissions.filter(
            (selectedPermission: SelectedPermissionsInterface) =>
                selectedPermission.apiResourceId !== apiResource.id
        );

        selectedScopes.push(
            {
                apiResourceId: apiResource.id,
                scopes: scopes
            }
        );

        setSelectedPermissions(selectedScopes);

        if (scopes?.length > 0) {
            setInvalidAPIResourceFields(invalidAPIResourceFields.filter((id: string) => id !== apiResource.id));
        } else {
            setInvalidAPIResourceFields([ ...invalidAPIResourceFields, apiResource.id ]);
        }
    };

    /**
     * Handles the removal of an API resource.
     */
    const onRemoveAPIResource = (apiResourceId: string): void => {
        // Remove the API resource from the selected API resources list.
        setSelectedAPIResources(selectedAPIResources.filter((apiResource: APIResourceInterface) => {
            return apiResource.id !== apiResourceId;
        }));

        // Remove the scopes(permissions) of the removed API resource from the selected permissions list.
        setSelectedPermissions(selectedPermissions.filter((selectedPermission: SelectedPermissionsInterface) => {
            return selectedPermission.apiResourceId !== apiResourceId;
        }));

        setInvalidAPIResourceFields(invalidAPIResourceFields.filter((id: string) => id !== apiResourceId));
    };

    /**
     * Handle create role action when create role wizard finish action is triggered.
     *
     * @param basicData - basic data required to create role.
     */
    const addRole = ( role: CreateRoleInterface): void => {
        setIsSubmitting(true);

        const selectedPermissionsList: CreateRolePermissionInterface[] = selectedPermissions?.flatMap(
            (permission: SelectedPermissionsInterface) => (
                permission?.scopes?.map((scope: ScopeInterface) => ({ value: scope?.name })) || []
            )) || [];

        const roleData: CreateRoleInterface = {
            audience: {
                type: RoleAudienceTypes.APPLICATION,
                value: application?.id
            },
            displayName: role?.displayName,
            permissions: selectedPermissionsList,
            schemas: []
        };

        // Create Role API Call.
        createRole(roleData)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    dispatch(addAlert({
                        description: t("console:manage.features.roles.notifications.createRole.success" +
                            ".description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.roles.notifications.createRole.success.message")
                    }));

                    onRoleCreated();
                }
            })
            .catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    dispatch(addAlert({
                        description: t("console:manage.features.roles.notifications.createRole.error" +
                            ".description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.notifications.createRole.error.message")
                    }));
                } else if (error.response && error.response.data.detail) {
                    dispatch(addAlert({
                        description: t("console:manage.features.roles.notifications.createRole.error" +
                            ".description",
                        { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.notifications.createRole.error.message")
                    }));
                } else {
                    dispatch(addAlert({
                        description: t("console:manage.features.roles.notifications.createRole.genericError" +
                            ".description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.notifications.createRole.genericError.message")
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                closeWizard();
            });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = async (values: CreateRoleFormData): Promise<CreateRoleFormData> => {
        const errors: CreateRoleFormData = {
            assignedApplicationId: undefined,
            displayName: undefined
        };

        const audienceId: string = appId;

        // Handle the case where the user has not entered a role name.
        if (!values.displayName?.toString().trim()) {
            errors.displayName = t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails.roleName." +
                "validations.empty", { type: "Role" });
        } else {
            setRoleNameSearchQuery(`displayName eq ${values?.displayName} and audience.value eq ${audienceId}`);
            if (!isRolesListLoading || !isRolesListValidating) {
                if (rolesList?.totalResults > 0) {
                    errors.displayName = t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                        "roleName.validations.duplicate", { type: "Role" });
                }
            }
        }

        if (errors.displayName) {
            setIsFormError(true);
        } else {
            setIsFormError(false);
        }

        return errors;
    };

    return (
        <Modal
            data-testid={ componentId }
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header>
                { t("console:develop.features.applications.edit." +
                "sections.roles.createApplicationRoleWizard.title") }
                <Heading
                    as="h6"
                    subHeading>
                    {
                        t("console:develop.features.applications.edit." +
                        "sections.roles.createApplicationRoleWizard.subTitle")
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ true }
                    onSubmit={ addRole }
                    initialValues={ null }
                    validate={ validateForm }
                    ref={ formRef }
                >
                    <Field.Input
                        ariaLabel="roleName"
                        inputType="roleName"
                        type="text"
                        name="displayName"
                        label={
                            t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." +
                                "roleBasicDetails.roleName.label")
                        }
                        placeholder={
                            t("extensions:develop.applications.edit.sections.roles.addRoleWizard.forms." +
                                "roleBasicDetails.roleName.placeholder")
                        }
                        required
                        message={ t("console:develop.features.authenticationProvider." +
                            "forms.generalDetails.name.validations.empty") }
                        value={ null }
                        maxLength={ RoleConstants.ROLE_NAME_MAX_LENGTH }
                        minLength={ RoleConstants.ROLE_NAME_MIN_LENGTH }
                        data-testid={ `${ componentId }-role-name` }
                        readOnly={ false }
                    />
                    <Field.Dropdown
                        ariaLabel="assignedApplicationId"
                        name="assignedApplicationId"
                        label={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                            "assignedApplication.label") }
                        required={ true }
                        options={ selectedApplication }
                        value={ applicationName }
                        search
                        loading = { false }
                        data-componentid={ `${componentId}-typography-font-family-dropdown` }
                        hint={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                            "assignedApplication.note") }
                        placeholder={ t("console:manage.features.roles.addRoleWizard.forms.roleBasicDetails." +
                            "assignedApplication.placeholder") }
                        onChange={ (
                            e: React.ChangeEvent<HTMLInputElement>,
                            data: DropdownProps
                        ) => {
                            setApplicationName(data.value.toString());
                        } }
                        disabled
                    />
                    <Field.Dropdown
                        search
                        selection
                        selectOnNavigation={ false }
                        ariaLabel="assignedApplication"
                        name="assignedApplication"
                        label={ t("console:manage.features.roles.addRoleWizard.forms.rolePermission." +
                            "apiResource.label") }
                        options={ apiResourcesListOptions }
                        data-componentid={ `${componentId}-typography-font-family-dropdown` }
                        placeholder={ t("console:manage.features.roles.addRoleWizard." +
                            "forms.rolePermission.apiResource.placeholder") }
                        noResultsMessage={
                            isSubscribedAPIResourcesListLoading
                                ? t("common:searching")
                                :  t("common:noResultsFound")
                        }
                        loading={ false }
                        onChange={ onAPIResourceSelected }
                        hint={
                            !isSubscribedAPIResourcesListLoading
                            && apiResourcesListOptions?.length === 0
                            && selectedAPIResources?.length === 0
                            && (
                                <Hint>
                                    <Trans
                                        i18nKey={ "console:manage.features.roles.addRoleWizard.forms.rolePermission" +
                                            ".apiResource.hint.empty" }
                                    >
                                        There are no API resources authorized for the selected application.
                                        API Resources can be authorized through <Link
                                            external={ false }
                                            onClick={ () => {
                                                history.push(
                                                    `${ AppConstants.getPaths()
                                                        .get("APPLICATION_EDIT").replace(":id", appId) }#tab=4`
                                                );
                                            } }
                                        > here </Link>
                                    </Trans>
                                </Hint>
                            )
                        }
                    />
                </Form>
                { selectedAPIResources?.length > 0
                    ? (
                        <div className="role-permission-list field">
                            <label className="form-label">
                                { t("console:manage.features.roles.addRoleWizard." +
                                        "forms.rolePermission.permissions.label") }
                            </label>
                            <EmphasizedSegment
                                className="mt-2"
                                data-componentid={ `${componentId}-segment` }
                                basic
                                loading={ false }
                            >
                                {
                                    selectedAPIResources?.map((apiResource: APIResourceInterface) => {
                                        return (
                                            <RoleAPIResourcesListItem
                                                key={ apiResource?.id }
                                                apiResource={ apiResource }
                                                onChangeScopes={ onChangeScopes }
                                                onRemoveAPIResource={ onRemoveAPIResource }
                                                selectedPermissions={
                                                    selectedPermissions?.find(
                                                        (selectedPermission: SelectedPermissionsInterface) =>
                                                            selectedPermission.apiResourceId === apiResource?.id
                                                    )?.scopes
                                                }
                                                hasError={ invalidAPIResourceFields?.includes(apiResource?.id) }
                                                errorMessage={ t("console:manage.features.roles.addRoleWizard." +
                                                    "forms.rolePermission.permissions.validation.empty") }
                                            />
                                        );
                                    })
                                }
                            </EmphasizedSegment>
                        </div>
                    ) : null
                }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${componentId}-cancel-button` }
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid={ `${componentId}-finish-button` }
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isFormError || isSubmitting || invalidAPIResourceFields?.length > 0 }
                                form={ FORM_ID }
                                type="button"
                                onClick={ () => {
                                    formRef?.current?.triggerSubmit();
                                } }
                            >
                                { t("common:create") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
