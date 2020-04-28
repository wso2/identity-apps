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

import React, { ReactElement, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { Divider, Grid, Header, Segment } from "semantic-ui-react";
import { getADialect, getAllExternalClaims } from "../api";
import {
    EditDialectDetails,
    EditExternalClaims
} from "../components";
import { CLAIM_DIALECTS_PATH } from "../constants";
import { history } from "../helpers";
import { PageLayout } from "../layouts"
import { AlertLevels, ClaimDialect, ExternalClaim } from "../models";
import { addAlert } from "../store/actions";

/**
 * This renders the edit external dialect page
 * @param props 
 * @return {ReactElement}
 */
export const ExternalDialectEditPage = (props): ReactElement => {

    const dialectId = props.match.params.id;

    const [ dialect, setDialect ] = useState<ClaimDialect>(null);
    const [ claims, setClaims ] = useState<ExternalClaim[]>(null);
    const [ isLoading, setIsLoading ] = useState(true);

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
     * Fetch external claims.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getExternalClaims = (limit?: number, offset?: number, sort?: string, filter?: string) => {
        dialectId && setIsLoading(true);
        dialectId && getAllExternalClaims(dialectId, {
            filter,
            limit,
            offset,
            sort
        }).then(response => {
            setClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching the external claims",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getExternalClaims();
    }, [ dialectId ]);

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
            <Divider />

            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <Header as="h5">Update Dialect URI</Header>
                        <EditDialectDetails
                            dialect={ dialect }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider hidden />
            <Divider />
            <Grid columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Header as="h5">Update External Claims</Header>
                </Grid.Column>
            </Grid>

            <Divider hidden />

            <Segment>
                <EditExternalClaims
                    dialectID={ dialectId }
                    isLoading={ isLoading }
                    claims={ claims }
                    update={ getExternalClaims }
                />
            </Segment>
        </PageLayout>
    )
}
