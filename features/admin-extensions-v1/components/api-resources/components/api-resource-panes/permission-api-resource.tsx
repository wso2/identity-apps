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

import Alert from "@oxygen-ui/react/Alert";
import Grid from "@oxygen-ui/react/Grid";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import {
    ConfirmationModal,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    ListLayout,
    PrimaryButton
} from "@wso2is/react-components";
import { getEmptyPlaceholderIllustrations } from "../../../../../features/core";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Input } from "semantic-ui-react";
import { PermissionListAPIResource } from "./permission-list-api-resource";
import { ExtendedFeatureConfigInterface } from "../../../../configs/models";
import { APIResourcePanesCommonPropsInterface, APIResourcePermissionInterface } from "../../models";
import { AddAPIResourcePermission } from "../wizard";

/**
 * Prop-types for the API resources page component.
 */
type PermissionAPIResourceInterface = SBACInterface<ExtendedFeatureConfigInterface> &
    IdentifiableComponentInterface & APIResourcePanesCommonPropsInterface;

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const PermissionAPIResource: FunctionComponent<PermissionAPIResourceInterface> = (
    props: PermissionAPIResourceInterface
): ReactElement => {

    const {
        apiResourceData,
        isAPIResourceDataLoading,
        isSubmitting,
        isReadOnly,
        isManagedByChoreo,
        handleUpdateAPIResource,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ permissionList, setPermissionList ] = useState<APIResourcePermissionInterface[]>([]);
    const [ serachedPermissionList, setSearchedPermissionList ] = useState<APIResourcePermissionInterface[]>([]);
    const [ deletingAPIResourcePermission, setDeletingAPIResourcePermission ]
        = useState<APIResourcePermissionInterface>(null);
    const [ triggerAddAPIResourcePermissionModal, setTriggerAddAPIResourcePermissionModal ] = useTrigger();
    const [ permissionSearchQuery, setPermissionSearchQuery ] = useState<string>("");

    /**
     * Set the permission list.
     */
    useEffect(() => {
        if (apiResourceData) {
            setPermissionList(apiResourceData.permissions);
            setSearchedPermissionList(apiResourceData.permissions);
        }
    }, [ apiResourceData, deletingAPIResourcePermission ]);

    /**
     * Handles the search query change.
     * 
     * @param event - Change event
     */
    const searchPermission = (event: React.ChangeEvent<HTMLInputElement>) => {
        const changeValue: string = event.target.value;

        setPermissionSearchQuery(changeValue);
        if (changeValue.length > 0) {
            // Filter the permission list using the `displayName`
            setSearchedPermissionList(
                permissionList.filter(
                    (permission: APIResourcePermissionInterface) => {
                        const displayName: string = permission.displayName;

                        return displayName.toLowerCase().includes(changeValue.toLowerCase());
                    }
                )
            );
        } else {
            setSearchedPermissionList(permissionList);
        }
    };

    /**
     * Handles the search query clear.
     */
    const clearSearchPermission = () => {
        setPermissionSearchQuery("");
        setSearchedPermissionList(permissionList);
    };

    /**
     * Handles the API resource permission delete action.
     */
    const deletePermission = (): void => {
        handleUpdateAPIResource(
            {
                deletedPermissions: [ deletingAPIResourcePermission.id ]
            },
            (): void => setDeletingAPIResourcePermission(null)
        );
    };

    return (
        <>
            {
                isManagedByChoreo && (
                    <Alert severity="warning">
                        <Trans i18nKey={ "extensions:develop.apiResource.tabs.choreoApiEditWarning" }>
                            Updating this API resource will create unforeseen errors as this is an API 
                            resource managed by Choreo. <b>Proceed with caution.</b>
                        </Trans>
                    </Alert>
                )
            }
            <EmphasizedSegment className="padded" loading={ isAPIResourceDataLoading }>
                <Grid container className="mb-1">
                    <Grid xs={ 8 }>
                        <Heading as="h4" compact>
                            { t("extensions:develop.apiResource.tabs.permissions.title") }
                        </Heading>
                        <Heading as="h6" color="grey" subHeading className="mb-5">
                            { t("extensions:develop.apiResource.tabs.permissions.subTitle") }
                        </Heading>
                    </Grid>
                    <Grid xs={ 4 } alignItems="flex-end">
                        {
                            permissionList?.length !== 0
                                && (<PrimaryButton
                                    data-componentid={ `${componentId}-add-permission-button` }
                                    size="medium"
                                    floated="right"
                                    onClick={ () => setTriggerAddAPIResourcePermissionModal() }
                                >
                                    <Icon name="add" />
                                    { t("extensions:develop.apiResource.tabs.permissions.button") }
                                </PrimaryButton>)
                        }
                    </Grid>
                </Grid>
                <ListLayout
                    showTopActionPanel={ !isAPIResourceDataLoading && permissionList?.length > 0 }
                    showPagination={ false }
                    onPageChange={ () => null }
                    totalPages={ 100 }
                    data-testid={ `${componentId}-list-layout` }
                    totalListSize={ permissionList?.length }
                    leftActionPanel={
                        (<div className="advanced-search-wrapper aligned-left fill-default">
                            <Input
                                className="advanced-search with-add-on"
                                data-testid={ `${componentId}-list-search-input` }
                                icon="search"
                                iconPosition="left"
                                onChange={ searchPermission }
                                placeholder={ t("extensions:develop.apiResource.tabs.permissions.search") }
                                floated="right"
                                size="small"
                                value={ permissionSearchQuery }
                            />
                        </div>)
                    }
                >
                    {
                        !permissionList
                            ? (
                                <EmptyPlaceholder
                                    subtitle={ [ t("extensions:develop.apiResource.apiResourceError." +
                                                    "subtitles.0"),
                                    t("extensions:develop.apiResource.apiResourceError.subtitles.1") ] }
                                    title={ t("extensions:develop.apiResource.apiResourceError.title") }
                                    image={ getEmptyPlaceholderIllustrations().genericError }
                                    imageSize="tiny"
                                />
                            )
                            : (
                                <PermissionListAPIResource
                                    isAPIResourceDataLoading={ isAPIResourceDataLoading }
                                    isReadOnly={ isReadOnly }
                                    permissionList={ permissionList }
                                    serachedPermissionList={ serachedPermissionList }
                                    isSubmitting={ isSubmitting }
                                    clearSearchPermission={ clearSearchPermission }
                                    setRemovePermission={ setDeletingAPIResourcePermission }
                                    setTriggerAddAPIResourcePermissionModal
                                        ={ setTriggerAddAPIResourcePermissionModal }
                                />
                            )
                    }
                </ListLayout>
            </EmphasizedSegment>
            {
                triggerAddAPIResourcePermissionModal && (
                    <AddAPIResourcePermission 
                        closeWizard={ () => setTriggerAddAPIResourcePermissionModal() } 
                        handleUpdateAPIResource={ handleUpdateAPIResource }
                    />
                )
            }
            {
                deletingAPIResourcePermission && (
                    <ConfirmationModal
                        primaryActionLoading={ isSubmitting }
                        open={ deletingAPIResourcePermission !== null }
                        onClose={ (): void => setDeletingAPIResourcePermission(null) }
                        type="negative"
                        assertionHint={ t("extensions:develop.apiResource.confirmations." +
                                    "deleteAPIResourcePermission.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setDeletingAPIResourcePermission(null) }
                        onPrimaryActionClick={ (): void => deletePermission() }
                        data-testid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("extensions:develop.apiResource.confirmations.deleteAPIResourcePermission." +
                                        "header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("extensions:develop.apiResource.confirmations.deleteAPIResourcePermission." +
                                        "message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("extensions:develop.apiResource.confirmations.deleteAPIResourcePermission." +
                                        "content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
PermissionAPIResource.defaultProps = {
    "data-componentid": "permission-api-resource"
};
