/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import TextField from "@oxygen-ui/react/TextField";
import { APIResourceCategories, APIResourcesConstants } from "@wso2is/admin.api-resources.v2/constants";
import { APIResourceInterface } from "@wso2is/admin.api-resources.v2/models";
import { APIResourceUtils } from "@wso2is/admin.api-resources.v2/utils/api-resource-utils";
import useSubscribedAPIResources from "@wso2is/admin.applications.v1/api/use-subscribed-api-resources";
import { AuthorizedAPIListItemInterface } from "@wso2is/admin.applications.v1/models/api-authorization";
import { ApplicationInterface, ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/form";
import { Code, ContentLoader, EmphasizedSegment, Heading, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import startCase from "lodash-es/startCase";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownItemProps, DropdownProps, Grid, Header, Label, Modal } from "semantic-ui-react";
import { createRole, createRoleUsingV3Api } from "../../api";
import useGetRolesList from "../../api/use-get-roles-list";
import { RoleAudienceTypes, RoleConstants } from "../../constants";
import { ScopeInterface } from "../../models/apiResources";
import { Policy } from "../../models/policies";
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
    /**
     * Original template ID of the application to which the app role is assigned.
     */
    originalTemplateId?: string;
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
        originalTemplateId,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ selectedPermissions, setSelectedPermissions ] = useState<SelectedPermissionsInterface[]>([]);
    const [ selectedAPIResources, setSelectedAPIResources ] = useState<APIResourceInterface[]>([]);
    const [ apiResourcesListOptions, setAPIResourcesListOptions ] = useState<DropdownItemProps[]>([]);
    const [ applicationName, setApplicationName ] = useState<string>(application?.name);
    const [ selectedApplication, setSelectedApplication ] = useState<DropdownItemProps[]>([]);
    const [ isFormError, setIsFormError ] = useState<boolean>(false);
    const [ roleNameSearchQuery, setRoleNameSearchQuery ] = useState<string>(undefined);

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];
    const FORM_ID: string = "application-role-creation-form";
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const createRoleFunction: (role: CreateRoleInterface) => Promise<AxiosResponse> =
        userRolesV3FeatureEnabled ? createRoleUsingV3Api : createRole;

    const {
        data: subscribedAPIResourcesListData,
        isLoading: isSubscribedAPIResourcesListLoading,
        error: subscribedAPIResourcesFetchRequestError
    } = useSubscribedAPIResources(appId);

    const {
        data: rolesList,
        isLoading: isRolesListLoading,
        isValidating: isRolesListValidating
    } = useGetRolesList(undefined, undefined, roleNameSearchQuery, "users,groups,permissions,associatedApplications");

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
        const options: DropdownItemProps[] = [];

        subscribedAPIResourcesListData?.map((apiResource: AuthorizedAPIListItemInterface) => {
            const isNotSelected: boolean = !selectedAPIResources
                ?.find((selectedAPIResource: APIResourceInterface) => selectedAPIResource?.id === apiResource?.id);

            if (isNotSelected && apiResource.policyId == Policy.ROLE) {
                options.push({
                    identifier: apiResource?.identifier,
                    key: apiResource?.id,
                    text: apiResource?.displayName,
                    type: apiResource?.type,
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

        // Add the selected resource to selectedAPIResources
        const subscribedApiResourcesList: APIResourceInterface[] = [ ...selectedAPIResources ];

        const selectedApiResources: AuthorizedAPIListItemInterface[] = subscribedAPIResourcesListData.filter(
            (permission: AuthorizedAPIListItemInterface) =>
                permission?.id === data?.value
        );

        selectedApiResources.map((selectedAPIResource: AuthorizedAPIListItemInterface) => {
            subscribedApiResourcesList.push({
                id: selectedAPIResource?.id,
                identifier: selectedAPIResource?.identifier,
                name: selectedAPIResource?.displayName,
                scopes: selectedAPIResource?.authorizedScopes,
                type: APIResourceUtils.resolveApiResourceGroup(selectedAPIResource?.type)
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
        createRoleFunction(roleData)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    dispatch(addAlert({
                        description: t("roles:notifications.createRole.success" +
                            ".description"),
                        level: AlertLevels.SUCCESS,
                        message: t("roles:notifications.createRole.success.message")
                    }));

                    onRoleCreated();
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
            errors.displayName = t("roles:addRoleWizard.forms.roleBasicDetails.roleName." +
                "validations.empty", { type: "Role" });
        } else {
            setRoleNameSearchQuery(`displayName eq ${values?.displayName} and audience.value eq ${audienceId}`);
            if (!isRolesListLoading || !isRolesListValidating) {
                if (rolesList?.totalResults > 0) {
                    errors.displayName = t("roles:addRoleWizard.forms.roleBasicDetails." +
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
                { t("applications:edit." +
                "sections.roles.createApplicationRoleWizard.title") }
                <Heading
                    as="h6"
                    subHeading>
                    {
                        t("applications:edit." +
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
                        message={ t("authenticationProvider:" +
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
                        label={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                            "assignedApplication.label") }
                        required={ true }
                        options={ selectedApplication }
                        value={ applicationName }
                        search
                        loading = { false }
                        data-componentid={ `${componentId}-typography-font-family-dropdown` }
                        hint={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                            "assignedApplication.note") }
                        placeholder={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                            "assignedApplication.placeholder") }
                        onChange={ (
                            e: React.ChangeEvent<HTMLInputElement>,
                            data: DropdownProps
                        ) => {
                            setApplicationName(data.value.toString());
                        } }
                        disabled
                    />
                    {
                        isSubscribedAPIResourcesListLoading
                            ? <ContentLoader inline="centered" active />
                            : (
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    aria-label="API resource selection"
                                    className="pt-2"
                                    componentsProps={ {
                                        paper: {
                                            elevation: 2
                                        },
                                        popper: {
                                            modifiers: [
                                                {
                                                    enabled: false,
                                                    name: "flip"
                                                },
                                                {
                                                    enabled: false,
                                                    name: "preventOverflow"
                                                }
                                            ]
                                        }
                                    } }
                                    data-componentid={ `${componentId}-api` }
                                    getOptionLabel={ (apiResourcesListOption: DropdownProps) =>
                                        apiResourcesListOption.text }
                                    renderOption={ (props: any, apiResourcesListOption: any) =>
                                        (
                                            <div { ...props }>
                                                <Header.Content>
                                                    { apiResourcesListOption.text }
                                                    { apiResourcesListOption.type == APIResourcesConstants.BUSINESS && (
                                                        <Header.Subheader>
                                                            <Code
                                                                className="inline-code compact transparent"
                                                                withBackground={ false }
                                                            >
                                                                { apiResourcesListOption?.identifier }
                                                            </Code>
                                                            <Label
                                                                pointing="left"
                                                                size="mini"
                                                                className="client-id-label">
                                                                { t("extensions:develop.apiResource.table." +
                                                                "identifier.label") }
                                                            </Label>
                                                        </Header.Subheader>
                                                    ) }
                                                </Header.Content>
                                            </div>
                                        ) }
                                    groupBy={ (apiResourcesListOption: DropdownItemProps) =>
                                        APIResourceUtils
                                            .resolveApiResourceGroup(apiResourcesListOption?.type) }
                                    isOptionEqualToValue={
                                        (option: DropdownItemProps, value: DropdownItemProps) =>
                                            option.value === value.value
                                    }
                                    options={
                                        apiResourcesListOptions?.filter((item: DropdownItemProps) =>
                                            item?.type === APIResourceCategories.TENANT ||
                                            item?.type === APIResourceCategories.ORGANIZATION ||
                                            item?.type === APIResourceCategories.BUSINESS ||
                                            item?.type === APIResourceCategories.MCP
                                        ).sort((a: DropdownItemProps, b: DropdownItemProps) =>
                                            APIResourceUtils.sortApiResourceTypes(a, b)
                                        )
                                    }
                                    onChange={ onAPIResourceSelected }
                                    noOptionsText={ isSubscribedAPIResourcesListLoading
                                        ? t("common:searching")
                                        : t("common:noResultsFound")
                                    }
                                    key="apiResource"
                                    placeholder={ t("roles:addRoleWizard." +
                                        "forms.rolePermission.apiResource.placeholder") }
                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                        <TextField
                                            { ...params }
                                            label={ t("extensions:develop.applications.edit." +
                                                "sections.apiAuthorization.sections.apiSubscriptions." +
                                                "wizards.authorizeAPIResource.fields.apiResource.label", {
                                                resourceText: originalTemplateId ===
                                                    ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION
                                                    ? startCase(t("extensions:develop.applications.edit.sections" +
                                                        ".apiAuthorization.resourceText.genericResource"))
                                                    : t("extensions:develop.applications.edit.sections.apiAuthorization"
                                                        + ".resourceText.apiResource")

                                            }) }
                                            placeholder={ t("extensions:develop.applications.edit." +
                                                "sections.apiAuthorization.sections.apiSubscriptions." +
                                                "wizards.authorizeAPIResource.fields.apiResource." +
                                                "placeholder", {
                                                resourceText: originalTemplateId ===
                                                    ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION
                                                    ? startCase(t("extensions:develop.applications.edit.sections" +
                                                        ".apiAuthorization.resourceText.genericResource"))
                                                    : t("extensions:develop.applications.edit.sections.apiAuthorization"
                                                        + ".resourceText.apiResource")

                                            }) }
                                            size="small"
                                            variant="outlined"
                                        />
                                    ) }
                                />
                            )
                    }
                </Form>
                { selectedAPIResources?.length > 0
                    ? (
                        <div className="role-permission-list field">
                            <label className="form-label">
                                { t("roles:addRoleWizard.forms.rolePermission" +
                                    ".permissions.label") }
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
                                                errorMessage={ t("roles:addRoleWizard." +
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
                                disabled={ isFormError || isSubmitting }
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
