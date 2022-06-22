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

import { AccessControlConstants, Show } from "@wso2is/access-control";
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
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { AttributeSelectionWizardOtherDialect }
    from "../../applications/components/settings/attribute-management/attirbute-selection-wizard-other-dialect";
import { AppState, FeatureConfigInterface, getEmptyPlaceholderIllustrations } from "../../core";
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
 * @param {EditScopePropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
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

    const dispatch = useDispatch();

    const [ showSelectionModal, setShowSelectionModal ] = useState<boolean>(false);
    const [ deletingClaim, setDeletingClaim ] = useState<ExternalClaim>(undefined);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);

    const init = useRef(true);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const isReadOnly = useMemo(
        () => !hasRequiredScopes(featureConfig?.oidcScopes, featureConfig?.oidcScopes?.scopes?.update, allowedScopes),
        [ featureConfig, allowedScopes ]
    );

    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            handleOpenSelectionModal();
        }
    }, [ triggerAddAttributeModal ]);

    const updateOIDCScope = (attributes: string[]): void => {
        const data: OIDCScopesListInterface = {
            claims: attributes,
            description: scope.description,
            displayName: scope.displayName
        };

        updateOIDCScopeDetails(scope.name, data)
            .then(() => {
                setShowDeleteConfirmationModal(false);
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope.success" + ".description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope.success" + ".message"
                        )
                    })
                );
                onUpdate(scope.name);
            })
            .catch((error) => {
                setShowDeleteConfirmationModal(false);
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.oidcScopes.notifications.updateOIDCScope.error" + ".message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope" + ".genericError.message"
                        )
                    })
                );
            });
    };

    const showAttributeSelectionModal = () => {
        return (
            <AttributeSelectionWizardOtherDialect
                availableExternalClaims={ unselectedAttributes }
                selectedExternalClaims={ selectedAttributes }
                showAddModal={ showSelectionModal }
                data-testid={ `${ testId }-add-attributes` }
                setShowAddModal={ setShowSelectionModal }
                setAvailableExternalClaims={ () => null }
                setInitialSelectedExternalClaims={ (response: ExternalClaim[]) => {
                    const claimURIs: string[] = response?.map((claim: ExternalClaim) => claim.claimURI);
                    updateOIDCScope(claimURIs);
                } }
                setSelectedExternalClaims={ () => null }
                isScopeSection={ true }
                scopeName={ scope.displayName }
            />
        );
    };

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const handleRemoveAttribute = (claim: string): void => {
        const assignedClaims = scope?.claims;
        const newClaimList = assignedClaims.filter((claimName) => claimName !== claim);

        updateOIDCScope(newClaimList);
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
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
                title: t("console:manage.features.oidcScopes.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.oidcScopes.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
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
                subtitle={ [ t("console:manage.features.oidcScopes.editScope." +
                    "claimList.emptyPlaceholder.subtitles.0") ] }
                action={
                    <Show when={ AccessControlConstants.SCOPE_WRITE }>
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
                            { t("console:manage.features.oidcScopes.editScope.claimList.addClaim") }
                        </PrimaryButton>
                    </Show>
                }
                image={ getEmptyPlaceholderIllustrations().newList }
                imageSize="tiny"
            />
        ) : tempSelectedAttributes?.length === 0 ? (
            <EmptyPlaceholder
                data-testid="scope-mgt-empty-claims-list"
                title={ t("console:manage.features.oidcScopes.editScope.claimList.emptySearch.title") }
                subtitle={ [
                    t("console:manage.features.oidcScopes.editScope.claimList.emptySearch.subtitles.0"),
                    t("console:manage.features.oidcScopes.editScope.claimList.emptySearch.subtitles.1")
                ] }
                action={
                    <LinkButton onClick={ clearSearchedAttributes }>
                        { t("console:manage.features.oidcScopes.editScope.claimList.emptySearch.action") }
                    </LinkButton>
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
                data={ tempSelectedAttributes }
                onRowClick={ () => null }
                placeholders={ showPlaceholders() }
                transparent={ !isRequestLoading && showPlaceholders() !== null }
                showHeader={ false }
                data-testid={ testId }
            />
            {
                deletingClaim && (
                    <ConfirmationModal
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("console:manage.features.claims.scopeMappings." +
                            "deletionConfirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleRemoveAttribute(deletingClaim.claimURI) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("console:manage.features.claims.scopeMappings.deletionConfirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("console:manage.features.claims.scopeMappings.deletionConfirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("console:manage.features.claims.scopeMappings.deletionConfirmationModal.content") }
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
