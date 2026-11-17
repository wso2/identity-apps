/**
 * Copyright (c) 2023-2026, WSO2 LLC. (https://www.wso2.com).
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
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { updateApplicationDetails } from "@wso2is/admin.applications.v1/api/application";
import { useGetApplication } from "@wso2is/admin.applications.v1/api/use-get-application";
import { ApplicationInterface } from "@wso2is/admin.applications.v1/models/application";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    LinkButton,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    HTMLAttributes,
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
import { Grid, Icon } from "semantic-ui-react";
import { AutoCompleteRenderOption } from "./auto-complete-render-option";
import { ApplicationRoleWizard } from "./wizard-updated/application-role-wizard";
import { getAllApplicationRolesByAudience } from "../api/roles";
import { RoleAudienceTypes } from "../constants/role-constants";
import {
    AssociatedRolesPatchObjectInterface,
    BasicRoleInterface,
    RolesV2Interface
} from "../models/roles";
import { addNewlyListedRoles, addRoleIfMissing } from "../utils/application-roles-utils";


interface ApplicationRolesSettingsInterface extends IdentifiableComponentInterface {
    /**
     * on application update callback
     */
    onUpdate: (id: string) => void;
    /**
     * Make the component read only.
     */
    readOnly?: boolean;
    /**
     * Original template ID of the application for which the roles are created.
     */
    originalTemplateId?: string;
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
        onUpdate,
        originalTemplateId,
        readOnly,
        [ "data-componentid" ]: componentId
    } = props;

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { getLink } = useDocumentation();
    const { data: application } = useGetApplication(appId, !!appId);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ shouldUpdateRoleAudience, setShouldUpdateRoleAudience ] = useState<boolean>(false);
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

    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    // IDs of the roles the selection already accounts for: the application's associated roles when the tab
    // loaded, and every role listed since. A listed role that is not in it was associated with the application
    // elsewhere, so it is added to the selection.
    const knownRoleIdsRef: MutableRefObject<Set<string>> = useRef<Set<string>>(new Set<string>());

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const userRolesV3FeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3
    );
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const hasRoleCreatePermissions: boolean = useRequiredScopes(
        userRolesV3FeatureEnabled
            ? userRolesV3FeatureConfig?.scopes?.create
            : featureConfig?.userRoles?.scopes?.create
    );

    /**
     * Fetch application roles on component load and audience switch.
     */
    useEffect(() => {
        const associatedRoles: BasicRoleInterface[] = roleAudience === application?.associatedRoles?.allowedAudience
            ? application?.associatedRoles?.roles ?? []
            : [];

        knownRoleIdsRef.current = new Set<string>(
            associatedRoles.map((role: BasicRoleInterface): string => role.id)
        );
        setSelectedRoles(associatedRoles);
        setInitialSelectedRoles(associatedRoles);
        getApplicationRoles();
    }, [ roleAudience ]);

    /**
     * Send a request to update roles when one of the role audience radio buttons is selected.
     */
    useEffect(() => {

        if (!shouldUpdateRoleAudience) {
            return;
        }

        updateRoles();
    }, [ shouldUpdateRoleAudience, roleAudience ]);

    /**
     * Handles the click event of the New Role button.
     */
    const handleAddNewRoleWizardClick = (): void => {
        setShowWizard(true);
    };

    /**
     * Fetch all the roles of the selected audience.
     *
     * The server has already associated the listed roles that are not known yet, and the role created from this
     * tab, with the application, so they are added to the selection. The listing is only used to add roles: it
     * can miss a role, so it is not used to drop any.
     *
     * @param createdRole - Role created from this tab, if any.
     */
    const getApplicationRoles = (createdRole?: BasicRoleInterface): void => {
        // The role options are only used to edit the APPLICATION audience roles. Skip paging through the roles
        // when they would not be used.
        if (readOnly || roleAudience !== RoleAudienceTypes.APPLICATION) {
            setRoleList([]);

            return;
        }

        setIsLoading(true);

        getAllApplicationRolesByAudience(roleAudience, appId, "users,groups,permissions,associatedApplications",
            userRolesV3FeatureEnabled)
            .then((roles: RolesV2Interface[]): void => {
                const rolesArray: BasicRoleInterface[] = roles.map((role: RolesV2Interface): BasicRoleInterface => ({
                    id: role?.id,
                    name: role?.displayName
                }));
                const knownRoleIds: Set<string> = knownRoleIdsRef.current;
                const addAssociatedRoles = (currentRoles: BasicRoleInterface[]): BasicRoleInterface[] =>
                    addRoleIfMissing(addNewlyListedRoles(currentRoles, rolesArray, knownRoleIds), createdRole);

                // Keep the earlier IDs too, so a role that a listing misses cannot look new in a later one.
                knownRoleIdsRef.current = new Set<string>([
                    ...Array.from(knownRoleIds),
                    ...rolesArray.map((role: BasicRoleInterface): string => role.id)
                ]);
                setRoleList(rolesArray);
                setSelectedRoles(addAssociatedRoles);
                setInitialSelectedRoles(addAssociatedRoles);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
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
            .finally((): void => {
                setIsLoading(false);
            });
    };

    /**
     * Triggers on role update.
     */
    const updateRoles = (): void => {
        setIsSubmitting(true);
        const isRoleAudienceChanged: boolean = roleAudience !== application?.associatedRoles?.allowedAudience;
        const data: AssociatedRolesPatchObjectInterface = {
            allowedAudience: roleAudience,
            roles: (isRoleAudienceChanged || !selectedRoles)
                ? []
                : selectedRoles.map((role: BasicRoleInterface) => {
                    return {
                        id: role.id
                    };
                })
        };

        const updatedApplication: ApplicationInterface = {
            associatedRoles: data,
            id: appId,
            name: application.name
        };

        updateApplicationDetails(updatedApplication)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateApplication.success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
                setShouldUpdateRoleAudience(false);
            });
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

    /**
     * Handles the on role created callback.
     *
     * @param createdRole - The role that was created.
     */
    const onRoleCreated = (createdRole: BasicRoleInterface): void => {
        // The server associates a new APPLICATION audience role with the application, so select it too.
        // Otherwise the next update would send a role list without it and the role would be deleted.
        const addCreatedRole = (currentRoles: BasicRoleInterface[]): BasicRoleInterface[] =>
            addRoleIfMissing(currentRoles, createdRole);

        // Record the role as known now, so a later listing does not select it again after the user removes it.
        if (createdRole?.id) {
            knownRoleIdsRef.current = new Set<string>([ ...Array.from(knownRoleIdsRef.current), createdRole.id ]);
        }

        setRoleList(addCreatedRole);
        setSelectedRoles(addCreatedRole);
        setInitialSelectedRoles(addCreatedRole);
        getApplicationRoles(createdRole);
        onUpdate(appId);
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
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </Heading>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Heading as="h5" className="mb-2">
                                { t("extensions:develop.applications.edit.sections.rolesV2.roleAudience") }
                            </Heading>
                        </Grid.Column>
                        <Grid.Column width={ 10 }>
                            <FormGroup>
                                <Grid>
                                    <Grid.Row columns={ 2 } className="pb-0">
                                        <Grid.Column width={ 4 }>
                                            <FormControlLabel
                                                className="mt-1"
                                                checked={ roleAudience === RoleAudienceTypes.APPLICATION }
                                                control={ <Radio size="small" /> }
                                                onChange={ () =>
                                                    promptAudienceSwitchWarning(RoleAudienceTypes.APPLICATION) }
                                                label={
                                                    t("extensions:develop.applications.edit.sections." +
                                                    "rolesV2.application")
                                                }
                                                data-componentid={ `${ componentId }-application-audience-checkbox` }
                                                disabled={ readOnly }
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={ 6 }>
                                            {
                                                !readOnly &&
                                                roleAudience === RoleAudienceTypes.APPLICATION &&
                                                hasRoleCreatePermissions
                                                    && (
                                                        <LinkButton
                                                            fluid
                                                            data-componentid="create-application-role-button"
                                                            onClick={ handleAddNewRoleWizardClick }
                                                        >
                                                            <Icon name="plus"/>
                                                            {
                                                                t("applications:edit." +
                                                                "sections.roles.createApplicationRoleWizard.button")
                                                            }
                                                        </LinkButton>
                                                    )
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="pt-0">
                                        <Grid.Column width={ 6 }>
                                            <FormControlLabel
                                                checked={ roleAudience === RoleAudienceTypes.ORGANIZATION }
                                                control={ <Radio size="small"/> }
                                                onChange={ () =>
                                                    promptAudienceSwitchWarning(RoleAudienceTypes.ORGANIZATION) }
                                                label={
                                                    t("extensions:develop.applications.edit.sections." +
                                                    "rolesV2.organization")
                                                }
                                                data-componentid={ `${ componentId }-organization-audience-checkbox` }
                                                disabled={ readOnly }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </FormGroup>
                        </Grid.Column>
                    </Grid.Row>
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION ? (
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
                                    readOnly={ readOnly }
                                    loading={ isLoading }
                                    options={ roleList }
                                    value={ selectedRoles ?? [] }
                                    data-componentid={ `${ componentId }-assigned-roles-list` }
                                    getOptionLabel={
                                        (role: BasicRoleInterface) => role.name
                                    }
                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                        <TextField
                                            { ...params }
                                            placeholder={ !readOnly && t("extensions:develop.applications.edit." +
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
                                        <>
                                            { /* `activeOption` and `setActiveOption` are not part of Chip API */ }
                                            { /* TODO: Tracker: https://github.com/wso2/product-is/issues/21351 */ }
                                            { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
                                            { /* @ts-ignore */ }
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
                                                        ? "filled"
                                                        : "outlined"
                                                }
                                            />
                                        </>
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
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }
                    {
                        !readOnly && (
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
                onClose={ (): void => {
                    setTempRoleAudience(roleAudience);
                    setShowSwitchAudienceWarning(false);
                } }
                type="negative"
                open={ showSwitchAudienceWarning }
                assertionHint={ t("extensions:develop.applications.edit.sections." +
                    "rolesV2.switchRoleAudience.applicationConfirmationModal.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setTempRoleAudience(roleAudience);
                    setShowSwitchAudienceWarning(false);
                } }
                onPrimaryActionClick={ (): void => {
                    setRoleAudience(tempRoleAudience);
                    setShouldUpdateRoleAudience(true);
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
            {
                showWizard
                && roleAudience === RoleAudienceTypes.APPLICATION
                && (
                    <ApplicationRoleWizard
                        setUserListRequestLoading={ null }
                        data-testid="user-mgt-add-user-wizard-modal"
                        data-componentid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => {
                            setShowWizard(false);
                        } }
                        application={ application }
                        onRoleCreated={ onRoleCreated }
                        originalTemplateId={ originalTemplateId }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
ApplicationRoles.defaultProps = {
    "data-componentid": "application-roles-tab",
    readOnly: true
};
