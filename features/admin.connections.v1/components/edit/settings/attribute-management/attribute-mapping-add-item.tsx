/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Field, FieldConstants, Form } from "@wso2is/form";
import { FormValidation } from "@wso2is/validation";
import { FormApi } from "final-form";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Header } from "semantic-ui-react";
import { 
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface 
} from "../../../../models/connection";
/**
 * Props interface of {@link AttributeMappingAddItem}
 */
export interface AttributeMappingAddItemProps {
    /**
     * This is the list of attributes that the user can pick from.
     * It only contains the non-mapped/selected ones.
     */
    availableAttributeList: Array<ConnectionClaimInterface>;
    /**
     * Attributes which are already persisted (in model) or mapped locally.
     * What we mean by locally is that, user can open the modal multiple
     * times and map attributes before saving.
     */
    alreadyMappedAttributesList: Array<ConnectionCommonClaimMappingInterface>;
    onSubmit: (mapping: ConnectionCommonClaimMappingInterface) => void;
}

const toBits = (bool: boolean): number => bool ? 1 : 0;

const FORM_ID: string = "idp-attributes-mapping-list-item-form";

/**
 * This is a common interface that allows the user to map one attribute
 * to another local attribute. The interface looks like this: -
 *
 * External Mapping:           Local Mappings List:
 * +-----------------------+   +-----------------------+   +=====+
 * | This is a text input  |   |  This is a dropdown   |   |  +  |
 * +-----------------------+   +-----------------------+   +=====+
 *                                       +=============+
 *                                       | Add Mapping |
 *                                       +=============+
 *
 * This component is a <Form> internally. And the fields value submissions
 * are handled by onSubmit so, it is mandatory to have a submission
 * button. If you pass editingMode=`true` it will render plus icon button
 * inline and hide button with text "Add Mapping Button" below it
 * and input labels.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const AttributeMappingAddItem: FunctionComponent<AttributeMappingAddItemProps> = (
    props: AttributeMappingAddItemProps
): ReactElement => {

    const {
        onSubmit,
        availableAttributeList,
        alreadyMappedAttributesList
    } = props;

    const { t } = useTranslation();

    const [ copyOfAttrs, setCopyOfAttrs ] = useState<Array<ConnectionClaimInterface>>([]);
    const [ mappedInputValue, setMappedInputValue ] = useState<string>();
    const [ selectedLocalAttributeInputValue, setSelectedLocalAttributeInputValue ] = useState<string>();
    const [ mappingHasError, setMappingHasError ] = useState<boolean>();

    useEffect(() => {
        if (availableAttributeList) {
            const copy: ConnectionClaimInterface[] = [ ...availableAttributeList ];
          
            setCopyOfAttrs(copy);
        }
    }, [ availableAttributeList ]);

    const getListOfAvailableAttributes = () => {
        return copyOfAttrs.map((claim: ConnectionClaimInterface, index: number) => ({
            content: (
                <Header as="h6" key={ `attribute-option-${ index }` }>
                    <Header.Content>
                        { claim?.displayName }
                        <Header.Subheader>
                            <code className="inline-code compact transparent">
                                { claim.uri }
                            </code>
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            ),
            key: claim?.id,
            text: claim?.displayName,
            value: claim?.id
        }));
    };

    /**
     * Form submission handler.
     * @param values - Form values.
     * @param form - Form.
     */
    const onFormSub = (values: Record<string, any>, form: FormApi<Record<string, any>>) => {
        // Find the claim by id and create a instance of
        // ConnectionCommonClaimMappingInterface
        // with the mapping value.

        const mappedAttributes: ConnectionClaimInterface[] = [ ...copyOfAttrs ];

        const newMapping: ConnectionCommonClaimMappingInterface = {
            claim: mappedAttributes.find(
                (claim: ConnectionClaimInterface) => claim.id === values.localClaimId
            ),
            mappedValue: values.mappedValue
        } as ConnectionCommonClaimMappingInterface;    

        onSubmit(newMapping);

        // Resets the form field values and its fields states.
        form.change("mappedValue", "");
        form.change("localClaimId", "");
        form.resetFieldState("mappedValue");
        form.resetFieldState("localClaimId");
        setMappedInputValue("");
        setSelectedLocalAttributeInputValue("");
        
    };

    return (
        <Form
            id={ FORM_ID }
            onSubmit={ onFormSub }
            uncontrolledForm={ true }
        >
            <Grid>
                <Grid.Row columns={ 2 } key={ 1 }>
                    <Grid.Column width={ 8 } key={ 1 }>
                        <Field.Input
                            required
                            name="mappedValue"
                            inputType="identifier"
                            maxLength={ 120 }
                            minLength={ 1 }
                            label={ t("idp:forms.attributeSettings.attributeMapping." +
                                    "externalAttributeInput.label")
                            }
                            placeholder={
                                t("idp:forms.attributeSettings.attributeMapping." +
                                    "externalAttributeInput.placeHolder")
                            }
                            ariaLabel="External IdP Attribute Mapping Value"
                            validation={ (value: string) => {
                                if (!value || !value.trim()) {
                                    setMappingHasError(true);

                                    return FieldConstants.FIELD_REQUIRED_ERROR;
                                }

                                /**
                                 * Entity category support attribute values MUST be URIs. Such values
                                 * are also referred to as "category support URIs" but at the same time
                                 * our server allows simple strings as well.
                                 *
                                 * In the following if condition we do a bitwise AND SC operation
                                 * to either allow one of them.
                                 *
                                 * @see {@link https://datatracker.ietf.org/doc/html/rfc8409#section-4.1}
                                 */
                                if (toBits(!FormValidation.url(value)) &
                                    toBits(!FormValidation.isValidResourceName(value))) {
                                    setMappingHasError(true);

                                    return FieldConstants.INVALID_RESOURCE_ERROR;
                                }

                                // Check whether this attribute external name is already mapped.
                                const mappedValues: Set<string> = new Set(
                                    alreadyMappedAttributesList.map(
                                        (attributeMapping: ConnectionCommonClaimMappingInterface) =>
                                            attributeMapping.mappedValue
                                    )
                                );

                                if (mappedValues.has(value)) {
                                    // This means we have a mapping value like this...
                                    // But we need to make sure that if the current value
                                    // actually differs from the model value if user is in
                                    // editing mode...
                                    setMappingHasError(true);

                                    return t("idp:forms.attributeSettings.attributeMapping." +
                                        "externalAttributeInput.existingErrorMessage");
                                }
                                // If there's no errors.
                                setMappingHasError(false);

                                return undefined;
                            } }
                            listen={ (value: string) => setMappedInputValue(value) }
                            width={ 16 }/>
                    </Grid.Column>
                    <Grid.Column width={ 8 } key={ 2 }>
                        <Field.Dropdown
                            required
                            search
                            clearable
                            width={ 16 }
                            options={ getListOfAvailableAttributes() }
                            label={ t("idp:forms.attributeSettings.attributeMapping." +
                                "attributeDropdown.label")
                            }
                            ariaLabel="Local Claim Attribute"
                            name="localClaimId"
                            placeholder={
                                t("idp:forms.attributeSettings.attributeMapping." +
                                "attributeDropdown.placeHolder")
                            }
                            listen={ (value: string) => setSelectedLocalAttributeInputValue(value) }
                            noResultsMessage={
                                t("idp:forms.attributeSettings.attributeMapping." +
                                "attributeDropdown.noResultsMessage")
                            }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 } key={ 2 }>
                    <Grid.Column width={ 16 } textAlign="right">
                        <Field.Button
                            form={ FORM_ID }
                            disabled={
                                mappingHasError ||
                                !mappedInputValue ||
                                !selectedLocalAttributeInputValue
                            }
                            buttonType="primary_btn"
                            type="submit"
                            name="submit-button"
                            label={
                                t("idp:forms.attributeSettings.attributeMapping." +
                                    "addAttributeButtonLabel")
                            }
                            ariaLabel="Attribute Selection Form Submit Button"/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    );
};
