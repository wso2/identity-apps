/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { AlertLevels, LoadableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AppAvatar,
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList,
    ResourceListActionInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Label } from "semantic-ui-react";
import { deleteApplication } from "../../api";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { ApplicationManagementConstants, UIConstants } from "../../constants";
import { history } from "../../helpers";
import {
    ApplicationListInterface,
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface,
    ConfigReducerStateInterface,
    FeatureConfigInterface
} from "../../models";
import { AppState } from "../../store";
import { ApplicationManagementUtils } from "../../utils";

/**
 *
 * Proptypes for the applications list component.
 */
interface ApplicationListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface {
    /**
     * Application list.
     */
    list: ApplicationListInterface;
    /**
     * On application delete callback.
     */
    onApplicationDelete: () => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
}

/**
 * Application list component.
 *
 * @param {ApplicationListPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ApplicationList: FunctionComponent<ApplicationListPropsInterface> = (
    props: ApplicationListPropsInterface
): ReactElement => {

    const {
        featureConfig,
        isLoading,
        list,
        onApplicationDelete,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery
    } = props;

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingApplication, setDeletingApplication ] = useState<ApplicationListItemInterface>(undefined);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Fetch the application templates if list is not available in redux.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates ]);

    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param {string} appId - Application id.
     */
    const handleApplicationEdit = (appId: string): void => {
        history.push(`applications/${ appId }`);
    };

    /**
     * Deletes an application when the delete application button is clicked.
     *
     * @param {string} appId - Application id.
     */
    const handleApplicationDelete = (appId: string): void => {
        deleteApplication(appId)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully deleted the application",
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                setShowDeleteConfirmationModal(false);
                onApplicationDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Delete Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting the application",
                    level: AlertLevels.ERROR,
                    message: "Application Delete Error"
                }));
            });
    };

    /**
     * Resolves list item actions based on the app config.
     *
     * @param {ApplicationListItemInterface} app - Application derails.
     *
     * @return {ResourceListActionInterface[]} Resolved list actions.
     */
    const resolveListActions = (app: ApplicationListItemInterface): ResourceListActionInterface[] => {
        const actions: ResourceListActionInterface[] = [
            {
                hidden: !isFeatureEnabled(
                    featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: "pencil alternate",
                onClick: (): void => handleApplicationEdit(app.id),
                popupText: "Edit",
                type: "button"
            }
        ];

        actions.push({
            hidden: !hasRequiredScopes(
                featureConfig?.applications,
                featureConfig?.applications?.scopes?.delete)
                || config.ui.doNotDeleteApplications.includes(app.name),
            icon: "trash alternate",
            onClick: (): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingApplication(app);
            },
            popupText: "Delete",
            type: "button"
        });

        return actions;
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ "No results found" }
                    subtitle={ [
                        `We couldn't find any results for ${ searchQuery }`,
                        "Please try a different search term."
                    ] }
                />
            );
        }

        if (list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add"/>
                            New Application
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ "Add a new Application" }
                    subtitle={ [
                        "Currently there are no applications available.",
                        "You can add a new application easily by following the",
                        "steps in the application creation wizard."
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="applications-list"
                isLoading={ isLoading || isApplicationTemplateRequestLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
            >
                {
                    list?.applications && list.applications instanceof Array && list.applications.length > 0
                        ? list.applications.map((app: ApplicationListItemInterface, index: number) => {

                            const [
                                templateName,
                                description
                            ] = ApplicationManagementUtils.resolveApplicationTemplateNameInDescription(
                                app.description);

                            // TODO Remove this check and move the logic to backend.
                            if ("wso2carbon-local-sp" !== app.name) {
                                return (
                                    <ResourceList.Item
                                        key={ index }
                                        actions={ resolveListActions(app) }
                                        actionsFloated="right"
                                        avatar={ (
                                            <AppAvatar
                                                name={ app.name }
                                                image={ app.image }
                                                size="mini"
                                                floated="left"
                                            />
                                        ) }
                                        itemHeader={ app.name }
                                        itemDescription={ (
                                            <>
                                                {
                                                    templateName
                                                    && applicationTemplates
                                                    && applicationTemplates instanceof Array
                                                    && applicationTemplates
                                                        .find((template) => template.name === templateName)
                                                    && (
                                                        <Label size="mini" className="compact spaced-right">
                                                            { templateName }
                                                        </Label>
                                                    )
                                                }
                                                { description }
                                            </>
                                        ) }
                                    />
                                );
                            }
                        })
                        : showPlaceholders()
                }
            </ResourceList>
            {
                deletingApplication && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingApplication.name }
                        assertionHint={ <p>Please type <strong>{ deletingApplication.name }</strong> to confirm.</p> }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationDelete(deletingApplication.id) }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the application.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this application, you will not be able to get it back. All the applications
                            depending on this also might stop working. Please proceed with caution.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
