/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useGroupList } from "@wso2is/admin.groups.v1/api/groups";
import { GroupsInterface } from "@wso2is/admin.groups.v1/models/groups";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { AlertLevels, IdentifiableComponentInterface, LabelValue } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AutocompleteFieldAdapter, FinalForm, FinalFormField, FormRenderProps } from "@wso2is/form";
import { Heading, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import filter from "lodash-es/filter";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, MouseEvent, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Grid, Icon, Label } from "semantic-ui-react";
import { updateConnectionRoleMappings } from "../../../../api/connections";
import { ConnectionRolesInterface } from "../../../../models/connection";
import { handleUpdateIDPRoleMappingsError } from "../../../../utils/connection-utils";

interface OutboundProvisioningGroupsPropsInterface extends IdentifiableComponentInterface {
    idpId: string;
    idpRoles: ConnectionRolesInterface;
    isReadOnly?: boolean;
    onUpdate: (id: string) => void;
}

export const OutboundProvisioningGroups: FunctionComponent<OutboundProvisioningGroupsPropsInterface> = (
    props: OutboundProvisioningGroupsPropsInterface) => {

    const {
        idpId,
        idpRoles,
        isReadOnly,
        onUpdate,
        [ "data-componentid" ]: componentId = "outbound-provisioning-settings-groups"
    } = props;

    const [ selectedGroups, setSelectedGroups ] = useState<string[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ inputValue, setInputValue ] = useState<string>("");

    const dispatch: Dispatch = useDispatch();
    const { isSuperOrganization } = useGetCurrentOrganizationType();
    const { t } = useTranslation();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasUpdateScopes: boolean = useRequiredScopes(featureConfig?.identityProviders?.scopes?.update);

    const excludedAttributes: string = "members,roles,meta";

    const {
        data: groupListResponse,
        error: groupsListFetchRequestError
    } = useGroupList(
        null,
        null,
        searchQuery,
        null,
        excludedAttributes,
        isSuperOrganization()
    );

    /**
     * Handle search query change with debounce for server-side search
     */
    const debouncedSearch: DebouncedFunc<(query: string) => void>
        = useCallback(debounce((query: string) => {
            if (isEmpty(query?.trim())) {
                setSearchQuery(null);
            } else {
                // SCIM filter format: "displayName co <searchTerm>"
                const processedQuery: string = "displayName co " + query;

                setSearchQuery(processedQuery);
            }
        }, 1000), []);

    const handleGroupAdd = (selectedGroup: string, resetForm: () => void) => {
        if (isEmpty(selectedGroup)) {
            return;
        }
        if (isEmpty(selectedGroups.find((group: string) => group === selectedGroup))) {
            setSelectedGroups([ ...selectedGroups, selectedGroup ]);
        }
        // Reset the form field and clear input
        resetForm();
        setInputValue("");
        setSearchQuery(null);
    };

    const handleGroupRemove = (removingGroup: string) => {
        if (isEmpty(removingGroup)) {
            return;
        }
        setSelectedGroups(filter(selectedGroups, (group: string) => !isEqual(removingGroup, group)));
    };

    useEffect(() => {
        if (groupsListFetchRequestError) {
            dispatch(
                addAlert({
                    description: t("groups:notifications.fetchGroups.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("groups:notifications.fetchGroups.genericError.message")
                })
            );
        }
    }, [ groupsListFetchRequestError ]);

    useEffect(() => {
        if (!isSuperOrganization()) {
            return;
        }

        setSelectedGroups(idpRoles.outboundProvisioningRoles === undefined ? [] :
            idpRoles.outboundProvisioningRoles);
    }, []);

    const handleOutboundProvisioningGroupMapping = () => {
        setIsSubmitting(true);

        updateConnectionRoleMappings(idpId, {
            ...idpRoles,
            outboundProvisioningRoles: selectedGroups
        }
        ).then(() => {
            dispatch(addAlert(
                {
                    description: t("authenticationProvider:" +
                        "notifications.updateIDPRoleMappings." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:" +
                        "notifications.updateIDPRoleMappings.success.message")
                }
            ));
            onUpdate(idpId);
        }).catch((error: AxiosError) => {
            handleUpdateIDPRoleMappingsError(error);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const groupOptions: LabelValue[] = groupListResponse?.Resources?.map(
        (group: GroupsInterface) => ({
            label: group.displayName,
            value: group.displayName
        })
    ) || [];

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 12 } computer={ 8 }>
                    <Heading as="h4">
                        { t("authenticationProvider:forms.outboundProvisioningGroups.heading") }
                    </Heading>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 12 } computer={ 8 }>
                    <FinalForm
                        onSubmit={ () => {
                            // Form submission is handled by the add button.
                        } }
                        initialValues={ { selectedGroup: "" } }
                        render={ ({ handleSubmit, form, values }: FormRenderProps) => (
                            <form onSubmit={ handleSubmit } data-componentid={ componentId }>
                                <div style={ { alignItems: "flex-start" , display: "flex", gap: "8px" } }>
                                    <div style={ { flex: 1 } }>
                                        <FinalFormField
                                            key="selectedGroup"
                                            name="selectedGroup"
                                            label={ t("authenticationProvider:forms.outboundProvisioningGroups.label") }
                                            placeholder={
                                                t("authenticationProvider:forms.outboundProvisioningGroups.placeHolder")
                                            }
                                            component={ AutocompleteFieldAdapter }
                                            options={ groupOptions }
                                            getOptionLabel={
                                                (option: LabelValue) => option?.label ?? ""
                                            }
                                            filterOptions={
                                                (options: LabelValue[]) => options
                                            }
                                            inputValue={ inputValue }
                                            onInputChange={ (_event: SyntheticEvent, value: string, reason: string) => {
                                                setInputValue(value);
                                                // Only trigger search when user is typing, not when selecting.
                                                if (reason === "input") {
                                                    debouncedSearch(value);
                                                }
                                            } }
                                            readOnly={ isReadOnly }
                                            data-componentid={ `${componentId}-group-select-dropdown` }
                                            disabled={ !hasUpdateScopes || isReadOnly || isSubmitting }
                                        />
                                    </div>
                                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                        <Button
                                            onClick={ (event: MouseEvent<HTMLButtonElement>) => {
                                                event.preventDefault();
                                                if (values.selectedGroup) {
                                                    const selectedValue: string =
                                                        typeof values.selectedGroup === "string"
                                                            ? values.selectedGroup
                                                            : (values.selectedGroup as LabelValue)?.value;

                                                    handleGroupAdd(selectedValue, form.reset);
                                                }
                                            } }
                                            icon="add"
                                            type="button"
                                            disabled={ !hasUpdateScopes || isReadOnly || isSubmitting
                                                || !values.selectedGroup }
                                            data-componentid={ `${ componentId }-add-button` }
                                            style={ { marginTop: "28px" } }
                                        />
                                    </Show>
                                </div>
                            </form>
                        ) }
                    />
                    <Hint>
                        { t("authenticationProvider:forms.outboundProvisioningGroups.hint") }
                    </Hint>

                    {
                        selectedGroups && selectedGroups?.map((selectedGroup: string, index: number) => {
                            return (
                                <Label key={ index }>
                                    { selectedGroup }
                                    <Icon
                                        name="delete"
                                        onClick={ () => handleGroupRemove(selectedGroup) }
                                        data-componentid={ `${componentId}-delete-button-${index}` }
                                        disabled={ !hasUpdateScopes || isReadOnly || isSubmitting }
                                    />
                                </Label>
                            );
                        })
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={ 8 }>
                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                        <Button
                            primary
                            size="small"
                            loading={ isSubmitting }
                            disabled={ isSubmitting || isReadOnly }
                            onClick={ handleOutboundProvisioningGroupMapping }
                            data-componentid={ `${ componentId }-update-button` }
                        >
                            { t("common:update") }
                        </Button>
                    </Show>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
