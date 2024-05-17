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

import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { FormValue } from "@wso2is/forms";
import { EmphasizedSegment } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Header } from "semantic-ui-react";
import { PermissionMappingList } from "./permission-mapping-list";
import { PermissionMappingListItem } from "./permission-mapping-list-item";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { APIResourcePermissionInterface } from "../../../models";

/**
 * Prop-types for the API resources page component.
 */
interface AddAPIResourcePermissionsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Initial permission list.
     */
    initialPermissions: Map<string, APIResourcePermissionInterface>;
    /**
     * Trigger add permission form submit action.
     */
    triggerAddPermission: boolean;
    /**
     * Permission value loading status.
     */
    isPermissionValidationLoading: boolean;
    /**
     * Set the trigger add permission form submit action.
     */
    setAddPermission: () => void;
    /**
     * Set the permission list.
     */
    setPermissionsList : (permissions: Map<string, APIResourcePermissionInterface>) => void;
    /**
     * Set the latest permission form values.
     */
    setLatestPermissionFormValues: (formValue: Map<string, FormValue>) => void;
    /**
     * Set the permission value loading status.
     */
    setPermissionValidationLoading: (status: boolean) => void;
}

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const AddAPIResourcePermissions: FunctionComponent<AddAPIResourcePermissionsInterface> = (
    props: AddAPIResourcePermissionsInterface
): ReactElement => {

    const {
        initialPermissions,
        triggerAddPermission,
        isPermissionValidationLoading,
        setAddPermission,
        setPermissionsList,
        setLatestPermissionFormValues,
        setPermissionValidationLoading
    } = props;

    const { t } = useTranslation();

    const [ addedPermissions, setAddedPermissions ]
        = useState<Map<string, APIResourcePermissionInterface>>(initialPermissions ? initialPermissions : new Map());

    /**
     * Update the permission list when the added permissions map is updated.
     */
    useEffect(() => {
        setPermissionsList(addedPermissions);
    }, [ addedPermissions ]);

    /**
     * Update the permission map when a new permission is added or deleted.
     *
     * @param permission - The permission to be added or deleted.  `APIResourcePermissionInterface`
     * @param action - The action to be performed. `set` or `delete`
     */
    const updatePermissions = (permission: APIResourcePermissionInterface, action : "set" | "delete"): void => {
        const updatedPermissions: Map<string, APIResourcePermissionInterface> = new Map(addedPermissions);

        switch (action) {
            case "set":
                updatedPermissions.set(permission.name, permission);

                break;

            case "delete":
                updatedPermissions.delete(permission.name);

                break;

            default:
                break;
        }
        setAddedPermissions(updatedPermissions);
    };

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <EmphasizedSegment className="mb-4">
                        <PermissionMappingListItem
                            addedPermissions={ addedPermissions }
                            updatePermissions={ updatePermissions }
                            triggerAddPermission={ triggerAddPermission }
                            setAddPermission={ setAddPermission }
                            setLatestPermissionFormValues={ setLatestPermissionFormValues }
                            isPermissionValidationLoading={ isPermissionValidationLoading }
                            setPermissionValidationLoading={ setPermissionValidationLoading } />
                    </EmphasizedSegment>
                </Grid.Column>
                <Grid.Column width={ 16 }>
                    <React.Fragment>
                        <Header
                            as="h5"
                            className="bold-text mb-2"
                        >
                            { t("apiResources:wizard.addApiResource.steps.scopes.form." +
                                "fields.permissionList.label") }
                        </Header>
                        <EmphasizedSegment className="mt-0">
                            <PermissionMappingList
                                addedPermissions={ addedPermissions }
                                updatePermissions={ updatePermissions } />
                        </EmphasizedSegment>
                    </React.Fragment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
