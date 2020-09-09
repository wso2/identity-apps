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

import { Claim, ClaimDialect, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { FormValue } from "@wso2is/forms";
import { EmptyPlaceholder } from "@wso2is/react-components";
import isEqual from "lodash/isEqual";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { ClaimsList, ListType } from "../..";
import { EmptyPlaceholderIllustrations } from "../../../../core";
import { ClaimManagementConstants } from "../../../constants";
import { AddExternalClaim } from "../../../models";
import { AddExternalClaims } from "../../add";

/**
 * Prop types of `ExternalClaims` component.
 */
interface ExternalClaimsPropsInterface extends TestableComponentInterface {
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
 * @param {ExternalClaimsPropsInterface} props - Props injected to the component.
 * 
 * @return {React.ReactElement}
 */
export const ExternalClaims: FunctionComponent<ExternalClaimsPropsInterface> = (
    props: ExternalClaimsPropsInterface
): ReactElement => {

    const {
        onSubmit,
        submitState,
        values,
        [ "data-testid" ]: testId
    } = props;

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
    },[values]);

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
                        data-testid={ `${ testId }-add-external-claims` }
                    />
                    <Divider hidden />
                    {
                        claims?.length > 0
                            ? (
                                <ClaimsList
                                    isLoading={ false }
                                    list={ claims }
                                    localClaim={ ListType.ADD_EXTERNAL }
                                    onEdit={ (editingClaim: Claim | ExternalClaim | ClaimDialect | AddExternalClaim,
                                              values: Map<string, FormValue>) => {

                                        const tempClaims = [ ...claims ];

                                        tempClaims.forEach((claim: AddExternalClaim) => {
                                            if (!isEqual(editingClaim, claim)) {
                                                return;
                                            }

                                            // `ClaimDialect` interface doesn't have `claimURI` key which results
                                            // in TS error due to the usage of union type.
                                            if (!(ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY in editingClaim)) {
                                                return;
                                            }

                                            claim.claimURI = values.get("claimURI").toString();
                                            claim.mappedLocalClaimURI = values.get("localClaim").toString();
                                        });

                                        setClaims(tempClaims);
                                    } }
                                    onDelete={ (editingClaim: Claim | ExternalClaim | ClaimDialect |
                                        AddExternalClaim) => {

                                        const tempClaims = claims.filter((claim: AddExternalClaim) =>
                                            !isEqual(editingClaim, claim));

                                        setClaims(tempClaims);
                                    } }
                                    data-testid={ `${ testId }-list` }
                                />
                            )
                            : (
                                <EmptyPlaceholder
                                    title={ t("adminPortal:components.claims.external.placeholders.empty.title") }
                                    subtitle={ [ t("adminPortal:components.claims.external." +
                                        "placeholders.empty.subtitle") ] }
                                    image={ EmptyPlaceholderIllustrations.emptyList }
                                    imageSize="tiny"
                                    data-testid={ `${ testId }-empty-placeholder` }
                                />
                            )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

/**
 * Default props for the application creation wizard.
 */
ExternalClaims.defaultProps = {
    "data-testid": "external-claims"
};
