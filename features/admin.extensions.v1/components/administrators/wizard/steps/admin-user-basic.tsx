/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
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
import { AxiosResponse } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, { FormEvent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, DropdownProps, Grid, Header } from "semantic-ui-react";
import { useApplicationList } from "../../../../../admin.applications.v1/api/application";
import { ApplicationManagementConstants } from "../../../../../admin.applications.v1/constants";
import useAuthorization from "../../../../../admin.authorization.v1/hooks/use-authorization";
import {
    SharedUserStoreUtils,
    UIConstants,
    UserBasicInterface,
    UserRoleInterface,
    getUsersList
} from "../../../../../admin.core.v1";
import { EventPublisher } from "../../../../../admin.core.v1/utils";
import { getRolesList } from "../../../../../admin.roles.v2/api";
import { UserInviteInterface, UserListInterface } from "../../../../../admin.users.v1/models/user";
import { UserManagementUtils } from "../../../../../admin.users.v1/utils";
import { administratorConfig } from "../../../../configs/administrator";
import { SCIMConfigs } from "../../../../configs/scim";
import { AdminAccountTypes } from "../../constants";
import { InternalAdminFormDataInterface } from "../../models";

/**
 * Proptypes for the add admin user basic component.
 */
interface AddAdminUserBasicProps extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    administratorType: string;
    setFinishButtonDisabled: (values: boolean) => void;
}

/**
 * Add admin user basic component.
 *
 * @returns add admin modal component.
 */
export const AddAdminUserBasic: React.FunctionComponent<AddAdminUserBasicProps> = (
    props: AddAdminUserBasicProps): ReactElement => {

    const {
        administratorType,
        triggerSubmit,
        onSubmit,
        setFinishButtonDisabled,
        [ "data-componentid"]: componentId
    } = props;

    const { legacyAuthzRuntime } = useAuthorization();

    const [ userRoleOptions, setUserRoleList ] = useState([]);
    const [ rolesList, setRolesList ] = useState<RolesInterface[]>([]);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(false);
    const [ isUserRoleOptionsRequestLoading, setUserRoleOptionsRequestLoading ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset ] = useState<number>(0);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    /**
     * Retrieve the application data for the console application, filtering by name.
     */
    const { data: applicationListData } = useApplicationList(
        null,
        null,
        null,
        `name eq ${ApplicationManagementConstants.CONSOLE_APP_NAME}`,
        !legacyAuthzRuntime
    );

    /**
     * Build the roles filter to search for roles specific to the console application.
     */
    const roleSearchFilter: string = useMemo(() => {
        if (legacyAuthzRuntime) {
            return null;
        }

        if (applicationListData?.applications && applicationListData?.applications?.length > 0) {
            return `audience.value eq ${applicationListData?.applications[0]?.id}`;
        }

        return null;
    }, [ applicationListData ]);

    // Username input validation error messages.
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("users:guestUsers.fields." +
        "username.validations.regExViolation");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        if (!legacyAuthzRuntime && !roleSearchFilter) {
            return;
        }

        // Fetch users to select as internal admins.
        if (administratorType === AdminAccountTypes.INTERNAL) {
            setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
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

        const roleOptions: DropdownProps[] = [];

        if (userRoleOptions.length === 0) {
            setUserRoleOptionsRequestLoading(true);
            getRolesList(null, roleSearchFilter)
                .then((response: AxiosResponse) => {
                    setRolesList(response.data.Resources);
                    response.data.Resources.map((role: RolesInterface, index: number) => {
                        if (role.displayName !== "system" &&
                            role.displayName !== "everyone" &&
                            role.displayName !== "selfsignup" &&
                            (role.displayName?.split("/")?.length < 2 &&
                            role.displayName?.split("/")[0] !== "Application")
                        ) {
                            roleOptions?.push({
                                key: index,
                                text: role?.displayName,
                                value: role?.displayName
                            });
                        }
                    });
                    setUserRoleList(roleOptions);
                }).finally(() => {
                    setUserRoleOptionsRequestLoading(false);
                });
        }
    }, [ roleSearchFilter ]);

    useEffect(() => {
        if (userListMetaContent) {
            const attributes: string = generateAttributesString(userListMetaContent.values());

            if (isEmpty(searchQuery)) {
                setUsersList([]);

                return;
            }

            getUserList(listItemLimit, listOffset, searchQuery, attributes, null);
        }
    }, [ listOffset, listItemLimit, searchQuery ]);

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
                // Exclude JIT users and internal admin users.
                const responseUsers: UserBasicInterface[] = response?.Resources?.filter(
                    (user: UserBasicInterface) =>
                        !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId && !isAdminUser(user));

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

    // Checks whether administrator role is present in the user.
    const isAdminUser = (user: UserBasicInterface): boolean => {
        return user.roles.some((role: UserRoleInterface) => role.display === administratorConfig.adminRoleName);
    };

    const getFormValues = (values: Map<string, FormValue>): void => {
        eventPublisher.publish("manage-users-collaborator-role", {
            type: kebabCase(values.get("role").toString())
        });

        const inviteUser: UserInviteInterface = {
            email: values.get("email").toString(),
            roles: [ values.get("role").toString() ]
        };

        if (triggerSubmit) {
            onSubmit(inviteUser);
        }
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
        const selectedRoles: RolesInterface[] = rolesList?.filter(
            (role: RolesInterface) => role.displayName == roleName);
        const processedFormData: InternalAdminFormDataInterface = {
            checkedUsers: checkedAssignedListItems,
            selectedRoles: selectedRoles
        };

        if (triggerSubmit) {
            onSubmit(processedFormData);
        }
    };

    /**
     * The modal to add new user internally.
     */
    const inviteInternalUserForm = () => (
        <Forms
            data-componentid={ `${ componentId }-external-form` }
            onSubmit={ () => processInternalAdminFormData(administratorConfig.adminRoleName) }
            submitState={ triggerSubmit }
        >
            <Heading as="h5" className="mt-3">
                { t("extensions:manage.users.wizard.addAdmin.internal.selectUser") }
            </Heading>
            <Hint>
                { t("extensions:manage.users.wizard.addAdmin.internal.hint") }
            </Hint>
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
                handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>,
                    { value }: { value: string; }) => {
                    handleSearchFieldChange(e, value);
                } }
                data-componentid={ `${ componentId }-transfer-component` }
            >
                <TransferList
                    selectionComponent
                    isListEmpty={ !isUserListRequestLoading && usersList?.length < 1 }
                    isLoading={ isUserListRequestLoading }
                    listType="unselected"
                    emptyPlaceholderContent={ isEmpty(searchQuery)
                        ? t("extensions:manage.users.wizard.addAdmin.internal.emptySearchQueryPlaceholder")
                        : t("extensions:manage.users.wizard.addAdmin.internal.emptySearchResultsPlaceholder")
                    }
                    data-componentid={ `${ componentId }-unselected-transfer-list` }
                    emptyPlaceholderDefaultContent={ t("transferList:list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        usersList?.map((user: UserBasicInterface, index: number) => {

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
                                    isItemChecked={ checkedAssignedListItems.some((item: UserBasicInterface) =>
                                        item.id === user.id) }
                                    showSecondaryActions={ false }
                                    showListSubItem={ true }
                                    listSubItem={ header !== subHeader && (
                                        <Header as="h6">
                                            <Header.Content>
                                                <Header.Subheader
                                                    data-componentid={ `${ componentId }-item-sub-heading` }
                                                >
                                                    { subHeader }
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    ) }
                                    data-componentid={ `${ componentId }-unselected-transfer-list-item-${ index }` }
                                />
                            );
                        } )
                    }
                </TransferList>
            </TransferComponent>
        </Forms>
    );

    /**
     * The modal to add new user externally.
     */
    const inviteExternalUserForm = () => (
        <Forms
            data-componentid={ `${ componentId }-external-form` }
            onSubmit={ (values: Map<string, FormValue>) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            {
                isUserRoleOptionsRequestLoading ? (
                    <ContentLoader/>
                ) : (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                <Field
                                    data-componentid={ `${ componentId }-external-form-email-input` }
                                    label={ t(
                                        "user:forms.addUserForm.inputs.email.label"
                                    ) }
                                    name="email"
                                    placeholder={ t(
                                        "user:forms.addUserForm.inputs." +
                                        "email.placeholder"
                                    ) }
                                    required={ true }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm.inputs.email.validations.empty"
                                    ) }
                                    validation={ (value: string, validation: Validation) => {
                                        // Check whether username is a valid email.
                                        // check username validity against userstore regex
                                        if (value && (!FormValidation.email(value) || !SharedUserStoreUtils
                                            .validateInputAgainstRegEx(value, window["AppUtils"].getConfig().extensions
                                                .collaboratorUsernameRegex))) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(USERNAME_REGEX_VIOLATION_ERROR_MESSAGE);
                                        }
                                    } }
                                    type="email"
                                    tabIndex={ 5 }
                                    maxLength={ 50 }
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                <Field
                                    data-componentid={ `${ componentId }-external-form-role-dropdown` }
                                    type="dropdown"
                                    label={ "Role" }
                                    name="role"
                                    children={ userRoleOptions }
                                    requiredErrorMessage={ t(
                                        "user:forms.addUserForm.inputs.domain.validations.empty"
                                    ) }
                                    required={ true }
                                    value={ userRoleOptions[0]?.value }
                                    tabIndex={ 1 }
                                />
                                <Hint>
                                    { "Select a role to assign to the user." +
                                        " The access level of the user is determined by the role." }
                                    <DocumentationLink
                                        link={ getLink("manage.users.newCollaboratorUser.learnMore") }
                                    >
                                        { t("extensions:common.learnMore") }
                                    </DocumentationLink>
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Divider hidden/>
                    </Grid>
                )
            }
        </Forms>
    );

    return (
        administratorType === AdminAccountTypes.INTERNAL
            ? inviteInternalUserForm()
            : inviteExternalUserForm()
    );
};

/**
 * Default props for the component.
 */
AddAdminUserBasic.defaultProps = {
    "data-componentid": "add-admin-user-basic"
};
