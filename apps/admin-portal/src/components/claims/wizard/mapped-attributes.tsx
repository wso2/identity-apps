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

import React, { useState, useEffect } from "react";
import { Grid, Message } from "semantic-ui-react";
import { getUserStoreList } from "../../../api";
import { DynamicField, KeyValue } from "..";
import { Hint } from "@wso2is/react-components";

interface MappedAttributesPropsInterface {
    submitState: boolean;
    onSubmit: (data: any, values: KeyValue[]) => void;
    values: KeyValue[];
}
export const MappedAttributes = (props: MappedAttributesPropsInterface): React.ReactElement => {

    const { onSubmit, submitState, values } = props;

    const [userStore, setUserStore] = useState([]);
    const [empty, setEmpty] = useState(false);

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
    }, [])
    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column width={ 16 }>
                    <h5>Map Attributes</h5>
                    <Hint>
                        Corresponding attribute name from the underlying user store 
                        which is mapped to the Claim URI value
                    </Hint>
                    <DynamicField
                        data={ values }
                        keyType="dropdown"
                        keyData={
                            userStore.map(store => {
                                return {
                                    value: store.name,
                                    id: store.id
                                }
                            })
                        }
                        requiredField={ true }
                        duplicateKeyErrorMsg={
                            "This User Store has been selected twice. A User Store can only be selected once."
                        }
                        keyName="User Store"
                        valueName="Attribute to map to"
                        keyRequiredMessage="Please select a User Store"
                        valueRequiredErrorMessage="Please enter an attribute to map to"
                        submit={ submitState }
                        update={ (data) => {
                            if (data.length > 0) {
                                setEmpty(false);
                                const submitData = {
                                    attributeMapping: data.map(mapping => {
                                        return {
                                            mappedAttribute: mapping.value,
                                            userstore: mapping.key
                                        }
                                    }),
                                }
                                onSubmit(submitData, data);
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
                    <Grid.Row>
                        <Message negative>
                            The claim should be mapped to at least one attribute from a user store.
                        </Message>
                    </Grid.Row>
                )
                    : null
            }
        </Grid>
    )
};
