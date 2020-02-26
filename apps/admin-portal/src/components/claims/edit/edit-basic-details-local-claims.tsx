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
import { Claim, AttributeMapping } from "../../../models";
import { Forms, Field, FormValue, Validation } from "@wso2is/forms";
import { Grid, Button } from "semantic-ui-react";
import { getADialect, getUserStoreList, updateAClaim } from "../../../api";

interface EditBasicDetailsLocalClaimsPropsInterface{
    claim: Claim;
    update: () => void;
}
export const EditBasicDetailsLocalClaims = (
    props: EditBasicDetailsLocalClaimsPropsInterface
): React.ReactElement => {

    const [mappedAttributes, setMappedAttributes] = useState<Set<number>>(new Set([0]));
    const [userStore, setUserStore] = useState([]);
    const [claimURIBase, setClaimURIBase] = useState("");

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

        getADialect("local").then((response) => {
            setClaimURIBase(response.dialectURI);
        }).catch(error => {

        })

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
                    <Grid.Column width={16}>
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
                const data:Claim = {
                    claimURI: claimURIBase + "/" + values.get("claimURI").toString(),
                    description: values.get("description").toString(),
                    displayOrder: parseInt(values.get("displayOrder").toString()),
                    regEx: values.get("regularExpression").toString(),
                    displayName: values.get("name").toString(),
                    attributeMapping: getMappedAttributes(values),
                    properties: claim.properties,
                    supportedByDefault: values.get("supportedByDefault").length > 0,
                    readOnly: values.get("readOnly").length > 0,
                    required: values.get("required").length > 0
                    
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
                        <Field
                            type="text"
                            name="name"
                            label="Name"
                            required={true}
                            requiredErrorMessage="Name is required"
                            placeholder="Enter a name for the claim"
                            value={claim?.displayName}
                        />
                        <Field
                            type="text"
                            name="description"
                            label="Description"
                            required={true}
                            requiredErrorMessage="Description is required"
                            placeholder="Enter a description"
                            value={claim?.description}
                        />
                        <Field
                            type="text"
                            name="claimURI"
                            label="Claim ID"
                            required={true}
                            requiredErrorMessage="Claim URI is required"
                            placeholder="Enter a claim URI"
                            value={claim?.claimURI.replace(claimURIBase+"/","")}
                        />
                        <Field
                            type="text"
                            name="regularExpression"
                            label="Regular Expression"
                            required={false}
                            requiredErrorMessage=""
                            placeholder="Regular expression to validate the claim"
                            value={claim?.regEx}
                        />
                        <Field
                            type="number"
                            min="0"
                            name="displayOrder"
                            label="Display Order"
                            required={false}
                            requiredErrorMessage=""
                            placeholder="Enter the display order"
                            value={claim?.displayOrder.toString()}
                        />
                        <Field
                            type="checkbox"
                            toggle={true}
                            name="supportedByDefault"
                            label="Show on Profile?"
                            required={false}
                            requiredErrorMessage=""
                            children={[{ value: "Support", label: "" }]}
                            value={claim?.supportedByDefault?["Support"]:[]}
                        />
                        <Field
                            type="checkbox"
                            toggle={true}
                            name="required"
                            label="Required"
                            required={false}
                            requiredErrorMessage=""
                            children={[{ value: "Required", label: "" }]}
                            value={claim?.required ? ["Required"] : []}
                        />
                        <Field
                            type="checkbox"
                            toggle={true}
                            name="readOnly"
                            label="Read Only"
                            required={false}
                            requiredErrorMessage=""
                            children={[{ value: "ReadOnly", label: "" }]}
                            value={claim?.readOnly ? ["ReadOnly"] : []}
                        />
                    </Grid.Column>
                </Grid.Row>
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
}