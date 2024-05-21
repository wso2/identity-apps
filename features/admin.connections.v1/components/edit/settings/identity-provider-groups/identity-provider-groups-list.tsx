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

import { Show } from "@wso2is/access-control";
import { FeatureConfigInterface, UIConstants, getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React,
{
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Input, SemanticICONS } from "semantic-ui-react";
import { CreateIdPGroupWizard } from "./create-identity-provider-group-wizard";
import { updateConnectionGroup, useConnectionGroups } from "../../../../api/connections";
import { ConnectionGroupInterface } from "../../../../models/connection";

/**
 * Proptypes for the identity provider groups component.
 */
interface IdentityProviderGroupsPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Scopes allowed for the user.
     */
    allowedScopes: string;
    /**
     * IDP Id.
     */
    idpId: string;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Flag to show/hide the group list loader.
     */
    isGroupListLoading: boolean;
}

/**
 * Identity provider groups list component.
 *
 * @param props - Props related to identity provider groups list component.
 */
export const IdentityProviderGroupsList: FunctionComponent<IdentityProviderGroupsPropsInterface> = (
    props: IdentityProviderGroupsPropsInterface
): ReactElement => {

    const {
        allowedScopes,
        featureConfig,
        readOnly,
        idpId,
        isGroupListLoading,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isOpenDeleteConfirmationModal, setIsOpenDeleteConfirmationModal ] = useState<boolean>(false);
    const [ groupsList, setGroupsList ] = useState<ConnectionGroupInterface[]>([]);
    const [ deleteGroup, setDeleteGroup ] = useState<ConnectionGroupInterface>(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const {
        data: originalIdentityProviderGroups,
        isLoading: isIdentityProviderGroupsFetchRequestLoading,
        mutate: mutateIdentityProviderGroupsFetchRequest,
        error: identityProviderGroupsFetchRequestError
    } = useConnectionGroups(idpId);

    useEffect(() => {
        if (originalIdentityProviderGroups instanceof IdentityAppsApiException
                || identityProviderGroupsFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalIdentityProviderGroups) {
            return;
        }

        setGroupsList(originalIdentityProviderGroups);
    }, [ originalIdentityProviderGroups ]);

    useEffect(() => {
        if (searchQuery) {
            // search groups by name
            const filteredGroups: ConnectionGroupInterface[] = originalIdentityProviderGroups?.filter(
                (group: ConnectionGroupInterface) => {
                    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
                });

            setGroupsList(filteredGroups);

            return;
        }

        setGroupsList(originalIdentityProviderGroups);
    }, [ searchQuery ]);

    /**
     * Displays the error banner when unable to fetch identity provider groups.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("extensions:console.identityProviderGroups.groupsList.notifications.fetchGroups." +
                    "genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.identityProviderGroups.groupsList.notifications.fetchGroups." +
                    "genericError.message")
            })
        );
    };

    /**
     * Handles the delete group action.
     */
    const handleDeleteGroup = (): Promise<any> => {
        const newIdpGroupList: ConnectionGroupInterface[] = [
            ...groupsList.filter((group: ConnectionGroupInterface) => group.id !== deleteGroup.id)
        ];

        return updateConnectionGroup(idpId, newIdpGroupList)
            .then(() => {
                dispatch(addAlert({
                    description: t("extensions:console.identityProviderGroups.groupsList.notifications.deleteGroup." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:console.identityProviderGroups.groupsList.notifications.deleteGroup." +
                        "success.message")
                }));
                mutateIdentityProviderGroupsFetchRequest();

                return Promise.resolve();
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("extensions:console.identityProviderGroups.groupsList.notifications.deleteGroup." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:console.identityProviderGroups.groupsList.notifications.deleteGroup." +
                        "genericError.message")
                }));

                return Promise.reject();
            });
    };

    /**
     * Shows list placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && groupsList?.length === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${ componentId }-search-empty-placeholder` }
                    action={ (
                        <LinkButton
                            data-testid={ `${ componentId }-search-empty-placeholder-clear-button` }
                            onClick={ () => setSearchQuery("") }
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

        if (groupsList?.length === 0) {
            if (hasRequiredScopes(featureConfig?.groups, featureConfig?.groups?.scopes?.create, allowedScopes)) {
                return (
                    <EmptyPlaceholder
                        data-testid={ `${ componentId }-empty-list-empty-placeholder` }
                        action={ (
                            <PrimaryButton
                                data-testid={ `${ componentId }-empty-list-empty-placeholder-add-button` }
                                onClick={ () => setShowWizard(true) }
                            >
                                <Icon name="add"/>
                                { t("roles:list.emptyPlaceholders.emptyRoleList.action",
                                    { type: "Group" }) }
                            </PrimaryButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("extensions:console.applicationRoles.connectorGroups.placeholder.title") }
                        subtitle={
                            [
                                t("extensions:console.applicationRoles.connectorGroups.placeholder.subTitle.0"),
                                t("extensions:console.applicationRoles.connectorGroups.placeholder.subTitle.1")
                            ]
                        }
                    />
                );
            } else {
                return (
                    <EmptyPlaceholder
                        data-testid={ `${ componentId }-empty-list-empty-placeholder` }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("extensions:console.identityProviderGroups.groupsList.noGroupsAvailable") }
                        subtitle={ [
                            t("roles:list.emptyPlaceholders.emptyRoleList.subtitles.0",
                                { type: "groups" })
                        ] }
                    />
                );
            }
        }

        return null;
    };

    /**
     * Resolves data table actions.
     *
     * @returns - The table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {

        const actions: TableActionsInterface[] = [ {
            hidden: (): boolean => {
                return !hasRequiredScopes(
                    featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.update, allowedScopes) || readOnly;
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, group: ConnectionGroupInterface): void => {
                setDeleteGroup(group);
                setIsOpenDeleteConfirmationModal(true);
            },
            popupText: (): string => I18n.instance.t("common:delete"),
            renderer: "semantic-icon"
        } ];

        return actions;
    };

    /**
     * Resolves data table columns.
     *
     * @returns - The table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (group: ConnectionGroupInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ componentId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ group.name }
                                    size="mini"
                                    data-testid={ `${ componentId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ componentId }-item-image` }
                        />
                        <Header.Content>
                            { group.name }
                        </Header.Content>
                    </Header>
                ),
                title: null
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

    return (
        <>
            <ListLayout
                showTopActionPanel={ !isGroupListLoading && !isIdentityProviderGroupsFetchRequestLoading
                    && (!isEmpty(searchQuery) || groupsList?.length !== 0) }
                listItemLimit={ UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT }
                showPagination={ false }
                onPageChange={ () => null }
                totalPages={ Math.ceil(groupsList?.length / UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT) }
                data-componentId={ `${ componentId }-list-layout` }
                leftActionPanel={ (
                    <div className="advanced-search-wrapper aligned-left fill-default p-1 pl-3 pr-3">
                        <Input
                            className="with-add-on mt-3"
                            data-componentId={ `${ componentId }-list-search-input` }
                            icon="search"
                            iconPosition="left"
                            onChange={ (e: ChangeEvent<HTMLInputElement>)  => setSearchQuery(e.target.value) }
                            placeholder={ t("extensions:console.identityProviderGroups.groupsList.searchByName") }
                            value={ searchQuery }
                            floated="right"
                            size="small"
                            transparent
                        />
                        <Show
                            when={ featureConfig?.groups?.scopes?.create }
                        >
                            <PrimaryButton
                                data-testid="user-mgt-roles-list-update-button"
                                size="medium"
                                icon={ <Icon name="add" /> }
                                floated="right"
                                onClick={ () => setShowWizard(true) }
                            >
                                <Icon name="add" />
                                { t("extensions:console.identityProviderGroups.groupsList.newGroup") }
                            </PrimaryButton>
                        </Show>
                    </div>
                ) }
            >
                <DataTable<ConnectionGroupInterface[]>
                    className="idp-groups-table"
                    isLoading={ isGroupListLoading || isIdentityProviderGroupsFetchRequestLoading }
                    loadingStateOptions={ {
                        count: 1,
                        imageType: "square"
                    } }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ groupsList }
                    onRowClick={ () => null }
                    placeholders={ showPlaceholders() }
                    transparent={ null }
                    showHeader={ false }
                    data-testid={ componentId }
                />
            </ListLayout>
            <ConfirmationModal
                primaryActionLoading={ isSubmitting }
                data-componentid={ `${ componentId }-delete-confirmation-modal` }
                onClose={ (): void => setIsOpenDeleteConfirmationModal(false) }
                type="negative"
                open={ isOpenDeleteConfirmationModal }
                assertionHint={ t("extensions:develop.emailProviders.confirmationModal" +
                    ".assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setIsOpenDeleteConfirmationModal(false) }
                onPrimaryActionClick={ (): void => {
                    setIsSubmitting(true);
                    handleDeleteGroup().finally(() => {
                        setIsSubmitting(false);
                        setIsOpenDeleteConfirmationModal(false);
                    });
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
                >
                    { t("extensions:develop.emailProviders.confirmationModal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    data-componentid={
                        `${ componentId }-delete-confirmation-modal-message`
                    }
                    attached
                    negative
                >
                    { t("extensions:console.identityProviderGroups.groupsList.confirmation.deleteGroup.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("extensions:console.identityProviderGroups.groupsList.confirmation.deleteGroup.content",
                        { groupName: deleteGroup?.name }) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
            {
                showWizard && (
                    <CreateIdPGroupWizard
                        idpId={ idpId }
                        groupsList={ groupsList }
                        closeWizard={ () => setShowWizard(false) }
                        updateList={ () => mutateIdentityProviderGroupsFetchRequest() }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for identity provider groups tab component.
 */
IdentityProviderGroupsList.defaultProps = {
    "data-componentid": "identity-provider-groups-list"
};
