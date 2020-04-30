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
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { getAllLocalClaims, getAnExternalClaim, updateAnExternalClaim } from "../../../../api";
import { AddExternalClaim, AlertLevels, Claim, ExternalClaim } from "../../../../models";

/**
 * Prop types of `EditExternalClaims` component
 */
interface EditExternalClaimsPropsInterface {
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
}

/**
 * This component renders the edit external claim modal
 * @param {EditExternalClaimsPropsInterface} props
 * @return {ReactElement}
 */
export const EditExternalClaim = (props: EditExternalClaimsPropsInterface): ReactElement => {

    const { claimID, update, dialectID, submit, claimURI, wizard, onSubmit, addedClaim } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();
    const [ claim, setClaim ] = useState<ExternalClaim>(null);


    const dispatch = useDispatch();

    useEffect(() => {
        getAllLocalClaims(null).then(response => {
            setLocalClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching local attributes",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        });

        if (!wizard) {
            getAnExternalClaim(dialectID, claimID).then(response => {
                setClaim(response);
            }).catch(error => {
                dispatch(addAlert(
                    {
                        description: error?.description || "There was an error while fetching the external attribute",
                        level: AlertLevels.ERROR,
                        message: error?.message || "Something went wrong"
                    }
                ));
            })
        }
    }, []);

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
                                description: "The external attribute has been updated successfully!",
                                level: AlertLevels.SUCCESS,
                                message: "External attribute updated successfully"
                            }
                        ));
                        update();
                    }).catch(error => {
                        dispatch(addAlert(
                            {
                                description: error?.description || "There was an error while updating the" +
                                    " external attribute",
                                level: AlertLevels.ERROR,
                                message: error?.message || "Something went wrong"
                            }
                        ));
                    })
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
                                    label="Attribute URI"
                                    required={ true }
                                    requiredErrorMessage="Attribute URI is required"
                                    placeholder="Enter an attribute URI"
                                    type="text"
                                    value={ addedClaim.claimURI }
                                />
                            </Grid.Column>
                        )
                    }
                    <Grid.Column width={ 8 }>
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label="Local attribute URI"
                            required={ true }
                            requiredErrorMessage="Select a local attribute to map to"
                            placeholder="Select a local attribute"
                            search
                            value={ wizard ? addedClaim.mappedLocalClaimURI : claim?.mappedLocalClaimURI }
                            children={
                                localClaims?.map((claim: Claim, index) => {
                                    return {
                                        key: index,
                                        text: claim?.displayName,
                                        value: claim?.claimURI
                                    }
                                })
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};
