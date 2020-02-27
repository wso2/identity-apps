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
import { ClaimsList, ListType, LocalClaimsSearch } from "../components";
import { Claim, ClaimsGetParams } from "../models";
import { getAllLocalClaims, getADialect } from "../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../constants";
import { AddLocalClaims } from "../components";

export const LocalClaimsPage = (): React.ReactElement => {

    const [claims, setClaims] = useState<Claim[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [openModal, setOpenModal] = useState(false);
    const [claimURIBase, setClaimURIBase] = useState("");

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
        getLocalClaims(null,null,null,null);
        getADialect("local").then((response) => {
            setClaimURIBase(response.dialectURI);
        }).catch(error => {
            // TODO: Notify 
        });
    }, []);

    const getLocalClaims = (limit?: number, sort?: string, offset?: number, filter?: string) => {
        const params: ClaimsGetParams = {
            limit: limit || null,
            sort: sort || null,
            offset: offset || null,
            filter: filter || null
        };

        getAllLocalClaims(params).then(response => {
            setClaims(response);
        }).catch(error => {
            // TODO: Notify
        });
    };

    const paginate = (list: Claim[], limit: number, offset: number): Claim[] => {
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
            {
                openModal
                    ? <AddLocalClaims
                        open={openModal}
                        onClose={() => { setOpenModal(false) }}
                        claimID={null}
                        update={getLocalClaims}
                        claimURIBase={claimURIBase}
                    />
                    : null
            }
            <PageLayout
                title="Local Claims"
                description="View, edit and add local claims"
                showBottomDivider={true}
            >
                <ListLayout
                    advancedSearch={
                        <LocalClaimsSearch
                            onFilter={(query) => {
                                getLocalClaims(null, null, null, query);
                            }}
                            claimURIBase={claimURIBase}
                        />
                    }
                    currentListSize={listItemLimit}
                    listItemLimit={listItemLimit}
                    onItemsPerPageDropdownChange={handleItemsPerPageDropdownChange}
                    onPageChange={handlePaginationChange}
                    onSortStrategyChange={null}
                    rightActionPanel={
                        (
                            <PrimaryButton
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                            >
                                <Icon name="add" />Add a Local Claim
                        </PrimaryButton>
                        )
                    }
                    leftActionPanel={null}
                    showPagination={true}
                    sortOptions={null}
                    sortStrategy={null}
                    totalPages={Math.ceil(claims?.length / listItemLimit)}
                    totalListSize={claims?.length}
                >
                    <ClaimsList
                        list={paginate(claims, listItemLimit, offset)}
                        localClaim={ListType.LOCAL}
                        update={getLocalClaims}
                    />
                </ListLayout>
            </PageLayout>
        </>
    );
};
