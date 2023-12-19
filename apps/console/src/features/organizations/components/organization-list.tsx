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

import { BasicUserInfo } from "@asgardeo/auth-react";
import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    Popup,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import { organizationConfigs } from "../../../extensions";
import useSignIn from "../../authentication/hooks/use-sign-in";
import useAuthorization from "../../authorization/hooks/use-authorization";
import {
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import { getEmptyPlaceholderIllustrations } from "../../core/configs/ui";
import { deleteOrganization, useGetOrganizationBreadCrumb } from "../api";
import { OrganizationIcon } from "../configs";
import { OrganizationManagementConstants } from "../constants";
import useOrganizationSwitch from "../hooks/use-organization-switch";
import { GenericOrganization, OrganizationInterface, OrganizationListInterface } from "../models";

/**
 *
 * Proptypes for the organizations list component.
 */
export interface OrganizationListPropsInterface
    extends LoadableComponentInterface,
    IdentifiableComponentInterface {
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Organization list.
     */
    list: OrganizationListInterface;
    /**
     * Authorized Organization list.
     */
    authorizedList?: OrganizationListInterface;
    /**
     * On organization delete callback.
     */
    onOrganizationDelete?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, organization: OrganizationInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Callback to be fired when the list is mutated.
     */
    onListMutate: () => void;
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
     * Current parent organization.
     */
    parentOrganization: OrganizationInterface;
    /**
     * Show sign on methods condition
     */
    isSetStrongerAuth?: boolean;
    /**
     * Is the list rendered on a portal.
     */
    isRenderedOnPortal?: boolean;
}

/**
 * Organization list component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const OrganizationList: FunctionComponent<OrganizationListPropsInterface> = (
    props: OrganizationListPropsInterface
): ReactElement => {
    const {
        defaultListItemLimit,
        isLoading,
        list,
        authorizedList,
        onOrganizationDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        onListMutate,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        parentOrganization,
        isSetStrongerAuth,
        isRenderedOnPortal,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const { onSignIn } = useSignIn();

    const { switchOrganization, switchOrganizationInLegacyMode } = useOrganizationSwitch();

    const { legacyAuthzRuntime }  = useAuthorization();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const isFirstLevelOrg: boolean = useSelector(
        (state: AppState) => state?.organization?.isFirstLevelOrganization
    );
    const tenantDomain: string = useSelector(
        (state: AppState) => state?.auth?.tenantDomain
    );

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingOrganization, setDeletingOrganization ] = useState<OrganizationInterface>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const shouldSendRequest: boolean = useMemo(() => {
        return (
            isFirstLevelOrg ||
            window[ "AppUtils" ].getConfig().organizationName ||
            tenantDomain === AppConstants.getSuperTenant()
        );
    }, [ isFirstLevelOrg, tenantDomain ]);

    const { data: breadcrumbList, mutate: mutateOrganizationBreadCrumbFetchRequest } = useGetOrganizationBreadCrumb(
        shouldSendRequest
    );

    /**
     * Redirects to the organizations edit page when the edit button is clicked.
     *
     * @param organizationId - Organization id.
     */
    const handleOrganizationEdit = (organizationId: string): void => {
        history.push({
            pathname: AppConstants.getPaths()
                .get("ORGANIZATION_UPDATE")
                .replace(":id", organizationId)
        });
    };

    /**
     * Deletes an organization when the delete organization button is clicked.
     *
     * @param organizationId - Organization id.
     */
    const handleOrganizationDelete = (organizationId: string): void => {
        deleteOrganization(organizationId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success" +
                            ".description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.success.message"
                        )
                    })
                );

                setShowDeleteConfirmationModal(false);
                onOrganizationDelete();
            })
            .catch((error: AxiosError) => {
                setShowDeleteConfirmationModal(false);
                if (error.response && error.response.data && error.response.data.description) {
                    if (error.response.data.code === "ORG-60007") {
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:manage.features.organizations.notifications." +
                                    "deleteOrganizationWithSubOrganizationError",
                                    { organizationName: deletingOrganization.name }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:manage.features.organizations.notifications.deleteOrganization.error" +
                                    ".message"
                                )
                            })
                        );

                        return;
                    }

                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.organizations.notifications.deleteOrganization.error" +
                                ".message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.organizations.notifications.deleteOrganization" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.organizations.notifications.deleteOrganization.genericError" +
                            ".message"
                        )
                    })
                );
            });
    };

    /**
     * The following function handles the organization switch.
     *
     * @param organization - Organization to be switch.
     */
    const handleOrganizationSwitch = async (
        organization: GenericOrganization
    ): Promise<void> => {
        if (legacyAuthzRuntime) {
            switchOrganizationInLegacyMode(breadcrumbList, organization);
        }

        let response: BasicUserInfo = null;

        try {
            response = await switchOrganization(organization.id);
            await onSignIn(response, () => null, () => null, () => null);

            onListMutate();
            mutateOrganizationBreadCrumbFetchRequest();
            history.push(AppConstants.getPaths().get("GETTING_STARTED"));
        } catch(e) {
            // TODO: Handle error
        }
    };

    /**
     * Resolves data table columns.
     *
     * @returns
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (organization: OrganizationInterface): ReactNode => {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <GenericIcon
                                defaultIcon
                                relaxed="very"
                                size="micro"
                                shape="rounded"
                                spaced="right"
                                hoverable={ false }
                                icon={ OrganizationIcon }
                            />
                            { organization.id === OrganizationManagementConstants.SUPER_ORGANIZATION_ID
                               && (< Header.Content >
                                   <Icon
                                       className="mr-2 ml-0 vertical-aligned-baseline"
                                       size="small"
                                       name="circle"
                                       color="green"
                                   />
                               </Header.Content>)
                            }
                            <Header.Content>
                                <Popup
                                    trigger={
                                        (<Icon
                                            data-componentid={ `${ componentId }-org-status-icon` }
                                            className="mr-2 ml-0 vertical-aligned-baseline"
                                            size="small"
                                            name="circle"
                                            color={ organization.status === "ACTIVE" ? "green" : "orange" }
                                        />)
                                    }
                                    content={
                                        organization.status === "ACTIVE"
                                            ? t("common:active")
                                            : t("common:disabled")
                                    }
                                    inverted
                                />
                            </Header.Content>
                            <Header.Content>
                                { organization.name }
                                <Header.Subheader
                                    className="truncate ellipsis"
                                    data-componentid={ `${ componentId }-item-sub-heading` }
                                >
                                    Organization Id:<Label size="tiny">{ organization.id }</Label>
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.organizations.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.organizations.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        return [
            organizationConfigs.allowNavigationInDropdown && {
                "data-componentid": `${ componentId }-item-go-to-organization-button`,
                icon: (): SemanticICONS => {
                    return "arrow alternate circle right";
                },
                onClick: (e: SyntheticEvent, organization: OrganizationInterface): void =>
                    onListItemClick && onListItemClick(e, organization),
                popupText: () => t("common:view"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-switch-button`,
                hidden: (organization: OrganizationInterface): boolean => {

                    let isAuthorized: boolean = false;
                    const isActive: boolean = organization.status === "ACTIVE";

                    authorizedList?.organizations?.map((org: OrganizationInterface) => {
                        if (org.id === organization.id) {
                            isAuthorized = true;
                        }
                    });

                    return !isFeatureEnabled(
                        featureConfig?.organizations,
                        OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_UPDATE"))
                        || !isAuthorized
                        || !isActive;
                },
                icon: (): SemanticICONS => "exchange",
                onClick: (event: SyntheticEvent, organization: OrganizationInterface) => {
                    event.stopPropagation();
                    handleOrganizationSwitch && handleOrganizationSwitch(organization);
                },
                popupText: (): string => t("common:switch"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-edit-button`,
                hidden: (): boolean =>
                    !isFeatureEnabled(
                        featureConfig?.organizations,
                        OrganizationManagementConstants.FEATURE_DICTIONARY.get("ORGANIZATION_UPDATE")
                    ),
                icon: (organization: OrganizationInterface): SemanticICONS => {

                    let isAuthorized: boolean = false;

                    authorizedList?.organizations?.map((org: OrganizationInterface) => {
                        if (org.id === organization.id) {
                            isAuthorized = true;
                        }
                    });

                    return !hasRequiredScopes(
                        featureConfig?.organizations,
                        featureConfig?.organizations?.scopes?.update,
                        allowedScopes
                    ) || !isAuthorized
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, organization: OrganizationInterface): void =>
                    handleOrganizationEdit(organization.id),
                popupText: (organization: OrganizationInterface ): string => {

                    let isAuthorized: boolean = false;

                    authorizedList?.organizations?.map((org: OrganizationInterface) => {
                        if (org.id === organization.id) {
                            isAuthorized = true;
                        }
                    });

                    return !hasRequiredScopes(
                        featureConfig?.organizations,
                        featureConfig?.organizations?.scopes?.update,
                        allowedScopes
                    ) || !isAuthorized
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ componentId }-item-delete-button`,
                hidden: (organization: OrganizationInterface): boolean => {

                    let isAuthorized: boolean = false;

                    authorizedList?.organizations?.map((org: OrganizationInterface) => {
                        if (org.id === organization.id) {
                            isAuthorized = true;
                        }
                    });

                    return !hasRequiredScopes(
                        featureConfig?.organizations,
                        featureConfig?.organizations?.scopes?.delete,
                        allowedScopes
                    ) || !isAuthorized;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, organization: OrganizationInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingOrganization(organization);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns
     */
    const showPlaceholders = (): ReactElement => {
        if (searchQuery && (isEmpty(list) || list?.organizations?.length === 0)) {
            return (
                <EmptyPlaceholder
                    action={
                        (<LinkButton onClick={ onSearchQueryClear }>
                            { t("console:manage.placeholders.emptySearchResult.action") }
                        </LinkButton>)
                    }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:manage.placeholders.emptySearchResult.subtitles.0", {
                            // searchQuery looks like "name co OrgName", so we only remove the filter string only to get
                            // the actual user entered query
                            query: searchQuery.split("name co ")[1]
                        }),
                        t("console:manage.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        // When the search returns empty.
        if (isEmpty(list) || list?.organizations?.length === 0) {
            return (
                <EmptyPlaceholder
                    className={ !isRenderedOnPortal ? "list-placeholder mr-0" : "" }
                    action={
                        onEmptyListPlaceholderActionClick && (
                            <Show when={ AccessControlConstants.ORGANIZATION_WRITE }>
                                <PrimaryButton
                                    disabled={ parentOrganization?.status === "DISABLED" }
                                    onClick={ () => {
                                        eventPublisher.publish(componentId + "-click-new-organization-button");
                                        onEmptyListPlaceholderActionClick();
                                    } }
                                >
                                    <Icon name="add" />
                                    { t("console:manage.features.organizations.placeholders.emptyList.action") }
                                </PrimaryButton>
                            </Show>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        parentOrganization
                            ? t("console:manage.features.organizations.placeholders.emptyList.subtitles.3",
                                { parent: parentOrganization.name })
                            : t("console:manage.features.organizations.placeholders.emptyList.subtitles.0")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<OrganizationInterface>
                className="organizations-table"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ !isSetStrongerAuth && resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list?.organizations }
                onRowClick={ (e: SyntheticEvent, organization: OrganizationInterface): void => {
                    organizationConfigs.allowNavigationInDropdown
                        ? onListItemClick && onListItemClick(e, organization)
                        : handleOrganizationEdit(organization.id);
                }
                }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && showPlaceholders() !== null }
                data-componentid={ componentId }
            />
            { deletingOrganization && (
                <ConfirmationModal
                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t(
                        "console:manage.features.organizations.confirmations.deleteOrganization." + "assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                    } }
                    onPrimaryActionClick={ (): void => handleOrganizationDelete(deletingOrganization.id) }
                    data-componentid={ `${ componentId }-delete-confirmation-modal` }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${ componentId }-delete-confirmation-modal-header` }>
                        { t("console:manage.features.organizations.confirmations.deleteOrganization.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                    >
                        { t("console:manage.features.organizations.confirmations.deleteOrganization.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${ componentId }-delete-confirmation-modal-content` }>
                        { t("console:manage.features.organizations.confirmations.deleteOrganization.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

/**
 * Default props for the component.
 */
OrganizationList.defaultProps = {
    "data-componentid": "organization-list",
    selection: true,
    showListItemActions: true
};
