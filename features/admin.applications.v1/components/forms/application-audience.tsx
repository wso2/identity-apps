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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Autocomplete,
    Chip,
    Grid,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import { ApplicationManagementConstants, UserStoreProperty, getAUserStore } from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { useUserStores } from "@wso2is/admin.userstores.v1/api";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import { UserStoreItem, UserStoreListItem, UserStorePostData } from "@wso2is/admin.userstores.v1/models/user-stores";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Hint, useDocumentation } from "@wso2is/react-components";
import React, { useEffect, useMemo } from "react";
import { Trans } from "react-i18next";
import { ApplicationInterface, DiscoverableGroup } from "../../models/application";

interface GroupAssignmentProps extends IdentifiableComponentInterface {
    application: ApplicationInterface,
    discoverableGroups: DiscoverableGroup[],
    setDiscoverableGroups: React.Dispatch<React.SetStateAction<DiscoverableGroup[]>>
}

const GroupAssignmentRow = ({
    index,
    discoverableGroup,
    userStoreOptions,
    handleGroupChange,
    handleUserStoreChange,
    handleAddRow,
    handleDeleteRow,
    discoverableGroups
}: {
    index: number;
    discoverableGroup: DiscoverableGroup;
    userStoreOptions: any;
    handleGroupChange: any;
    handleUserStoreChange: any;
    handleAddRow: any;
    handleDeleteRow: any;
    discoverableGroups: any
}) => {
    const {
        data: groupList,
        isLoading: isGroupListFetchRequestLoading,
        error: groupListFetchError
    } = useGroupList(discoverableGroup.userStore);

    useEffect(() => {
        if (!isGroupListFetchRequestLoading && groupListFetchError) {
            addAlert({
                description: "Error occurred while getting user groups",
                message: "Something went wrong!",
                type: AlertLevels.ERROR
            });
        }
    }, [ isGroupListFetchRequestLoading, groupListFetchError ]);

    return (
        <>
            <Grid item xs={ 3 }>
                <Select
                    value={ discoverableGroup.userStore }
                    onChange={
                        (e: SelectChangeEvent<string>) => handleUserStoreChange(index, e.target.value)
                    }
                    fullWidth
                    displayEmpty
                >
                    { userStoreOptions.map((store: UserStoreItem, index: number) => (
                        <MenuItem key={ index } value={ store.value }>
                            { store.text }
                        </MenuItem>
                    )) }
                </Select>
            </Grid>

            <Grid item xs={ 7 }>
                <Autocomplete
                    multiple
                    options={ groupList?.Resources?.map((group: GroupsInterface) => group.displayName) || [] }
                    value={ discoverableGroup.groups }
                    onChange={
                        (
                            event: React.SyntheticEvent<Element, Event>,
                            newValue: any
                        ) => handleGroupChange(index, newValue)
                    }
                    renderTags={ (value, getTagProps) =>
                        value.map((option, i) => (
                            <Chip
                                key={ option }
                                label={ option }
                                { ...getTagProps({ index: i }) }
                            />
                        ))
                    }
                    renderInput={ (params) => (
                        <TextField { ...params } placeholder="Type group name to select and assign" />
                    ) }
                />
            </Grid>

            <Grid item xs={ 2 }>
                <IconButton
                    aria-label="delete"
                    onClick={ () => handleDeleteRow(index) }
                >
                    <DeleteIcon />
                </IconButton>
                { index === discoverableGroups.length - 1 && (
                    <IconButton aria-label="add" onClick={ handleAddRow }>
                        <AddCircleOutlineIcon />
                    </IconButton>
                ) }
            </Grid>
        </>
    );
};

export default function GroupAssignment({
    application,
    discoverableGroups,
    setDiscoverableGroups,
    ["data-componentid"]: componentId = "application-audience"
}: GroupAssignmentProps) {
    const { getLink } = useDocumentation();

    const {
        data: userStoreList,
        isLoading: isUserStoreListFetchRequestLoading,
        error: userStoreFetchError
    } = useUserStores({
        filter: null,
        limit: null,
        offset: null,
        sort: null
    });

    const userStoreOptions: UserStoreItem[] = useMemo(() => {
        const storeOptions: UserStoreItem[] = [
            {
                key: -1,
                text: userstoresConfig.primaryUserstoreName,
                value: userstoresConfig.primaryUserstoreName
            }
        ];

        if (userStoreList?.length > 0) {
            userStoreList.map((store: UserStoreListItem, index: number) => {
                if (store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName) {
                    getAUserStore(store.id).then((response: UserStorePostData) => {
                        const isDisabled: boolean = response.properties.find(
                            (property: UserStoreProperty) => property.name === "Disabled")?.value === "true";

                        if (!isDisabled) {
                            const storeOption: UserStoreItem = {
                                disabled: store.typeName === RemoteUserStoreManagerType.RemoteUserStoreManager,
                                key: index,
                                text: store.name,
                                value: store.name
                            };

                            storeOptions.push(storeOption);
                        }
                    });
                }
            });
        }

        return storeOptions;
    }, [ userStoreList ]);

    useEffect(() => {
        if (!isUserStoreListFetchRequestLoading && userStoreFetchError) {
            addAlert({
                description: "Error when getting the user stores",
                level: AlertLevels.ERROR,
                message: "Something went wrong!"
            });
        }
    }, [ isUserStoreListFetchRequestLoading, userStoreFetchError ]);

    const handleAddRow = () => {
        setDiscoverableGroups([ ...discoverableGroups, { groups: [], userStore: "" } ]);
    };

    const handleDeleteRow = (index: number) => {
        const updatedRows: DiscoverableGroup[] = discoverableGroups.filter(
            (_: DiscoverableGroup, i: number) => i !== index);

        setDiscoverableGroups(updatedRows);
    };

    const handleGroupChange = (index: number, newGroups: string[]) => {
        const updatedRows: DiscoverableGroup[] = [ ...discoverableGroups ];

        updatedRows[index].groups = newGroups;
        setDiscoverableGroups(updatedRows);
    };

    const handleUserStoreChange = (index: number, value: string) => {
        const updatedRows: DiscoverableGroup[] = [ ...discoverableGroups ];

        updatedRows[index].userStore = value;
        setDiscoverableGroups(updatedRows);
    };

    return (
        <div data-componentid={ componentId }>
            <Typography>Application audience</Typography>
            <Hint compact className="mt-2">
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
            </Hint>

            <Grid container spacing={ 2 } sx={ { mt: 2 } }>
                <Grid item xs={ 3 }>
                    <Typography variant="subtitle1">User store</Typography>
                </Grid>
                <Grid item xs={ 7 }>
                    <Typography variant="subtitle1">Groups</Typography>
                </Grid>
                <Grid item xs={ 2 } />

                { discoverableGroups.map((discoverableGroup: DiscoverableGroup, index: number) => (
                    <GroupAssignmentRow
                        key={ index }
                        index={ index }
                        discoverableGroup={ discoverableGroup }
                        userStoreOptions={ userStoreOptions }
                        handleGroupChange={ handleGroupChange }
                        handleUserStoreChange={ handleUserStoreChange }
                        handleAddRow={ handleAddRow }
                        handleDeleteRow={ handleDeleteRow }
                        discoverableGroups={ discoverableGroups }
                    />
                )) }
            </Grid>
        </div>
    );
}
