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

import { getAllLocalClaims } from "@wso2is/core/api";
import { AlertLevels, Claim, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { getAnExternalClaim, updateAnExternalClaim } from "../../../api";
import { AddExternalClaim } from "../../../models";

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
}

/**
 * This component renders the edit external claim modal.
 *
 * @param {EditExternalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
        [ "data-testid" ]: testId
    } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();
    const [ claim, setClaim ] = useState<ExternalClaim>(null);
    const [ filteredLocalClaims, setFilteredLocalClaims ] = useState<Claim[]>();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        getAllLocalClaims(null).then(response => {
            setLocalClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("console:manage.features.claims.local.notifications.getClaims.genericError.message")
                }
            ));
        });

        if (!wizard) {
            getAnExternalClaim(dialectID, claimID).then(response => {
                setClaim(response);
            }).catch(error => {
                dispatch(addAlert(
                    {
                        description: error?.description
                            || t("console:manage.features.claims.external.notifications." +
                                "getExternalAttribute.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.claims.external.notifications." +
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
     * This removes the mapped local claims from the local claims list.
     *
     * @param {string} claimURI The claim URI of the mapped local claim.
     * @param {Claim[]} filteredLocalClaims - Filtered claims.
     *
     * @returns {Claim[]} The array of filtered Claims.
     */
    const removeMappedLocalClaim = (claimURI: string, filteredLocalClaims?: Claim[]): Claim[] => {
        const claimsToFilter = filteredLocalClaims ? filteredLocalClaims : localClaims;

        return claimsToFilter?.filter((claim: Claim) => {
            return claim.claimURI !== claimURI;
        });
    };

    /**
     * Returns the local claim that is mapped to the external claim.
     *
     * @returns {Claim} The Local Claim mapped to the selected external claim.
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
                                description: t("console:manage.features.claims.external.notifications." +
                                    "updateExternalAttribute.success.description"),
                                level: AlertLevels.SUCCESS,
                                message: t("console:manage.features.claims.external.notifications." +
                                    "updateExternalAttribute.success.message")
                            }
                        ));
                        update();
                    }).catch(error => {
                        dispatch(addAlert(
                            {
                                description: error?.description
                                    || t("console:manage.features.claims.external.notifications." +
                                        "updateExternalAttribute.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: error?.message
                                    || t("console:manage.features.claims.external.notifications." +
                                        "updateExternalAttribute.genericError.message")
                            }
                        ));
                    });
                } else {
                    onSubmit(values);
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
                                    label={ t("console:manage.features.claims.external.forms.attributeURI.label") }
                                    required={ true }
                                    requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                        "attributeURI.label") }
                                    placeholder={ 
                                        t("console:manage.features.claims.external.forms.attributeURI.label") 
                                    }
                                    type="text"
                                    value={ addedClaim.claimURI }
                                    data-testid={ `${ testId }-form-claim-uri-input` }
                                />
                            </Grid.Column>
                        )
                    }
                    <Grid.Column width={ 8 }>
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label={ t("console:manage.features.claims.external.forms.localAttribute.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                "localAttribute.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.external.forms.attributeURI.placeholder") }
                            search
                            value={ wizard ? addedClaim.mappedLocalClaimURI : claim?.mappedLocalClaimURI }
                            children={
                                filteredLocalClaims?.map((claim: Claim, index) => {
                                    return {
                                        key: index,
                                        text: claim?.displayName,
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
    "data-testid": "edit-external-claim"
};
