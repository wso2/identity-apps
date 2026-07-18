/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GridLayout,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { deleteFunctionLibrary } from "../api/function-library";
import { FUNCTION_LIBRARIES_LIST } from "../constants/component-ids";
import { FunctionLibraryInterface } from "../models/function-library";

/**
 * Props interface of {@link FunctionLibrariesList}.
 */
interface FunctionLibrariesListPropsInterface extends IdentifiableComponentInterface {
    /**
     * Function libraries to be displayed.
     */
    functionLibraryList: FunctionLibraryInterface[];
    /**
     * Whether the list is being fetched.
     */
    isLoading: boolean;
    /**
     * Called after a function library is deleted, so the parent can refresh the list.
     */
    onFunctionLibraryDelete: () => void;
    /**
     * Called when the empty-state "create" action is clicked.
     */
    onAddNewFunctionLibrary: () => void;
}

/**
 * Lists the function libraries in a table with edit/delete actions.
 *
 * @param props - Props injected to the component.
 * @returns Function libraries list component.
 */
const FunctionLibrariesList: FunctionComponent<FunctionLibrariesListPropsInterface> = (
    props: FunctionLibrariesListPropsInterface
): ReactElement => {
    const {
        functionLibraryList,
        isLoading,
        onFunctionLibraryDelete,
        onAddNewFunctionLibrary,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingFunctionLibrary, setDeletingFunctionLibrary ] = useState<FunctionLibraryInterface>(undefined);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    const handleFunctionLibraryEditClick: (event: SyntheticEvent, item: FunctionLibraryInterface) => void = (
        event: SyntheticEvent,
        item: FunctionLibraryInterface
    ): void => {
        event?.preventDefault();

        history.push(
            AppConstants.getPaths()
                .get("APPLICATIONS_SETTINGS_FUNCTION_LIBRARY_EDIT")
                .replace(":name", item?.name)
        );
    };

    const handleFunctionLibraryDelete: () => void = (): void => {
        if (!deletingFunctionLibrary) {
            return;
        }

        setIsDeleting(true);

        deleteFunctionLibrary(deletingFunctionLibrary.name)
            .then(() => {
                dispatch(addAlert({
                    description: t("functionLibraries:notifications.delete.success.description",
                        { name: deletingFunctionLibrary.name }),
                    level: AlertLevels.SUCCESS,
                    message: t("functionLibraries:notifications.delete.success.message")
                }));
                onFunctionLibraryDelete();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("functionLibraries:notifications.delete.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("functionLibraries:notifications.delete.genericError.message")
                }));
            })
            .finally(() => {
                setIsDeleting(false);
                setShowDeleteConfirmationModal(false);
                setDeletingFunctionLibrary(undefined);
            });
    };

    const createDatatableColumns: () => TableColumnInterface[] = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "function-library-name",
                render: (data: FunctionLibraryInterface): ReactElement => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-componentid={ `${ componentId }-item-heading` }
                    >
                        <Header.Content>
                            { data.name }
                            <Header.Subheader className="truncate ellipsis">
                                { data.description }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("functionLibraries:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("functionLibraries:list.columns.actions")
            }
        ];
    };

    const createDatatableActions: () => TableActionsInterface[] = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean => !hasRequiredScopes(
                    featureConfig?.functionLibraries,
                    featureConfig?.functionLibraries?.scopes?.update,
                    allowedScopes
                ),
                icon: (): SemanticICONS => "pencil alternate",
                onClick: handleFunctionLibraryEditClick,
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-delete-button`,
                hidden: (): boolean => !hasRequiredScopes(
                    featureConfig?.functionLibraries,
                    featureConfig?.functionLibraries?.scopes?.delete,
                    allowedScopes
                ),
                icon: (): SemanticICONS => "trash alternate",
                onClick: (event: SyntheticEvent, data: FunctionLibraryInterface): void => {
                    event?.preventDefault();
                    setDeletingFunctionLibrary(data);
                    setShowDeleteConfirmationModal(true);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <GridLayout isLoading={ isLoading } showTopActionPanel={ false }>
            { functionLibraryList?.length > 0
                ? (
                    <ListLayout
                        currentListSize={ functionLibraryList.length }
                        showPagination={ false }
                        onPageChange={ () => void 0 }
                        totalPages={ 1 }
                        totalListSize={ functionLibraryList.length }
                        data-componentid={ `${ componentId }-layout` }
                    >
                        <DataTable<FunctionLibraryInterface>
                            data={ functionLibraryList }
                            showHeader={ false }
                            onRowClick={ handleFunctionLibraryEditClick }
                            actions={ createDatatableActions() }
                            columns={ createDatatableColumns() }
                        />
                        { showDeleteConfirmationModal && (
                            <ConfirmationModal
                                primaryActionLoading={ isDeleting }
                                onClose={ (): void => {
                                    setShowDeleteConfirmationModal(false);
                                    setDeletingFunctionLibrary(undefined);
                                } }
                                type="negative"
                                open={ showDeleteConfirmationModal }
                                assertionHint={ t("functionLibraries:modals.deleteConfirmation.assertionHint") }
                                assertionType="checkbox"
                                primaryAction={ t("common:confirm") }
                                secondaryAction={ t("common:cancel") }
                                onSecondaryActionClick={ (): void => {
                                    setShowDeleteConfirmationModal(false);
                                    setDeletingFunctionLibrary(undefined);
                                } }
                                onPrimaryActionClick={ handleFunctionLibraryDelete }
                                data-componentid={ `${ componentId }-delete-confirmation-modal` }
                                closeOnDimmerClick={ false }
                            >
                                <ConfirmationModal.Header>
                                    { t("functionLibraries:modals.deleteConfirmation.heading") }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message attached negative>
                                    { t("functionLibraries:modals.deleteConfirmation.message") }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content>
                                    { t("functionLibraries:modals.deleteConfirmation.content",
                                        { name: deletingFunctionLibrary?.name }) }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                        ) }
                    </ListLayout>
                )
                : (
                    <EmptyPlaceholder
                        action={ (
                            <Show when={ featureConfig?.functionLibraries?.scopes?.create }>
                                <PrimaryButton onClick={ onAddNewFunctionLibrary }>
                                    <Icon name="add" />
                                    { t("functionLibraries:list.emptyPlaceholder.action") }
                                </PrimaryButton>
                            </Show>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("functionLibraries:list.emptyPlaceholder.title") }
                        subtitle={ [ t("functionLibraries:list.emptyPlaceholder.subtitle") ] }
                        data-componentid={ `${ componentId }-empty-placeholder` }
                    />
                )
            }
        </GridLayout>
    );
};

FunctionLibrariesList.defaultProps = {
    "data-componentid": FUNCTION_LIBRARIES_LIST
};

export default FunctionLibrariesList;
