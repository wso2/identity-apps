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

import React, { useEffect, useState } from "react"
import { PageLayout } from "../layouts"
import { getAClaim } from "../api";
import { Claim } from "../models";
import { ResourceTab } from "@wso2is/react-components";
import {
    EditBasicDetailsLocalClaims,
    EditAdditionalPropertiesLocalClaims,
    EditMappedAttributesLocalClaims
} from "../components";
import { history } from "../helpers";

export const LocalClaimsEditPage = (props): React.ReactElement => {

    const claimID = props.match.params.id;

    const [claim, setClaim] = useState<Claim>(null);

    useEffect(() => {
        getClaim();
    }, []);

    const getClaim = () => {
        getAClaim(claimID).then(response => {
            setClaim(response);
        }).catch(error => {
            // TODO: Notify
        })
    }

    const panes = [
        {
            menuItem: "Basic Details",
            render: () => (
                <EditBasicDetailsLocalClaims
                    claim={claim}
                    update={getClaim} />
            )
        },
        {
            menuItem: "Mapped Attributes",
            render: () => (
                <EditMappedAttributesLocalClaims
                    claim={claim}
                    update={getClaim}
                />
            )
        },
        {
            menuItem: "Additional Properties",
            render: () => (
                <EditAdditionalPropertiesLocalClaims
                    claim={claim}
                    update={getClaim}
                />
            )
        }
    ];

    return (
        <PageLayout
            title={claim?.displayName}
            description={"Edit " + claim?.claimURI}
            backButton={{
                onClick: () => {
                    history.push("/local-claims");
                },
                text: "Go back to Local Claims"
            }}
            titleTextAlign="left"
            bottomMargin={false}
        >
            <ResourceTab panes={panes} />
        </PageLayout>
    )
}