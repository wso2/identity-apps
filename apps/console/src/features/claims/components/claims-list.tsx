/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    Claim,
    ClaimDialect,
    ExternalClaim,
    LoadableComponentInterface,
    ProfileSchemaInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert, setProfileSchemaRequestLoadingStatus, setSCIMSchemas } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import isEqual from "lodash-es/isEqual";
import React,{
    Dispatch,
    FunctionComponent,
    ReactElement,
    ReactNode,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, ItemHeader, Popup, SemanticICONS } from "semantic-ui-react";
import { EditExternalClaim } from "./edit";
import { attributeConfig } from "../../../extensions";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history,
    store
} from "../../core";
import { getProfileSchemas } from "../../users/api";
import { UserStoreListItem, getUserStores } from "../../userstores";
import { deleteAClaim, deleteADialect, deleteAnExternalClaim } from "../api";
import { ClaimManagementConstants } from "../constants";
import { AddExternalClaim } from "../models";

/**
 * The model of the object containing info specific to the list type.
 */
interface ListItem {
    assertion: string;
    message: string;
    name: string;
    delete: (id: string, claimId?: string) => void;
}

/**
 * Enum containing the list types.
 */
export enum ListType {
    LOCAL,
    EXTERNAL,
    DIALECT,
    ADD_EXTERNAL
}

export type ClaimEventClickItem = Claim | ExternalClaim | ClaimDialect | AddExternalClaim;

/**
 * Prop types of `ClaimsList` component
 */
interface ClaimsListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * The array containing claims/external claims/claim dialects/add external claim.
     */
    list: Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[];
    /**
     * Sets if the list is to contain local claims.
     */
    localClaim: ListType;
    /**
     * Called to initiate update.
     */
    update?: () => void;
    /**
     * The dialect ID of claims.
     */
    dialectID?: string;
    /**
     * Called when edit is clicked on add external claim list.
     */
    onEdit?: (claim: ClaimEventClickItem, values: Map<string, FormValue>) => void;
    /**
     * Called when delete is clicked on add external claim list.
     */
    onDelete?: (claim: ClaimEventClickItem) => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, claim: Claim | ExternalClaim | ClaimDialect | AddExternalClaim) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Show or hide table headers. By default they are hidden.
     * You have to explicitly mark them as enabled.
     */
    showTableHeaders?: boolean;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Specifies the attribute type.
     */
    attributeType?: string;
    /**
     * Update mapped claims on delete or edit
     */
    updateMappedClaims?: Dispatch<SetStateAction<boolean>>;
    /**
     * Depending on the attribute type
     * disables the edit functionality.
     */
    isEditable?: boolean;
}

/**
 * This component renders claims/dialects list
 *
 * @param {ClaimsListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ClaimsList: FunctionComponent<ClaimsListPropsInterface> = (
    props: ClaimsListPropsInterface
): ReactElement => {

    const {
        showTableHeaders,
        advancedSearch,
        defaultListItemLimit,
        featureConfig,
        list,
        localClaim,
        update,
        dialectID,
        onEdit,
        onDelete,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        selection,
        searchQuery,
        attributeType,
        showListItemActions,
        isEditable,
        updateMappedClaims,
        [ "data-testid" ]: testId
    } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteType, setDeleteType ] = useState<ListType>(null);
    const [ deleteItem, setDeleteItem ] = useState<Claim | ExternalClaim | ClaimDialect>(null);
    const [ userStores, setUserStores ] = useState<UserStoreListItem[]>([]);
    const [ editClaim, setEditClaim ] = useState("");
    const [ editExternalClaim, setEditExternalClaim ] = useState<AddExternalClaim>(undefined);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const dispatch = useDispatch();

    const [ submitExternalClaim, setSubmitExternalClaim ] = useTrigger();

    const claimURIText = useRef([]);
    const copyButton = useRef([]);

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const OIDC = "oidc";

    list?.forEach((element, index) => {
        claimURIText.current.push(claimURIText.current[ index ] || React.createRef());
        copyButton.current.push(copyButton.current[ index ] || React.createRef());
    });

    useEffect(() => {
        if (isLocalClaim(list)) {
            getUserStores(null).then(response => {
                setUserStores(response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description
                        ?? t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                            ".description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        ?? t("console:manage.features.userstores.notifications.fetchUserstores.genericError.message")
                }));
            });
        }
    }, [ JSON.stringify(list) ]);

    /**
     * This check if the input claim is mapped to attribute from every userstore.
     *
     * @param {Claim} claim The claim to be checked.
     *
     * @returns {string[]} The array of userstore names without a mapped attribute.
     */
    const checkUserStoreMapping = (claim: Claim): string[] => {
        const userStoresNotSet = [];

        userStores?.forEach(userStore => {
            claim?.attributeMapping?.find(attribute => {
                return attribute.userstore.toLowerCase() === userStore.name.toLowerCase();
            }) ?? userStoresNotSet.push(userStore.name);
        });

        claim?.attributeMapping?.find(attribute => {
            return attribute.userstore === "PRIMARY";
        }) ?? userStoresNotSet.push("Primary");

        return userStoresNotSet;
    };

    /**
     * This checks if the list data is a local claim.
     *
     * @param {Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]} toBeDetermined Type to be checked.
     *
     * @return {boolean} `true` if the data is a local claim.
     */
    const isLocalClaim = (
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]
            | Claim | ExternalClaim | ClaimDialect
    ): toBeDetermined is Claim[] | Claim => {
        return localClaim === ListType.LOCAL;
    };

    /**
     * This checks if the list data is a dialect.
     *
     * @param {Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]} toBeDetermined
     *
     * @return {boolean} `true` if the data is a dialect.
     */
    const isDialect = (
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]
            | Claim | ExternalClaim | ClaimDialect
    ): toBeDetermined is ClaimDialect[] | ClaimDialect => {
        return localClaim === ListType.DIALECT;
    };

    /**
     * This checks if the list data is an external claim.
     *
     * @param {Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]} toBeDetermined
     *
     * @return {boolean} `true` if the data is a an external claim.
     */
    const isExternalClaim = (
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]
            | Claim | ExternalClaim | ClaimDialect
    ): toBeDetermined is ExternalClaim[] | ExternalClaim => {
        return localClaim === ListType.EXTERNAL;
    };

    /**
     * This closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteItem(null);
        setDeleteType(null);
    };

    /**
     * This deletes a local claim
     * @param {string} id
     */
    const deleteLocalClaim = (id: string) => {
        deleteAClaim(id).then(() => {
            update();
            closeDeleteConfirm();
            updateMappedClaims(true);
            dispatch(addAlert(
                {
                    description: t("console:manage.features.claims.local.notifications.deleteClaim.success."+
                        "description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.claims.local.notifications.deleteClaim.success.message")
                }
            ));
        }).catch(error => {
            dispatch(setAlert(
                {
                    description: error?.description
                        || t("console:manage.features.claims.local.notifications.deleteClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.claims.local.notifications.deleteClaim.genericError.message")
                }
            ));
        });
    };

    /**
     * This deletes an external claim
     * @param {string} dialectID
     * @param {string} claimID
     */
    const deleteExternalClaim = (dialectID: string, claimID: string) => {
        deleteAnExternalClaim(dialectID, claimID).then(() => {
            update();
            attributeConfig.localAttributes.isSCIMCustomDialectAvailable().then(() => {
                fetchUpdatedSchemaList();
            });

            updateMappedClaims(true);
            closeDeleteConfirm();
            dispatch(addAlert(
                {
                    description: t("console:manage.features.claims.external.notifications." +
                        "deleteExternalClaim.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.claims.external.notifications." +
                        "deleteExternalClaim.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("console:manage.features.claims.external.notifications." +
                            "deleteExternalClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.claims.external.notifications." +
                            "deleteExternalClaim.genericError.message")
                }
            ));
        });
    };

    /**
     * Fetch the updated SCIM2 schema list.
     */
    const fetchUpdatedSchemaList = (): void => {
        dispatch(setProfileSchemaRequestLoadingStatus(true));

        getProfileSchemas()
            .then((response: ProfileSchemaInterface[]) => {
                dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.notifications.getProfileSchema.error.message")
                    })
                    );
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.notifications.getProfileSchema.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.notifications.getProfileSchema.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                dispatch(setProfileSchemaRequestLoadingStatus(false));
            });
    };

    /**
     * This deletes a dialect
     * @param {string} dialectID
     */
    const deleteDialect = (dialectID: string) => {
        deleteADialect(dialectID).then(() => {
            update();
            closeDeleteConfirm();
            dispatch(addAlert(
                {
                    description: t("console:manage.features.claims.dialects.notifications." +
                        "deleteDialect.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.claims.dialects.notifications." +
                        "deleteDialect.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("console:manage.features.claims.dialects.notifications." +
                            "deleteDialect.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("console:manage.features.claims.dialects.notifications." +
                            "deleteDialect.genericError.message")
                }
            ));
        });
    };

    /**
     * This shows the delete confirmation modal
     * @return {ReactElement} Modal
     */
    const showDeleteConfirm = (): ReactElement => {
        let listItem: ListItem;

        if (isLocalClaim(deleteItem)) {
            listItem = {
                assertion: deleteItem.displayName,
                delete: deleteLocalClaim,
                message:t("console:manage.features.claims.list.confirmation.local.message"),
                name: t("console:manage.features.claims.list.confirmation.local.name")
            };
        } else if (isDialect(deleteItem)) {
            listItem = {
                assertion: deleteItem.dialectURI,
                delete: deleteDialect,
                message: t("console:manage.features.claims.list.confirmation.dialect.message"),
                name: t("console:manage.features.claims.list.confirmation.dialect.name")
            };
        } else {
            listItem = {
                assertion: deleteItem.claimURI,
                delete: deleteExternalClaim,
                message: ( t("console:manage.features.claims.list.confirmation.external.message") +
                    (attributeType && attributeType === OIDC
                        ?
                        "If this attribute is attached to any scope, this action will also remove " +
                        "the attribute from the relevant scope."
                        : ClaimManagementConstants.EMPTY_STRING
                    )),
                name: t("console:manage.features.claims.list.confirmation.external.name")
            };
        }

        return (
            <ConfirmationModal
                onClose={ closeDeleteConfirm }
                type="negative"
                open={ deleteConfirm }
                assertionHint={ t("console:manage.features.claims.list.confirmation.hint") }
                assertionType="checkbox"
                primaryAction={ t("console:manage.features.claims.list.confirmation.action") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setDeleteConfirm(false);
                    setAlert(null);
                } }
                onPrimaryActionClick={ () => {
                    deleteType === ListType.EXTERNAL
                        ? listItem.delete(dialectID, deleteItem.id)
                        : listItem.delete(deleteItem.id);
                } }
                data-testid={ `${ testId }-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-delete-confirmation-modal-header` }
                >
                    { t("console:manage.features.claims.list.confirmation.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-testid={ `${ testId }-delete-confirmation-modal-message` }
                >
                    { t("console:manage.features.claims.list.confirmation.message", {
                        name: listItem.name
                    }) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-testid={ `${ testId }-delete-confirmation-modal-content` }
                >
                    <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                    { t("console:manage.features.claims.list.confirmation.content", {
                        message: listItem.message
                    }) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * This initiates the delete process
     * @param {ListType} type The type of the list item.
     * @param {Claim | ExternalClaim | ClaimDialect} item The list item to be deleted.
     */
    const initDelete = (type: ListType, item: Claim | ExternalClaim | ClaimDialect) => {
        setDeleteType(type);
        setDeleteItem(item);
        setDeleteConfirm(true);
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
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("console:manage.placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:manage.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:manage.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ attributeConfig.attributesPlaceholderAddButton(attributeType)
                        && (
                            <Show when={ AccessControlConstants.SCOPE_WRITE }>
                                <PrimaryButton
                                    onClick={ onEmptyListPlaceholderActionClick }
                                >
                                    <Icon name="add"/>
                                    {
                                        isLocalClaim(list)
                                            ?  t("console:manage.features.claims.list.placeholders.emptyList." +
                                                "action.local")
                                            : isDialect(list)
                                                ? t("console:manage.features.claims.list.placeholders.emptyList." +
                                                    "action.dialect")
                                                : t("console:manage.features.claims.list.placeholders." +
                                            "emptyList.action.external")
                                    }
                                </PrimaryButton>
                            </Show>
                        ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={
                        isLocalClaim(list)
                            ? t("console:manage.features.claims.list.placeholders.emptyList.title.local")
                            : isDialect(list)
                                ? t("console:manage.features.claims.list.placeholders.emptyList.title.dialect")
                                : t("console:manage.features.claims.list.placeholders.emptyList.title.external")
                    }
                    subtitle={ [

                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Generates the initial for an attribute.
     *
     * @param {Claim} - An attribute.
     *
     * @return {string} - The last word.
     */
    const generateInitialLetter = (claim: Claim): string => {
        const parts = claim.claimURI.split("/");

        return parts[ parts.length - 1 ];
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        if (isLocalClaim(list)) {
            return [
                {
                    allowToggleVisibility: false,
                    dataIndex: "displayName",
                    id: "displayName",
                    key: "displayName",
                    render: (claim: Claim) => {
                        const userStoresNotMapped = checkUserStoreMapping(claim);
                        const showWarning = userStoresNotMapped.length > 0;

                        return (
                            <Header as="h6" image>
                                <>
                                    { attributeConfig.attributes.showUserstoreMappingWarningIcon && showWarning && (
                                        <Popup
                                            trigger={ (
                                                <Icon
                                                    className="notification-icon"
                                                    name="warning circle"
                                                    size="small"
                                                    color="red"
                                                />
                                            ) }
                                            content={ (
                                                <div>
                                                    { t("console:manage.features.claims.list.warning") }
                                                    <ul>
                                                        {
                                                            userStoresNotMapped.map((store: string, index: number) => {
                                                                return (
                                                                    <li key={ index }>
                                                                        { store }
                                                                    </li>
                                                                );
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            ) }
                                            inverted
                                        />
                                    ) }
                                    <AppAvatar
                                        image={ (
                                            <AnimatedAvatar
                                                name={ generateInitialLetter(claim) }
                                                size="mini"
                                                data-testid={ `${ testId }-item-image-inner` }
                                            />
                                        ) }
                                        size="mini"
                                        spaced="right"
                                        data-testid={ `${ testId }-item-image` }
                                    />
                                </>
                                <Header.Content>
                                    { claim.displayName }
                                    <Header.Subheader>
                                        <code className="inline-code compact transparent">{ claim.claimURI }</code>
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                        );
                    },
                    // TODO: Add i18n strings.
                    title: t("console:manage.features.claims.list.columns.name")
                },
                {
                    allowToggleVisibility: false,
                    dataIndex: "action",
                    id: "actions",
                    key: "actions",
                    textAlign: "right",
                    title: ClaimManagementConstants.EMPTY_STRING
                }
            ];
        }

        if (isDialect(list)) {
            return [
                {
                    allowToggleVisibility: false,
                    dataIndex: "dialectURI",
                    id: "dialectURI",
                    key: "dialectURI",
                    render: (dialect: ClaimDialect) => {
                        return (
                            <Header
                                image
                                as="h6"
                                className="header-with-icon"
                                data-testid={ `${ testId }-item-heading` }
                            >
                                <AppAvatar
                                    image={ (
                                        <AnimatedAvatar
                                            name={ dialect.dialectURI }
                                            size="mini"
                                            data-testid={ `${ testId }-item-image-inner` }
                                        />
                                    ) }
                                    size="mini"
                                    spaced="right"
                                    data-testid={ `${ testId }-item-image` }
                                />
                                <Header.Content>
                                    { dialect.dialectURI }
                                </Header.Content>
                            </Header>
                        );
                    },
                    // TODO: Add i18n strings.
                    title: t("console:manage.features.claims.list.columns.dialectURI")
                },
                {
                    allowToggleVisibility: false,
                    dataIndex: "action",
                    id: "actions",
                    key: "actions",
                    textAlign: "right",
                    title: ClaimManagementConstants.EMPTY_STRING
                }
            ];
        }

        if (isExternalClaim(list)) {

            /**
             * A predicate that tells whether table action column should render or not.
             * Currently we only have "edit" and "delete". This will only check whether
             * one of the targeted action is enabled for all rows.
             *
             * @return {boolean} show it or hide
             */
            const shouldRenderActionsColumn = (): boolean => {
                const showEditAction =
                    attributeConfig.externalAttributes.showActions(dialectID) &&
                    attributeConfig.externalAttributes.isAttributeEditable &&
                    hasRequiredScopes(
                        featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.create,
                        allowedScopes
                    );
                const showDeleteAction =
                    attributeConfig.externalAttributes.showDeleteIcon(dialectID, list) &&
                    hasRequiredScopes(
                        featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.delete,
                        allowedScopes
                    );

                return showEditAction || showDeleteAction;
            };

            return [
                {
                    allowToggleVisibility: false,
                    dataIndex: "claimURI",
                    id: "claimURI",
                    key: "claimURI",
                    render: (claim: ExternalClaim) => {
                        return (
                            <Header
                                image
                                as="h6"
                                className="header-with-icon"
                                data-testid={ `${ testId }-item-heading` }
                            >
                                <AppAvatar
                                    image={ (
                                        <AnimatedAvatar
                                            name={ claim.claimURI }
                                            size="mini"
                                            data-testid={ `${ testId }-item-image-inner` }
                                        />
                                    ) }
                                    size="mini"
                                    spaced="right"
                                    data-testid={ `${ testId }-item-image` }
                                />
                                <Header.Content>
                                    { claim.claimURI }
                                </Header.Content>
                            </Header>
                        );
                    },
                    title: attributeType && attributeType === OIDC
                        ? "Name"
                        : t("console:manage.features.claims.list.columns.claimURI")
                },
                {
                    allowToggleVisibility: false,
                    dataIndex: "dialectURI",
                    id: "dialectURI",
                    key: "dialectURI",
                    render: (claim: ExternalClaim): ReactNode => (
                        (editClaim === claim?.id)
                            ? (
                                <EditExternalClaim
                                    claimID={ claim.id }
                                    dialectID={ dialectID }
                                    update={ () => {
                                        setEditClaim("");
                                        update();
                                    } }
                                    submit={ submitExternalClaim }
                                    claimURI={ claim.claimURI }
                                    externalClaims={ list }
                                    data-testid={ `${ testId }-edit-external-claim` }
                                    attributeType={ attributeType }
                                />
                            )
                            : <code>{ claim.mappedLocalClaimURI }</code>
                    ),
                    title: t("console:manage.features.claims.list.columns.dialectURI")
                },
                shouldRenderActionsColumn() ? {
                    allowToggleVisibility: false,
                    dataIndex: "action",
                    id: "actions",
                    key: "actions",
                    textAlign: "right",
                    title: ClaimManagementConstants.EMPTY_STRING
                } : null
            ].filter(Boolean);
        }

        return [
            {
                allowToggleVisibility: false,
                dataIndex: "claimURI",
                id: "claimURI",
                key: "claimURI",
                render: (claim: AddExternalClaim) => {
                    if (!claim) {
                        return null;
                    }

                    if (isEqual(editExternalClaim, claim)) {

                        return (
                            <EditExternalClaim
                                dialectID={ dialectID }
                                update={ () => {
                                    setEditExternalClaim(undefined);
                                } }
                                submit={ submitExternalClaim }
                                claimURI={ claim.claimURI }
                                onSubmit={ (values: Map<string, FormValue>) => {
                                    onEdit(claim, values);
                                } }
                                wizard={ true }
                                addedClaim={ claim }
                                externalClaims={ list }
                            />
                        );
                    }

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-item-heading` }
                        >
                            <AppAvatar
                                name={ claim.claimURI }
                                image={ (
                                    <AnimatedAvatar
                                        name={ claim.claimURI }
                                        size="mini"
                                        data-testid={ `${ testId }-item-image-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-testid={ `${ testId }-item-image` }
                            />
                            <Header.Content>
                                { claim.claimURI }
                                <Header.Subheader>
                                    { claim.mappedLocalClaimURI }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                // TODO: Add i18n strings.
                title: t("console:manage.features.claims.list.columns.dialectURI")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ClaimManagementConstants.EMPTY_STRING
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        if (isLocalClaim(list)) {
            return [
                {
                    icon: (): SemanticICONS => !hasRequiredScopes(featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.update, allowedScopes)
                        ? "eye"
                        : "pencil alternate",
                    onClick: (e: SyntheticEvent, claim: Claim | ExternalClaim | ClaimDialect): void => {
                        history.push(AppConstants.getPaths().get("LOCAL_CLAIMS_EDIT").replace(":id", claim?.id));
                    },
                    popupText: (): string => hasRequiredScopes(featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.update, allowedScopes)
                        ? t("common:edit")
                        : t("common:view"),
                    renderer: "semantic-icon"
                },
                attributeConfig.attributes.deleteAction && {
                    hidden: (): boolean => !hasRequiredScopes(featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.delete, allowedScopes),
                    icon: (): SemanticICONS => "trash alternate",
                    onClick: (e: SyntheticEvent, claim: Claim | ExternalClaim | ClaimDialect): void =>
                        initDelete(ListType.LOCAL, claim),
                    popupText: (): string => t("common:delete"),
                    renderer: "semantic-icon"
                }
            ];
        }

        if (isDialect(list)) {
            return [
                {
                    hidden: (): boolean => !hasRequiredScopes(featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.create, allowedScopes),
                    icon: (): SemanticICONS => "pencil alternate",
                    onClick: (e: SyntheticEvent, dialect: ClaimDialect): void => {
                        history.push(AppConstants.getPaths().get("EXTERNAL_DIALECT_EDIT").replace(":id", dialect.id));
                    },
                    popupText: (): string =>  t("common:edit"),
                    renderer: "semantic-icon"
                },
                attributeConfig.attributeMappings.deleteAction && {
                    hidden: (): boolean => !hasRequiredScopes(featureConfig?.attributeDialects,
                        featureConfig?.attributeDialects?.scopes?.delete, allowedScopes),
                    icon: (): SemanticICONS => "trash alternate",
                    onClick: (e: SyntheticEvent, dialect: ClaimDialect): void => initDelete(ListType.DIALECT, dialect),
                    popupText: (): string => t("common:delete"),
                    renderer: "semantic-icon"
                }
            ];
        }

        if (isExternalClaim(list)) {
            return [
                {
                    hidden: (claim: ExternalClaim): boolean => editClaim !== claim?.id,
                    icon: (): SemanticICONS => "check",
                    onClick: (): void => setSubmitExternalClaim(),
                    popupText: (): string => t("common:update"),
                    renderer: "semantic-icon"
                },
                attributeConfig.externalAttributes.showActions(dialectID) && {
                    hidden: (): boolean => {
                        if (attributeConfig.externalAttributes.isAttributeEditable) {
                            return !hasRequiredScopes(featureConfig?.attributeDialects,
                                featureConfig?.attributeDialects?.scopes?.create, allowedScopes);
                        } else {
                            return !attributeConfig.externalAttributes.isAttributeEditable;
                        }
                    },
                    icon: (claim: ExternalClaim): SemanticICONS => attributeConfig.externalAttributes
                        .getEditIcon(claim, editClaim),

                    link: (claim: ExternalClaim) => {
                        return attributeConfig.externalAttributes.isEditActionClickable(claim);
                    },
                    onClick: (e: SyntheticEvent, claim: ExternalClaim): void =>
                        attributeConfig.externalAttributes.editAttribute(claim, editClaim, setEditClaim),
                    popupText: (claim: ExternalClaim): string => attributeConfig.externalAttributes
                        .getEditPopupText(claim, editClaim),
                    renderer: "semantic-icon"
                },
                attributeConfig.externalAttributes.showDeleteIcon(dialectID, list) && {
                    hidden: (claim: ExternalClaim): boolean => {
                        if (!hasRequiredScopes(featureConfig?.attributeDialects,
                            featureConfig?.attributeDialects?.scopes?.delete, allowedScopes)
                            || attributeConfig.externalAttributes.hideDeleteIcon(claim)) {
                            return true;
                        }

                        if (attributeConfig.defaultScimMapping
                            && Object.keys(attributeConfig.defaultScimMapping).length > 0) {
                            const defaultSCIMClaims: Map<string, string> = attributeConfig
                                .defaultScimMapping[claim.claimDialectURI];

                            if (defaultSCIMClaims && defaultSCIMClaims.get(claim.claimURI)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    icon: (): SemanticICONS => "trash alternate",
                    onClick: (e: SyntheticEvent, claim: ExternalClaim): void =>
                        initDelete(ListType.EXTERNAL, claim),
                    popupText: (): string => t("common:delete"),
                    renderer: "semantic-icon"
                }
            ];
        }

        return [
            {
                hidden: (claim: AddExternalClaim): boolean => !isEqual(editExternalClaim, claim),
                icon: (): SemanticICONS => "check",
                onClick: () => setSubmitExternalClaim(),
                popupText: (): string => t("common:update"),
                renderer: "semantic-icon"
            },
            {
                hidden: () => !isEditable,
                icon: (claim: AddExternalClaim): SemanticICONS => isEqual(editExternalClaim, claim)
                    ? "times"
                    : "pencil alternate",
                onClick: (e: SyntheticEvent, claim: AddExternalClaim) => {
                    setEditExternalClaim(editExternalClaim ? undefined : claim);
                },
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, claim: AddExternalClaim) => onDelete(claim),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolves table row on click action.
     *
     * @param {React.SyntheticEvent} e - Click Event.
     * @param {Claim | ExternalClaim | ClaimDialect | any} item - Row item.
     */
    const resolveTableRowClick = (e: SyntheticEvent, item: Claim | ExternalClaim | ClaimDialect | any): void => {

        //Disables inline edit if create scope is not available
        if (!hasRequiredScopes(featureConfig?.attributeDialects,
            featureConfig?.attributeDialects?.scopes?.create, allowedScopes)) {
            return;
        }

        if (isLocalClaim(list)) {
            history.push(AppConstants.getPaths().get("LOCAL_CLAIMS_EDIT").replace(":id", item.id));
        } else if (isDialect(list)) {
            history.push(AppConstants.getPaths().get("EXTERNAL_DIALECT_EDIT").replace(":id", item.id));
        } else if (isExternalClaim(list) && attributeConfig.externalAttributes.isRowClickable(dialectID, ItemHeader)) {
            if (attributeConfig.externalAttributes.isAttributeEditable) {
                setEditClaim(editClaim ? "" : item.id);
            }
        } else {
            if (!isEditable) {
                return;
            }
            setEditExternalClaim(item);
        }

        onListItemClick && onListItemClick(e, item);
    };

    return (
        <>
            { deleteConfirm ? showDeleteConfirm() : null }
            <DataTable<(Claim | ExternalClaim | ClaimDialect)[]>
                className="external-dialects-list"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ resolveTableRowClick }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ showTableHeaders }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
                isRowSelectable={ (claim: Claim | ExternalClaim | ClaimDialect) =>
                    attributeConfig.isRowSelectable(claim) }
            />
        </>
    );
};

/**
 * Default props for the component.
 */
ClaimsList.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "claims-list",
    selection: true,
    showListItemActions: true,
    showTableHeaders: false
};
