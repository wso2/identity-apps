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

import { AlertLevels, AppConfigInterface, Claim, ClaimDialect, ExternalClaim, UserStoreListItem } from "../../models";
import { AppConfig, history } from "../../helpers";
import { deleteAClaim, deleteADialect, deleteAnExternalClaim, getUserStores } from "../../api";
import { EDIT_EXTERNAL_DIALECT, EDIT_LOCAL_CLAIMS_PATH } from "../../constants";
import { Icon, List, Modal, Popup } from "semantic-ui-react";
import { LinkButton, PrimaryButton, ResourceList } from "@wso2is/react-components"
import React, { useContext, useEffect, useRef, useState } from "react";

import { addAlert } from "@wso2is/core/store";
import { ClaimsAvatarBackground } from ".";
import { CopyInputField } from "@wso2is/react-components";
import { Image } from "semantic-ui-react";
import { useDispatch } from "react-redux";

/**
 * Enum containing the list types
 */
export enum ListType {
    LOCAL,
    EXTERNAL,
    DIALECT
}

/**
 * Prop types of `ClaimsList` component
 */
interface ClaimsListPropsInterface {
    /**
     * The array containing claims/external claims/claim dialects
     */
    list: Claim[] | ExternalClaim[] | ClaimDialect[];
    /**
     * Sets if the list is to contain local claims
     */
    localClaim: ListType;
    /**
     * Opens the edit modal
     */
    openEdit?: (id: string) => void;
    /**
     * Called to initiate update
     */
    update: () => void;
    /**
     * The dialect ID of claims
     */
    dialectID?: string;
}

/**
 * This component renders claims/dialects list
 * @param {ClaimsListPropsInterface} props
 * @return {React.ReactElement}
 */
export const ClaimsList = (props: ClaimsListPropsInterface): React.ReactElement => {

    const { list, localClaim, openEdit, update, dialectID } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteType, setDeleteType ] = useState<ListType>(null);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ userStores, setUserStores ] = useState<UserStoreListItem[]>([]);

    const dispatch = useDispatch();

    const appConfig: AppConfigInterface = useContext(AppConfig);

    const claimURIText = useRef([]);
    const copyButton = useRef([]);

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
                    description: error?.description ?? "An error occurred while fetching the userstores.",
                    level: AlertLevels.ERROR,
                    message: error?.message ?? "Something went wrong"
                }))
            })
        }
    }, [ list ]);

    /**
     * This check if the input claim is mapped to attribute from every userstore.
     * 
     * @param {Claim} claim The claim to be checked.
     * 
     * @returns {string[]} The array of userstore names without a mapped attribute.
     */
    const checkUserStoreMapping = (claim: Claim): string[] => {
        const userStoresNotSet = [];

        userStores.forEach(userStore => {
            claim.attributeMapping.find(attribute => {
                return attribute.userstore.toLowerCase() === userStore.name.toLowerCase();
            }) ?? userStoresNotSet.push(userStore.name);
        });

        claim.attributeMapping.find(attribute => {
            return attribute.userstore === "PRIMARY";
        }) ?? userStoresNotSet.push("Primary");

        return userStoresNotSet;
    }

    /**
     * This checks if the list data is a local claim
     * @param {Claim[] | ExternalClaim[] | ClaimDialect[]} toBeDetermined Type to be checked
     * @return {boolean} `true` if the data is a local claim
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isLocalClaim = (toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[]): toBeDetermined is Claim[] => {
        return localClaim === ListType.LOCAL;
    }

    /**
     * This checks if the list data is a dialect
     * @param {Claim[] | ExternalClaim[] | ClaimDialect[]} toBeDetermined
     * @return {boolean} `true` if the data is a dialect 
     */
    const isDialect = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[]
    ): toBeDetermined is ClaimDialect[] => {
        return localClaim === ListType.DIALECT
    }

    /**
     * This displays the input content within a `List` content
     * @param {any} content 
     * @return {React.ReactElement}
     */
    const listContent = (content: any): React.ReactElement => (
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
        setDeleteID(null);
        setDeleteType(null);
    }

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
                    description: "The local claim has been deleted successfully!",
                    level: AlertLevels.SUCCESS,
                    message: "Local claim deleted successfully"
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while deleting the local claim",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
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
                    description: "The external claim has been deleted successfully!",
                    level: AlertLevels.SUCCESS,
                    message: "External claim deleted successfully"
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while deleting the external claim",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
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
                    description: "The dialect has been deleted successfully!",
                    level: AlertLevels.SUCCESS,
                    message: "Dialect deleted successfully"
                }
            ));
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while deleting the dialect",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        })
    };

    /**
     * This shows the delete confirmation modal
     * @return {React.ReactElement} Modal
     */
    const showDeleteConfirm = (): React.ReactElement => {
        return (
            <Modal
                open={ deleteConfirm }
                onClose={ closeDeleteConfirm }
                size="mini"
                dimmer="blurring"
            >
                <Modal.Header>
                    Confirm Delete
                </Modal.Header>
                <Modal.Content>
                    This will completely delete the
                    {
                        deleteType === ListType.DIALECT
                            ? " Claim Dialect. "
                            : deleteType === ListType.EXTERNAL
                                ? " External Claim. "
                                : " Local Claim. "
                    }
                    Do you want to continue deleting it?
                </Modal.Content>
                <Modal.Actions>
                    <LinkButton onClick={ closeDeleteConfirm }>
                        Cancel
                    </LinkButton>
                    <PrimaryButton onClick={ () => {
                        switch (deleteType) {
                            case ListType.DIALECT:
                                deleteDialect(deleteID);
                                break;
                            case ListType.EXTERNAL:
                                deleteExternalClaim(dialectID, deleteID);
                                break;
                            case ListType.LOCAL:
                                deleteLocalClaim(deleteID);
                                break;
                        }
                    } }>
                        Delete
                    </PrimaryButton>
                </Modal.Actions>
            </Modal>
        )
    };

    /**
     * This initiates the delete process
     * @param {ListType} type 
     * @param {string} id 
     */
    const initDelete = (type: ListType, id: string) => {
        setDeleteType(type);
        setDeleteID(id);
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
    }

    /**
     * This generates the first letter of a claim
     * @param {string} name 
     * @return {string} The first letter of a claim
     */
    const generateClaimLetter = (name: string): string => {
        const stringArray = name.replace("http://", "").split("/");
        return stringArray[ stringArray.length - 1 ][ 0 ].toLocaleUpperCase();
    }

    return (
        <>
            { deleteConfirm ? showDeleteConfirm() : null }
            <ResourceList>
                {
                    isLocalClaim(list)
                        ? appConfig?.claimDialects?.features?.localClaims?.permissions?.read
                        && list?.map((claim: Claim, index: number) => {
                            const userStoresNotMapped = checkUserStoreMapping(claim);
                            const showWarning = userStoresNotMapped.length > 0;
                            return (
                                <ResourceList.Item
                                    key={ index }
                                    actions={ [
                                        appConfig?.claimDialects?.features?.localClaims?.permissions?.update && {
                                            icon: "pencil alternate",
                                            onClick: () => {
                                                history.push(`${EDIT_LOCAL_CLAIMS_PATH}/${claim?.id}`)
                                            },
                                            popupText: "Edit",
                                            type: "button"
                                        },
                                        appConfig?.claimDialects?.features?.localClaims?.permissions?.delete && {
                                            icon: "trash alternate",
                                            onClick: () => { initDelete(ListType.LOCAL, claim?.id) },
                                            popupText: "Delete",
                                            type: "dropdown"
                                        }
                                    ] }
                                    avatar={
                                        <>
                                            { showWarning &&
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
                                                            This claim has not been mapped to an attribute
                                                            in the following userstores:
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
                                            }
                                            <Image
                                                floated="left"
                                                verticalAlign="middle"
                                                rounded
                                                centered
                                                size="mini"
                                            >
                                                <ClaimsAvatarBackground />
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
                            ? appConfig?.claimDialects?.permissions?.read
                            && list?.map((dialect: ClaimDialect, index: number) => {
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
                                                <ClaimsAvatarBackground />
                                                <span className="claims-letter">
                                                    { generateDialectLetter(dialect.dialectURI) }
                                                </span>
                                            </Image>
                                        }
                                        actions={ [
                                            appConfig?.claimDialects?.permissions?.update && {
                                                icon: "pencil alternate",
                                                onClick: () => {
                                                    history.push(`${EDIT_EXTERNAL_DIALECT}/${dialect.id}`)
                                                },
                                                popupText: "Edit",
                                                type: "button"
                                            },
                                            appConfig?.claimDialects?.permissions?.delete && {
                                                icon: "trash alternate",
                                                onClick: () => { initDelete(ListType.DIALECT, dialect?.id) },
                                                popupText: "Delete",
                                                type: "dropdown"
                                            }
                                        ] }
                                        actionsFloated="right"
                                        itemHeader={ dialect.dialectURI }
                                    />
                                );
                            })
                            : appConfig?.claimDialects?.features?.externalClaims?.permissions?.read
                            && list?.map((claim: ExternalClaim, index: number) => {
                                return (
                                    <ResourceList.Item
                                        key={ index }
                                        actions={ [
                                            appConfig?.claimDialects?.features?.externalClaims?.permissions?.update && {
                                                icon: "pencil alternate",
                                                onClick: () => {
                                                    openEdit(claim?.id);
                                                },
                                                popupText: "Edit",
                                                type: "button"
                                            },
                                            appConfig?.claimDialects?.features?.externalClaims?.permissions?.delete && {
                                                icon: "trash alternate",
                                                onClick: () => { initDelete(ListType.EXTERNAL, claim?.id) },
                                                popupText: "Delete",
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
                                                <ClaimsAvatarBackground />
                                                <span className="claims-letter">
                                                    { generateClaimLetter(claim.claimURI) }
                                                </span>
                                            </Image>
                                        }
                                        actionsFloated="right"
                                        itemHeader={ claim.claimURI }
                                        itemDescription={ claim.mappedLocalClaimURI }
                                    />
                                )
                            })
                }
            </ResourceList>
        </>
    )
};
