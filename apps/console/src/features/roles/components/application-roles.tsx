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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import Radio from "@oxygen-ui/react/Radio";
import TextField from "@oxygen-ui/react/TextField";
import { OrganizationType } from "@wso2is/common";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { AutoCompleteRenderOption } from "./auto-complete-render-option";
import { updateApplicationDetails } from "../../applications/api";
import { ApplicationInterface } from "../../applications/models";
import {
    history
} from "../../core";
import { useGetOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { getApplicationRolesByAudience } from "../api/roles";
import { RoleAudienceTypes } from "../constants/role-constants";
import {
    AssociatedRolesPatchObjectInterface,
    BasicRoleInterface, RolesV2Interface,
    RolesV2ResponseInterface
} from "../models/roles";


interface ApplicationRolesSettingsInterface extends IdentifiableComponentInterface {
    /**
     * Application.
     */
    application?: ApplicationInterface
    /**
     * on application update callback
     */
    onUpdate: (id: string) => void;
}

/**
 * Application roles component.
 *
 * @param props - Props related to application roles component.
 */
export const ApplicationRoles: FunctionComponent<ApplicationRolesSettingsInterface> = (
    props: ApplicationRolesSettingsInterface
): ReactElement => {

    const {
        application,
        onUpdate,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { getLink } = useDocumentation();
    const orgType: OrganizationType = useGetOrganizationType();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showSwitchAudienceWarning, setShowSwitchAudienceWarning ] = useState<boolean>(false);
    const [ roleAudience, setRoleAudience ] =
        useState<RoleAudienceTypes>(application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION);
    const [ tempRoleAudience, setTempRoleAudience ] =
        useState<RoleAudienceTypes>(application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION);
    
    const [ roleList, setRoleList ] = useState<BasicRoleInterface[]>([]);
    const [ selectedRoles, setSelectedRoles ] =
        useState<BasicRoleInterface[]>(application?.associatedRoles?.roles ?? []);
    const [ initialSelectedRoles, setInitialSelectedRoles ] =
        useState<BasicRoleInterface[]>(application?.associatedRoles?.roles ?? []);
    const [ activeOption, setActiveOption ] = useState<BasicRoleInterface>(undefined);
    const [ removedRolesOptions, setRemovedRolesOptions ] = useState<BasicRoleInterface[]>(undefined);

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];

    const isReadOnly: boolean = orgType === OrganizationType.SUBORGANIZATION;

    /**
     * Fetch application roles on component load and audience switch.
     */
    useEffect(() => {        
        getApplicationRoles();
        if (roleAudience === application?.associatedRoles?.allowedAudience) {
            setSelectedRoles(application?.associatedRoles?.roles);
            setInitialSelectedRoles(application?.associatedRoles?.roles);
        } else {
            setSelectedRoles([]);
            setInitialSelectedRoles([]);
        }
    }, [ roleAudience ]);

    /**
     * Set removed roles
     */
    useEffect(() => {
        if (initialSelectedRoles && selectedRoles) {
            setRemovedRolesOptions(initialSelectedRoles?.filter((role: BasicRoleInterface) => {
                return selectedRoles?.find(
                    (selectedRole: BasicRoleInterface) => selectedRole.id === role.id) === undefined;
            }));
        }
    }, [ initialSelectedRoles, selectedRoles ]);

    /**
     * Fetch application roles.
     */
    const getApplicationRoles = (): void => {
        getApplicationRolesByAudience(roleAudience, appId, null, null, null)
            .then((response: RolesV2ResponseInterface) => {
                const rolesArray: BasicRoleInterface[] = [];

                response?.Resources?.forEach((role: RolesV2Interface) => {
                    rolesArray.push({
                        id: role?.id,
                        name: role?.displayName
                    });
                });
                
                setRoleList(rolesArray);
            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ??
                            error?.response?.data?.detail ??
                            t("extensions:develop.applications.edit.sections.roles.notifications." +
                                "fetchApplicationRoles.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message ??
                            t("extensions:develop.applications.edit.sections.roles.notifications." +
                                "fetchApplicationRoles.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "fetchApplicationRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "fetchApplicationRoles.genericError.message")
                }));

                setRoleList([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Triggers on role update.
     */
    const updateRoles = (): void => {
        setIsSubmitting(true);
        const data: AssociatedRolesPatchObjectInterface = {
            allowedAudience: roleAudience,
            roles: selectedRoles ? selectedRoles.map((role: BasicRoleInterface) => {
                return {
                    id: role.id
                };
            }) : []
        };

        const updatedApplication: ApplicationInterface = {
            associatedRoles: data,
            id: appId,
            name: application.name
        };        

        updateApplicationDetails(updatedApplication)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateApplication.success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Handle the restore roles.
     * 
     * @param remainingRoles - remaining roles
     */
    const handleRestoreUsers = (remainingRoles: BasicRoleInterface[]) => {
        const removedRoles: BasicRoleInterface[] = [];

        removedRolesOptions.forEach((user: BasicRoleInterface) => {
            if (!remainingRoles?.find((newUser: BasicRoleInterface) => newUser.id === user.id)) {
                removedRoles.push(user);
            }
        });

        setSelectedRoles([
            ...selectedRoles,
            ...removedRoles
        ]);
    };

    /**
     * Prompt the user to confirm the role audience switch.
     * 
     * @param selectedAudience - selected audience
     */
    const promptAudienceSwitchWarning = (selectedAudience: RoleAudienceTypes): void => {
        setTempRoleAudience(selectedAudience);
        setShowSwitchAudienceWarning(true);
    };

    return (
        <>
            <EmphasizedSegment
                loading={ isLoading }
                padded="very"
                data-componentid={ componentId }
            >
                <Grid>
                    <Grid.Row>
                        <Grid.Column className="heading-wrapper" width={ 10 }>
                            <Heading as="h4">
                                { t("extensions:develop.applications.edit.sections.rolesV2.heading") }
                            </Heading>
                            <Heading subHeading ellipsis as="h6">
                                { t("extensions:develop.applications.edit.sections.rolesV2.subHeading") }
                                <DocumentationLink
                                    link={ getLink("develop.applications.roles.learnMore") }
                                >
                                    { t("extensions:common.learnMore") }
                                </DocumentationLink>
                            </Heading>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Heading as="h5" className="mb-2">
                                { t("extensions:develop.applications.edit.sections.rolesV2.roleAudience") }
                            </Heading>
                            <FormGroup>
                                <FormControlLabel
                                    checked={ roleAudience === RoleAudienceTypes.ORGANIZATION }
                                    control={ <Radio size="small"/> }
                                    onChange={ () => promptAudienceSwitchWarning(RoleAudienceTypes.ORGANIZATION) }
                                    label={ t("extensions:develop.applications.edit.sections.rolesV2.organization") }
                                    data-componentid={ `${ componentId }-organization-audience-checkbox` }
                                    disabled={ isReadOnly }
                                />
                                <FormControlLabel
                                    checked={ roleAudience === RoleAudienceTypes.APPLICATION }
                                    control={ <Radio size="small" /> }
                                    onChange={ () => promptAudienceSwitchWarning(RoleAudienceTypes.APPLICATION) }
                                    label={ t("extensions:develop.applications.edit.sections.rolesV2.application") }
                                    data-componentid={ `${ componentId }-application-audience-checkbox` }
                                    disabled={ isReadOnly }
                                />
                            </FormGroup>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>     
                            <Heading as="h5">
                                { t("extensions:develop.applications.edit.sections.rolesV2.assignedRoles") }
                            </Heading>
                        </Grid.Column>
                        { /* {
                            // Will be enabled once the feature is completed.
                            roleAudience === RoleAudienceTypes.APPLICATION
                                && (
                                    <Grid.Column width={ 4 } textAlign="right">
                                        <Button
                                            startIcon={ <PlusIcon/> }
                                            variant="text"
                                        >
                                            Create Role
                                        </Button>
                                    </Grid.Column>
                                )
                        } */ }
                        <Grid.Column width={ 8 }>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                readOnly={ isReadOnly }
                                loading={ isLoading }
                                options={ roleList }
                                value={ selectedRoles ?? [] }
                                getOptionLabel={ 
                                    (role: BasicRoleInterface) => role.name
                                }
                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                    <TextField
                                        { ...params }
                                        placeholder={ !isReadOnly && t("extensions:develop.applications.edit." +
                                            "sections.rolesV2.searchPlaceholder") }
                                    />
                                ) }
                                onChange={ (event: SyntheticEvent, roles: BasicRoleInterface[]) => {
                                    setSelectedRoles(roles); 
                                } }
                                isOptionEqualToValue={ 
                                    (option: BasicRoleInterface, value: BasicRoleInterface) => 
                                        option.id === value.id 
                                }
                                renderTags={ (
                                    value: BasicRoleInterface[], 
                                    getTagProps: AutocompleteRenderGetTagProps
                                ) => value.map((option: BasicRoleInterface, index: number) => (
                                    <Chip
                                        { ...getTagProps({ index }) }
                                        key={ index }
                                        label={ option.name }
                                        activeOption={ activeOption }
                                        setActiveOption={ setActiveOption }
                                        variant={
                                            initialSelectedRoles?.find(
                                                (role: BasicRoleInterface) => role.id === option.id
                                            )
                                                ? "solid"
                                                : "outlined"
                                        }
                                    />
                                )) }
                                renderOption={ (
                                    props: HTMLAttributes<HTMLLIElement>,
                                    option: BasicRoleInterface, 
                                    { selected }: { selected: boolean }
                                ) => (
                                    <AutoCompleteRenderOption
                                        selected={ selected }
                                        displayName={ option.name }
                                        renderOptionProps={ props }
                                    />
                                ) }
                            />
                            {
                                removedRolesOptions?.length > 0
                                    ? (
                                        <Autocomplete
                                            className="mt-3"
                                            multiple
                                            disableCloseOnSelect
                                            loading={ isLoading }
                                            options={ removedRolesOptions }
                                            value={ removedRolesOptions }
                                            getOptionLabel={ 
                                                (role: BasicRoleInterface) => role.name
                                            }
                                            onChange={ (
                                                event: SyntheticEvent,
                                                remainingRoles: BasicRoleInterface[]
                                            ) => {
                                                handleRestoreUsers(remainingRoles);
                                            } }
                                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                                <TextField
                                                    { ...params }
                                                    label={ t("extensions:develop.applications.edit.sections." +
                                                        "rolesV2.removedRoles") }
                                                    placeholder={ t("extensions:develop.applications.edit.sections." +
                                                        "rolesV2.searchPlaceholder") }
                                                />
                                            ) }
                                            renderTags={ (
                                                value: BasicRoleInterface[], 
                                                getTagProps: AutocompleteRenderGetTagProps
                                            ) => value.map((option: BasicRoleInterface, index: number) => (
                                                <Chip
                                                    { ...getTagProps({ index }) }
                                                    key={ index }
                                                    label={ option.name }
                                                    option={ option }
                                                    activeOption={ activeOption }
                                                    setActiveOption={ setActiveOption }
                                                    variant="outlined"
                                                    onDelete={ () => {
                                                        setSelectedRoles([
                                                            ...selectedRoles,
                                                            option
                                                        ]);
                                                    } }
                                                />
                                            ) ) }
                                            renderOption={ (
                                                props: HTMLAttributes<HTMLLIElement>, 
                                                option: BasicRoleInterface
                                            ) => (
                                                <AutoCompleteRenderOption
                                                    displayName={ option.name }
                                                    renderOptionProps={ props }
                                                />
                                            ) }
                                        />
                                    ) : null
                            } 
                            
                        </Grid.Column>
                    </Grid.Row>
                    {
                        !isReadOnly && (
                            <Grid.Row className="mt-4">
                                <Grid.Column width={ 16 }>
                                    <PrimaryButton
                                        size="small"
                                        loading={ isSubmitting }
                                        onClick={ () => updateRoles() }
                                        ariaLabel="Roles update button"
                                        data-componentid={ `${ componentId }-update-button` }
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                </Grid>
            </EmphasizedSegment>
            <ConfirmationModal
                onClose={ (): void => setShowSwitchAudienceWarning(false) }
                type="negative"
                open={ showSwitchAudienceWarning }
                assertionHint={ t("extensions:develop.applications.edit.sections." +
                    "rolesV2.switchRoleAudience.applicationConfirmationModal.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setShowSwitchAudienceWarning(false);
                } }
                onPrimaryActionClick={ (): void => {
                    setRoleAudience(tempRoleAudience);
                    setShowSwitchAudienceWarning(false);
                } }
                data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal-header` }
                >
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION
                        ? t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.applicationConfirmationModal.header")
                        : t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.organizationConfirmationModal.header")
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal-message` }
                >
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION
                        ? t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.applicationConfirmationModal.message")
                        : t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.organizationConfirmationModal.message")
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal-content` }
                >
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION
                        ? t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.applicationConfirmationModal.content")
                        : t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.organizationConfirmationModal.content")
                    }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
ApplicationRoles.defaultProps = {
    "data-componentid": "application-roles-tab"
};
