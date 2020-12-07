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
import { Field, FormValue, Forms, useTrigger } from "@wso2is/forms";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon } from "semantic-ui-react";
import { addExternalClaim } from "../../api";
import { AddExternalClaim } from "../../models";

/**
 * Prop types for the `AddExternalClaims` component.
 */
interface AddExternalClaimsPropsInterface extends TestableComponentInterface {
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
 * @param {AddExternalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement} Component.
 */
export const AddExternalClaims: FunctionComponent<AddExternalClaimsPropsInterface> = (
    props: AddExternalClaimsPropsInterface
): ReactElement => {

    const {
        dialectId,
        update,
        wizard,
        onSubmit,
        externalClaims,
        triggerSubmit,
        cancel,
        [ "data-testid" ]: testId
    } = props;

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
            const sortedClaims = response.sort((a: Claim, b: Claim) => {
                return a.displayName > b.displayName ? 1 : -1;
            });

            setLocalClaims(sortedClaims);
            setFilteredLocalClaims(sortedClaims);
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
                                description: t("console:manage.features.claims.external.notifications." +
                                    "addExternalAttribute.success.description"),
                                level: AlertLevels.SUCCESS,
                                message: t("console:manage.features.claims.external.notifications." +
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
                                    || t("console:manage.features.claims.external.notifications." +
                                    "addExternalAttribute.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: error?.message
                                    || t("console:manage.features.claims.external.notifications." +
                                        "addExternalAttribute.genericError.message")
                            }
                        ));
                    });
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
                            label={ t("console:manage.features.claims.external.forms.attributeURI.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                "attributeURI.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.external.forms.attributeURI.placeholder") }
                            type="text"
                            data-testid={ `${ testId }-form-claim-uri-input` }
                        />
                    </Grid.Column>
                    <Grid.Column width={ 2 } textAlign="center" verticalAlign="middle">
                        <Icon className="map-icon" name="arrow right" size="large"/>
                    </Grid.Column>
                    <Grid.Column width={ 7 }>
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label={ t("console:manage.features.claims.external.forms.localAttribute.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.external.forms." +
                                "attributeURI.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.external.forms.attributeURI.placeholder") }
                            search
                            children={
                                filteredLocalClaims?.map((claim: Claim, index) => {
                                    return {
                                        key: index,
                                        text: claim.displayName,
                                        value: claim.claimURI
                                    };
                                })
                                ?? []
                            }
                            data-testid={ `${ testId }-form-local-claim-dropdown` }
                        />
                    </Grid.Column>
                </Grid.Row>
                {
                    wizard && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 } textAlign="right" verticalAlign="top">
                            <PrimaryButton type="submit" data-testid={ `${ testId }-form-submit-button` }>
                                    { t("console:manage.features.claims.external.forms.submit") }
                            </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the component.
 */
AddExternalClaims.defaultProps = {
    "data-testid": "add-external-claims"
};
