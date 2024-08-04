/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { AttributeSelectionWizardOtherDialect } from
    "@wso2is/admin.applications.v1/components/settings/attribute-management/attirbute-selection-wizard-other-dialect";
import { AppState, FeatureConfigInterface, getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ExternalClaim, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    TableDataInterface
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { updateOIDCScopeDetails } from "../api";
import { OIDCScopesManagementConstants } from "../constants";
import { OIDCScopesListInterface } from "../models";

/**
 * Proptypes for the OIDC scope edit component.
 */
interface EditScopePropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Editing scope.
     */
    scope: OIDCScopesListInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the scope details.
     */
    onUpdate: (name: string) => void;
    /**
     * Attributes that have already been selected.
     */
    selectedAttributes: ExternalClaim[];
    /**
     * Attributes that have already been filtered.
     */
    tempSelectedAttributes: ExternalClaim[];
    /**
     * Attributes that haven't been selected yet.
     */
    unselectedAttributes: ExternalClaim[];
    /**
     * Specifies if a network request is still loading.
     */
    isRequestLoading: boolean;
    /**
     * Triggers the add attribute modal.
     */
    triggerAddAttributeModal: boolean;
    /**
     * Callback to clear the searched attributed list.
     */
    clearSearchedAttributes?: () => void;
}

/**
 * OIDC scope edit component.
 *
 *
 * @returns OIDC scopes table
 */
export const EditOIDCScope: FunctionComponent<EditScopePropsInterface> = (
    props: EditScopePropsInterface
): ReactElement => {
    const {
        scope,
        onUpdate,
        selectedAttributes,
        tempSelectedAttributes,
        unselectedAttributes,
        isRequestLoading,
        triggerAddAttributeModal,
        clearSearchedAttributes,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ showSelectionModal, setShowSelectionModal ] = useState<boolean>(false);
    const [ deletingClaim, setDeletingClaim ] = useState<ExternalClaim>(undefined);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ updatedClaimList, setUpdatedClaimList ] = useState<ExternalClaim[]>([]);

    const init: MutableRefObject<boolean> = useRef(true);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const isReadOnly: boolean = useMemo(
        () => (!hasRequiredScopes(featureConfig?.oidcScopes, featureConfig?.oidcScopes?.scopes?.update, allowedScopes)
            || OIDCScopesManagementConstants.OIDC_READONLY_SCOPES.includes(scope?.name)),
        [ featureConfig, allowedScopes, scope ]
    );

    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            handleOpenSelectionModal();
        }
    }, [ triggerAddAttributeModal ]);

    useEffect(() => {
        if (!tempSelectedAttributes) {
            return;
        }

        setUpdatedClaimList(tempSelectedAttributes);
    }, [ tempSelectedAttributes ]);

    const updateOIDCScope: () => void = useCallback((): void => {
        const data: OIDCScopesListInterface = {
            claims: updatedClaimList.map((claim: ExternalClaim) => claim.claimURI),
            description: scope.description,
            displayName: scope.displayName
        };

        updateOIDCScopeDetails(scope.name, data)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "oidcScopes:notifications.updateOIDCScope.success"
                            + ".description", {
                                scope: scope.name
                            }
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "oidcScopes:notifications.updateOIDCScope.success" + ".message"
                        )
                    })
                );
                onUpdate(scope.name);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "oidcScopes:notifications.updateOIDCScope.error" + ".message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "oidcScopes:notifications.updateOIDCScope" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "oidcScopes:notifications.updateOIDCScope" + ".genericError.message"
                        )
                    })
                );
            });
    }, [ updatedClaimList, scope.name, onUpdate, dispatch ]);

    const showAttributeSelectionModal = () => {
        return (
            <AttributeSelectionWizardOtherDialect
                availableExternalClaims={ unselectedAttributes }
                selectedExternalClaims={ selectedAttributes }
                showAddModal={ showSelectionModal }
                data-testid={ `${ testId }-add-attributes` }
                setShowAddModal={ setShowSelectionModal }
                setAvailableExternalClaims={ () => null }
                setInitialSelectedExternalClaims={ (response: ExternalClaim[]) => setUpdatedClaimList(response) }
                setSelectedExternalClaims={ () => null }
                isScopeSection={ true }
                scopeName={ scope.displayName }
            />
        );
    };

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const handleRemoveAttribute = (claim: ExternalClaim): void => {
        const newClaimList: ExternalClaim[] = updatedClaimList.filter(
            (claimItem: ExternalClaim) => claimItem.id !== claim.id);

        setUpdatedClaimList(newClaimList);
        setShowDeleteConfirmationModal(false);
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
                render: (claim: ExternalClaim): ReactNode => (
                    <Header image as="h6" className="header-with-icon" data-testid={ `${ testId }-item-heading` }>
                        <Header.Content>
                            { claim.claimURI }
                        </Header.Content>
                    </Header>
                ),
                title: t("oidcScopes:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("oidcScopes:list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                hidden: (item: TableDataInterface<ExternalClaim>) => {
                    return (
                        (item.claimURI === "sub" && scope.name === OIDCScopesManagementConstants.OPEN_ID_SCOPE) ||
                        isReadOnly
                    );
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, claim: ExternalClaim): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingClaim(claim);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    const showPlaceholders = (): ReactElement => {
        return selectedAttributes?.length === 0 ? (
            <EmptyPlaceholder
                data-testid="scope-mgt-empty-actual-claims-list"
                subtitle={ [ t("oidcScopes:editScope." +
                    "claimList.emptyPlaceholder.subtitles.0") ] }
                action={
                    (<Show when={ featureConfig?.oidcScopes?.scopes?.create }>
                        <PrimaryButton
                            data-testid="user-mgt-roles-list-add-button"
                            size="medium"
                            icon={ <Icon name="add" /> }
                            onClick={ () => {
                                handleOpenSelectionModal();
                                showAttributeSelectionModal();
                            } }
                        >
                            <Icon name="add" />
                            { t("oidcScopes:editScope.claimList.addClaim") }
                        </PrimaryButton>
                    </Show>)
                }
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
            />
        ) : tempSelectedAttributes?.length === 0 ? (
            <EmptyPlaceholder
                data-testid="scope-mgt-empty-claims-list"
                title={ t("oidcScopes:editScope.claimList.emptySearch.title") }
                subtitle={ [
                    t("oidcScopes:editScope.claimList.emptySearch.subtitles.0"),
                    t("oidcScopes:editScope.claimList.emptySearch.subtitles.1")
                ] }
                action={
                    (<LinkButton onClick={ clearSearchedAttributes }>
                        { t("oidcScopes:editScope.claimList.emptySearch.action") }
                    </LinkButton>)
                }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
            />
        ) : null;
    };

    return (
        <>
            <DataTable<ExternalClaim>
                className="oidc-scopes-table"
                isLoading={ isRequestLoading }
                loadingStateOptions={ {
                    count: 10,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ updatedClaimList }
                onRowClick={ () => null }
                placeholders={ showPlaceholders() }
                transparent={ !isRequestLoading && showPlaceholders() !== null }
                showHeader={ false }
                data-testid={ testId }
            />
            {
                !isReadOnly && (
                    <PrimaryButton onClick={ updateOIDCScope }>
                        { t("claims:scopeMappings.saveChangesButton") }
                    </PrimaryButton>
                )
            }
            {
                deletingClaim && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("claims:scopeMappings." +
                            "deletionConfirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleRemoveAttribute(deletingClaim) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("claims:scopeMappings.deletionConfirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("claims:scopeMappings.deletionConfirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("claims:scopeMappings.deletionConfirmationModal.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            { showAttributeSelectionModal() }
        </>
    );
};

/**
 * Default props for the `EditOIDCScope` component.
 */
EditOIDCScope.defaultProps = {
    isRequestLoading: true
};
