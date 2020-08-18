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
import { LoadableComponentInterface, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { CommonUtils } from "@wso2is/core/utils";
import {
    AnimatedAvatar,
    ConfirmationModal,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList,
    ResourceListActionInterface,
    ResourceListItem
} from "@wso2is/react-components";
import React, { ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon, Image, Label, ListItemProps, SemanticWIDTHS } from "semantic-ui-react";
import { AppConstants, AppState, EmptyPlaceholderIllustrations, FeatureConfigInterface, history } from "../../core";
import { GroupConstants } from "../constants";
import { GroupsInterface } from "../models";

interface GroupListProps extends SBACInterface<FeatureConfigInterface>,
    LoadableComponentInterface, TestableComponentInterface {
    /**
     * Width of the action panel column.
     */
    actionsColumnWidth?: SemanticWIDTHS;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Groups list.
     */
    groupList: GroupsInterface[];
    /**
     * Group delete callback.
     * @param {GroupsInterface} group - Deleting group.
     */
    handleGroupDelete?: (group: GroupsInterface) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Width of the description area.
     */
    descriptionColumnWidth?: SemanticWIDTHS;
    /**
     * Width of the meta info area.
     */
    metaColumnWidth?: SemanticWIDTHS;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
}

/**
 * List component for Group Management list
 *
 * @param props contains the role list as a prop to populate
 */
export const GroupList: React.FunctionComponent<GroupListProps> = (props: GroupListProps): ReactElement => {

    const {
        actionsColumnWidth,
        descriptionColumnWidth,
        defaultListItemLimit,
        handleGroupDelete,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        groupList,
        metaColumnWidth,
        selection,
        searchQuery,
        showListItemActions,
        showMetaContent,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    const [ showGroupDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedGroup, setCurrentDeletedGroup ] = useState<GroupsInterface>();

    const handleGroupEdit = (groupId: string) => {
        history.push(AppConstants.PATHS.get("GROUP_EDIT").replace(":id", groupId));
    };

    /**
     * Util method to generate listing header content.
     *
     * @param displayName - display name of the group
     *
     * @returns - React element if containing a prefix or the string
     */
    const generateHeaderContent = (displayName: string): ReactElement | string => {
        if (displayName.indexOf("/") !== -1){
            return (
                <>
                    <Label
                        data-testid={ `${ testId }-group-${ displayName.split("/")[0] }-label` }
                        content={ displayName.split("/")[0] }
                        size="mini"
                        color="olive"
                        className={ "group-label" }
                    />
                    { "/ " + displayName.split("/")[1] }
                </>
            )
        } else {
            return (
                <>
                    <Label
                        data-testid={ `${ testId }-group-${ displayName }-label` }
                        content={ "Primary" }
                        size="mini"
                        color="teal"
                        className={ "primary-label" }
                    />
                    { "/ " + displayName }
                </>
            );
        }
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ testId }-search-empty-placeholder-clear-button` }
                            onClick={ onSearchQueryClear }
                        >
                            { t("adminPortal:components.roles.list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("adminPortal:components.roles.list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("adminPortal:components.roles.list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("adminPortal:components.roles.list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (groupList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-list-empty-placeholder` }
                    action={ (
                        <PrimaryButton
                            data-testid={ `${ testId }-empty-list-empty-placeholder-add-button` }
                            onClick={ onEmptyListPlaceholderActionClick }
                        >
                            <Icon name="add"/>
                            { t("adminPortal:components.roles.list.emptyPlaceholders.emptyRoleList.action",
                                { type: "Group" })}
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ t("adminPortal:components.roles.list.emptyPlaceholders.emptyRoleList.title",
                        { type: "group" }) }
                    subtitle={ [
                        t("adminPortal:components.roles.list.emptyPlaceholders.emptyRoleList.subtitles.0",
                            { type: "groups" }),
                        t("adminPortal:components.roles.list.emptyPlaceholders.emptyRoleList.subtitles.1",
                            { type: "group" }),
                        t("adminPortal:components.roles.list.emptyPlaceholders.emptyRoleList.subtitles.2",
                            { type: "group" })
                    ] }
                />
            );
        }

        return null;
    };

    /**
     * Resolves list item actions based on user store mutability and app configs.
     *
     * @param group - Group details.
     *
     * @return {ResourceListActionInterface[]} Resolved list actions.
     */
    const resolveListItemActions = (group): ResourceListActionInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const userStore = group?.displayName?.split("/").length > 1 ? group?.displayName?.split("/")[0] : "PRIMARY";

        const actions: ResourceListActionInterface[] = [
            {
                "data-testid": `${ testId }-edit-group-${ group?.displayName }-button`,
                hidden: false,
                icon: !isFeatureEnabled(
                    featureConfig?.groups,
                    GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
                || readOnlyUserStores?.includes(userStore.toString())
                    ? "eye" : "pencil alternate",
                onClick: (): void => handleGroupEdit(group.id),
                popupText: !isFeatureEnabled(
                    featureConfig?.groups,
                    GroupConstants.FEATURE_DICTIONARY.get("GROUP_UPDATE"))
                || readOnlyUserStores?.includes(userStore.toString())
                    ? t("common:view")
                    : t("common:edit"),
                type: "button"
            }
        ];

        actions.push({
            "data-testid": `${ testId }-delete-group-${ group?.displayName }-button`,
            hidden: !hasRequiredScopes(
                featureConfig?.groups,
                featureConfig?.groups?.scopes?.delete, allowedScopes)
                || readOnlyUserStores?.includes(userStore.toString()),
            icon: "trash alternate",
            onClick: (): void => {
                setCurrentDeletedGroup(group);
                setShowDeleteConfirmationModal(!showGroupDeleteConfirmation);
            },
            popupText: t("adminPortal:components.roles.list.popups.delete",
                { type: "Group" }),
            type: "button"
        });

        return actions;
    };

    return (
        <>
            <ResourceList
                className="roles-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit,
                    imageType: "square"
                } }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
                selection={ selection }
            >
                {
                    groupList && groupList instanceof Array && groupList.length > 0
                        ? groupList.map((group, index) => (
                            <ResourceListItem
                                data-testid={ `${ testId }-list-item-${ group?.displayName }` }
                                key={ index }
                                actionsFloated="right"
                                actions={ resolveListItemActions(group) }
                                avatar={ (
                                    <Image
                                        floated="left"
                                        verticalAlign="middle"
                                        rounded
                                        centered
                                        size="mini"
                                    >
                                        <AnimatedAvatar/>
                                        <span className="claims-letter">
                                            { group.displayName[ 0 ].toLocaleUpperCase() }
                                        </span>
                                    </Image>
                                ) }
                                itemHeader={ generateHeaderContent(group.displayName) }
                                metaContent={
                                    showMetaContent
                                        ? CommonUtils.humanizeDateDifference(group.meta.created)
                                        : null
                                }
                                metaColumnWidth={ metaColumnWidth }
                                descriptionColumnWidth={ descriptionColumnWidth }
                                actionsColumnWidth={ actionsColumnWidth }
                                onClick={
                                    (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                                        if (!selection) {
                                            return;
                                        }

                                        handleGroupEdit(group.id);
                                        onListItemClick(event, data);
                                    }
                                }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
            {
                showGroupDeleteConfirmation &&
                <ConfirmationModal
                    data-testid={ `${ testId }-delete-item-confirmation-modal` }
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="warning"
                    open={ showGroupDeleteConfirmation }
                    assertion={ currentDeletedGroup.displayName }
                    assertionHint={
                        (
                            <p>
                                <Trans
                                    i18nKey={ "adminPortal:components.roles.list.confirmations.deleteItem." +
                                    "assertionHint" }
                                    tOptions={ { roleName: currentDeletedGroup.displayName } }
                                >
                                    Please type <strong>{ currentDeletedGroup.displayName }</strong> to confirm.
                                </Trans>
                            </p>
                        )
                    }
                    assertionType="input"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                    onPrimaryActionClick={ (): void => {
                        handleGroupDelete(currentDeletedGroup);
                        setShowDeleteConfirmationModal(false);
                    } }
                >
                    <ConfirmationModal.Header>
                        { t("adminPortal:components.roles.list.confirmations.deleteItem.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        { t("adminPortal:components.roles.list.confirmations.deleteItem.message",
                            { type: "group" }) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("adminPortal:components.roles.list.confirmations.deleteItem.content",
                            { type: "group" }) }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            }
        </>
    );
};

/**
 * Default props for the component.
 */
GroupList.defaultProps = {
    actionsColumnWidth: 3,
    descriptionColumnWidth: 3,
    metaColumnWidth: 10,
    selection: false,
    showListItemActions: true,
    showMetaContent: true
};
