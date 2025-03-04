/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { getUsersList } from "@wso2is/admin.core.v1/api/users";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { SystemRoleType } from "@wso2is/admin.users.v1/components/guests/models/invite";
import { AdminAccountTypes } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { UserInviteInterface, UserListInterface } from "@wso2is/admin.users.v1/models/user";
import { UserManagementUtils } from "@wso2is/admin.users.v1/utils";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { AutocompleteFieldAdapter } from "@wso2is/form/src";
import { Validation } from "@wso2is/forms";
import {
    ContentLoader,
    DocumentationLink,
    Heading,
    Hint,
    TransferComponent,
    TransferList,
    TransferListItem,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, {
    FormEvent,
    ForwardRefExoticComponent,
    ForwardedRef,
    MutableRefObject,
    ReactElement,
    RefAttributes,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, DropdownProps, Grid, Header } from "semantic-ui-react";
import { InternalAdminFormDataInterface } from "../../models/invite";
import { isAdminUser, isCollaboratorUser } from "../../utils/administrators";

/**
 * Proptypes for the add admin user basic component.
 */
interface AddAdminUserBasicProps extends IdentifiableComponentInterface {
    onSubmit: (values: any) => void;
    administratorType: string;
    setFinishButtonDisabled: (values: boolean) => void;
    /**
     * Roles list for console application.
     */
    consoleRolesList: RolesInterface[];
    /**
     * Whether the console roles list is loading.
     */
    isConsoleRolesListLoading: boolean;
}

/**
 * Add admin user basic form component ref interface.
 */
export interface AddAdminUserBasicFormRef {
    /**
     * Trigger the form submit.
     */
    triggerSubmit: () => void;
}

/**
 * Add admin user basic component.
 *
 * @returns add admin modal component.
 */
export const AddAdminUserBasic: ForwardRefExoticComponent<RefAttributes<AddAdminUserBasicFormRef> &
AddAdminUserBasicProps> = forwardRef((
    {
        administratorType,
        onSubmit,
        setFinishButtonDisabled,
        consoleRolesList,
        isConsoleRolesListLoading,
        [ "data-componentid"]: componentId = "add-admin-user-basic"
    }: AddAdminUserBasicProps,
    ref: ForwardedRef<AddAdminUserBasicFormRef>
): ReactElement => {

    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset ] = useState<number>(0);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const triggerFormSubmit: MutableRefObject<() => void> = useRef<(() => void) | null>(null);

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.consoleSettings);
    const isInvitedAdminInConsoleSettingsEnabled: boolean = !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
        "consoleSettings.invitedExternalAdmins"
    );

    // Username input validation error messages.
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("users:guestUsers.fields." +
        "username.validations.regExViolation");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Constructs user role options from the console roles list.
     */
    const userRoleOptions: DropdownProps[] = useMemo(() => {
        return consoleRolesList
            ?.filter((role: RolesInterface) => {
                if (Object.values(SystemRoleType).includes(role.displayName as SystemRoleType)) {
                    return false;
                }

                const roleNameParts: string[] = role.displayName?.split("/") || [];

                if (roleNameParts.length < 2 && roleNameParts[0] === "Application") {
                    return false;
                }

                if (!isInvitedAdminInConsoleSettingsEnabled && !role.meta?.systemRole) {
                    return false;
                }

                return true;
            })
            ?.map((role: RolesInterface, index: number) => ({
                key: role?.id ?? index,
                label: role?.displayName,
                value: role?.displayName
            }));
    }, [ consoleRolesList ]);

    // Expose triggerFormSubmit to the parent via the ref.
    useImperativeHandle(
        ref,
        () => ({
            triggerSubmit: () => {
                if (triggerFormSubmit.current) {
                    triggerFormSubmit.current();
                }
            }
        }),
        []
    );

    useEffect(() => {
        // Fetch users to select as internal admins.
        if (administratorType === AdminAccountTypes.INTERNAL) {
            setUserListMetaContent(new Map<string, string>([
                [ "name", "name" ],
                [ "emails", "emails" ],
                [ "roles", "roles" ],
                [ "userName", "userName" ],
                [ "id", "" ],
                [ "profileUrl", "profileUrl" ],
                [ "meta.lastModified", "meta.lastModified" ],
                [ "meta.created", "" ]
            ]));
        }
    }, [ ]);

    useEffect(() => {
        if (userListMetaContent) {
            const attributes: string = generateAttributesString(userListMetaContent.values());

            if (isEmpty(searchQuery)) {
                setUsersList([]);

                return;
            }

            getUserList(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT, listOffset, searchQuery, attributes, null);
        }
    }, [ listOffset, searchQuery ]);

    useEffect(() => {
        if (administratorType === AdminAccountTypes.INTERNAL) {
            setFinishButtonDisabled(isEmpty(checkedAssignedListItems));
        }
    }, [ checkedAssignedListItems ]);

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @returns attribute string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray: string[] = [];
        const iterator1: IterableIterator<string> = attributeMap[ Symbol.iterator ]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    const getUserList = (limit: number, offset: number, filter: string, attribute: string, userStore: string) => {

        setUserListRequestLoading(true);

        getUsersList(limit, offset, filter, attribute, userStore)
            .then((response: UserListInterface) => {
                // Exclude JIT users, internal admin users and collaborators.
                const responseUsers: UserBasicInterface[] = response?.Resources?.filter(
                    (user: UserBasicInterface) =>
                        !user[ SCIMConfigs.scim.systemSchema ]?.userSourceId &&
                    !isAdminUser(user) &&
                    !isCollaboratorUser(user));

                if (responseUsers) {
                    responseUsers.sort((userObject: UserBasicInterface, comparedUserObject: UserBasicInterface) =>
                        userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                    );

                    setUsersList(responseUsers);
                } else {
                    setUsersList([]);
                }
            })
            .finally(() => {
                setUserListRequestLoading(false);
            });
    };

    const getFormValues = (values: {email: string, roles: DropdownProps[]}): void => {
        eventPublisher.publish("manage-users-collaborator-role", {
            type: kebabCase(values.roles.toString())
        });

        const inviteUser: UserInviteInterface = {
            email: values.email.toString(),
            roles: values.roles.map((role: DropdownProps) => role.value as string)
        };

        onSubmit(inviteUser);
    };

    /**
     * This is a debounced function to handle the user search by email address.
     * Debounced to limit getUsers() api call.
     * @param FormEvent - form event
     * @param string - query
     */
    const handleSearchFieldChange: DebouncedFunc<(e: FormEvent<HTMLInputElement>, query: string) => void>
    = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        if (query === "") {
            setSearchQuery("");
        } else {
            const processedQuery: string = "emails co " + query;

            setSearchQuery(processedQuery);
        }
    }, 1000), []);

    const handleAssignedItemCheckboxChange = (user: UserBasicInterface) => {
        const checkedUsers: UserBasicInterface[] = [ ...checkedAssignedListItems ];

        if (checkedUsers.some((item: UserBasicInterface) => item.id === user.id)) {
            checkedUsers.splice(checkedUsers.indexOf(user), 1);
            setCheckedAssignedListItems(checkedUsers);
        } else {
            checkedUsers.push(user);
            setCheckedAssignedListItems(checkedUsers);
        }
    };

    const resolveListItemElement = (listItemValue: string) => {

        return (
            <>
                { listItemValue }
            </>
        );
    };

    const processInternalAdminFormData = (roleName: string): void => {
        const selectedRoles: RolesInterface[] = consoleRolesList?.filter(
            (role: RolesInterface) => role.displayName == roleName);
        const processedFormData: InternalAdminFormDataInterface = {
            checkedUsers: checkedAssignedListItems,
            selectedRoles: selectedRoles
        };

        onSubmit(processedFormData);
    };

    /**
     * The modal to add new user internally.
     */
    const inviteInternalUserForm = () => (
        <>
            <Heading as="h5" className="mt-3">
                { t("extensions:manage.users.wizard.addAdmin.internal.selectUser") }
            </Heading>
            <Hint>{ t("extensions:manage.users.wizard.addAdmin.internal.hint") }</Hint>
            <FinalForm
                data-componentid={ `${componentId}-external-form` }
                onSubmit={ () => processInternalAdminFormData(administratorConfig.adminRoleName) }
                render={ ({ handleSubmit }: FormRenderProps) => {
                    triggerFormSubmit.current = handleSubmit;

                    return (<form id="inviteInternalUserForm" onSubmit={ handleSubmit }>
                        <TransferComponent
                            compact
                            basic
                            bordered
                            className="one-column-selection"
                            selectionComponent
                            searchPlaceholder={
                                t("extensions:manage.users.wizard.addAdmin.internal.searchPlaceholder")
                            }
                            isLoading={ isUserListRequestLoading }
                            iconPosition="left"
                            handleUnelectedListSearch={
                                (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                                    handleSearchFieldChange(e, value);
                                }
                            }
                            data-componentid={ `${componentId}-transfer-component` }
                        >
                            <TransferList
                                selectionComponent
                                isListEmpty={ !isUserListRequestLoading && usersList?.length < 1 }
                                isLoading={ isUserListRequestLoading }
                                listType="unselected"
                                emptyPlaceholderContent={
                                    isEmpty(searchQuery)
                                        ? t("extensions:manage.users.wizard.addAdmin.internal." +
                                            "emptySearchQueryPlaceholder")
                                        : t(
                                            "extensions:manage.users.wizard.addAdmin.internal." +
                                            "emptySearchResultsPlaceholder"
                                        )
                                }
                                data-componentid={ `${componentId}-unselected-transfer-list` }
                                emptyPlaceholderDefaultContent={ t("transferList:list." + "emptyPlaceholders.default") }
                            >
                                { usersList?.map((user: UserBasicInterface, index: number) => {
                                    const header: string = getUserNameWithoutDomain(user?.userName);
                                    const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);

                                    return (
                                        <TransferListItem
                                            handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                            key={ index }
                                            listItem={ {
                                                listItemElement: resolveListItemElement(header),
                                                listItemValue: subHeader
                                            } }
                                            listItemId={ user.id }
                                            listItemIndex={ index }
                                            isItemChecked={ checkedAssignedListItems.some(
                                                (item: UserBasicInterface) => item.id === user.id
                                            ) }
                                            showSecondaryActions={ false }
                                            showListSubItem={ true }
                                            listSubItem={
                                                header !== subHeader && (
                                                    <Header as="h6">
                                                        <Header.Content>
                                                            <Header.Subheader
                                                                data-componentid={ `${componentId}-item-sub-heading` }
                                                            >
                                                                { subHeader }
                                                            </Header.Subheader>
                                                        </Header.Content>
                                                    </Header>
                                                )
                                            }
                                            data-componentid={ `${componentId}-unselected-transfer-list-item-${index}` }
                                        />
                                    );
                                }) }
                            </TransferList>
                        </TransferComponent>
                    </form>);

                }
                }
            ></FinalForm>
        </>
    );

    /**
     * The modal to add new user externally.
     */
    const inviteExternalUserForm = () => (
        <>

            {
                (isConsoleRolesListLoading ||
                !userRoleOptions ||
                userRoleOptions?.length <= 0
                ) ?
                    <ContentLoader/>     :
                    (<FinalForm
                        data-componentid={ `${ componentId }-external-form` }
                        onSubmit={ (values: {email: string, roles: DropdownProps[]}) => {
                            onSubmit(getFormValues(values));
                        } }
                        render={ ({ handleSubmit }: FormRenderProps) => {
                            triggerFormSubmit.current = handleSubmit;

                            return (
                                <form id="inviteExternalUserForm" onSubmit={ handleSubmit }>
                                    <Grid>
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                <FinalFormField
                                                    data-componentid={ `${ componentId }-external-form-email-input` }
                                                    label={ t(
                                                        "user:forms.addUserForm.inputs.email.label"
                                                    ) }
                                                    name="email"
                                                    placeholder={ t(
                                                        "user:forms.addUserForm.inputs.email.placeholder"
                                                    ) }
                                                    required={ true }
                                                    requiredErrorMessage={ t(
                                                        "user:forms.addUserForm.inputs.email.validations.empty"
                                                    ) }
                                                    validation={ (value: string, validation: Validation) => {
                                                        // Check whether username is a valid email.
                                                        // check username validity against userstore regex
                                                        if (
                                                            value &&
                                                            (
                                                                !FormValidation.email(value) ||
                                                                !SharedUserStoreUtils.validateInputAgainstRegEx(
                                                                    value, window["AppUtils"]
                                                                        .getConfig().extensions.
                                                                        collaboratorUsernameRegex
                                                                )
                                                            )
                                                        ) {
                                                            validation.isValid = false;
                                                            validation.errorMessages.push(
                                                                USERNAME_REGEX_VIOLATION_ERROR_MESSAGE
                                                            );
                                                        }
                                                    } }
                                                    type="email"
                                                    component={ TextFieldAdapter }
                                                    tabIndex={ 5 }
                                                    maxLength={ 50 }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                                <FinalFormField
                                                    data-componentid={ `${ componentId }-external-form-role-dropdown` }
                                                    label={ "Roles" }
                                                    name="roles"
                                                    options={ userRoleOptions }
                                                    requiredErrorMessage={ t(
                                                        "user:forms.addUserForm.inputs.domain.validations.empty"
                                                    ) }
                                                    placeholder="Select roles"
                                                    component={ AutocompleteFieldAdapter }
                                                    required={ true }
                                                    value={ userRoleOptions[0]?.value }
                                                    tabIndex={ 1 }
                                                    multipleValues
                                                />
                                                <Hint>
                                                    { "Select a role to assign to the user." +
                                    " The access level of the user is determined by the role." }
                                                    <DocumentationLink
                                                        link={ getLink("manage.users.newCollaboratorUser.learnMore") }
                                                    >
                                                        { t("common:learnMore") }
                                                    </DocumentationLink>
                                                </Hint>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Divider hidden/>
                                    </Grid>
                                </form>

                            );
                        } }
                    />)
            }


        </>

    );

    return (
        administratorType === AdminAccountTypes.INTERNAL
            ? inviteInternalUserForm()
            : inviteExternalUserForm()
    );
});
