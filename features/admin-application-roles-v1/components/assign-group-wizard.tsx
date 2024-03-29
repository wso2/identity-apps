/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal } from "semantic-ui-react";
import {
    ApplicationRoleGroupInterface,
    ApplicationRoleGroupsAPIResponseInterface
} from "../../admin-extensions-v1/components/application/models";
import { getGroupList } from "../../admin-groups-v1/api";

/**
 * Interface which captures create group props.
 */
interface AssignGroupProps extends IdentifiableComponentInterface {
    closeWizard: () => void;
    handleGroupAdd: (groups: ApplicationRoleGroupInterface[]) => void;
    existingGroupsList: ApplicationRoleGroupsAPIResponseInterface;
    isSubmitting: boolean;
}

/**
 * Component to handle addition of a new group to the system.
 *
 */
const AssignGroupWizard = (props: AssignGroupProps): ReactElement => {
    const {
        closeWizard,
        handleGroupAdd,
        existingGroupsList,
        isSubmitting,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ isLoading, setLoading ] = useState<boolean>(true);
    const [ groupList, setGroupsList ] = useState<RolesInterface[]>([]);
    const [ tempGroupList, setTempGroupList ] = useState<RolesInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<RolesInterface[]>([]);
    const [ , setInitialTempGroupList ] = useState<RolesInterface[]>([]);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesInterface[]>([]);
    const [ isSelectUnassignedGroupsAllRolesChecked, setIsSelectUnassignedAllGroupsChecked ] = useState(false);

    useEffect(() => {
        getGroupListForDomain();
    }, []);

    useEffect(() => {
        setCheckedUnassignedListItems(tempGroupList);
    }, [ tempGroupList ]);

    const getGroupListForDomain = () => {
        setLoading(true);

        getGroupList(null)
            .then((response: AxiosResponse) => {
                filterOutExistingGroupsFromAllGroups(
                    response?.data?.Resources,
                    existingGroupsList?.groups
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const filterOutExistingGroupsFromAllGroups = (
        allGroups: RolesInterface[], 
        existingGroups: ApplicationRoleGroupInterface[]
    ) => {
        const filteredGroups: RolesInterface[] = [];

        if (allGroups?.length > 0) {
            allGroups.forEach((item: RolesInterface) => {
                const itemIndex: number = existingGroups.findIndex(
                    (existingGroup: ApplicationRoleGroupInterface)  => existingGroup?.name === item?.displayName);
                
                // No matching index found.
                if (itemIndex === -1) {
                    filteredGroups.push(item);
                }
            });
    
            setGroupsList(filteredGroups);
            setInitialGroupList(filteredGroups);
        }
    };

    const assignGroupsToRole = () => {
        const selectedGroups: ApplicationRoleGroupInterface[] = [];
        
        tempGroupList.forEach((group: RolesInterface) => {
            selectedGroups.push({
                name: group.displayName
            });
        });
        
        handleGroupAdd(selectedGroups);
    };

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
        const filteredGroupList: RolesInterface[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            initialGroupList && initialGroupList.map((group: RolesInterface) => {
                isMatch = re.test(group.displayName);
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
    const handleUnassignedItemCheckboxChange = (group: RolesInterface) => {        
        const checkedGroups: RolesInterface[] = [ ...checkedUnassignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
        } else {
            checkedGroups.push(group);
        }
        handleAddedGroupListChange(checkedGroups);
        handleAddedGroupInitialListChange(checkedGroups);
        setIsSelectUnassignedAllGroupsChecked(groupList?.length === checkedGroups.length);
    };

    const handleGroupListChange = (groupList: RolesInterface[]) => {
        setGroupsList(groupList);
    };

    const handleAddedGroupListChange = (newGroupList: RolesInterface[]) => {
        setTempGroupList(newGroupList);
    };

    const handleAddedGroupInitialListChange = (newGroupList: RolesInterface[]) => {
        setInitialTempGroupList(newGroupList);
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param groupName - string
     */
    const createGroupLabel = (groupName: string): any => {
        const group: string[] = groupName.split("/");

        if (group.length > 1) {
            return { labelColor: "teal", labelText: group[0].toString() };
        } else {
            return { labelColor: "olive", labelText: "Primary" };
        }
    };

    return (
        <Modal
            open={ true }
            className="wizard create-role-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape= { false }
            data-componentId={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("extensions:console.applicationRoles.assignGroupWizard.heading") }
                <Heading as="h6">
                    { t("extensions:console.applicationRoles.assignGroupWizard.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="content-container" scrolling>
                {
                    !isLoading 
                        ? (
                            <TransferComponent
                                selectionComponent
                                searchPlaceholder={ t("transferList:searchPlaceholder",
                                    { type: "Groups" }) }
                                handleUnelectedListSearch={ handleUnselectedListSearch }
                                data-componentid="application-role-assign-group-modal"
                                isLoading={ isLoading }
                            >
                                <TransferList
                                    isListEmpty={ !(groupList?.length > 0) }
                                    listType="unselected"
                                    listHeaders={ [
                                        t("transferList:list.headers.0"),
                                        t("transferList:list.headers.1"), ""
                                    ] }
                                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                                    isHeaderCheckboxChecked={ isSelectUnassignedGroupsAllRolesChecked }
                                    emptyPlaceholderContent={ t("transferList:list." +
                                        "emptyPlaceholders.users.roles.unselected", { type: "groups" }) }
                                    data-testid="user-mgt-add-user-wizard-modal-unselected-groups-select-all-checkbox"
                                    emptyPlaceholderDefaultContent={ t("transferList:list."
                                        + "emptyPlaceholders.default") }
                                >
                                    {
                                        groupList?.map((group: RolesInterface, index: number)=> {
                                            const groupName: string[] = group?.displayName?.split("/");

                                            return (
                                                <TransferListItem
                                                    style={ { height: "100%" } }
                                                    handleItemChange={ () => handleUnassignedItemCheckboxChange(group) }
                                                    key={ index }
                                                    listItem={ groupName?.length > 1 
                                                        ? groupName[1] : group?.displayName }
                                                    listItemId={ group.id }
                                                    listItemIndex={ index }
                                                    listItemTypeLabel={ createGroupLabel(group?.displayName) }
                                                    isItemChecked={ checkedUnassignedListItems.includes(group) }
                                                    showSecondaryActions={ false }
                                                    data-componentid="application-role-assign-group-modal-unselected"
                                                />
                                            );
                                        })
                                    }
                                </TransferList>
                            </TransferComponent>
                        )
                        : (
                            <ContentLoader />
                        ) 
                }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-componentId={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                onClick={ () => assignGroupsToRole() }
                                data-componentId={ `${ componentId }-assign-button` }
                                loading={ isSubmitting || isLoading }
                                disabled={ isSubmitting || isLoading || groupList?.length === 0 }
                            >
                                { t("extensions:console.applicationRoles.assign") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

export default AssignGroupWizard;
