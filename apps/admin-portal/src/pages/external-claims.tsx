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

import React, { useEffect, useState } from "react";
import { PageLayout } from "../layouts";
import { ListLayout } from "../layouts";
import { PrimaryButton } from "@wso2is/react-components";
import { Icon, DropdownProps, PaginationProps } from "semantic-ui-react";
import { ClaimsList, ListType, AddExternalClaims, EditExternalClaims, ExternalClaimsSearch } from "../components";
import { ExternalClaim, ClaimDialect, AlertLevels } from "../models";
import { getAllExternalClaims, getADialect } from "../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../constants";
import { history } from "../helpers";
import { useDispatch } from "react-redux";
import { addAlert } from "../store/actions";

export const ExternalClaimsPage = (props): React.ReactElement => {

    const [claims, setClaims] = useState<ExternalClaim[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [dialect, setDialect] = useState<ClaimDialect>(null);
    const [addClaim, setAddClaim] = useState(false);
    const [editClaim, setEditClaim] = useState(false);
    const [editClaimID, setEditClaimID] = useState("");

    const dispatch=useDispatch();

    const dialectID = props.match.params.id;

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);

        getADialect(dialectID).then(response => {
            setDialect(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description,
                    level: AlertLevels.ERROR,
                    message: error?.message
                }
            ));
        });

    }, []);

    const getExternalClaims = (limit?: number, offset?: number, sort?: string, filter?: string) => {
        dialectID && getAllExternalClaims(dialectID, { limit, offset, sort, filter }).then(response => {
            setClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description,
                    level: AlertLevels.ERROR,
                    message: error?.message
                }
            ));
        });
    }
    
    useEffect(() => {
        getExternalClaims();
    }, [dialectID]);

    const paginate = (list: ExternalClaim[], limit: number, offset: number): ExternalClaim[] => {
        return list?.slice(offset, offset + limit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListItemLimit(data.value as number);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setOffset((data.activePage as number - 1) * listItemLimit);
    };

    return (
        <>
            {addClaim
                ? <AddExternalClaims
                    open={ addClaim }
                    onClose={ () => { setAddClaim(false) } }
                    dialect={ dialect }
                    update={ getExternalClaims }
                />
                : null
            }
            {
                editClaim
                    ? <EditExternalClaims
                        open={ editClaim }
                        onClose={ () => {
                            setEditClaim(false);
                            setEditClaimID("");
                        } }
                        update={ getExternalClaims }
                        claimID={ editClaimID }
                        dialectID={ dialect?.id }
                    />
                    : null
            }
            <PageLayout
                title="External Claims"
                description={ "View, edit and add claims of " + dialect?.dialectURI }
                showBottomDivider={ true }
                backButton={ {
                    onClick: () => { history.push("/external-dialects") },
                    text: "Go back to Claim Dialects"
                } }
            >
                <ListLayout
                    advancedSearch={ <ExternalClaimsSearch onFilter={ (query) => {
                        getExternalClaims(null, null, null, query);
                    } }/> }
                    currentListSize={ listItemLimit }
                    listItemLimit={ listItemLimit }
                    onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                    onPageChange={ handlePaginationChange }
                    onSortStrategyChange={ null }
                    rightActionPanel={
                        (
                            <PrimaryButton
                                onClick={ () => {
                                    setAddClaim(true);
                                } }
                            >
                                <Icon name="add" />Add a claim
                        </PrimaryButton>
                        )
                    }
                    showPagination={ true }
                    sortOptions={ null }
                    sortStrategy={ null }
                    totalPages={ Math.ceil(claims?.length / listItemLimit) }
                    totalListSize={ claims?.length }
                >
                    <ClaimsList
                        list={ paginate(claims, listItemLimit, offset) }
                        localClaim={ ListType.EXTERNAL }
                        openEdit={ (claimID: string) => {
                            setEditClaim(true);
                            setEditClaimID(claimID);
                        } }
                        update={ getExternalClaims }
                        dialectID={ dialectID }
                    />
                </ListLayout>
            </PageLayout>
        </>
    );
};
