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
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    EmphasizedSegment,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import {
    updateIdentityProviderAssignedGroups,
    useIdentityProviderAssignedGroups
} from "../../../../extensions/components/application/api";
import {
    ApplicationRoleGroupInterface,
    ApplicationRoleGroupsUpdatePayloadInterface
} from "../../../../extensions/components/application/models";
import { getIdentityProviderDetail } from "../../../identity-providers/api";
import { IdentityProviderGroupInterface, IdentityProviderInterface } from "../../../identity-providers/models";

interface GroupsListProps extends IdentifiableComponentInterface {
    authenticatorId: string;
    roleId: string;
    appId: string;
}

const GroupsList = (props: GroupsListProps): ReactElement => {
    const {
        appId,
        authenticatorId,
        roleId,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ isGroupListRequestLoading, setGroupListRequestLoading ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ initialAssignedGroups, setInitialAssignedGroups ] = useState<ApplicationRoleGroupInterface[]>([]);
    const [ groupList, setGroupsList ] = useState<string[]>([]);
    const [ tempGroupList, setTempGroupList ] = useState<string[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<string[]>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<string[]>([]);
    const [ isSelectUnassignedGroupsAllRolesChecked, setIsSelectUnassignedAllGroupsChecked ] = useState(false);

    const {
        data: originalAssignedGroups,
        mutate: mutateAssignedGroups,
        isLoading: isAssignedGroupsFetchRequestLoading,
        error: assignedGroupsFetchRequestError
    } = useIdentityProviderAssignedGroups(appId, roleId, authenticatorId);

    useEffect(() => {
        setGroupListRequestLoading(true);
        // Get authenticator groups.
        getIdentityProviderDetail(authenticatorId)
            .then((response: IdentityProviderInterface) => {
                const groupNameList: string[] = [];

                response.groups.map((group: IdentityProviderGroupInterface) => {
                    groupNameList.push(group.name);
                });

                setGroupsList(groupNameList);
                setInitialGroupList(groupNameList);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    handleAlerts({
                        description: t("authenticationProvider:" +
                            "notifications.getIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:" +
                            "notifications.getIDP.error.message")
                    });

                    return;
                }

                handleAlerts({
                    description: t("authenticationProvider:" +
                        "notifications.getIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:" +
                        "notifications.getIDP.genericError.message")
                });
            }).finally(() => {
                setGroupListRequestLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(isGroupListRequestLoading || isAssignedGroupsFetchRequestLoading);
    }, [ isGroupListRequestLoading, isAssignedGroupsFetchRequestLoading ]);

    useEffect(() => {
        if (originalAssignedGroups instanceof IdentityAppsApiException
                || assignedGroupsFetchRequestError) {
            handleAlerts({
                description: t("extensions:console.applicationRoles.authenticatorGroups.groupsList.notifications" +
                    ".fetchAssignedGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.applicationRoles.authenticatorGroups.groupsList.notifications" +
                    ".fetchAssignedGroups.genericError.message")
            });

            return;
        }

        if (!originalAssignedGroups) {
            return;
        }

        if (originalAssignedGroups?.groups?.length > 0) {
            setInitialAssignedGroups(originalAssignedGroups.groups);
            setCheckedUnassignedListItems(originalAssignedGroups?.groups.map(
                (group:ApplicationRoleGroupInterface) => group.name));
            setTempGroupList(originalAssignedGroups?.groups.map(
                (group:ApplicationRoleGroupInterface) => group.name));
        }
    }, [ originalAssignedGroups ]);

    useEffect(() => {
        setCheckedUnassignedListItems(tempGroupList);
    }, [ tempGroupList ]);

    /**
     * The following method handles the onChange event of the
     * search field. It matches the string pattern of the user
     * input value with the elements of the user list.
     *
     * @param e - Click event.
     * @param value - Input value of the field
     */
    const handleUnselectedListSearch = (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
        let isMatch: boolean = false;
        const filteredGroupList: any[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            initialGroupList && initialGroupList.map((group: string) => {
                isMatch = re.test(group);
                if (isMatch) {
                    filteredGroupList.push(group);
                    handleGroupListChange(filteredGroupList);
                }
            });
        } else {
            handleGroupListChange(initialGroupList);
        }
    };

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        if (!isSelectUnassignedGroupsAllRolesChecked) {
            setCheckedUnassignedListItems(groupList);
            handleAddedGroupListChange(groupList);
        } else {
            setCheckedUnassignedListItems([]);
        }
        setIsSelectUnassignedAllGroupsChecked(!isSelectUnassignedGroupsAllRolesChecked);
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group: string) => {
        const checkedGroups: string[] = [ ...checkedUnassignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
        } else {
            checkedGroups.push(group);
        }
        handleAddedGroupListChange(checkedGroups);
        setIsSelectUnassignedAllGroupsChecked(groupList?.length === checkedGroups.length);
    };

    const handleGroupListChange = (groupList: string[]) => {
        setGroupsList(groupList);
    };

    const handleAddedGroupListChange = (newGroupList: string[]) => {
        setTempGroupList(newGroupList);
    };

    /**
     * Dispatches the alert object to the redux store.
     *
     * @param alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const assignAuthenticatorGroupsToRole = () => {
        setIsSubmitting(true);
        const addedGroups: ApplicationRoleGroupInterface[] =
            tempGroupList?.filter((groupName: string) =>
                !initialAssignedGroups?.find((group: ApplicationRoleGroupInterface) => group?.name === groupName))
                .map((groupName: string) => {
                    return {
                        name: groupName
                    };
                });

        const removedGroups: ApplicationRoleGroupInterface[] =
            initialAssignedGroups?.filter((group: ApplicationRoleGroupInterface) =>
                !tempGroupList.includes(group?.name));

        const data: ApplicationRoleGroupsUpdatePayloadInterface = {
            added_groups: addedGroups,
            removed_groups: removedGroups
        };

        updateIdentityProviderAssignedGroups(
            appId,
            roleId,
            authenticatorId,
            data
        ).then(() => {
            handleAlerts({
                description: t("extensions:console.applicationRoles.authenticatorGroups.groupsList.notifications" +
                    ".updateAssignedGroups.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("extensions:console.applicationRoles.authenticatorGroups.groupsList.notifications" +
                    ".updateAssignedGroups.success.message")
            });
            mutateAssignedGroups();
        }).catch(() => {
            handleAlerts({
                description: t("extensions:console.applicationRoles.authenticatorGroups.groupsList.notifications" +
                    ".updateAssignedGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.applicationRoles.authenticatorGroups.groupsList.notifications" +
                    ".updateAssignedGroups.genericError.message")
            });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        !isLoading
            ? (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 10 }>
                            <TransferComponent
                                selectionComponent
                                searchPlaceholder={ t("console:manage.features.transferList.searchPlaceholder",
                                    { type: "Groups" }) }
                                handleUnelectedListSearch={ handleUnselectedListSearch }
                                data-componentid="application-role-assign-group-modal"
                                isLoading={ isLoading }
                                bordered={ false }
                                basic={ true }
                            >
                                <TransferList
                                    isListEmpty={ !(groupList?.length > 0) }
                                    listType="unselected"
                                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                                    isHeaderCheckboxChecked={ isSelectUnassignedGroupsAllRolesChecked }
                                    emptyPlaceholderContent={ t("console:manage.features.transferList.list." +
                                        "emptyPlaceholders.users.roles.unselected", { type: "groups" }) }
                                    data-testid="user-mgt-add-user-wizard-modal-unselected-groups-select-all-checkbox"
                                    emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                        + "emptyPlaceholders.default") }
                                >
                                    {
                                        groupList?.map((group: string, index: number)=> {
                                            return (
                                                <TransferListItem
                                                    style={ { height: "100%" } }
                                                    handleItemChange={ () =>
                                                        handleUnassignedItemCheckboxChange(group) }
                                                    key={ index }
                                                    listItem={ group }
                                                    listItemId={ group }
                                                    listItemIndex={ index }
                                                    isItemChecked={ checkedUnassignedListItems.includes(group) }
                                                    showSecondaryActions={ false }
                                                    data-componentid="application-role-assign-group-modal-unselected"
                                                />
                                            );
                                        })
                                    }
                                </TransferList>
                            </TransferComponent>
                        </Grid.Column>
                    </Grid.Row>
                    {
                        groupList?.length > 0 && (
                            <PrimaryButton
                                className="ml-6 mb-5"
                                size="small"
                                floated="left"
                                onClick={ () => assignAuthenticatorGroupsToRole() }
                                data-componentId={ `${ componentId }-assign-button` }
                                loading={ isSubmitting || isLoading }
                                disabled={ isSubmitting || isLoading }
                            >
                                { t("extensions:console.applicationRoles.authenticatorGroups.groupsList.assignGroups") }
                            </PrimaryButton>
                        )
                    }
                </Grid>
            )
            : (
                <EmphasizedSegment padded="very">
                    <ContentLoader />
                </EmphasizedSegment>
            )
    );
};

export default GroupsList;
