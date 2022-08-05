/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    GridLayout,
    Message,
    LinkButton,
    ListLayout,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import find from "lodash-es/find";
import React, { FC, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownItemProps, DropdownProps, Header, SemanticICONS } from "semantic-ui-react";
import { EmptySecretListPlaceholder } from "./empty-secret-list-placeholder";
import {
    AdvancedSearchWithBasicFilters,
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    getSecretManagementIllustrations,
    history
} from "../../core";
import { deleteSecret } from "../api/secret";
import { ADAPTIVE_SCRIPT_SECRETS, FEATURE_EDIT_PATH } from "../constants/secrets.common";
import { SecretModel } from "../models/secret";
import { formatDateString, humanizeDateString } from "../utils/secrets.date.utils";

const SECRETS_LIST_SORTING_OPTIONS: DropdownItemProps[] = [
    {
        key: 1,
        text: I18n.instance.t("common:name"),
        value: "name"
    },
    {
        key: 2,
        text: I18n.instance.t("common:type"),
        value: "type"
    },
    {
        key: 3,
        text: I18n.instance.t("common:createdOn"),
        value: "createdDate"
    },
    {
        key: 4,
        text: I18n.instance.t("common:lastUpdatedOn"),
        value: "lastUpdated"
    }
];

/**
 * Props interface of {@link SecretsList}
 */
export type SecretsListProps = {
    onEmptyListPlaceholderActionClick?: () => void;
    isRenderedOnPortal?: boolean;
    onSearchQueryClear?: () => void;
    advancedSearch?: ReactNode;
    whenSecretDeleted: (deletedSecret: SecretModel, shouldRefresh: boolean) => void;
    isSecretListLoading: boolean;
    selectedSecretType: string;
    secretList: SecretModel[];
    onAddNewSecretButtonClick: () => void;
    showAdaptiveAuthSecretBanner?: boolean;
} & IdentifiableComponentInterface;

/**
 * @param props {SecretsListProps}
 * @constructor
 * @return {ReactElement}
 */
const SecretsList: FC<SecretsListProps> = (props: SecretsListProps): ReactElement => {

    const {
        onSearchQueryClear,
        advancedSearch,
        whenSecretDeleted,
        isSecretListLoading,
        secretList,
        ["data-componentid"]: testId,
        onAddNewSecretButtonClick,
        selectedSecretType,
        showAdaptiveAuthSecretBanner
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingSecret, setDeletingSecret ] = useState<SecretModel>(undefined);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ filteredSecrets, setFilteredSecrets ] = useState([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listSortingStrategy, setListSortingStrategy ] = useState<DropdownItemProps>(
        SECRETS_LIST_SORTING_OPTIONS[ 0 ]
    );

    const onSecretEditClick = (event: React.SyntheticEvent, item: SecretModel) => {
        event?.preventDefault();
        if (hasRequiredScopes(
            featureConfig?.secretsManagement,
            featureConfig?.secretsManagement?.scopes?.update,
            allowedScopes
        )) {
            const pathname = AppConstants
                .getPaths()
                .get(FEATURE_EDIT_PATH)
                .replace(":type", item?.type)
                .replace(":name", item?.secretName);

            history.push({ pathname });
        }
    };

    useEffect(() => {
        setFilteredSecrets([ ...secretList ].reverse());
    }, [ secretList ]);

    /**
     * This will be only called when user gives their consent.
     * @see {@code SecretDeleteConfirmationModal}
     */
    const onSecretDeleteClick = async (): Promise<void> => {
        if (deletingSecret && hasRequiredScopes(
            featureConfig?.secretsManagement,
            featureConfig?.secretsManagement?.scopes?.delete,
            allowedScopes
        )) {
            try {
                await deleteSecret({
                    params: {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }
                });
                dispatch(addAlert({
                    description: t("console:develop.features.secrets.alerts.deleteSecret.description", {
                        secretName: deletingSecret.secretName,
                        secretType: deletingSecret.type
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.secrets.alerts.deleteSecret.message")
                }));
            } catch (error) {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: error.response.data.message
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("console:develop.features.secrets.errors.generic.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.secrets.errors.generic.message")
                }));
            } finally {
                const refreshSecretList = true;

                whenSecretDeleted(deletingSecret, refreshSecretList);
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            }
        }
    };

    const createDatatableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "secretName",
                id: "secret-name",
                key: "data-column-secret-name",
                render(data: SecretModel) {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-first-column` }>
                            <AppAvatar
                                image={ (
                                    <GenericIcon
                                        size="mini"
                                        shape="rounded"
                                        colored
                                        background={ true }
                                        hoverable={ false }
                                        icon={ getSecretManagementIllustrations().editingSecretIcon }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${ testId }-item-image` }
                            />
                            <Header.Content data-testid={ `${ testId }-first-column-item-header` }>
                                { data.secretName }
                                <Header.Subheader
                                    className="truncate ellipsis"
                                    data-testid={ `${ testId }-item-sub-heading` }>
                                    { data.description }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Secret Name"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "created",
                id: "created-at",
                key: "data-column-created-at",
                render(data: SecretModel) {
                    return (
                        <Header as="h6" data-testid={ `${ testId }-second-column` }>
                            <Header.Content data-testid={ `${ testId }-second-column-data` }>
                                { formatDateString(data.created) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Created At"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "lastModified",
                id: "last-modified",
                key: "data-column-last-modified",
                render(data: SecretModel) {
                    return (
                        <Header as="h6" data-testid={ `${ testId }-third-column` }>
                            <Header.Content data-testid={ `${ testId }-third-column-data` }>
                                { humanizeDateString(data.lastModified) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Last Modified"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: "Take Action"
            }
        ];
    };

    const createDatatableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ testId }-item-edit-button`,
                hidden: () => {
                    return !hasRequiredScopes(
                        featureConfig?.secretsManagement,
                        featureConfig?.secretsManagement?.scopes?.update,
                        allowedScopes
                    );
                },
                icon: (): SemanticICONS => "pencil alternate",
                onClick: onSecretEditClick,
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ testId }-item-delete-button`,
                hidden: () => {
                    return !hasRequiredScopes(
                        featureConfig?.secretsManagement,
                        featureConfig?.secretsManagement?.scopes?.delete,
                        allowedScopes
                    );
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick(event: SyntheticEvent, data: SecretModel) {
                    event?.preventDefault();
                    setDeletingSecret(data);
                    setShowDeleteConfirmationModal(true);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && filteredSecrets?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("console:develop.placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Handles the `onFilter` callback action from the secrets search component.
     *
     * @param {string} query - Search query.
     */
    const handleSecretsFilter = (query: string) => {

        setSearchQuery(query);

        if (!query) {
            setFilteredSecrets(secretList.reverse());
        }

        const records =  query?.split(" ");

        if (!records) {
            return;
        }

        // const attribute  = records[0];
        const operator = records[1];
        const keyWords = records.splice(2).join("");
        const filteredArray = [];

        secretList.forEach((val) => {
            if (operator === "co" && val?.secretName.includes(keyWords)) {
                filteredArray.push(val);
            }
            if (operator === "sw" && val?.secretName.startsWith(keyWords)) {
                filteredArray.push(val);
            }
            if (operator === "ew" && val?.secretName.endsWith(keyWords)) {
                filteredArray.push(val);
            }
            if (operator === "eq" && val?.secretName == keyWords) {
                filteredArray.push(val);
            }
        });
        setFilteredSecrets(filteredArray.reverse());

    };

    /**
     * Sets the list sorting strategy.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - The event.
     * @param {DropdownProps} data - Dropdown data.
     */
    const handleListSortingStrategyOnChange = (
        event: SyntheticEvent<HTMLElement>,
        data: DropdownProps
    ): void => {
        setListSortingStrategy(find(SECRETS_LIST_SORTING_OPTIONS, (option) => {
            return data.value === option.value;
        }));
    };

    const SecretDeleteConfirmationModal: ReactElement = (
        <ConfirmationModal
            onClose={ (): void => {
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            } }
            onSecondaryActionClick={ (): void => {
                setShowDeleteConfirmationModal(false);
                setDeletingSecret(undefined);
            } }
            onPrimaryActionClick={ onSecretDeleteClick }
            open={ showDeleteConfirmationModal }
            type="warning"
            assertionHint={ t("console:develop.features.secrets.modals.deleteSecret.assertionHint") }
            assertionType="checkbox"
            primaryAction={ t("console:develop.features.secrets.modals.deleteSecret.primaryActionButtonText") }
            secondaryAction={ t("console:develop.features.secrets.modals.deleteSecret.secondaryActionButtonText") }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }>
            <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                { t("console:develop.features.secrets.modals.deleteSecret.title") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }>
                { t("console:develop.features.secrets.modals.deleteSecret.warningMessage") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                { t("console:develop.features.secrets.modals.deleteSecret.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        <GridLayout isLoading={ isSecretListLoading } showTopActionPanel={ false }>
            {
                showAdaptiveAuthSecretBanner && selectedSecretType === ADAPTIVE_SCRIPT_SECRETS && (
                    <Message
                        type="info"
                        data-componentid={ `${ testId }-page-message` }
                        header={ t("console:develop.features.secrets.banners.adaptiveAuthSecretType.title") }
                        content={ t("console:develop.features.secrets.banners.adaptiveAuthSecretType.content") }
                    />
                )
            }
            { secretList?.length > 0
                ? (
                    <ListLayout
                        advancedSearch={ (
                            <AdvancedSearchWithBasicFilters
                                onFilter={ handleSecretsFilter }
                                filterAttributeOptions={ [
                                    {
                                        key: 0,
                                        text: t("common:name"),
                                        value: "name"
                                    }
                                ] }
                                filterAttributePlaceholder={
                                    t("console:develop.features.secrets.advancedSearch.form" +
                                        ".inputs.filterAttribute.placeholder")
                                }
                                filterConditionsPlaceholder={
                                    t("console:develop.features.secrets.advancedSearch.form" +
                                        ".inputs.filterCondition.placeholder")
                                }
                                filterValuePlaceholder={
                                    t("console:develop.features.secrets.advancedSearch.form.inputs.filterValue" +
                                    ".placeholder")
                                }
                                placeholder={ t("console:develop.features.secrets.advancedSearch.placeholder") }
                                defaultSearchAttribute="name"
                                defaultSearchOperator="co"
                                data-testid={ `${ testId }-list-advanced-search` }
                            />
                        ) }
                        currentListSize={ secretList.length }
                        onPageChange={ () => void 0 }
                        onSortStrategyChange={ handleListSortingStrategyOnChange }
                        showPagination={ false }
                        sortOptions={ SECRETS_LIST_SORTING_OPTIONS }
                        sortStrategy={ listSortingStrategy }
                        totalPages={ 1 }
                        data-testid={ `${ testId }-list-layout` }
                    >
                        <DataTable<SecretModel>
                            externalSearch={ advancedSearch }
                            data={ filteredSecrets }
                            showHeader={ false }
                            onRowClick={ onSecretEditClick }
                            actions={ createDatatableActions() }
                            columns={ createDatatableColumns() }
                            placeholders={ showPlaceholders() }>
                        </DataTable>
                        { showDeleteConfirmationModal && SecretDeleteConfirmationModal }
                    </ListLayout>
                )
                : (
                    <EmptySecretListPlaceholder
                        onAddNewSecret={ onAddNewSecretButtonClick }
                    />
                )
            }
        </GridLayout>
    );

};

/**
 * Default props of {@link SecretsList}
 */
SecretsList.defaultProps = {
    "data-componentid": "secrets-list",
    showAdaptiveAuthSecretBanner: false
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretsList;
