/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { getRolesList } from "@wso2is/core/api";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import {
    DocumentationLink,
    Heading,
    Hint,
    TransferComponent,
    TransferList,
    TransferListItem,
    useDocumentation
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import debounce from "lodash-es/debounce";
import kebabCase from "lodash-es/kebabCase";
import React, { FormEvent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Header } from "semantic-ui-react";
import { SharedUserStoreUtils, UIConstants, UserBasicInterface, getUsersList } from "../../../../../features/core";
import { EventPublisher } from "../../../../../features/core/utils";
import { SCIMConfigs } from "../../../../configs/scim";
import { AdminAccountTypes, CONSUMER_USERSTORE, UserAccountTypes } from "../../constants";
import { InternalAdminFormDataInterface, UserInviteInterface } from "../../models";
import { UserManagementUtils } from "../../utils";

/**
 * Proptypes for the add admin user basic component.
 */
interface AddAdminUserBasicProps extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    administratorType: string;
}

/**
 * Add admin user basic component.
 *
 * @return {ReactElement}
 */
export const AddAdminUserBasic: React.FunctionComponent<AddAdminUserBasicProps> = (
    props: AddAdminUserBasicProps): ReactElement => {

    const {
        administratorType,
        triggerSubmit,
        onSubmit,
        [ "data-componentid"]: componentId
    } = props;

    const [ userRoleOptions, setUserRoleList ] = useState([]);
    const [ rolesList, setRolesList] = useState<RolesInterface[]>([]);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ initialUserList, setInitialUserList ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ isUserListRequestLoading, setUserListRequestLoading ] = useState<boolean>(true);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset ] = useState<number>(0);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    // Username input validation error messages.
    const USERNAME_REGEX_VIOLATION_ERROR_MESSAGE: string = t("console:manage.features.users.guestUsers.fields." +
        "username.validations.regExViolation");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
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

        const roleOptions = [];
        let roleOption =
            {
                key: null,
                text: "",
                value: ""
            };

        if (userRoleOptions.length === 0) {
            setUserListRequestLoading(true);
            getRolesList(null)
                .then((response) => {
                    setRolesList(response.data.Resources);
                    response.data.Resources.map((role: RolesInterface, index) => {
                        if (role.displayName !== "system" &&
                            role.displayName !== "everyone" &&
                            role.displayName !== "selfsignup" &&
                            (role.displayName?.split("/")?.length < 2 &&
                            role.displayName?.split("/")[0] !== "Application")
                        ) {
                            roleOption = {
                                key: index,
                                text: role.displayName,
                                value: role.displayName
                            };
                            roleOptions.push(roleOption);
                        }
                    });
                    setUserRoleList(roleOptions);
                })
                .finally(() => {
                    setUserListRequestLoading(false);
                });
        }
        setUserRoleList(roleOptions);
    }, []);

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());

            if (searchQuery === undefined || searchQuery === "") {
                getUserList(listItemLimit, listOffset, null, attributes, CONSUMER_USERSTORE);
            } else  {
                getUserList(listItemLimit, listOffset, searchQuery, attributes, CONSUMER_USERSTORE);
            }
        }
    }, [ listOffset, listItemLimit, searchQuery ]);

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[ Symbol.iterator ]();

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
            .then((response) => {                
                // Exclude JIT users and internal admin users.
                const responseUsers = response?.Resources?.filter(
                    (user) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId && !isAdminUser(user));

                if (responseUsers) {
                    responseUsers.sort((userObject, comparedUserObject) =>
                        userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                    );
                    
                    setUsersList(responseUsers);
                    setInitialUserList(responseUsers);
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
        return user.roles.some((role) => role.display === UserAccountTypes.ADMINISTRATOR);
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
     * @param {FormEvent<HTMLInputElement>}
     * @param string - query
     */
    const handleSearchFieldChange = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        if (query === "") {
            setSearchQuery("");
        } else {
            const processedQuery = "emails co " + query;

            setSearchQuery(processedQuery);
        }
    }, 1000), []);

    const handleAssignedItemCheckboxChange = (user) => {
        const checkedUsers = [ ...checkedAssignedListItems ];

        if (checkedUsers.some((item) => item.id === user.id)) {
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
        const selectedRoles: RolesInterface[] = rolesList?.filter((role) => role.displayName == roleName);
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
            onSubmit={ () => processInternalAdminFormData(UserAccountTypes.ADMINISTRATOR) }
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
                    emptyPlaceholderContent={ "We couldn't find any results for search. "+
                        "Please try a different search term." }
                    data-componentid={ `${ componentId }-unselected-transfer-list` }
                    emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                        + "emptyPlaceholders.default") }
                >
                    {
                        usersList?.map((user: UserBasicInterface, index: number) => {

                            const header: string = UserManagementUtils.resolveUserListHeader(user);
                            const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);

                            return (
                                <TransferListItem
                                    handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                    key={ index }
                                    listItem={ {
                                        listItemElement: resolveListItemElement(header),
                                        listItemValue: header
                                    } }
                                    listItemId={ user.id }
                                    listItemIndex={ index }
                                    isItemChecked={ checkedAssignedListItems.some((item) =>
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
            onSubmit={ (values) => {
                onSubmit(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <Field
                            data-componentid={ `${ componentId }-external-form-email-input` }
                            label={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.email.label"
                            ) }
                            name="email"
                            placeholder={ t(
                                "console:manage.features.user.forms.addUserForm.inputs." +
                                "email.placeholder"
                            ) }
                            required={ true }
                            requiredErrorMessage={ t(
                                "console:manage.features.user.forms.addUserForm.inputs.email.validations.empty"
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
                                "console:manage.features.user.forms.addUserForm.inputs.domain.validations.empty"
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
