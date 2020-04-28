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

import { ConfirmationModal, DangerZone, DangerZoneGroup } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { Divider, Grid, Header, Image, Segment } from "semantic-ui-react";
import { deleteADialect, getADialect, getAllExternalClaims } from "../api";
import {
    AvatarBackground,
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
    const [ claims, setClaims ] = useState<ExternalClaim[]>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    const dispatch = useDispatch();

    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setConfirmDelete(false) }
            type="warning"
            open={ confirmDelete }
            assertion={ dialect.dialectURI }
            assertionHint={ <p>Please type <strong>{ dialect.dialectURI }</strong> to confirm.</p> }
            assertionType="input"
            primaryAction="Confirm"
            secondaryAction="Cancel"
            onSecondaryActionClick={ (): void => setConfirmDelete(false) }
            onPrimaryActionClick={ (): void => deleteDialect(dialect.id) }
        >
            <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
            <ConfirmationModal.Message attached warning>
                This action is irreversible and will permanently delete the selected external dialect.
                        </ConfirmationModal.Message>
            <ConfirmationModal.Content>
                If you delete this external dialect, all the associated external claims will also be deleted.
                Please proceed with caution.
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

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
     * This deletes a dialect
     * @param {string} dialectID 
     */
    const deleteDialect = (dialectID: string) => {
        deleteADialect(dialectID).then(() => {
            history.push(CLAIM_DIALECTS_PATH);
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

    return (
        <PageLayout
            image={
                <Image
                    floated="left"
                    verticalAlign="middle"
                    rounded
                    centered
                    size="tiny"
                >
                    <AvatarBackground />
                    <span className="claims-letter">
                        { dialect && generateDialectLetter(dialect.dialectURI) }
                    </span>
                </Image>
            }
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

            <Divider hidden />

            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <DangerZoneGroup sectionHeader="Danger Zone">
                            <DangerZone
                                actionTitle="Delete External Dialect"
                                header="Delete External Dialect"
                                subheader={ "Once you delete an external dialect, there is no going back. " +
                                    "Please be certain." }
                                onActionClick={ () => setConfirmDelete(true) }
                            />
                        </DangerZoneGroup>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { confirmDelete && deleteConfirmation() }
        </PageLayout>
    )
}
