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

import { TestableComponentInterface } from "@wso2is/core/models";
import { FormValue } from "@wso2is/forms";
import { EmptyPlaceholder } from "@wso2is/react-components";
import differenceWith from "lodash-es/differenceWith";
import isEqual from "lodash-es/isEqual";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { ClaimEventClickItem, ClaimsList, ListType } from "../..";
import { getEmptyPlaceholderIllustrations } from "../../../../core";
import { ClaimManagementConstants } from "../../../constants";
import { AddExternalClaim } from "../../../models";
import { resolveType } from "../../../utils";
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
    /**
     * A delegated event handler to pass the current
     * selected/active claims to the parent.
     *
     * @see methods onExternalClaimAdd, onExternalClaimDelete, onExternalClaimEdit
     * @param {AddExternalClaim[]} claims
     */
    onExternalClaimsChanged?: (claims: AddExternalClaim[]) => void;
    /**
     * Specifies if the initial values passed should be shown.
     */
    shouldShowInitialValues?: boolean;
    /**
     * Specifies the attribute type.
     */
    attributeType?: string;
    /**
     * Specific claim dialect URI
     */
    claimDialectUri?: string;
    /**
     * Specifies if this is to be rendered in a wizard.
     */
    wizard?: boolean;
    /**
     * Specifies the dialect id required to filter
     * mappable claims
     */
    dialectId?: string;
    /**
     * list of mapped local claims
     */
    mappedLocalClaims?: string[];
    /**
     * Specifies if the submit button have to be displayed.
     */
    onClaimListChange?: (buttonState: boolean) => void;
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
        onExternalClaimsChanged,
        shouldShowInitialValues,
        attributeType,
        claimDialectUri,
        wizard,
        dialectId,
        mappedLocalClaims,
        onClaimListChange,
        [ "data-testid" ]: testId
    } = props;

    const [ claims, setClaims ] = useState<AddExternalClaim[]>([]);
    const [ initialList, setInitialList ] = useState<AddExternalClaim[]>([]);
    const [ tempMappedLocalClaims, setTempMappedLocalClaims ] = useState<string[]>([]);

    const ref = useRef(true);
    const firstTimeValueChanges = useRef(true);

    const { t } = useTranslation();

    useEffect(() => {
        setTempMappedLocalClaims(mappedLocalClaims);
    }, [ mappedLocalClaims ]);

    useEffect(() => {
        if (ref.current) {
            ref.current = false;
        } else {
            onSubmit(getAttributesList());
        }
    }, [ submitState ]);

    useEffect(() => {
        if (values) {
            setClaims(values);
            if (firstTimeValueChanges.current) {
                setInitialList(values);
                firstTimeValueChanges.current = false;
            }
        }
    }, [ values ]);

    /**
     * Change button disable state when claims are added.
     */
    useEffect(() => {

        if (typeof onClaimListChange === "function") {
            if (claims.length === initialList.length) {
                onClaimListChange(true);
            } else {
                onClaimListChange(false);
            }
        }
    }, [ claims ]);

    /**
     * Handles the event when a new external claim has been submitted via
     * the form {@link AddExternalClaims}. We delegate this change to
     * to the above parent component {@link AddDialect} because it has the
     * state to manage the user selected {@link ExternalClaim} mappings.
     *
     * @see AddExternalClaims
     * @param {Map<string, FormValue>} values {claimURI, localClaim}
     */
    const onExternalClaimAdd = (values: Map<string, FormValue>): void => {
        const newClaim = {
            claimURI: attributeType === "scim" 
                ? `${claimDialectUri}:${values.get("claimURI").toString()}` 
                : values.get("claimURI").toString(),
            mappedLocalClaimURI: values.get("localClaim").toString()
        };
        const newState = [ ...claims, newClaim ];

        setTempMappedLocalClaims(prevLocalClaims => 
            [ ...prevLocalClaims, newClaim.mappedLocalClaimURI
            ]);
        setClaims(newState);
        onExternalClaimsChanged && onExternalClaimsChanged(newState);
    };

    /**
     * This function handles the event when a added claim is removed from the
     * {@link ClaimsList} component. In here what we do is remove the item
     * from the local state {@link claims} and delegate the change to the
     * parent component {@link AddDialect} as well.
     *
     * Clarification Note: -
     * In this function the param `claim` is always {@link AddExternalClaim}
     *
     * @see {@link ClaimsList}
     * @param {ClaimEventClickItem} editingClaim
     */
    const onExternalClaimDelete = (editingClaim: ClaimEventClickItem): void => {
        const deletedClaim = editingClaim as AddExternalClaim;
        const filteredClaims = claims.filter((claim: AddExternalClaim) => !isEqual(editingClaim, claim));

        setClaims(filteredClaims);
        setTempMappedLocalClaims(tempMappedLocalClaims.filter(claim => claim !== deletedClaim.mappedLocalClaimURI));
        onExternalClaimsChanged && onExternalClaimsChanged(filteredClaims);
    };

    /**
     * This function handles the event when the user edits a already added
     * claim in the {@link ClaimsList}
     *
     * @see ClaimsList
     * @param {ClaimEventClickItem} editingClaim
     * @param {Map<string, FormValue>} values {claimURI, localClaim}
     */
    const onExternalClaimEdit = (editingClaim: ClaimEventClickItem, values: Map<string, FormValue>): void => {
        const existingClaims = [ ...claims ];

        for (const claim of existingClaims) {
            // If its not the claim then continue
            if (!isEqual(editingClaim, claim)) continue;
            // `ClaimDialect` interface doesn't have `claimURI` key which results
            // in TS error due to the usage of union type.
            if (!( ClaimManagementConstants.CLAIM_URI_ATTRIBUTE_KEY in editingClaim )) continue;
            claim.claimURI = values.get("claimURI").toString();
            claim.mappedLocalClaimURI = values.get("localClaim").toString();
        }
        setClaims(existingClaims);
        onExternalClaimsChanged && onExternalClaimsChanged(existingClaims);
    };

    /**
     * Returns either the whole list or the newly added attributes based on the `shouldShowInitialValues` flag.
     */
    const getAttributesList = (): AddExternalClaim[] => {
        if (shouldShowInitialValues) {
            return claims;
        } else {
            return differenceWith(claims, initialList, isEqual);
        }
    };

    return (
        <Grid>
            <Grid.Row columns={ 2 }>
                <Grid.Column width={ 16 }>
                    <AddExternalClaims
                        wizard={ true }
                        onSubmit={ onExternalClaimAdd }
                        externalClaims={ claims }
                        data-testid={ `${ testId }-add-external-claims` }
                        attributeType={ attributeType }
                        claimDialectUri={ claimDialectUri }
                        dialectId={ dialectId }
                        mappedLocalClaims={ tempMappedLocalClaims }
                    />
                    <Divider hidden />
                    {
                        getAttributesList().length>0
                            ? (
                                <ClaimsList
                                    isLoading={ false }
                                    list={ getAttributesList() }
                                    localClaim={ ListType.ADD_EXTERNAL }
                                    onEdit={ onExternalClaimEdit }
                                    onDelete={ onExternalClaimDelete }
                                    data-testid={ `${ testId }-list` }
                                    attributeType={ attributeType }
                                    isEditable={ false }
                                />
                            )
                            : wizard && (
                                <EmptyPlaceholder
                                    title={ t("console:manage.features.claims.external.placeholders.empty.title",
                                        { type: resolveType(attributeType, true) }) }
                                    subtitle={ [ t("console:manage.features.claims.external." +
                                        "placeholders.empty.subtitle", { type: resolveType(attributeType) }) ] }
                                    image={ getEmptyPlaceholderIllustrations().emptyList }
                                    imageSize="tiny"
                                    data-testid={ `${ testId }-empty-placeholder` }
                                />
                            )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the application creation wizard.
 */
ExternalClaims.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "external-claims",
    mappedLocalClaims: [],
    shouldShowInitialValues: true,
    wizard: true
};
