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

import { Grid, Table } from "semantic-ui-react";

import { AddExternalClaim } from "../../../../models";
import React from "react";

/**
 * Prop types of the `SummaryAddDialect` component.
 */
interface SummaryAddDialectPropsInterface {
    /**
     * The dialectURI added.
     */
    dialectURI: string;
    /**
     * The external claims added.
     */
    claims: AddExternalClaim[];
}

/**
 * Renders teh summary step of the add dialect wizard.
 * 
 * @param {SummaryAddDialectPropsInterface} props
 * 
 * @return {React.ReactElement}
 */
export const SummaryAddDialect = (props: SummaryAddDialectPropsInterface): React.ReactElement => {

    const { dialectURI, claims } = props;

    return (
        <Grid className="wizard-summary">
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{ dialectURI }</h3>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    External Claim URI
                                    </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Mapped Local Claim URI
                                    </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { claims.map((claim: AddExternalClaim, index: number) => {
                                return (
                                    <Table.Row key={ index } columns={ 2 }>
                                        <Table.Cell>
                                            { claim.claimURI }
                                        </Table.Cell>
                                        <Table.Cell>
                                            { claim.mappedLocalClaimURI }
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            }) }
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}


