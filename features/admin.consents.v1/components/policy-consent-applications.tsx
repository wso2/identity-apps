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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { useRequiredScopes } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationListInterface,
    ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    deleteConsentPolicyApps,
    saveConsentPolicyApps
} from "../api/consent-policy-apps";
import useGetConsentPolicyApps from "../hooks/use-get-consent-policy-apps";
import {
    DataTable,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    TransferComponent,
    TransferList,
    TransferListItem,
    UserAvatar
} from "@wso2is/react-components";
import React, {
    FormEvent,
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Header, Icon, Modal, PaginationProps, SemanticICONS } from "semantic-ui-react";

interface PolicyConsentApplicationsPropsInterface extends IdentifiableComponentInterface {
    purposeId?: string;
}

/**
 * Applications tab — shows which applications are linked to this consent policy.
 * Admins can assign or remove applications from the scope.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consent Applications component.
 */
export const PolicyConsentApplications: FunctionComponent<PolicyConsentApplicationsPropsInterface> = (
    props: PolicyConsentApplicationsPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "policy-consent-applications"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const hasUpdatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.update);

    const {
        data: applicationListData,
        isLoading: isApplicationListLoading
    } = useApplicationList<ApplicationListInterface>(
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        false
    );

    const allApplications: ApplicationListItemInterface[] = useMemo(
        (): ApplicationListItemInterface[] => applicationListData?.applications ?? [],
        [ applicationListData ]
    );

    // IDs of applications that have been assigned to this consent policy scope.
    const [ assignedIds, setAssignedIds ] = useState<Set<string>>(new Set<string>());
    const [ isSaving, setIsSaving ] = useState<boolean>(false);

    const {
        data: fetchedIds,
        isLoading: isConsentAppsLoading,
        error: consentAppsError
    } = useGetConsentPolicyApps(props.purposeId, !!props.purposeId && !isApplicationListLoading);

    useEffect((): void => {
        setAssignedIds(new Set<string>(fetchedIds));
    }, [ fetchedIds ]);

    useEffect((): void => {
        if (!consentAppsError) {
            return;
        }
        dispatch(addAlert({
            description: t("consents:policyConsents.notifications.update.error.description"),
            level: AlertLevels.ERROR,
            message: t("consents:policyConsents.notifications.update.error.message")
        }));
    }, [ consentAppsError ]);

    // Main list state (search + pagination over assigned apps).
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ paginatedAssigned, setPaginatedAssigned ] = useState<ApplicationListItemInterface[]>([]);

    // Assign modal state.
    const [ showAssignModal, setShowAssignModal ] = useState<boolean>(false);
    const [ modalSelectedIds, setModalSelectedIds ] = useState<Set<string>>(new Set<string>());
    const [ modalSearchQuery, setModalSearchQuery ] = useState<string>("");
    const [ isSelectAll, setIsSelectAll ] = useState<boolean>(false);

    const assignedApplications: ApplicationListItemInterface[] = useMemo(
        (): ApplicationListItemInterface[] =>
            allApplications.filter((app: ApplicationListItemInterface): boolean => assignedIds.has(app.id)),
        [ allApplications, assignedIds ]
    );

    const unassignedApplications: ApplicationListItemInterface[] = useMemo(
        (): ApplicationListItemInterface[] =>
            allApplications.filter((app: ApplicationListItemInterface): boolean => !assignedIds.has(app.id)),
        [ allApplications, assignedIds ]
    );

    const filteredModalApps: ApplicationListItemInterface[] = useMemo(
        (): ApplicationListItemInterface[] => {
            if (!modalSearchQuery) {
                return unassignedApplications;
            }

            return unassignedApplications.filter(
                (app: ApplicationListItemInterface): boolean =>
                    app.name.toLowerCase().includes(modalSearchQuery.toLowerCase())
            );
        },
        [ unassignedApplications, modalSearchQuery ]
    );

    const filteredAssigned: ApplicationListItemInterface[] = useMemo(
        (): ApplicationListItemInterface[] => {
            if (!searchQuery) {
                return assignedApplications;
            }

            return assignedApplications.filter(
                (app: ApplicationListItemInterface): boolean =>
                    app.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        },
        [ assignedApplications, searchQuery ]
    );

    useEffect((): void => {
        setPaginatedAssigned(filteredAssigned.slice(listOffset, listOffset + listItemLimit));
    }, [ filteredAssigned, listOffset, listItemLimit ]);

    const persistAssignments = async (nextIds: Set<string>): Promise<void> => {
        if (!props.purposeId) {
            return;
        }

        try {
            if (nextIds.size === 0) {
                await deleteConsentPolicyApps(props.purposeId);
            } else {
                await saveConsentPolicyApps(props.purposeId, Array.from(nextIds));
            }
        } catch (error: unknown) {
            dispatch(addAlert({
                description: t("consents:policyConsents.notifications.update.error.description"),
                level: AlertLevels.ERROR,
                message: t("consents:policyConsents.notifications.update.error.message")
            }));
            throw error;
        }
    };

    const handleRemoveApplication: (_app: ApplicationListItemInterface) => Promise<void> = useCallback(
        async (_app: ApplicationListItemInterface): Promise<void> => {
            const prev: Set<string> = new Set<string>(assignedIds);
            const next: Set<string> = new Set<string>(prev);

            next.delete(_app.id);
            setAssignedIds(next);

            try {
                await persistAssignments(next);
            } catch {
                setAssignedIds(prev);
            }
        }, [ assignedIds, props.purposeId ]);

    const handleSearchQueryClear = (): void => {
        setSearchQuery("");
        setTriggerClearQuery((prev: boolean): boolean => !prev);
        setListOffset(0);
    };

    const handlePaginationChange = (_: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset(((data.activePage as number) - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (
        _: React.MouseEvent<HTMLAnchorElement>,
        data: { value: number }
    ): void => {
        setListItemLimit(data.value);
        setListOffset(0);
    };

    const handleOpenAssignModal = (): void => {
        setModalSelectedIds(new Set<string>());
        setModalSearchQuery("");
        setIsSelectAll(false);
        setShowAssignModal(true);
    };

    const handleModalToggle = (id: string): void => {
        setModalSelectedIds((prev: Set<string>): Set<string> => {
            const next: Set<string> = new Set<string>(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    const handleSelectAll = (): void => {
        if (!isSelectAll) {
            setModalSelectedIds(new Set<string>(filteredModalApps.map((app: ApplicationListItemInterface) => app.id)));
        } else {
            setModalSelectedIds(new Set<string>());
        }
        setIsSelectAll((prev: boolean): boolean => !prev);
    };

    const handleAssignConfirm: () => Promise<void> = async (): Promise<void> => {
        setIsSaving(true);

        const prev: Set<string> = new Set<string>(assignedIds);
        const next: Set<string> = new Set<string>(prev);

        modalSelectedIds.forEach((id: string): void => { next.add(id); });
        setAssignedIds(next);
        setShowAssignModal(false);

        try {
            await persistAssignments(next);
        } catch {
            setAssignedIds(prev);
        } finally {
            setIsSaving(false);
        }
    };

    const resolveTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "name",
            id: "name",
            key: "name",
            render: (app: ApplicationListItemInterface): ReactNode => (
                <Header
                    image
                    as="h6"
                    className="header-with-icon"
                    data-componentid={ `${componentId}-item-heading` }
                >
                    <UserAvatar
                        data-componentid={ `${componentId}-item-image` }
                        name={ app.name }
                        size="mini"
                        spaced="right"
                    />
                    <Header.Content>
                        { app.name }
                        { app.description && (
                            <Header.Subheader>{ app.description }</Header.Subheader>
                        ) }
                    </Header.Content>
                </Header>
            ),
            title: ""
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: ""
        }
    ];

    const resolveTableActions = (): TableActionsInterface[] => {
        if (!hasUpdatePermission) {
            return [];
        }

        return [
            {
                "data-componentid": `${componentId}-item-remove-button`,
                icon: (): SemanticICONS => "trash",
                onClick: (_: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    handleRemoveApplication(app);
                },
                popupText: (): string => t("common:remove"),
                renderer: "semantic-icon"
            }
        ];
    };

    const showPlaceholders = (): ReactElement => {
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("users:usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("users:usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("users:usersList.search.emptyResultPlaceholder.subTitle.0", { query: searchQuery }),
                        t("users:usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (assignedApplications.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ hasUpdatePermission && (
                        <PrimaryButton onClick={ handleOpenAssignModal }>
                            <Icon name="plus" />
                            { t("consents:policyConsents.promptScope.assignButton") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                    title={ t("consents:policyConsents.promptScope.noApplications") }
                    subtitle={ [ t("consents:policyConsents.promptScope.noApplicationsSubtitle") ] }
                />
            );
        }

        return null;
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            data-componentid={ `${componentId}-search` }
            onFilter={ (query: string): void => {
                setSearchQuery(query?.trim() ?? "");
                setListOffset(0);
            } }
            disableSearchFilterDropdown
            filterAttributeOptions={ [] }
            placeholder={ t("consents:policyConsents.promptScope.searchPlaceholder") }
            defaultSearchAttribute=""
            defaultSearchOperator=""
            triggerClearQuery={ triggerClearQuery }
        />
    );

    return (
        <>
            <EmphasizedSegment padded="very" data-componentid={ componentId }>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <div>
                        <Heading as="h4" data-componentid={ `${componentId}-heading` }>
                            { t("consents:policyConsents.promptScope.header") }
                        </Heading>
                        <Heading subHeading ellipsis as="h6">
                            { t("consents:policyConsents.promptScope.subHeading") }
                        </Heading>
                    </div>
                    { hasUpdatePermission && assignedApplications.length > 0 && (
                        <PrimaryButton
                            data-componentid={ `${componentId}-assign-button` }
                            onClick={ handleOpenAssignModal }
                        >
                            <Icon name="plus" />
                            { t("consents:policyConsents.promptScope.assignButton") }
                        </PrimaryButton>
                    ) }
                </Box>
                <Divider hidden />
                <ListLayout
                    advancedSearch={ advancedSearchFilter() }
                    currentListSize={ paginatedAssigned.length }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    data-componentid={ `${componentId}-list-layout` }
                    onPageChange={ handlePaginationChange }
                    showPagination={ true }
                    totalPages={ Math.ceil(filteredAssigned.length / listItemLimit) }
                    totalListSize={ filteredAssigned.length }
                    isLoading={ isApplicationListLoading || isConsentAppsLoading }
                >
                    <DataTable<ApplicationListItemInterface>
                        isLoading={ isApplicationListLoading || isConsentAppsLoading }
                        loadingStateOptions={ {
                            count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                            imageType: "square"
                        } }
                        actions={ resolveTableActions() }
                        columns={ resolveTableColumns() }
                        data={ paginatedAssigned }
                        onRowClick={ (): null => null }
                        placeholders={ showPlaceholders() }
                        selectable={ false }
                        showHeader={ false }
                        transparent={ true }
                    />
                </ListLayout>
            </EmphasizedSegment>

            { /* Assign Applications modal */ }
            <Modal
                data-componentid={ `${componentId}-assign-modal` }
                dimmer="blurring"
                open={ showAssignModal }
                size="small"
                className="user-roles"
            >
                <Modal.Header data-componentid={ `${componentId}-assign-modal-header` }>
                    { t("consents:policyConsents.promptScope.assignModal.header") }
                    <Heading subHeading ellipsis as="h6">
                        { t("consents:policyConsents.promptScope.assignModal.subHeading") }
                    </Heading>
                </Modal.Header>
                <Modal.Content className="add-role-user-modal-content">
                    <TransferComponent
                        compact
                        basic
                        className="one-column-selection"
                        selectionComponent
                        searchPlaceholder={ t("consents:policyConsents.promptScope.searchPlaceholder") }
                        isLoading={ isApplicationListLoading || isConsentAppsLoading }
                        handleHeaderCheckboxChange={ handleSelectAll }
                        isHeaderCheckboxChecked={ isSelectAll }
                        handleUnelectedListSearch={
                            (_: FormEvent<HTMLInputElement>, { value }: { value: string }): void => {
                                setModalSearchQuery(value ?? "");
                                setIsSelectAll(false);
                            }
                        }
                        showSelectAllCheckbox={ !isApplicationListLoading && filteredModalApps.length > 0 }
                        data-componentid={ `${componentId}-transfer-component` }
                    >
                        <TransferList
                            bordered={ true }
                            selectionComponent
                            isListEmpty={ filteredModalApps.length === 0 }
                            isLoading={ isApplicationListLoading || isConsentAppsLoading }
                            listType="unselected"
                            selectAllCheckboxLabel={ t("consents:policyConsents.promptScope.selectAll") }
                            data-componentid={ `${componentId}-transfer-list` }
                            emptyPlaceholderContent={ t("consents:policyConsents.promptScope.assignModal.noApps") }
                        >
                            { filteredModalApps.map((app: ApplicationListItemInterface, index: number): ReactElement => (
                                <TransferListItem
                                    key={ app.id }
                                    handleItemChange={ (): void => handleModalToggle(app.id) }
                                    listItem={ app.name }
                                    listItemId={ app.id }
                                    listItemIndex={ index }
                                    isItemChecked={ modalSelectedIds.has(app.id) }
                                    showSecondaryActions={ false }
                                    showListSubItem={ !!app.description }
                                    listSubItem={ app.description }
                                    data-componentid={ `${componentId}-transfer-list-item-${index}` }
                                />
                            )) }
                        </TransferList>
                    </TransferComponent>
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton
                        data-componentid={ `${componentId}-assign-modal-cancel-button` }
                        onClick={ (): void => setShowAssignModal(false) }
                        floated="left"
                    >
                        { t("common:cancel") }
                    </LinkButton>
                    <Button
                        variant="contained"
                        color="primary"
                        data-componentid={ `${componentId}-assign-modal-save-button` }
                        onClick={ handleAssignConfirm }
                        disabled={ modalSelectedIds.size === 0 || isSaving }
                        loading={ isSaving }
                    >
                        { t("common:save") }
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
};
