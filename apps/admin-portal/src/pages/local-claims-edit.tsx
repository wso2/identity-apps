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
import { EditBasicDetailsLocalClaims, EditAdditionalPropertiesLocalClaims } from "../components";

export const LocalClaimsEditPage = (props): React.ReactElement => {

    const claimID = props.match.params.id;

    const [claim, setClaim] = useState<Claim>(null);

    useEffect(() => {
        getAClaim(claimID).then(response => {
            setClaim(claim);
        }).catch(error => {
            // TODO: Notify
        })
    },[]);
    
    const panes = [
        {
            menuItem: "Basic Details",
            render: () => (
                <EditBasicDetailsLocalClaims/>
            )
        },
        {
            menuItem: "Additional Properties",
            render: () => (
                <EditAdditionalPropertiesLocalClaims/>
            )
        }
    ];

    return (
        <PageLayout
            title={""}
            description={""}
            backButton={{
                onClick: ()=>{},
                text: "Go back to users"
            }}
            titleTextAlign="left"
            bottomMargin={false}
        >
            <ResourceTab panes={panes}/>
        </PageLayout>
    )
}