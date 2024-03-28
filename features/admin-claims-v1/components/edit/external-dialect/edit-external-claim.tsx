/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ClaimsGetParams, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Code } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { getAllLocalClaims } from "../../../../admin-claims-v1/api";
import { AppState, sortList } from "../../../../admin-core-v1";
import { getAnExternalClaim, updateAnExternalClaim } from "../../../api";
import { ClaimManagementConstants } from "../../../constants";
import { AddExternalClaim } from "../../../models";
import { resolveType } from "../../../utils";

/**
 * Prop types of `EditExternalClaims` component
 */
interface EditExternalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The claim ID to be edited.
     */
    claimID?: string;
    /**
     * The ID of the dialect the claim belongs to.
     */
    dialectID: string;
    /**
     * Called to initiate an update.
     */
    update: () => void;
    /**
     * Used to trigger submit.
     */
    submit: boolean;
    /**
     * Claim URI of the claim.
     */
    claimURI: string;
    /**
     * Specifies if this is rendered by the wizard.
     */
    wizard?: boolean;
    /**
     * Calls the onSubmit method
     */
    onSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * Claim data if called from wizard
     */
    addedClaim?: AddExternalClaim;
    /**
     * The list of external claims belonging to the dialect.
     */
    externalClaims: ExternalClaim[] | AddExternalClaim[];
    /**
     * Specifies the the attribute type.
     */
    attributeType?: string;
}

/**
 * This component renders the edit external claim modal.
 *
 * @param props - Props injected to the component.
 *
 * @returns EditExternalClaim react element.
 */
export const EditExternalClaim: FunctionComponent<EditExternalClaimsPropsInterface> = (
    props: EditExternalClaimsPropsInterface
): ReactElement => {

    const {
        claimID,
        update,
        dialectID,
        submit,
        claimURI,
        wizard,
        onSubmit,
        addedClaim,
        externalClaims,
        attributeType,
        [ "data-testid" ]: testId
    } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();
    const [ claim, setClaim ] = useState<ExternalClaim>(null);
    const [ filteredLocalClaims, setFilteredLocalClaims ] = useState<Claim[]>();
    const [ isClaimsLoading, setIsClaimsLoading ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    const enableIdentityClaims: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const { t } = useTranslation();

    useEffect(() => {
        setIsClaimsLoading(true);
        const params: ClaimsGetParams = {
            "exclude-identity-claims": !enableIdentityClaims,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params).then((response: Claim[]) => {
            setIsClaimsLoading(false);
            setLocalClaims(sortList(response, "displayName", true));
        }).catch((error: IdentityAppsApiException) => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("claims:local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("claims:local.notifications.getClaims.genericError.message")
                }
            ));
        });

        if (!wizard) {
            getAnExternalClaim(dialectID, claimID).then((response: ExternalClaim) => {
                setClaim(response);
            }).catch((error: IdentityAppsApiException) => {
                dispatch(addAlert(
                    {
                        description: error?.response?.data?.description
                            || t("claims:external.notifications." +
                                "getExternalAttribute.genericError.description", { type: resolveType(attributeType) }),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            || t("claims:external.notifications." +
                                "getExternalAttribute.genericError.message")
                    }
                ));
            });
        }
    }, []);

    /**
     * Remove local claims that have already been mapped.
     */
    useEffect(() => {
        if (externalClaims && localClaims && (claim || addedClaim)) {
            let tempLocalClaims: Claim[] = [ ...localClaims ];

            externalClaims.forEach((externalClaim: ExternalClaim) => {
                tempLocalClaims = [ ...removeMappedLocalClaim(externalClaim.mappedLocalClaimURI, tempLocalClaims) ];
            });
            tempLocalClaims.unshift(getLocalClaimMappedToSelectedExternalClaim());
            setFilteredLocalClaims(tempLocalClaims);
        }
    }, [ externalClaims, localClaims, claim, addedClaim ]);

    /**
     * Get the attribute name.
     */
    const resolveClaimURIName = (): string => {
        const parts: string[] = addedClaim.claimURI.split(":");

        if (parts.length > 1) {
            return parts[parts.length - 1];
        }

        return addedClaim.claimURI;
    };

    /**
     * Set the modified claimURI to the form values.
     *
     * @param values - Claim object
     */
    const resolveClaimURI = (values: Map<string, FormValue>): Map<string, FormValue> => {
        const parts: string[] = addedClaim.claimURI.split(":");

        if (parts.length > 1) {
            const claimURI: string = parts.filter((part: string, idx: number) => idx < parts.length - 1).join(":") +
                ":" + values.get("claimURI");

            values.set("claimURI", claimURI);
        }

        return values;
    };

    /**
     * This removes the mapped local claims from the local claims list.
     *
     * @param claimURI - The claim URI of the mapped local claim.
     * @param filteredLocalClaims - Filtered claims.
     *
     * @returns The array of filtered Claims.
     */
    const removeMappedLocalClaim = (claimURI: string, filteredLocalClaims?: Claim[]): Claim[] => {
        const claimsToFilter: Claim[] = filteredLocalClaims ? filteredLocalClaims : localClaims;

        return claimsToFilter?.filter((claim: Claim) => {
            return claim.claimURI !== claimURI;
        });
    };

    /**
     * Returns the local claim that is mapped to the external claim.
     *
     * @returns The Local Claim mapped to the selected external claim.
     */
    const getLocalClaimMappedToSelectedExternalClaim = (): Claim => {
        return localClaims.find((localClaim: Claim) => {
            return wizard
                ? localClaim?.claimURI === addedClaim?.mappedLocalClaimURI
                : localClaim?.claimURI === claim?.mappedLocalClaimURI;
        });
    };

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                if (!wizard) {
                    updateAnExternalClaim(dialectID, claimID, {
                        claimURI: claimURI,
                        mappedLocalClaimURI: values.get("localClaim").toString()
                    }).then(() => {
                        dispatch(addAlert(
                            {
                                description: t("claims:external.notifications." +
                                    "updateExternalAttribute.success.description",
                                { type: resolveType(attributeType) }),
                                level: AlertLevels.SUCCESS,
                                message: t("claims:external.notifications." +
                                    "updateExternalAttribute.success.message", { type: resolveType(attributeType) })
                            }
                        ));
                        update();
                    }).catch((error: IdentityAppsApiException) => {
                        dispatch(addAlert(
                            {
                                description: error?.response?.data?.description
                                    || t("claims:external.notifications." +
                                        "updateExternalAttribute.genericError.description",
                                    { type: resolveType(attributeType) }),
                                level: AlertLevels.ERROR,
                                message: error?.response?.data?.message
                                    || t("claims:external.notifications." +
                                        "updateExternalAttribute.genericError.message")
                            }
                        ));
                    });
                } else {
                    onSubmit(resolveClaimURI(values));
                    update();
                }
            } }
            submitState={ submit }
        >
            <Grid>
                <Grid.Row columns={ wizard ? 2 : 1 }>
                    {
                        wizard &&
                        (
                            <Grid.Column width={ 8 }>
                                <Field
                                    name="claimURI"
                                    label={ t("claims:external.forms.attributeURI.label",
                                        { type: resolveType(attributeType, true) }) }
                                    required={ true }
                                    requiredErrorMessage={ t("claims:external.forms." +
                                        "attributeURI.label", { type: resolveType(attributeType, true) }) }
                                    placeholder={
                                        t("claims:external.forms.attributeURI.label",
                                            { type: resolveType(attributeType) })
                                    }
                                    type="text"
                                    value={ resolveClaimURIName() }
                                    data-testid={ `${ testId }-form-claim-uri-input` }
                                    validation={ (value: string, validation: Validation) => {
                                        for (const claim of externalClaims) {
                                            if (claim.claimURI === value) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(t("claims:" +
                                                    "external.forms.attributeURI.validationErrorMessages.duplicateName",
                                                { type: resolveType(attributeType) }));

                                                break;
                                            }
                                        }
                                    } }
                                />
                            </Grid.Column>
                        )
                    }
                    <Grid.Column width={ 8 }>
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label={ t("claims:external.forms.localAttribute.label") }
                            required={ true }
                            requiredErrorMessage={ t("claims:external.forms." +
                                "localAttribute.requiredErrorMessage") }
                            placeholder={ t("claims:external.forms.attributeURI.placeholder") }
                            search
                            loading={ isClaimsLoading }
                            value={ wizard ? addedClaim.mappedLocalClaimURI : claim?.mappedLocalClaimURI }
                            children={
                                filteredLocalClaims?.map((claim: Claim, index: number) => {
                                    return {
                                        key: index,
                                        text: (
                                            <div className="multiline">
                                                { claim?.displayName }
                                                <Code
                                                    className="description"
                                                    compact
                                                    withBackground={ false }>
                                                    { claim?.claimURI }
                                                </Code>
                                            </div>
                                        ),
                                        value: claim?.claimURI
                                    };
                                })
                                ?? []
                            }
                            data-testid={ `${ testId }-local-claim-dropdown` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
EditExternalClaim.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "edit-external-claim"
};
