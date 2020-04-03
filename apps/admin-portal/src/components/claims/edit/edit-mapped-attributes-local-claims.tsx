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

import React, { useEffect, useState } from "react";
import { AlertLevels, Claim } from "../../../models";
import { Grid, Message } from "semantic-ui-react";
import { useTrigger } from "@wso2is/forms";
import { getUserStoreList, updateAClaim } from "../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "@wso2is/core/store";
import { DynamicField, KeyValue } from "../dynamic-fields";
import { Hint, PrimaryButton } from "@wso2is/react-components";

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
 * @return {React.ReactElement}
 */
export const EditMappedAttributesLocalClaims = (
    props: EditMappedAttributesLocalClaimsPropsInterface
): React.ReactElement => {

    const [userStore, setUserStore] = useState([]);
    const [empty, setEmpty] = useState(false);

    const { claim, update } = props;
    const dispatch = useDispatch();
    const [submit, setSubmit] = useTrigger();

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
                    <Hint>
                        Corresponding attribute name from the underlying userstore
                        which is mapped to the Claim URI value
                    </Hint>
                    <DynamicField
                        data={
                            claim.attributeMapping.map(attribute => {
                                return {
                                    key: attribute.userstore,
                                    value: attribute.mappedAttribute
                                }
                            })
                        }
                        keyType="dropdown"
                        keyData={
                            userStore.map(store => {
                                return {
                                    value: store.name,
                                    id: store.id
                                }
                            })
                        }
                        keyName="Userstore"
                        valueName="Attribute to map to"
                        keyRequiredMessage="Please select a Userstore"
                        valueRequiredErrorMessage="Please enter an attribute to map to"
                        requiredField={ true }
                        duplicateKeyErrorMsg={
                            "This userstore has been selected twice. A userstore can only be selected once."
                        }
                        submit={ submit }
                        update={ (data) => {
                            if (data.length > 0) {
                                setEmpty(false);
                                const claimData = { ...claim };
                                delete claimData.id;
                                delete claimData.dialectURI;
                                const submitData: Claim = {
                                    ...claimData,
                                    attributeMapping: data.map(mapping => {
                                        return {
                                            mappedAttribute: mapping.value,
                                            userstore: mapping.key
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
                            } else {
                                setEmpty(true);
                            }
                        } }
                        listen={ (data: KeyValue[]) => {
                            if (data.length > 0) {
                                setEmpty(false);
                            }
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
            {
                empty ? (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 8 }>
                            <Message negative>
                                The claim should be mapped to at least one attribute from a userstore.
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                )
                    : null
            }
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
