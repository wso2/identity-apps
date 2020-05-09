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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { LoadableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { ConfirmationModal, EmptyPlaceholder, LinkButton, PrimaryButton, ResourceList } from "@wso2is/react-components"
import { CopyInputField } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Icon, Image, List, Popup } from "semantic-ui-react";
import { EditExternalClaim } from "./edit";
import { deleteAClaim, deleteADialect, deleteAnExternalClaim, getUserStores } from "../../api";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { EDIT_EXTERNAL_DIALECT, EDIT_LOCAL_CLAIMS_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import {
    AddExternalClaim,
    AlertLevels,
    Claim,
    ClaimDialect,
    ExternalClaim,
    FeatureConfigInterface,
    UserStoreListItem
} from "../../models";
import { AvatarBackground } from "../shared";

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

/**
 * Prop types of `ClaimsList` component
 */
interface ClaimsListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface {
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
    onEdit?: (index: number, values: Map<string, FormValue>) => void;
    /**
     * Called when delete is clicked on add external claim list.
     */
    onDelete?: (index: number) => void;
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
}

/**
 * This component renders claims/dialects list
 * @param {ClaimsListPropsInterface} props
 * @return {ReactElement}
 */
export const ClaimsList = (props: ClaimsListPropsInterface): ReactElement => {

    const {
        featureConfig,
        list,
        localClaim,
        update,
        dialectID,
        onEdit,
        onDelete,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery
    } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteType, setDeleteType ] = useState<ListType>(null);
    const [ deleteItem, setDeleteItem ] = useState<Claim | ExternalClaim | ClaimDialect>(null);
    const [ userStores, setUserStores ] = useState<UserStoreListItem[]>([]);
    const [ editClaim, setEditClaim ] = useState("");
    const [ editExternalClaim, setEditExternalClaim ] = useState(-1);

    const dispatch = useDispatch();

    const [ submitExternalClaim, setSubmitExternalClaim ] = useTrigger();

    const claimURIText = useRef([]);
    const copyButton = useRef([]);

    const { t } = useTranslation();

    list?.forEach((element, index) => {
        claimURIText.current.push(claimURIText.current[ index ] || React.createRef());
        copyButton.current.push(copyButton.current[ index ] || React.createRef())
    });

    useEffect(() => {
        if (isLocalClaim(list)) {
            getUserStores(null).then(response => {
                setUserStores(response);
            }).catch(error => {
                dispatch(addAlert({
                    description: error?.description
                        ?? t("devPortal:components.userstores.notifications.fetchUserstores.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        ?? t("devPortal:components.userstores.notifications.fetchUserstores.genericError.message")
                }))
            })
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]
            | Claim | ExternalClaim | ClaimDialect
    ): toBeDetermined is ClaimDialect[] | ClaimDialect => {
        return localClaim === ListType.DIALECT
    };

    /**
     * This checks if the list data is an external claim.
     *
     * @param {Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]} toBeDetermined
     *
     * @return {boolean} `true` if the data is a an external claim.
     */
    const isExternalClaim = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[] | AddExternalClaim[]
            | Claim | ExternalClaim | ClaimDialect
    ): toBeDetermined is ExternalClaim[] | ExternalClaim => {
        return localClaim === ListType.EXTERNAL
    };

    /**
     * This displays the input content within a `List` content.
     * 
     * @param {any} content Element to be enclosed within a list.
     * 
     * @return {ReactElement}
     */
    const listContent = (content: any): ReactElement => (
        <List.Content>
            <List.Description className="list-item-meta">
                { content }
            </List.Description>
        </List.Content>
    );

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
            dispatch(addAlert(
                {
                    description: t("devPortal:components.claims.local.notifications.deleteClaim.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.claims.local.notifications.deleteClaim.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.local.notifications.deleteClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.local.notifications.deleteClaim.genericError.message")
                }
            ));
        })
    };

    /**
     * This deletes an external claim
     * @param {string} dialectID 
     * @param {string} claimID 
     */
    const deleteExternalClaim = (dialectID: string, claimID: string) => {
        deleteAnExternalClaim(dialectID, claimID).then(() => {
            update();
            closeDeleteConfirm();
            dispatch(addAlert(
                {
                    description: t("devPortal:components.claims.external.notifications." +
                        "deleteExternalClaim.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.claims.external.notifications." +
                        "deleteExternalClaim.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.external.notifications." +
                            "deleteExternalClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.external.notifications." +
                            "deleteExternalClaim.genericError.message")
                }
            ));
        })
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
                    description: t("devPortal:components.claims.dialect.notifications." +
                        "deleteDialect.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.claims.dialect.notifications." +
                        "deleteDialect.success.message")
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.dialect.notifications." +
                            "deleteDialect.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.dialect.notifications." +
                            "deleteDialect.genericError.message")
                }
            ));
        })
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
                message:t("devPortal:components.claims.list.confirmation.local.message"),
                name: t("devPortal:components.claims.list.confirmation.local.name")
            }
        } else if (isDialect(deleteItem)) {
            listItem = {
                assertion: deleteItem.dialectURI,
                delete: deleteDialect,
                message: t("devPortal:components.claims.list.confirmation.dialect.message"),
                name: t("devPortal:components.claims.list.confirmation.dialect.name")
            }
        } else {
            listItem = {
                assertion: deleteItem.claimURI,
                delete: deleteExternalClaim,
                message: t("devPortal:components.claims.list.confirmation.external.message"),
                name: t("devPortal:components.claims.list.confirmation.external.name")
            }
        }

        return (
            <ConfirmationModal
                onClose={ closeDeleteConfirm }
                type="warning"
                open={ deleteConfirm }
                assertion={ listItem.assertion }
                assertionHint={ <p>{t("devPortal:components.claims.list.confirmation.hint",{
                    assertion:<strong>{ listItem.assertion }</strong>
                })}</p> }
                assertionType="input"
                primaryAction={ t("devPortal:components.claims.list.confirmation.action") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => setDeleteConfirm(false) }
                onPrimaryActionClick={ () => {
                    deleteType === ListType.EXTERNAL
                        ? listItem.delete(dialectID, deleteItem.id)
                        : listItem.delete(deleteItem.id)
                } }
            >
                <ConfirmationModal.Header>
                {t("devPortal:components.claims.list.confirmation.header")}
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    {t("devPortal:components.claims.list.confirmation.message",{
                        name:listItem.name
                    })}
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                {t("devPortal:components.claims.list.confirmation.content",{
                    message:listItem.message
                })}
                   
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
     * This generates the first letter of a dialect
     * @param {string} name 
     * @return {string} The first letter of a dialect
     */
    const generateDialectLetter = (name: string): string => {
        const stringArray = name.replace("http://", "").split("/");
        return stringArray[ 0 ][ 0 ].toLocaleUpperCase();
    };

    /**
     * This generates the first letter of a claim
     * @param {string} name 
     * @return {string} The first letter of a claim
     */
    const generateClaimLetter = (name: string): string => {
        const stringArray = name.replace("http://", "").split("/");
        return stringArray[ stringArray.length - 1 ][ 0 ].toLocaleUpperCase();
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
                        {t("devPortal:components.claims.list.placeholders.emptySearch.action")}
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title= { t("devPortal:components.claims.list.placeholders.emptySearch.title") }
                    subtitle={ [
                         t("devPortal:components.claims.list.placeholders.emptySearch.action",{
                             searchQuery:searchQuery
                         })
                    ] }
                />
            );
        }

        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton
                            onClick={ onEmptyListPlaceholderActionClick }
                        >
                            <Icon name="add"/>
                            {
                            isLocalClaim(list)
                                ?  t("devPortal:components.claims.list.placeholders.emptyList.action.local")
                                : isDialect(list)
                                    ? t("devPortal:components.claims.list.placeholders.emptyList.action.dialect")
                                    : t("devPortal:components.claims.list.placeholders.emptyList.action.external")
                            }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={
                        isLocalClaim(list)
                            ? t("devPortal:components.claims.list.placeholders.emptyList.title.local")
                            : isDialect(list)
                                ? t("devPortal:components.claims.list.placeholders.emptyList.title.dialect")
                                : t("devPortal:components.claims.list.placeholders.emptyList.title.external")
                    }
                    subtitle={ [
                        
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            { deleteConfirm ? showDeleteConfirm() : null }
            <ResourceList
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
            >
                {
                    list && list instanceof Array && list.length > 0
                        ? isLocalClaim(list)
                            ? list?.map((claim: Claim, index: number) => {
                                const userStoresNotMapped = checkUserStoreMapping(claim);
                                const showWarning = userStoresNotMapped.length > 0;
                                return (
                                    <ResourceList.Item
                                        key={ index }
                                        actions={ [
                                            {
                                                icon: "pencil alternate",
                                                onClick: () => {
                                                    history.push(`${EDIT_LOCAL_CLAIMS_PATH}/${claim?.id}`)
                                                },
                                                popupText: t("common:edit"),
                                                type: "button"
                                            },
                                            {
                                                hidden: !hasRequiredScopes(
                                                    featureConfig?.attributeDialects,
                                                    featureConfig?.attributeDialects?.scopes?.delete),
                                                icon: "trash alternate",
                                                onClick: () => { initDelete(ListType.LOCAL, claim) },
                                                popupText: t("common:delete"),
                                                type: "dropdown"
                                            }
                                        ] }
                                        avatar={
                                            <>
                                                { showWarning && (
                                                    <Popup
                                                        trigger={
                                                            <Icon
                                                                className="notification-icon"
                                                                name="warning circle"
                                                                size="small"
                                                                color="red"
                                                            />
                                                        }
                                                        content={
                                                            <div>
                                                               { t("devPortal:components.claims.list.warning")}
                                                                <ul>
                                                                    {
                                                                        userStoresNotMapped.map(
                                                                            (store: string, index: number) => {
                                                                                return (
                                                                                    <li key={ index }>
                                                                                        { store }
                                                                                    </li>
                                                                                )
                                                                            })
                                                                    }
                                                                </ul>


                                                            </div>
                                                        }
                                                        inverted
                                                    />
                                                ) }
                                                <Image
                                                    floated="left"
                                                    verticalAlign="middle"
                                                    rounded
                                                    centered
                                                    size="mini"
                                                >
                                                    <AvatarBackground />
                                                    <span className="claims-letter">
                                                        { generateClaimLetter(claim.claimURI) }
                                                    </span>
                                                </Image>
                                            </>
                                        }
                                        actionsFloated="right"
                                        itemHeader={ claim.displayName }
                                        metaContent={ [
                                            listContent(
                                                <CopyInputField
                                                    value={ claim ? claim.claimURI : "" }
                                                    className="copy-field"
                                                />
                                            )
                                        ] }
                                    />
                                )
                            })
                            : isDialect(list)
                                ? list?.map((dialect: ClaimDialect, index: number) => {
                                    return (
                                        <ResourceList.Item
                                            key={ index }
                                            avatar={
                                                <Image
                                                    floated="left"
                                                    verticalAlign="middle"
                                                    rounded
                                                    centered
                                                    size="mini"
                                                >
                                                    <AvatarBackground />
                                                    <span className="claims-letter">
                                                        { generateDialectLetter(dialect.dialectURI) }
                                                    </span>
                                                </Image>
                                            }
                                            actions={ [
                                                {
                                                    icon: "pencil alternate",
                                                    onClick: () => {
                                                        history.push(`${EDIT_EXTERNAL_DIALECT}/${dialect.id}`)
                                                    },
                                                    popupText: t("common:edit"),
                                                    type: "button"
                                                },
                                                {
                                                    hidden: !hasRequiredScopes(
                                                        featureConfig?.attributeDialects,
                                                        featureConfig?.attributeDialects?.scopes?.delete),
                                                    icon: "trash alternate",
                                                    onClick: () => { initDelete(ListType.DIALECT, dialect) },
                                                    popupText: t("common:delete"),
                                                    type: "dropdown"
                                                }
                                            ] }
                                            actionsFloated="right"
                                            itemHeader={ dialect.dialectURI }
                                        />
                                    );
                                })
                                : isExternalClaim(list)
                                    ? list?.map((claim: ExternalClaim, index: number) => {
                                        return (
                                            <ResourceList.Item
                                                key={ index }
                                                actions={ [
                                                    {
                                                        hidden: editClaim !== claim?.id,
                                                        icon: "check",
                                                        onClick: () => {
                                                            setSubmitExternalClaim();
                                                        },
                                                        popupText: t("common:update"),
                                                        type: "button"
                                                    },
                                                    {
                                                        icon: editClaim == claim?.id ? "times" : "pencil alternate",
                                                        onClick: () => {
                                                            setEditClaim(editClaim ? "" : claim?.id);
                                                        },
                                                        popupText: t("common:edit"),
                                                        type: "button"
                                                    },
                                                    {
                                                        hidden: !hasRequiredScopes(
                                                            featureConfig?.attributeDialects,
                                                            featureConfig?.attributeDialects?.scopes?.delete),
                                                        icon: "trash alternate",
                                                        onClick: () => { initDelete(ListType.EXTERNAL, claim) },
                                                        popupText: t("common:delete"),
                                                        type: "dropdown"
                                                    }
                                                ] }
                                                avatar={
                                                    <Image
                                                        floated="left"
                                                        verticalAlign="middle"
                                                        rounded
                                                        centered
                                                        size="mini"
                                                    >
                                                        <AvatarBackground />
                                                        <span className="claims-letter">
                                                            { generateClaimLetter(claim.claimURI) }
                                                        </span>
                                                    </Image>
                                                }
                                                actionsFloated="right"
                                                itemHeader={ claim.claimURI }
                                                metaContent={ [
                                                    editClaim !== claim?.id
                                                        ? claim.mappedLocalClaimURI
                                                        : null,
                                                    editClaim === claim?.id
                                                        ? <EditExternalClaim
                                                            claimID={ claim.id }
                                                            dialectID={ dialectID }
                                                            update={ () => {
                                                                setEditClaim("");
                                                                update();
                                                            } }
                                                            submit={ submitExternalClaim }
                                                            claimURI={ claim.claimURI }
                                                            externalClaims={ list }
                                                        />
                                                        : null
                                                ].filter(meta => meta !== null) }
                                            />
                                        )
                                    })
                                    : list?.map((claim: AddExternalClaim, index: number) => {
                                        return (
                                            <ResourceList.Item
                                                key={ index }
                                                actions={ [
                                                    {
                                                        hidden: editExternalClaim !== index,
                                                        icon: "check",
                                                        onClick: () => {
                                                            setSubmitExternalClaim();
                                                        },
                                                        popupText: t("common:update"),
                                                        type: "button"
                                                    },
                                                    {
                                                        icon: editExternalClaim === index
                                                            ? "times"
                                                            : "pencil alternate",
                                                        onClick: () => {
                                                            setEditExternalClaim(
                                                                editExternalClaim !== -1 ? -1 : index
                                                            );
                                                        },
                                                        popupText: t("common:edit"),
                                                        type: "button"
                                                    },
                                                    {
                                                        icon: "trash alternate",
                                                        onClick: () => { onDelete(index) },
                                                        popupText: t("common:delete"),
                                                        type: "dropdown"
                                                    }
                                                ] }
                                                avatar={
                                                    editExternalClaim !== index ?
                                                        (
                                                            <Image
                                                                floated="left"
                                                                verticalAlign="middle"
                                                                rounded
                                                                centered
                                                                size="mini"
                                                            >
                                                                <AvatarBackground />
                                                                <span className="claims-letter">
                                                                    { generateClaimLetter(claim.claimURI) }
                                                                </span>
                                                            </Image>
                                                        )
                                                        : null
                                                }
                                                actionsFloated="right"
                                                itemHeader={ editExternalClaim !== index ? claim.claimURI : null }
                                                itemDescription={ editExternalClaim !== index
                                                    ? claim.mappedLocalClaimURI
                                                    : null
                                                }
                                                descriptionColumnWidth={ 11 }
                                                metaColumnWidth={ editExternalClaim === index ? 12 : 1 }
                                                actionsColumnWidth={ editExternalClaim !== index ? 4 : 4 }
                                                metaContent={ [
                                                    editExternalClaim === index
                                                    && (
                                                        <EditExternalClaim
                                                            dialectID={ dialectID }
                                                            update={ () => {
                                                                setEditExternalClaim(-1);
                                                            } }
                                                            submit={ submitExternalClaim }
                                                            claimURI={ claim.claimURI }
                                                            onSubmit={ (values: Map<string, FormValue>) => {
                                                                onEdit(index, values);
                                                            } }
                                                            wizard={ true }
                                                            addedClaim={ claim }
                                                            externalClaims={ list }
                                                        />
                                                    )
                                                ] }
                                            />
                                        )
                                    })
                        : showPlaceholders()
                }
            </ResourceList>
        </>
    )
};
