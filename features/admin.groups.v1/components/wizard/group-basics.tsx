/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppState } from "@wso2is/admin.core.v1/store";
import { SharedUserStoreUtils } from "@wso2is/admin.core.v1/utils/user-store-utils";
import { groupConfig, userstoresConfig } from "@wso2is/admin.extensions.v1";
import { useUserStoreRegEx } from "@wso2is/admin.userstores.v1/api/use-get-user-store-regex";
import { USERSTORE_REGEX_PROPERTIES } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreDropdownItem, UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, GridColumn, GridRow } from "semantic-ui-react";
import { searchGroupList } from "../../api/groups";
import { CreateGroupFormData, SearchGroupInterface } from "../../models/groups";

/**
 * Interface to capture group basics props.
 */
interface GroupBasicProps extends IdentifiableComponentInterface {
    dummyProp?: string;
    triggerSubmit: boolean;
    initialValues: any;
    onSubmit: (values: any) => void;
    userStore: string;
    setUserStore: (userStore: string) => void;
}

/**
 * Component to capture basic details of a new role.
 */
export const GroupBasics: FunctionComponent<GroupBasicProps> = (props: GroupBasicProps): ReactElement => {

    const {
        onSubmit,
        triggerSubmit,
        initialValues,
        setUserStore,
        userStore,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const {
        isLoading: isUserStoresLoading,
        isUserStoreReadOnly,
        mutateUserStoreList,
        userStoresList
    } = useUserStores();

    const systemReservedUserStores: string[] =
        useSelector((state: AppState) => state?.config?.ui?.systemReservedUserStores);

    const [ basicDetails, setBasicDetails ] = useState<any>(null);

    const groupName: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();

    const {
        data: userStoreRegEx,
        isLoading: isUserStoreRegExLoading
    } = useUserStoreRegEx(
        userStore,
        USERSTORE_REGEX_PROPERTIES.RolenameRegEx
    );

    const userStoreOptions: UserStoreDropdownItem[] = useMemo(() => {
        const storeOptions: UserStoreDropdownItem[] = [
            {
                key: -1,
                text: userstoresConfig?.primaryUserstoreName,
                value: userstoresConfig?.primaryUserstoreName
            }
        ];

        if (userStoresList && !isUserStoresLoading) {
            if (userStoresList?.length > 0) {
                userStoresList
                    ?.filter((userStore: UserStoreListItem) => !systemReservedUserStores?.includes(userStore.name))
                    .forEach((store: UserStoreListItem, index: number) => {
                        const isEnabled: boolean = store.enabled;
                        const isReadOnly: boolean = isUserStoreReadOnly(store?.name);

                        if (store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName
                        && isEnabled && !isReadOnly) {
                            const storeOption: UserStoreDropdownItem = {
                                key: index,
                                text: store.name,
                                value: store.name
                            };

                            storeOptions.push(storeOption);
                        }
                    });
            }
        }

        return storeOptions;
    }, [ userStoresList, isUserStoresLoading ]);

    useEffect(() => {
        mutateUserStoreList();
    }, []);

    useEffect(() => {
        if (basicDetails) {
            onSubmit({ basicDetails });
        }
    }, [ basicDetails ]);

    /**
     * The following function change of the user stores.
     *
     * @param values - contains values from form elements
     */
    const handleDomainChange = (values: Map<string, FormValue>) => {
        const domain: string = values?.get("domain")?.toString();

        setUserStore(domain);
    };

    /**
     * Util method to collect form data for processing.
     *
     * @param values - contains values from form elements
     */
    const getFormValues = (values: any): CreateGroupFormData => {
        return {
            domain: userStore,
            groupName: values?.get("groupName")?.toString()
        };
    };

    return (
        <Forms
            data-componentid={ componentId }
            onSubmit={ (values: any) => {
                setBasicDetails(getFormValues(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {
                    groupConfig?.allowGroupAddForRemoteUserstores && (
                        <GridRow>
                            <GridColumn mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    data-componentid={ `${ componentId }-domain-dropdown` }
                                    type="dropdown"
                                    label={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                                        "domain.label.group") }
                                    name="domain"
                                    children={ userStoreOptions }
                                    placeholder={ t("roles:addRoleWizard." +
                                        "forms.roleBasicDetails.domain.placeholder") }
                                    requiredErrorMessage={ t("roles:addRoleWizard.forms." +
                                        "roleBasicDetails.domain.validation.empty.group") }
                                    required={ true }
                                    element={ <div></div> }
                                    listen={ handleDomainChange }
                                    value={ initialValues?.basicDetails?.domain ?? userStore ??
                                        userStoreOptions[ 0 ]?.value }
                                />
                            </GridColumn>
                        </GridRow>
                    )
                }
                <GridRow>
                    <GridColumn mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            ref={ groupName }
                            data-componentid={ `${ componentId }-role-name-input` }
                            type="text"
                            name="groupName"
                            label={ t("roles:addRoleWizard.forms.roleBasicDetails." +
                                "roleName.label", { type: "Group" }) }
                            placeholder={ t("roles:addRoleWizard.forms." +
                                "roleBasicDetails.roleName.placeholder", { type: "group" }) }
                            required={ true }
                            requiredErrorMessage={ t("roles:addRoleWizard.forms." +
                                "roleBasicDetails.roleName.validations.empty", { type: "Group" }) }
                            validation={ async (value: string, validation: Validation) => {
                                let isGroupNameValid: boolean = true;

                                isGroupNameValid = SharedUserStoreUtils
                                    .validateInputAgainstRegEx(value, userStoreRegEx);

                                if (!isGroupNameValid) {
                                    validation.isValid = false;
                                    if (userStoreRegEx === groupConfig.defaultUserstoreRegex) {
                                        // If the userstore regex is the default regex, show the default error message.
                                        validation.errorMessages.push(t(groupConfig?.groupPrimaryUserstoreRegexHint));
                                    } else {
                                        // If the userstore regex is a custom regex, show the custom regex.
                                        validation.errorMessages.push(t("groups:groupCreateWizard" +
                                            ".groupNameRegexCustomHint", { regex: userStoreRegEx }));;
                                    }
                                }

                                const searchData: SearchGroupInterface = {
                                    filter: `displayName eq  ${ userStore }/${ value }`,
                                    schemas: [
                                        "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                                    ],
                                    startIndex: 1
                                };

                                await searchGroupList(searchData).then((response: any) => {
                                    if (response?.data?.totalResults !== 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("roles:addRoleWizard." +
                                                "forms.roleBasicDetails.roleName.validations.duplicate",
                                            { type: "Group" }));
                                    }
                                }).catch(() => {
                                    dispatch(addAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "fetchGroups.genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.fetchGroups." +
                                            "genericError.message")
                                    }));
                                });

                            } }
                            value={  initialValues?.basicDetails?.groupName }
                            loading={ isUserStoreRegExLoading }
                        />
                        <Hint>
                            { t(groupConfig?.groupPrimaryUserstoreRegexHint) }
                        </Hint>
                    </GridColumn>
                </GridRow>
            </Grid>
        </Forms>
    );
};
