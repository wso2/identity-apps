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

import { AlertLevels, ClaimDialect } from "../models";
import {
    EditDialectDetails,
    EditExternalClaims
} from "../components";
import React, { useEffect, useState } from "react"

import { addAlert } from "../store/actions";
import { CLAIM_DIALECTS_PATH } from "../constants";
import { getADialect } from "../api";
import { history } from "../helpers";
import { PageLayout } from "../layouts"
import { ResourceTab } from "@wso2is/react-components";
import { useDispatch } from "react-redux";

/**
 * This renders the edit external dialect page
 * @param props 
 * @return {React.ReactElement}
 */
export const ExternalDialectEditPage = (props): React.ReactElement => {

    const dialectId = props.match.params.id;

    const [ dialect, setDialect ] = useState<ClaimDialect>(null);

    const dispatch = useDispatch();

    /**
     * Fetches the local claim
     */
    const getDialect = () => {
        getADialect(dialectId).then(response => {
            setDialect(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching the external dialect",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        })
    }

    useEffect(() => {
        getDialect();
    }, [ dialectId ]);

    /**
     * Contains the data of the panes
     */
    const panes = [
        {
            menuItem: "Dialect Details",
            render: () => (
                <EditDialectDetails
                    dialect={ dialect }
                />
            )
        },
        {
            menuItem: "External Claims",
            render: () => (
                <EditExternalClaims dialectID={ dialect.id }/>
            )
        }
    ];

    return (
        <PageLayout
            title={ dialect?.dialectURI }
            description={ "Edit external dialect and its claims" }
            backButton={ {
                onClick: () => {
                    history.push(CLAIM_DIALECTS_PATH);
                },
                text: "Go back to claim dialects"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <ResourceTab panes={ panes } />
        </PageLayout>
    )
}
