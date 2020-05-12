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

import { FormValue } from "@wso2is/forms";
import { EmptyPlaceholder } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { ClaimsList, ListType } from "../..";
import { EmptyPlaceholderIllustrations } from "../../../../configs";
import { AddExternalClaim } from "../../../../models";
import { AddExternalClaims } from "../../add";

/**
 * Prop types of `ExternalClaims` component.
 */
interface ExternalClaimsPropsInterface {
    /**
     * Calls onSubmit.
     */
    onSubmit: (claims: AddExternalClaim[]) => void;
    /**
     * Triggers submit.
     */
    submitState: boolean;
    /**
     * Saved add external claims
     */
    values: AddExternalClaim[];
}

/**
 * This component renders the Add External Claims step of the wizard.
 * 
 * @param {ExternalClaimsPropsInterface} props
 * 
 * @return {ReactElement}
 */
export const ExternalClaims = (props: ExternalClaimsPropsInterface): ReactElement => {

    const { onSubmit, submitState, values } = props;
    const [ claims, setClaims ] = useState<AddExternalClaim[]>([]);

    const ref = useRef(true);

    const { t } = useTranslation();
    
    useEffect(() => {
        if (ref.current) {
            ref.current = false;
        } else {
            onSubmit(claims);
        }
    }, [ submitState ]);
    
    useEffect(() => {
        setClaims(values);
    },[values])

    return (
        <Grid>
            <Grid.Row columns={ 2 }>
                <Grid.Column width={ 16 }>
                    <AddExternalClaims
                        wizard={ true }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const tempClaims = [ ...claims ];
                            tempClaims.push({
                                claimURI: values.get("claimURI").toString(),
                                mappedLocalClaimURI: values.get("localClaim").toString()
                            });
                            setClaims(tempClaims);
                        } }
                        externalClaims={ claims }
                    />
                    <Divider hidden />
                    {
                        claims?.length > 0
                            ? (
                                <ClaimsList
                                    isLoading={ false }
                                    list={ claims }
                                    localClaim={ ListType.ADD_EXTERNAL }
                                    onEdit={ (index: number, values: Map<string, FormValue>) => {
                                        const tempClaims = [ ...claims ];
                                        tempClaims[ index ].mappedLocalClaimURI = values.get("localClaim").toString();
                                        tempClaims[ index ].claimURI = values.get("claimURI").toString();
                                        setClaims(tempClaims);
                                    } }
                                    onDelete={ (index: number) => {
                                        const tempClaims = [ ...claims ];
                                        tempClaims.splice(index, 1);
                                        setClaims(tempClaims);
                                    } }
                                />
                            )
                            : (
                                <EmptyPlaceholder
                                    title={ t("devPortal:components.claims.external.placeholders.empty.title") }
                                    subtitle={ [ t("devPortal:components.claims.external." +
                                        "placeholders.empty.subtitle") ] }
                                    image={ EmptyPlaceholderIllustrations.emptyList }
                                    imageSize="tiny"
                                />
                            )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
