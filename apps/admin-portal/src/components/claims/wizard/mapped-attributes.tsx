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

import { Divider, Grid } from "semantic-ui-react";
import { Field, Forms, FormValue } from "@wso2is/forms";
import React, { useEffect, useState } from "react";

import { getUserStoreList } from "../../../api";
import { UserStoreListItem } from "../../../models";

/**
 * Prop types of `MappedAttributes` component
 */
interface MappedAttributesPropsInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Handles update
     */
    onSubmit: (data: any, values: Map<string, FormValue>) => void;
    /**
     * The key values to be stored
     */
    values: Map<string, FormValue>;
}

/**
 * This component renders the Mapped Attributes step of the wizard
 * @param {MappedAttributesPropsInterface} props
 * @return {React.ReactElement}
 */
export const MappedAttributes = (props: MappedAttributesPropsInterface): React.ReactElement => {

    const { onSubmit, submitState, values } = props;

    const [ userStore, setUserStore ] = useState<UserStoreListItem[]>([]);

    useEffect(() => {
        const userstore: UserStoreListItem[] = [];
        userstore.push({
            description: "",
            id: "PRIMARY",
            name: "PRIMARY",
            self: ""
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
                <Grid.Column width={ 14 }>
                    <h4>Map Attributes</h4>
                    <p>
                        Enter the attribute from each userstore that you want to map to this claim.
                    </p>
                    <Divider hidden />
                    <Divider hidden />
                    <Forms
                        submitState={ submitState }
                        onSubmit={ (values: Map<string, FormValue>) => {
                            const submitData = {
                                attributeMapping: Array.from(values).map(([ userstore, attribute ]) => {
                                    return {
                                        mappedAttribute: attribute,
                                        userstore: userstore
                                    }
                                })
                            }
                            onSubmit(submitData, values);
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
                                                value={ values?.get(store.name).toString() }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }) }
                        </Grid>
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
