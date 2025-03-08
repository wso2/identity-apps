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

import Autocomplete, {
    AutocompleteInputChangeReason,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Link from "@oxygen-ui/react/Link";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import TextField from "@oxygen-ui/react/TextField";
import { PaletteIcon } from "@oxygen-ui/react-icons";
import { ApplicationTabComponentsFilter } from
    "@wso2is/admin.application-templates.v1/components/application-tab-components-filter";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { UIConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState  } from "@wso2is/admin.core.v1/store";
import { ApplicationTabIDs, applicationConfig, userstoresConfig } from "@wso2is/admin.extensions.v1";
import FeatureFlagLabel from "@wso2is/admin.feature-gate.v1/components/feature-flag-label";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreDropdownItem, UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import {
    AlertLevels,
    FeatureFlagsInterface,
    IdentifiableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import { RadioChild } from "@wso2is/forms";
import {
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Hint,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import { DiscoverableGroupRenderChip } from "./discoverable-group-render-chip";
import { DiscoverableGroupRenderOption } from "./discoverable-group-render-option";
import { useMyAccountStatus } from "../../../api/application";
import { useGetGroupsMetadata } from "../../../api/use-get-groups-metadata";
import { ApplicationManagementConstants } from "../../../constants/application-management";
import { ApplicationInterface, DiscoverableGroupInterface, GroupMetadataInterface } from "../../../models/application";
import "./general-details-form.scss";

/**
 * Proptypes for the applications general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface, IdentifiableComponentInterface {
    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Currently editing application id.
     */
    appId?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverability?: boolean;
    /**
     * Set of hidden fields.
     */
    hiddenFields?: string[];
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the application.
     */
    name: string;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
    /**
     * Specifies a Management Application
     */
    isManagementApp?: boolean;
    /**
     * Specifies whether having edit-permissions
     */
    hasRequiredScope?: boolean;
    /**
     * Application
     */
    application?: ApplicationInterface;
    /**
     * Is the Branding Section Hidden?
     */
    isBrandingSectionHidden?: boolean;
}

/**
 * Form values interface.
 */
export interface GeneralDetailsFormValuesInterface {
    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverableByEndUsers?: boolean;
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the application.
     */
    name: string;
}

/**
 * Proptypes for the applications general details form error messages.
 */
export interface GeneralDetailsFormErrorValidationsInterface {
    /**
     *  Error message for the Application access URL.
     */
    accessUrl?: string;
}

const FORM_ID: string = "application-general-details";

/**
 * Enum for discoverable groups radio options.
 */
enum DiscoverableGroupsRadioOptionType {
    EVERYONE = "everyone",
    USER_GROUPS = "user-groups"
}

/**
 * This will be used to render the discoverable groups radio options.
 */
const DISCOVERABLE_GROUPS_RADIO_OPTIONS: RadioChild[] = [
    {
        label: "applications:forms.generalDetails.fields.discoverableGroups.radioOptions.everyone",
        value: DiscoverableGroupsRadioOptionType.EVERYONE
    },
    {
        label: "applications:forms.generalDetails.fields.discoverableGroups.radioOptions.userGroups",
        value: DiscoverableGroupsRadioOptionType.USER_GROUPS
    }
];

/**
 * Form to edit general details of the application.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    {
        appId,
        name,
        description,
        discoverability,
        hiddenFields,
        imageUrl,
        accessUrl,
        onSubmit,
        readOnly,
        hasRequiredScope,
        isSubmitting,
        isManagementApp,
        application,
        isBrandingSectionHidden,
        [ "data-testid" ]: testId = "application-general-settings-form",
        [ "data-componentid" ]: componentId = "application-general-settings-form"
    }: GeneralDetailsFormPopsInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const { getLink } = useDocumentation();

    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);
    const brandingFeatureFlagsConfig: FeatureFlagsInterface[] = UIConfig?.features?.applications?.featureFlags;
    const orgType: OrganizationType = useSelector((state: AppState) => state?.organization?.organizationType);

    const [ isDiscoverable, setDiscoverability ] = useState<boolean>(discoverability);

    const [ isMyAccountEnabled, setMyAccountStatus ] = useState<boolean>(AppConstants.DEFAULT_MY_ACCOUNT_STATUS);
    const [ isM2MApplication, setM2MApplication ] = useState<boolean>(false);
    const [
        selectedUserStoreDomain,
        setSelectedUserStoreDomain
    ] = useState<string>(userstoresConfig?.primaryUserstoreName);
    const [ searchTerm, setSearchTerm ] = useState<string>(null);
    const [
        selectedGroupsFromUserStore,
        setSelectedGroupsFromUserStore
    ] = useState<{ [ key: string ]: GroupMetadataInterface[] }>({});
    const [ activeOption, setActiveOption ] = useState<GroupMetadataInterface>(null);
    const [ discoverableGroupOption, setDiscoverableGroupOption ] = useState<string>(
        DiscoverableGroupsRadioOptionType.EVERYONE);

    const isSubOrg: boolean = window[ "AppUtils" ].getConfig().organizationName;
    const isSubOrganizationType: boolean = orgType === OrganizationType.SUBORGANIZATION;

    const {
        data: myAccountStatus,
        isLoading: isMyAccountStatusLoading
    } = useMyAccountStatus(!isSubOrg && applicationConfig?.advancedConfigurations?.showMyAccountStatus);
    const {
        userStoresList: userStores,
        isLoading: isUserStoresLoading
    } = useUserStores();

    const {
        data: groupsList,
        isLoading: isGroupsListLoading,
        error: groupsListFetchError
    } = useGetGroupsMetadata(selectedUserStoreDomain, searchTerm);

    /**
     * Handle the discoverable group option based on the application configuration.
     */
    useEffect(() => {
        if (!application) {
            return;
        }

        if (application?.advancedConfigurations?.discoverableGroups?.length > 0) {
            setDiscoverableGroupOption(DiscoverableGroupsRadioOptionType.USER_GROUPS);
        } else {
            setDiscoverableGroupOption(DiscoverableGroupsRadioOptionType.EVERYONE);
        }
    }, [ application ]);

    /**
     * Available user stores for the application.
     */
    const availableUserStores: UserStoreDropdownItem[] = useMemo(() => {
        const storeOptions: UserStoreDropdownItem[] = [ {
            key: -1,
            text: userstoresConfig?.primaryUserstoreName,
            value: userstoresConfig?.primaryUserstoreName
        } ];

        if (userStores?.length > 0) {
            userStores.forEach((store: UserStoreListItem, index: number) => {
                if (store?.name?.toUpperCase() !== userstoresConfig?.primaryUserstoreName && store?.enabled) {
                    storeOptions.push({
                        key: index,
                        text: store.name,
                        value: store.name
                    });
                }
            });
        }

        return storeOptions;
    }, [ userStores ]);

    useEffect(() => {
        const allSelectedGroupsList: { [ key: string ]: GroupMetadataInterface[] } = {};

        if (!application?.advancedConfigurations?.discoverableGroups
            || application?.advancedConfigurations?.discoverableGroups?.length === 0) {
            return setSelectedGroupsFromUserStore(allSelectedGroupsList);
        }

        application?.advancedConfigurations?.discoverableGroups.forEach(
            (discoverableGroup: DiscoverableGroupInterface) => {
                allSelectedGroupsList[ discoverableGroup.userStore ] = discoverableGroup.groups;
            }
        );
        setSelectedGroupsFromUserStore(allSelectedGroupsList);
    }, [ application ]);

    /**
     * Handle the error scenario of fetching groups.
     */
    useEffect(() => {
        if (!groupsListFetchError) {
            return;
        }

        dispatch(addAlert({
            description: t("groups:notifications.fetchGroups.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("groups:notifications.fetchGroups.genericError.message")
        }));
    }, [ groupsListFetchError ]);

    /**
     * Build the pattern for the access URL placeholders.
     */
    const accessUrlPlaceholdersPattern: RegExp = useMemo(() => {
        let placeholdersPattern: string = "";

        ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.ACCESS_URL_ALLOWED_PLACEHOLDERS.forEach(
            (placeholder: string, index: number) => {
                if (index == 0) {
                    placeholdersPattern += placeholder;
                } else {
                    placeholdersPattern += `|${placeholder}`;
                }
            }
        );

        return new RegExp(placeholdersPattern, "g");
    }, []);

    /**
     * Resolve the updated list of discoverable groups.
     *
     * @returns Updated discoverable groups list.
     */
    const resolveUpdatedDiscoverableGroupList = (): DiscoverableGroupInterface[] => {
        const discoverableGroups: DiscoverableGroupInterface[] = [];

        if (discoverableGroupOption === DiscoverableGroupsRadioOptionType.EVERYONE || !isDiscoverable) {
            return discoverableGroups;
        }

        Object.keys(selectedGroupsFromUserStore).forEach((key: string) => {
            if (selectedGroupsFromUserStore[key]?.length > 0) {
                discoverableGroups.push({
                    groups: selectedGroupsFromUserStore[key],
                    userStore: key
                });
            }
        });

        if (!isEqual(application?.advancedConfigurations?.discoverableGroups ?? [], discoverableGroups)) {
            return discoverableGroups;
        }

        return undefined;
    };

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @returns Sanitized form values.
     */
    const updateConfigurations = (values: GeneralDetailsFormValuesInterface) => {
        onSubmit({
            accessUrl: values.accessUrl?.toString(),
            advancedConfigurations: {
                discoverableByEndUsers: values.discoverableByEndUsers,
                discoverableGroups: resolveUpdatedDiscoverableGroupList()
            },
            description: values.description?.toString().trim(),
            id: appId,
            name: values.name?.toString(),
            ...!hiddenFields?.includes("imageUrl") && { imageUrl: values.imageUrl?.toString() }
        });
    };

    /**
     * Validates the Form.
     *
     * @param values - Form Values.
     * @returns Form validation.
     */
    const validateForm = (values: GeneralDetailsFormValuesInterface):
        GeneralDetailsFormErrorValidationsInterface => {

        const errors: GeneralDetailsFormErrorValidationsInterface = {
            accessUrl: undefined
        };

        if (isDiscoverable && !values.accessUrl) {
            errors.accessUrl = t("applications:forms.generalDetails.fields.accessUrl" +
                ".validations.empty");
        }

        return errors;
    };

    /**
     * Application Name validation.
     *
     * @param name - Application Name.
     * @returns Name validation.
     */
    const validateName = (name: string): string | void => {

        const isValid: boolean = name && !!name.match(
            ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_PATTERN
        );

        if (!isValid) {
            return "Please enter a valid input.";
        }
    };

    /**
     * Application Description validation.
     *
     * @param description - Application Description.
     * @returns Description validation.
     */
    const validateDescription = (description: string): string | void => {

        const isValid: boolean = description && !!description.match(
            ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_DESCRIPTION_PATTERN
        );

        if (!isValid) {
            return "Please enter a valid input.";
        }
    };

    /**
     * Access URL may have placeholders like `${UserTenantHint}`, or `${organizationIdHint}`.
     * This function validates the Access URL after removing those placeholders.
     *
     * @param value - Access URL to be validated.
     * @returns Error message.
     */
    const validateAccessURL = (value: string): string => {
        /**
         * Use a regex to replace `${UserTenantHint}`, and `${organizationIdHint}` placeholders
         * while preserving other characters
         */
        const moderatedValue: string = value?.trim()?.replace(accessUrlPlaceholdersPattern, "");
        let errorMsg: string;

        if (moderatedValue && (!URLUtils.isURLValid(moderatedValue, true) || !FormValidation.url(moderatedValue))) {
            errorMsg = t("applications:forms.generalDetails.fields.accessUrl.validations.invalid");
        }

        return errorMsg;
    };

    /**
     * Checks whether this is an M2M application.
     */
    useEffect(() => {
        setM2MApplication(application?.templateId === ApplicationManagementConstants.M2M_APP_TEMPLATE_ID);
    }, [ application ]);

    /**
     * Sets the initial spinner.
     * TODO: Remove this once the loaders are finalized.
     */
    useEffect(() => {
        let status: boolean = AppConstants.DEFAULT_MY_ACCOUNT_STATUS;

        if (myAccountStatus) {
            const enableProperty: string = myAccountStatus["value"];

            if (enableProperty && enableProperty === "false") {

                status = false;
            }
        }

        setMyAccountStatus(status);
    }, [ isMyAccountStatusLoading ]);

    if (isMyAccountStatusLoading) {
        return (
            <EmphasizedSegment padded="very">
                <ContentLoader inline="centered" active/>
            </EmphasizedSegment>
        );
    }

    return (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ true }
            onSubmit={ (values: GeneralDetailsFormValuesInterface) => {
                updateConfigurations(values);
            } }
            initialValues={ {
                accessUrl: accessUrl,
                description: description,
                name: name
            } }
            validate={ validateForm }
        >
            <Grid className="application-general-settings">
                <ApplicationTabComponentsFilter
                    tabId={ ApplicationTabIDs.GENERAL }
                >
                    { isManagementApp && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Message
                                    type="info"
                                    content={ (
                                        <>
                                            { t("applications:forms.generalDetails.managementAppBanner") }
                                            <DocumentationLink
                                                link={ getLink("develop.applications.managementApplication.learnMore") }
                                            >
                                                {
                                                    t("common:learnMore")
                                                }
                                            </DocumentationLink>
                                        </>
                                    ) }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                    { !UIConfig.systemAppsIdentifiers.includes(name) && !isSubOrganizationType && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Field.Input
                                    ariaLabel="Application name"
                                    inputType="name"
                                    name="name"
                                    label={
                                        t("applications:forms.generalDetails.fields.name" +
                                            ".label")
                                    }
                                    required={ true }
                                    placeholder={
                                        t("applications:forms.generalDetails.fields.name" +
                                            ".placeholder")
                                    }
                                    value={ name }
                                    readOnly={ readOnly || isSubOrganizationType }
                                    validation ={ (value: string) => validateName(value.toString().trim()) }
                                    maxLength={
                                        ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH }
                                    minLength={ 3 }
                                    data-testid={ `${ testId }-application-name-input` }
                                    width={ 16 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    ) }
                    {
                        name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME && !isSubOrganizationType && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Textarea
                                        ariaLabel="Application description"
                                        name="description"
                                        label={
                                            t("applications:forms.generalDetails.fields.description" +
                                                ".label")
                                        }
                                        required={ false }
                                        placeholder={
                                            t("applications:forms.generalDetails.fields.description" +
                                                ".placeholder")
                                        }
                                        value={ description }
                                        readOnly={ readOnly }
                                        validation ={ (value: string) => validateDescription(value.toString().trim()) }
                                        maxLength={ 300 }
                                        minLength={ 3 }
                                        data-testid={ `${ testId }-application-description-textarea` }
                                        width={ 16 }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    {
                        !isSubOrganizationType && !hiddenFields?.includes("imageUrl") && (
                            <Grid.Row columns={ 1 } data-componentid="application-edit-general-details-form-image-url">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Application image URL"
                                        inputType="url"
                                        name="imageUrl"
                                        label={
                                            t("applications:forms.generalDetails" +
                                                ".fields.imageUrl.label")
                                        }
                                        required={ false }
                                        placeholder={
                                            t("applications:forms.generalDetails" +
                                                ".fields.imageUrl.placeholder")
                                        }
                                        value={ imageUrl }
                                        readOnly={ readOnly }
                                        data-testid={ `${ testId }-application-image-url-input` }
                                        maxLength={ 200 }
                                        minLength={ 3 }
                                        hint={
                                            t("applications:forms.generalDetails" +
                                                ".fields.imageUrl.hint")
                                        }
                                        width={ 16 }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    {
                        !isM2MApplication && isMyAccountEnabled && !isSubOrganizationType && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    { !isSubOrganizationType && <Divider /> }
                                    <Heading as="h4">
                                        { t("applications:forms.generalDetails.fields.discoverable.label") }
                                    </Heading>
                                    <Field.Checkbox
                                        ariaLabel="Make application discoverable by end users"
                                        name="discoverableByEndUsers"
                                        required={ false }
                                        label={ t("common:enable") }
                                        initialValue={ isDiscoverable }
                                        readOnly={ readOnly }
                                        data-testid={ `${ testId }-application-discoverable-checkbox` }
                                        listen={ (value: boolean) => {
                                            setDiscoverability(value);
                                            if (value && Object.keys(selectedGroupsFromUserStore).length > 0) {
                                                setDiscoverableGroupOption(
                                                    DiscoverableGroupsRadioOptionType.USER_GROUPS);
                                            } else {
                                                setDiscoverableGroupOption(
                                                    DiscoverableGroupsRadioOptionType.EVERYONE);
                                            }
                                        } }
                                        hint={ (
                                            <Trans
                                                i18nKey={
                                                    application.templateId === ApplicationManagementConstants.MOBILE
                                                        ? "applications:forms.inboundOIDC.mobileApp" +
                                                            ".discoverableHint"
                                                        : "applications:forms.generalDetails.fields." +
                                                            "discoverable.hint"
                                                }
                                                tOptions={ { myAccount: "My Account" } }
                                            >
                                                { " " }
                                                { getLink(
                                                    "develop.applications.managementApplication.selfServicePortal"
                                                ) === undefined
                                                    ? (
                                                        <strong data-testid="application-name-assertion">
                                                            My Account
                                                        </strong>
                                                    )
                                                    : (
                                                        <strong
                                                            className="link pointing"
                                                            data-testid="application-name-assertion"
                                                            onClick={
                                                                () => window.open(
                                                                    getLink(
                                                                        "develop.applications.managementApplication"
                                                                            + ".selfServicePortal"
                                                                    ),
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            My Account
                                                        </strong>
                                                    )
                                                }
                                            </Trans>
                                        ) }
                                        width={ 16 }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    {
                        !isM2MApplication && isMyAccountEnabled && !isSubOrganizationType && (
                            <Grid.Row columns={ 16 } className="discoverable-groups">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Heading as="h6">
                                        { t("applications:forms.generalDetails.fields.discoverableGroups.label") }
                                    </Heading>
                                </Grid.Column>
                                <Grid.Column
                                    mobile={ 16 }
                                    tablet={ 16 }
                                    computer={ 16 }
                                    className={ discoverableGroupOption ===
                                        DiscoverableGroupsRadioOptionType.USER_GROUPS ? "radio-section" : "" }
                                >
                                    {
                                        DISCOVERABLE_GROUPS_RADIO_OPTIONS.map((option: RadioChild) => (
                                            <Field.Radio
                                                key={ option.value }
                                                ariaLabel={ t(option.label) }
                                                label={ t(option.label) }
                                                name="discoverableGroupType"
                                                type="radio"
                                                value={ option.value }
                                                checked={ discoverableGroupOption === option.value }
                                                listen={ () => setDiscoverableGroupOption(option.value) }
                                                readOnly={ readOnly }
                                                data-componentid={ `${ componentId }-discoverable-group-radio-` +
                                                    `option-${ option.value }` }
                                                disabled={ !isDiscoverable }
                                            />
                                        ))
                                    }
                                </Grid.Column>
                                {
                                    discoverableGroupOption === DiscoverableGroupsRadioOptionType.USER_GROUPS && (
                                        <Grid.Column mobile={ 16 } tablet={ 6 } computer={ 4 } stretched>
                                            <Select
                                                value={ selectedUserStoreDomain }
                                                onChange={
                                                    (e: SelectChangeEvent<string>) =>
                                                        setSelectedUserStoreDomain(e.target.value)
                                                }
                                                data-componentid={
                                                    `${ componentId }-group-store-domain-dropdown`
                                                }
                                                disabled={ !isDiscoverable }
                                            >
                                                { isUserStoresLoading
                                                    ? <p>{ t("common:loading") }</p>
                                                    : availableUserStores?.map(
                                                        (userStore: UserStoreDropdownItem) =>
                                                            (<MenuItem
                                                                key={ userStore.key }
                                                                value={ userStore.value }
                                                            >
                                                                { userStore.text }
                                                            </MenuItem>)
                                                    )
                                                }
                                            </Select>
                                        </Grid.Column>
                                    )
                                }
                                {
                                    discoverableGroupOption === DiscoverableGroupsRadioOptionType.USER_GROUPS && (
                                        <Grid.Column mobile={ 16 } tablet={ 10 } computer={ 12 } stretched>
                                            <Autocomplete
                                                multiple
                                                style={ { padding: 0 } }
                                                disableCloseOnSelect
                                                loading={ isGroupsListLoading }
                                                options={ groupsList ?? [] }
                                                value={ selectedGroupsFromUserStore[selectedUserStoreDomain] ?? [] }
                                                data-componentid={ `${ componentId }-discoverable-group` +
                                                    "-search-text-input" }
                                                getOptionLabel={ (group: GroupMetadataInterface) => group?.name }
                                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                                    <TextField
                                                        { ...params }
                                                        placeholder= { t("applications:forms.generalDetails.fields." +
                                                            "discoverableGroups.action.assign") }
                                                    />
                                                ) }
                                                onChange={ (
                                                    _event: SyntheticEvent,
                                                    groups: GroupMetadataInterface[]
                                                ) => {
                                                    const updatedGroups: {
                                                        [ key: string ]: GroupMetadataInterface[]
                                                    } = cloneDeep(selectedGroupsFromUserStore);

                                                    updatedGroups[selectedUserStoreDomain] = groups;
                                                    setSelectedGroupsFromUserStore(updatedGroups);
                                                } }
                                                filterOptions={ (groups: GroupMetadataInterface[]) => groups }
                                                inputValue={ searchTerm }
                                                onInputChange={
                                                    (
                                                        _event: SyntheticEvent,
                                                        searchTerm: string,
                                                        reason: AutocompleteInputChangeReason
                                                    ) => {
                                                        if (reason === "input") {
                                                            setSearchTerm(searchTerm);
                                                        }
                                                    }
                                                }
                                                isOptionEqualToValue={
                                                    (option: GroupMetadataInterface, value: GroupMetadataInterface) =>
                                                        option.id === value.id
                                                }
                                                renderTags={ (
                                                    value: GroupMetadataInterface[],
                                                    getTagProps: AutocompleteRenderGetTagProps
                                                ) => value.map((option: GroupMetadataInterface, index: number) => (
                                                    <DiscoverableGroupRenderChip
                                                        { ...getTagProps({ index }) }
                                                        key={ index }
                                                        primaryText={ option.name }
                                                        userStore={ selectedUserStoreDomain }
                                                        option={ option }
                                                        activeOption={ activeOption }
                                                        setActiveOption={ setActiveOption }
                                                        variant="filled"
                                                    />
                                                )) }
                                                renderOption={ (
                                                    props: HTMLAttributes<HTMLLIElement>,
                                                    option: GroupMetadataInterface,
                                                    { selected }: { selected: boolean }
                                                ) => (
                                                    <DiscoverableGroupRenderOption
                                                        selected={ selected }
                                                        displayName={ option.name }
                                                        userStore={ selectedUserStoreDomain }
                                                        data-componentid={ `${ componentId }-discoverable-group-` +
                                                            `option-${ option.name }` }
                                                        renderOptionProps={ props }
                                                    />
                                                ) }
                                                disabled={ !isDiscoverable }
                                            />
                                        </Grid.Column>
                                    )
                                }
                            </Grid.Row>
                        )
                    }
                    {
                        !isM2MApplication && !isSubOrganizationType && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel={
                                            t("applications:forms.generalDetails.fields.accessUrl.ariaLabel")
                                        }
                                        inputType="url"
                                        name="accessUrl"
                                        label={
                                            t("applications:forms.generalDetails.fields.accessUrl.label")
                                        }
                                        required={ isDiscoverable }
                                        placeholder={
                                            t("applications:forms.generalDetails.fields.accessUrl" +
                                                ".placeholder")
                                        }
                                        value={ accessUrl }
                                        readOnly={
                                            !hasRequiredScope || (
                                                readOnly
                                                && applicationConfig.generalSettings.getFieldReadOnlyStatus(
                                                    application, "ACCESS_URL"
                                                )
                                            )
                                        }
                                        validation={ validateAccessURL }
                                        maxLength={ ApplicationManagementConstants
                                            .FORM_FIELD_CONSTRAINTS.ACCESS_URL_MAX_LENGTH }
                                        minLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS
                                            .ACCESS_URL_MIN_LENGTH }
                                        data-testid={ `${ testId }-application-access-url-input` }
                                        hint={ t("applications:forms.generalDetails.fields.accessUrl.hint") }
                                        width={ 16 }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            {
                                (!isBrandingSectionHidden &&
                                !isM2MApplication &&
                                orgType !== OrganizationType.SUBORGANIZATION) && <Divider />
                            }
                            {
                                (!isBrandingSectionHidden && !isM2MApplication) && (
                                    <>
                                        <Heading as="h4">
                                            { t("applications:forms.generalDetails.sections.branding.title") }
                                            <FeatureFlagLabel
                                                featureFlags={ brandingFeatureFlagsConfig }
                                                featureKey={
                                                    FeatureFlagConstants.FEATURE_FLAG_KEY_MAP
                                                        .APPLICATION_EDIT_BRANDING_LINK
                                                }
                                                type="chip"
                                            />
                                        </Heading>
                                        <PaletteIcon fill="#ff7300" /> &nbsp;
                                        <Link
                                            className="application-branding-link"
                                            color="primary"
                                            data-componentid={ `${testId}-application-branding-link` }
                                            onClick={ () => {
                                                history.push({
                                                    pathname: AppConstants.getPaths().get("BRANDING"),
                                                    state: appId
                                                });
                                            } }
                                        >
                                            { t("applications:forms.generalDetails.brandingLink.label") }
                                        </Link>
                                        <Hint>{ t("applications:forms.generalDetails.brandingLink.hint") }</Hint>
                                    </>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </ApplicationTabComponentsFilter>
            </Grid>
            <Field.Button
                form={ FORM_ID }
                size="small"
                buttonType="primary_btn"
                ariaLabel="Update button"
                name="update-button"
                data-testid={ `${ testId }-submit-button` }
                disabled={ isSubmitting }
                loading={ isSubmitting }
                label={ t("common:update") }
                hidden={
                    isSubOrganizationType || !hasRequiredScope || (
                        readOnly
                        && applicationConfig.generalSettings.getFieldReadOnlyStatus(
                            application, "ACCESS_URL"
                        )
                    )
                }
            />
        </Form>
    );
};
