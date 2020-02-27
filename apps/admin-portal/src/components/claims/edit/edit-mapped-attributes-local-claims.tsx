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
import { Claim, AttributeMapping } from "../../../models";
import { Grid, Button } from "semantic-ui-react";
import { Field, Validation, FormValue, Forms } from "@wso2is/forms";
import { getUserStoreList, updateAClaim } from "../../../api";

interface EditMappedAttributesLocalClaimsPropsInterface {
    claim: Claim;
    update: () => void;
}
export const EditMappedAttributesLocalClaims = (
    props: EditMappedAttributesLocalClaimsPropsInterface
): React.ReactElement => {
    
    const [mappedAttributes, setMappedAttributes] = useState<Set<number>>(new Set([0]));
    const [userStore, setUserStore] = useState([]);

    const { claim, update } = props;

    useEffect(() => {
        const userstore = [];
        userstore.push({
            id: "PRIMARY",
            name: "PRIMARY"
        });
        getUserStoreList().then((response) => {
            userstore.push(...response.data);
            setUserStore(userstore);
        }).catch(error => {
            setUserStore(userstore);
            // TODO: Notify
        });

        const tempMappedAttributes = new Set(mappedAttributes);
        claim?.attributeMapping.forEach((attribute, index) => {
            tempMappedAttributes.add(index);
        });
        setMappedAttributes(tempMappedAttributes);

    }, []);

    const getMappedAttributes = (values: Map<string, FormValue>): AttributeMapping[] => {
        const attributes: AttributeMapping[] = [];
        mappedAttributes.forEach((attribute: number) => {
            attributes.push({
                mappedAttribute: values.get("attribute" + attribute).toString(),
                userstore: values.get("userstore" + attribute).toString()
            });
        });
        return attributes;
    }

    const generateMappedAttributes = (): React.ReactElement[] => {

        const mappedElements: React.ReactElement[] = [];
        mappedAttributes?.forEach((attribute: number) => {

            const isFirstElement: boolean = attribute === Array.from(mappedAttributes)[0];
            const isOnlyElement: boolean = mappedAttributes.size === 1;

            mappedElements.push(
                <Grid.Row key={attribute} columns={3}>
                    <Grid.Column width={7}>
                        <Field
                            type="dropdown"
                            name={"userstore" + attribute}
                            label={isFirstElement ? "User Store" : null}
                            required={true}
                            requiredErrorMessage="Select a user store"
                            placeholder="Select a user store"
                            value={claim?.attributeMapping[attribute]?.userstore}
                            children={
                                userStore.map(store => {
                                    return {
                                        key: store.id,
                                        value: store.id,
                                        text: store.name
                                    }
                                })
                            }
                            validation={
                                (
                                    value: string,
                                    validation: Validation,
                                    values: Map<string, FormValue>
                                ) => {
                                    let isSameUserStore = false;
                                    let mappedAttribute;
                                    for (mappedAttribute of mappedAttributes) {
                                        if (
                                            (values.get("userstore" + mappedAttribute)
                                                === value)
                                            && mappedAttribute !== attribute
                                        ) {
                                            isSameUserStore = true;
                                            break;
                                        }
                                    };
                                    if (isSameUserStore) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            "This User Store has been selected twice. " +
                                            "A User Store can only be selected once."
                                        )
                                    }
                                }
                            }
                            displayErrorOn="blur"
                        />
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <Field
                            type="text"
                            name={"attribute" + attribute}
                            label={isFirstElement ? "Attribute to map to" : null}
                            required={true}
                            requiredErrorMessage="Enter an attribute or delete the mapping"
                            placeholder="Enter an attribute"
                            value={claim?.attributeMapping[attribute]?.mappedAttribute}
                        />
                    </Grid.Column>
                    <Grid.Column width={2} verticalAlign="bottom">
                        {
                            !isOnlyElement
                                ? (
                                    <Button
                                        type="button"
                                        size="mini"
                                        primary
                                        circular
                                        icon={"trash"}
                                        onClick={() => {
                                            const tempMappedAttributes = new Set(mappedAttributes);
                                            if (!isOnlyElement) {
                                                tempMappedAttributes.delete(attribute);
                                            }
                                            setMappedAttributes(tempMappedAttributes);
                                        }}
                                    />
                                )
                                : null
                        }
                    </Grid.Column>
                </Grid.Row>
            )
        });

        const lastElement: number = Array.from(mappedAttributes)[mappedAttributes.size - 1];
        mappedAttributes.size < userStore.length
            ? mappedElements.push(
                <Grid.Row key={lastElement + 1} textAlign="center" columns={1}>
                    <Grid.Column width={14}>
                        <Button
                            type="button"
                            size="mini"
                            primary
                            circular
                            icon="add"
                            onClick={() => {
                                if (mappedAttributes.size < userStore.length) {
                                    const tempMappedAttributes = new Set(mappedAttributes);
                                    tempMappedAttributes.add(lastElement + 1);
                                    setMappedAttributes(tempMappedAttributes);
                                }
                            }}
                        />
                    </Grid.Column>
                </Grid.Row>
            )
            : null;
        return mappedElements;
    };

    return (
        <Forms
            onSubmit={(values) => {
                const { id, dialectURI, ...claimData } = claim;
                const data: Claim = {
                    ...claimData,
                    attributeMapping: getMappedAttributes(values),
                }
                updateAClaim(claim.id, data).then((response) => {
                    //TODO: Notify
                    update();
                }).catch(error => {
                    //TODO: Notify 
                })
            }}
        >
            <Grid>
                <Grid.Row columns={1}>
                    <Grid.Column width={6}>
                        <h5>Map Attributes</h5>
                        <Grid>
                            {
                                generateMappedAttributes()
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column width={6}>
                        <Field
                            type="submit"
                            value="Update"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};
