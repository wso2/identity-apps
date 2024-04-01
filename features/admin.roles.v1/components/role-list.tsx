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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { RoleConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    FeatureAccessConfigInterface,
    LoadableComponentInterface,
    RoleListInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    DataTablePropsInterface,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import moment from "moment";
import React, { ReactElement, ReactNode, SyntheticEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../admin.core.v1";
import { APPLICATION_DOMAIN, RoleConstants as LocalRoleConstants } from "../constants/role-constants";

interface RoleListProps extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Flag for Group list.
     */
    isGroup: boolean;
    /**
     * Roles list.
     */
    roleList: RoleListInterface;
    /**
     * Role delete callback.
     * @param role - Deleting role.
     */
    handleRoleDelete?: (role: RolesInterface) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, role: RolesInterface) => void;
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
     * Show/Hide header cells.
     */
    showHeader?: DataTablePropsInterface["showHeader"];
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Show/Hide role type label.
     */
    showRoleType?: boolean;
}

/**
 * List component for Role Management list
 *
 * @param props - contains the role list as a prop to populate
 */
export const RoleList: React.FunctionComponent<RoleListProps> = (props: RoleListProps): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        handleRoleDelete,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        roleList,
        selection,
        searchQuery,
        showListItemActions,
        showMetaContent,
        showHeader,
        showRoleType,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userV1Roles);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ showRoleDeleteConfirmation, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ currentDeletedRole, setCurrentDeletedRole ] = useState<RolesInterface>();

    const isReadOnly: boolean = useMemo(() => {
        return !isFeatureEnabled(featureConfig,
            LocalRoleConstants.FEATURE_DICTIONARY.get("ROLE_UPDATE")) ||
            !hasRequiredScopes(featureConfig,
                featureConfig?.scopes?.update, allowedScopes);
    }, [ featureConfig, allowedScopes ]);

    const handleRoleEdit = (roleId: string) => {
        history.push(AppConstants.getPaths().get("ROLE_EDIT").replace(":id", roleId));
    };

    /**
     * Util method to generate listing header content.
     *
     * @param displayName - display name of the role/group
     *
     * @returns - React element if containing a prefix or the string
     */
    const generateHeaderContent = (displayName: string): ReactElement | string => {

        if (displayName.includes(APPLICATION_DOMAIN)) {

            // Show only the role name.
            if (!showRoleType) {
                return displayName.split("/")[ 1 ];
            }

            // Show role name with type label.
            return (
                <>
                    <Label
                        data-testid={ `${ testId }-role-${ displayName.split("/")[ 1 ] }-label` }
                        content={ "Application" }
                        size="mini"
                        className={ "application-label" }
                    />
                    { "/ " + displayName.split("/")[ 1 ] }
                </>
            );
        }

        // Show only the role name.
        if (!showRoleType) {
            return displayName;
        }

        // Show role name with type label.
        return (
            <>
                <Label
                    data-testid={ `${ testId }-role-${ displayName }-label` }
                    content={ "Internal" }
                    size="mini"
                    className={ "internal-label" }
                />
                { "/ " + displayName }
            </>
        );
    };

    /**
     * Shows list placeholders.
     *
     * @returns List placeholders.
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
                            { t("roles:list.emptyPlaceholders.search.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("roles:list.emptyPlaceholders.search.title") }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.search.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("roles:list.emptyPlaceholders.search.subtitles.1")
                    ] }
                />
            );
        }

        if (roleList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ testId }-empty-list-empty-placeholder` }
                    action={ (
                        <Show when={ AccessControlConstants.ROLE_WRITE }>
                            <PrimaryButton
                                data-testid={ `${ testId }-empty-list-empty-placeholder-add-button` }
                                onClick={ onEmptyListPlaceholderActionClick }
                            >
                                <Icon name="add"/>
                                { t("roles:list.emptyPlaceholders.emptyRoleList.action",
                                    { type: "Role" }) }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("roles:list.emptyPlaceholders.emptyRoleList.title",
                        { type: "role" }) }
                    subtitle={ [
                        t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0",
                            { type: "roles" }),
                        t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.1",
                            { type: "role" }),
                        t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.2",
                            { type: "role" })
                    ] }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (role: RolesInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ role?.displayName[ 0 ] }
                                    size="mini"
                                    data-testid={ `${ testId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { generateHeaderContent(role?.displayName) }
                        </Header.Content>
                    </Header>
                ),
                title: t("roles:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "lastModified",
                hidden: !showMetaContent,
                id: "lastModified",
                key: "lastModified",
                render: (role: RolesInterface) => {
                    const now: moment.Moment = moment(new Date());
                    const receivedDate: moment.Moment = moment(role?.meta?.created);

                    return t("console:common.dateTime.humanizedDateString", {
                        date: moment.duration(now.diff(receivedDate)).humanize()
                    });
                },
                title: t("roles:list.columns.lastModified")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            {
                icon: (): SemanticICONS =>
                    !isReadOnly
                        ? "pencil alternate"
                        : "eye",
                onClick: (e: SyntheticEvent, role: RolesInterface): void =>
                    !isReadOnly && handleRoleEdit(role?.id),
                popupText: (): string =>
                    !isReadOnly
                        ? t("roles:list.popups.edit",
                            { type: "Role" })
                        : t("common:view"),
                renderer: "semantic-icon"
            },
            {
                hidden: (role: RolesInterface) => (role?.displayName === RoleConstants.ADMIN_ROLE ||
                    role?.displayName === RoleConstants.ADMIN_GROUP)
                    || !isFeatureEnabled(featureConfig, LocalRoleConstants.FEATURE_DICTIONARY.get("ROLE_DELETE"))
                    || !hasRequiredScopes(featureConfig, featureConfig?.scopes?.delete, allowedScopes),
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, role: RolesInterface): void => {
                    setCurrentDeletedRole(role);
                    setShowDeleteConfirmationModal(!showRoleDeleteConfirmation);
                },
                popupText: (): string => t("roles:list.popups.delete",
                    { type: "Role" }),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            <DataTable<RolesInterface>
                className="roles-list"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ roleList?.Resources }
                onRowClick={
                    (e: SyntheticEvent, role: RolesInterface): void => {
                        handleRoleEdit(role?.id);
                        onListItemClick && onListItemClick(e, role);
                    }
                }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ showHeader }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                showRoleDeleteConfirmation && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-delete-item-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showRoleDeleteConfirmation }
                        assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => {
                            handleRoleDelete(currentDeletedRole);
                            setShowDeleteConfirmationModal(false);
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("roles:list.confirmations.deleteItem.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached negative>
                            { t("roles:list.confirmations.deleteItem.message",
                                { type: "role" }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("roles:list.confirmations.deleteItem.content",
                                { type: "role" }) }
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
RoleList.defaultProps = {
    selection: true,
    showHeader: false,
    showListItemActions: true,
    showMetaContent: true,
    showRoleType: false
};
