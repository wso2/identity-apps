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

import { AlertLevels, Claim, UserStoreListItem } from "../../../../models";
import { Divider, Grid } from "semantic-ui-react";
import { Field, Forms, FormValue, useTrigger } from "@wso2is/forms";
import { getUserStoreList, updateAClaim } from "../../../../api";
import React, { ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { PrimaryButton } from "@wso2is/react-components";
import { useDispatch } from "react-redux";

/**
 * Prop types of `EditMappedAttributesLocalClaims` component
 */
interface EditMappedAttributesLocalClaimsPropsInterface {
    /**
     * Claim to be edited
     */
    claim: Claim;
    /**
     * Called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the Mapped Attribute pane of 
 * the edit local claim screen
 * 
 * @param {EditMappedAttributesLocalClaimsPropsInterface} props
 * @return {ReactElement}
 */
export const EditMappedAttributesLocalClaims = (
    props: EditMappedAttributesLocalClaimsPropsInterface
): ReactElement => {

    const [ userStore, setUserStore ] = useState([]);

    const { claim, update } = props;
    const dispatch = useDispatch();
    const [ submit, setSubmit ] = useTrigger();

    useEffect(() => {
        const userstore = [];

        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });

        getUserStoreList().then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(() => {
            setUserStore(userstore);
        });
    }, []);

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                    <p>
                        Enter the attribute from each userstore that you want to map to this claim.
                    </p>
                    <Divider hidden />
                    <Forms
                        submitState={ submit }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const claimData = { ...claim };
                            delete claimData.id;
                            delete claimData.dialectURI;

                            const submitData = {
                                ...claimData,
                                attributeMapping: Array.from(values).map(([ userstore, attribute ]) => {
                                    return {
                                        mappedAttribute: attribute.toString(),
                                        userstore: userstore.toString()
                                    }
                                })
                            }
                            updateAClaim(claim.id, submitData).then(() => {
                                dispatch(addAlert(
                                    {
                                        description: "The Attributes Mapping of this local claim has been" +
                                            " updated successfully!",
                                        level: AlertLevels.SUCCESS,
                                        message: "Attributes Mapping updated successfully"
                                    }
                                ));
                                update();
                            }).catch(error => {
                                dispatch(addAlert(
                                    {
                                        description: error?.description || "There was an error while updating" +
                                            " the local claim",
                                        level: AlertLevels.ERROR,
                                        message: error?.message || "Something went wrong"
                                    }
                                ));
                            })
                        } }
                    >
                        <Grid>
                            { userStore.map((store: UserStoreListItem, index: number) => {
                                return (
                                    <Grid.Row columns={ 2 } key={ index }>
                                        <Grid.Column width={ 4 }>
                                            { store.name }
                                        </Grid.Column>
                                        <Grid.Column width={ 12 }>
                                            <Field
                                                type="text"
                                                name={ store.name }
                                                placeholder="Enter an attribute to map to"
                                                required={ true }
                                                requiredErrorMessage="Attribute name is a required field"
                                                value={ claim?.attributeMapping?.find((attribute) => {
                                                    return attribute.userstore
                                                        .toLowerCase() === store.name.toLowerCase()
                                                })?.mappedAttribute }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }) }
                        </Grid>
                    </Forms>

                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 8 }>
                    <PrimaryButton
                        onClick={ () => {
                            setSubmit();
                        } }
                    >
                        Update
                    </PrimaryButton>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
