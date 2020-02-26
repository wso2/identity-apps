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

import React from "react";
import { ResourceList } from "@wso2is/react-components"
import { Claim, ExternalClaim, ClaimDialect } from "../../models";
import { List } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { history } from "../../helpers";
export enum ListType {
    LOCAL,
    EXTERNAL,
    DIALECT
};

interface ClaimsListPropsInterface {
    list: Claim[] | ExternalClaim[] | ClaimDialect[];
    localClaim: ListType
}

export const ClaimsList = (props: ClaimsListPropsInterface): React.ReactElement => {

    const { list, localClaim } = props;

    const isLocalClaim = (toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[]): toBeDetermined is Claim[] => {
        return localClaim === ListType.LOCAL;
    }

    const isDialect = (
        toBeDetermined: Claim[] | ExternalClaim[] | ClaimDialect[]
    ): toBeDetermined is ClaimDialect[] => {
        return localClaim === ListType.DIALECT
    }

    const listContent = (content: any): React.ReactElement => (
        <List.Content>
            <List.Description className="list-item-meta">
                {content}
            </List.Description>
        </List.Content>
    );

    return (
        <ResourceList>
            {
                isLocalClaim(list)
                    ? list?.map((claim: Claim, index: number) => {
                        return (
                            <ResourceList.Item
                                key={index}
                                actions={[
                                    {
                                        icon: "pencil alternate",
                                        onClick: () => {
                                            history.push("/edit-local-claims/"+claim.id)
                                         },
                                        popupText: "edit",
                                        type: "button"
                                    },
                                    {
                                        icon: "trash alternate",
                                        onClick: () => { },
                                        popupText: "delete",
                                        type: "dropdown"
                                    }
                                ]}
                                itemHeader={claim.displayName}
                                metaContent={listContent(claim.description)}
                            />
                        )
                    })
                    : isDialect(list)
                        ? list?.map((dialect: ClaimDialect, index: number) => {
                            return (
                                <ResourceList.Item
                                    key={index}
                                    actions={[
                                        {
                                            icon: "trash alternate",
                                            onClick: () => { },
                                            popupText: "delete",
                                            type: "dropdown"
                                        }
                                    ]}
                                    itemHeader={(
                                        <Link to={"/external-claims/"+dialect.id} >{dialect.dialectURI}</Link>
                                    )}
                                />
                            )
                        })
                        : list?.map((claim: ExternalClaim, index: number) => {
                            return (
                                <ResourceList.Item
                                    key={index}
                                    actions={[
                                        {
                                            icon: "pencil alternate",
                                            onClick: () => { },
                                            popupText: "edit",
                                            type: "button"
                                        },
                                        {
                                            icon: "trash alternate",
                                            onClick: () => { },
                                            popupText: "delete",
                                            type: "dropdown"
                                        }
                                    ]}
                                    itemHeader={claim.claimURI}
                                    metaContent={listContent(claim.mappedLocalClaimURI)}
                                />
                            )
                        })
            }
        </ResourceList>
    )
}
