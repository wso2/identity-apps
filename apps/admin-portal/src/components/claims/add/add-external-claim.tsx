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

import { addExternalClaim, getAllLocalClaims } from "../../../api";
import { AlertLevels, Claim, ClaimDialect } from "../../../models";
import { Field, Forms, FormValue, useTrigger } from "@wso2is/forms";
import React, { useEffect, useState } from "react";

import { addAlert } from "@wso2is/core/store";
import { Grid } from "semantic-ui-react";
import { useDispatch } from "react-redux";

/**
 * Prop types for the `AddExternalClaims` component.
 */
interface AddExternalClaimsPropsInterface {
    /**
     * Information about the claim dialect.
     */
    dialect?: ClaimDialect;
    /**
     * Function to be called to initiate an update.
     */
    update?: () => void;
    /**
     * SPecifies if this is called from the wizard.
     */
    wizard?: boolean;
    onSubmit?: (values: Map<string, FormValue>) => void;
}

/**
 * A component that lets you add an external claim.
 * 
 * @param {AddExternalClaimsPropsInterface} props
 * 
 * @return {React.ReactElement} Component.
 */
export const AddExternalClaims = (props: AddExternalClaimsPropsInterface): React.ReactElement => {

    const { dialect, update, wizard, onSubmit } = props;

    const [ localClaims, setLocalClaims ] = useState<Claim[]>();

    const [ reset, setReset ] = useTrigger();

    const dispatch = useDispatch();

    useEffect(() => {
        getAllLocalClaims(null).then(response => {
            setLocalClaims(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description || "There was an error while fetching local claims",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Something went wrong"
                }
            ));
        })
    }, []);

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                if (wizard) {
                    onSubmit(values)
                } else {
                    addExternalClaim(dialect.id, {
                        claimURI: values.get("claimURI").toString(),
                        mappedLocalClaimURI: values.get("localClaim").toString()
                    }).then(() => {
                        dispatch(addAlert(
                            {
                                description: "The external claim has been added to the dialect successfully!",
                                level: AlertLevels.SUCCESS,
                                message: "External claim added successfully"
                            }
                        ));
                        setReset();
                        update();
                    }).catch(error => {
                        dispatch(addAlert(
                            {
                                description: error?.description,
                                level: AlertLevels.ERROR,
                                message: error?.message || "Something went wrong"
                            }
                        ));
                    })
                }
            } }
            resetState={ reset }
        >
            <Grid>
                <Grid.Row columns={ wizard ? 2 : 3 }>
                    <Grid.Column width={ wizard ? 8 : 6 }>
                        <Field
                            name="claimURI"
                            label="Claim URI"
                            required={ true }
                            requiredErrorMessage="Claim URI is required"
                            placeholder="Enter a claim URI"
                            type="text"
                        />
                    </Grid.Column>
                    <Grid.Column width={ wizard ? 8 : 6 }>
                        <Field
                            type="dropdown"
                            name="localClaim"
                            label="Local claim URI to map to"
                            required={ true }
                            requiredErrorMessage="Select a local claim to map to"
                            placeholder="Select a Local Claim"
                            search
                            children={
                                localClaims?.map((claim: Claim, index) => {
                                    return {
                                        key: index,
                                        text: claim.displayName,
                                        value: claim.claimURI
                                    }
                                })
                            }
                        />
                    </Grid.Column>
                    { !wizard &&
                        (
                            <Grid.Column width={ 4 } textAlign="right">
                                <Field className="grid-button" type="submit" value="Add External Claim" />
                            </Grid.Column>
                        )
                    }
                </Grid.Row>
                { wizard &&
                    (
                    <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 } textAlign="right" verticalAlign="top">
                                <Field className="wizard grid-button" type="submit" value="Add External Claim" />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    )
};
