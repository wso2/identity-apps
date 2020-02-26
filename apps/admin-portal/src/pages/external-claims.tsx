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
import { ClaimsList, ListType } from "../components";
import { ExternalClaim, ClaimDialect } from "../models";
import { getAllExternalClaims, getADialect } from "../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../constants";
import { history } from "../helpers";

export const ExternalClaimsPage = (props): React.ReactElement => {

    const [claims, setClaims] = useState<ExternalClaim[]>(null);
    const [offset, setOffset] = useState(0);
    const [listItemLimit, setListItemLimit] = useState<number>(0);
    const [dialect, setDialect] = useState<ClaimDialect>( null);

    const dialectID = props.match.params.id;

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);

        getADialect(dialectID).then(response => {
            setDialect(response);
        }).catch(error => {
            // TODO: Notify
        });

    }, []);

    useEffect(() => {
        dialectID && getAllExternalClaims(dialectID, null).then(response => {
            setClaims(response);
        }).catch(error => {
            // TODO: Notify
        });
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
        <PageLayout
            title="External Claims"
            description={"View, edit and add claims of "+dialect?.dialectURI}
            showBottomDivider={true}
            backButton={{
                onClick: () => { history.push("/claim-dialects")},
                text: "Go back to Claim Dialects"
            }}
        >
            <ListLayout
                advancedSearch={null}
                currentListSize={listItemLimit}
                listItemLimit={listItemLimit}
                onItemsPerPageDropdownChange={handleItemsPerPageDropdownChange}
                onPageChange={handlePaginationChange}
                onSortStrategyChange={null}
                rightActionPanel={
                    (
                        <PrimaryButton
                            onClick={() => {
                            }}
                        >
                            <Icon name="add" />Add a claim
                        </PrimaryButton>
                    )
                }
                showPagination={true}
                sortOptions={null}
                sortStrategy={null}
                totalPages={Math.ceil(claims?.length / listItemLimit)}
                totalListSize={claims?.length}
            >
                <ClaimsList list={paginate(claims, listItemLimit, offset)} localClaim={ListType.EXTERNAL} />
            </ListLayout>
        </PageLayout>
    );
};
