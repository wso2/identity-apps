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

import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon } from "semantic-ui-react";
import { addExternalClaim, getAllLocalClaims } from "../../../api";
import { AddExternalClaim, AlertLevels, Claim, ExternalClaim } from "../../../models";

/**
 * Prop types for the `AddExternalClaims` component.
 */
interface AddExternalClaimsPropsInterface {
    /**
     * The dialect ID.
     */
    dialectId?: string;
    /**
     * Function to be called to initiate an update.
     */
    update?: () => void;
    /**
     * Specifies if this is called from the wizard.
     */
    wizard?: boolean;
    /**
     * Called on submit.
     */
    onSubmit?: (values: Map<string, FormValue>) => void;
    /**
     * The list of external claims belonging to the dialect.
     */
    externalClaims: ExternalClaim[] | AddExternalClaim[];
    /**
     * Triggers submit externally.
     */
    triggerSubmit?: boolean;
    /**
     * Triggers the cancel method internally.
     */
    cancel?: () => void;
}

/**
 * A component that lets you add an external claim.
 * 
 * @param {AddExternalClaimsPropsInterface} props
 * 
 * @return {ReactElement} Component.
 */
export const AddExternalClaims = (props: AddExternalClaimsPropsInterface): ReactElement => {

    const { dialectId, update, wizard, onSubmit, externalClaims, triggerSubmit, cancel } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();
    const [ filteredLocalClaims, setFilteredLocalClaims ] = useState<Claim[]>();
    const [ localClaimsSet, setLocalClaimsSet ] = useState(false);

    const [ reset, setReset ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Gets the list of local claims.
     */
    useEffect(() => {
        getAllLocalClaims(null).then(response => {
            setLocalClaims(response);
            setFilteredLocalClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("devPortal:components.claims.local.notifications.getClaims.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("devPortal:components.claims.local.notifications.getClaims.genericError.message")
                }
            ));
        });
    }, []);

    /**
     * Remove local claims that have already been mapped. 
     */
    useEffect(() => {
        if (externalClaims && localClaims) {
            let tempLocalClaims: Claim[] = [ ...localClaims ];
            externalClaims.forEach((externalClaim: ExternalClaim) => {
                tempLocalClaims = [ ...removeMappedLocalClaim(externalClaim.mappedLocalClaimURI, tempLocalClaims) ];
            });
            setFilteredLocalClaims(tempLocalClaims);
        }
    }, [ externalClaims, localClaimsSet ]);

    /**
     * Set `localClaimsSet`to true when `localClaims` is set.
     */
    useEffect(() => {
        localClaims && setLocalClaimsSet(true);
    }, [ localClaims ]);

    /**
     * This removes the mapped local claims from the local claims list.
     * 
     * @param {string} claimURI The claim URI of the mapped local claim.
     * 
     * @returns {Claim[]} The array of filtered Claims.
     */
    const removeMappedLocalClaim = (claimURI: string, filteredLocalClaims?: Claim[]): Claim[] => {
        const claimsToFilter = filteredLocalClaims ? filteredLocalClaims : localClaims;

        return claimsToFilter?.filter((claim: Claim) => {
            return claim.claimURI !== claimURI;
        });
    };

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                if (wizard) {
                    onSubmit(values);
                    setReset();
                } else {
                    addExternalClaim(dialectId, {
                        claimURI: values.get("claimURI").toString(),
                        mappedLocalClaimURI: values.get("localClaim").toString()
                    }).then(() => {
                        dispatch(addAlert(
                            {
                                description: t("devPortal:components.claims.external.notifications." +
                                    "addExternalAttribute.success.description"),
                                level: AlertLevels.SUCCESS,
                                message: t("devPortal:components.claims.external.notifications." +
                                    "addExternalAttribute.success.message")
                            }
                        ));
                        setReset();
                        update();
                        !wizard && cancel && cancel();
                    }).catch(error => {
                        dispatch(addAlert(
                            {
                                description: error?.description
                                    || t("devPortal:components.claims.external.notifications." +
                                    "addExternalAttribute.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: error?.message 
                                    || t("devPortal:components.claims.external.notifications." +
                                        "addExternalAttribute.genericError.message")
                            }
                        ));
                    })
                }
            } }
            resetState={ reset }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 3 }>
                    <Grid.Column width={ 7 }>
                        <Field
                            name="claimURI"
                            label={ t("devPortal:components.claims.external.forms.attributeURI.label") }
                            required={ true }
                            requiredErrorMessage={ t("devPortal:components.claims.external.forms." +
                                "attributeURI.requiredErrorMessage") }
                            placeholder={ t("devPortal:components.claims.external.forms.attributeURI.placeholder") }
                            type="text"
                        />
                    </Grid.Column>
                    <Grid.Column width={ 2 } textAlign="center" verticalAlign="middle">
                        <Icon className="map-icon" name="arrow right" size="large"/>
                    </Grid.Column>
                    <Grid.Column width={ 7 }>
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label={ t("devPortal:components.claims.external.forms.localAttribute.label") }
                            required={ true }
                            requiredErrorMessage={ t("devPortal:components.claims.external.forms." +
                                "attributeURI.requiredErrorMessage") }
                            placeholder={ t("devPortal:components.claims.external.forms.attributeURI.placeholder") }
                            search
                            children={
                                filteredLocalClaims?.map((claim: Claim, index) => {
                                    return {
                                        key: index,
                                        text: claim.displayName,
                                        value: claim.claimURI
                                    }
                                })
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
                {
                    wizard && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 } textAlign="right" verticalAlign="top">
                            <PrimaryButton type="submit">
                                    { t("devPortal:components.claims.external.forms.submit") }
                            </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    )
};
