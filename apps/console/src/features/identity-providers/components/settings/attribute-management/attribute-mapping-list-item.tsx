/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { Grid, Header } from "semantic-ui-react";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";

/**
 * Props interface of {@link AttributeMappingListItem}
 */
export interface AttributeMappingListItemProps {
    /**
     * This is the list of attributes that the user can pick from.
     * It only contains the non-mapped/selected ones.
     */
    availableAttributeList: Array<IdentityProviderClaimInterface>;
    /**
     * Attributes which are already persisted (in model) or mapped locally.
     * What we mean by locally is that, user can open the modal multiple
     * times and map attributes before saving.
     */
    alreadyMappedAttributesList: Array<IdentityProviderCommonClaimMappingInterface>;
    editingMode?: boolean;
    mapping?: IdentityProviderCommonClaimMappingInterface;
    onSubmit: (mapping: IdentityProviderCommonClaimMappingInterface) => void;
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
export const AttributeMappingListItem: FunctionComponent<AttributeMappingListItemProps> = (
    props: AttributeMappingListItemProps
): ReactElement => {

    const {
        onSubmit,
        availableAttributeList,
        alreadyMappedAttributesList,
        mapping,
        editingMode
    } = props;

    const [ copyOfAttrs, setCopyOfAttrs ] = useState<Array<IdentityProviderClaimInterface>>([]);
    const [ mappedInputValue, setMappedInputValue ] = useState<string>();
    const [ selectedLocalAttributeInputValue, setSelectedLocalAttributeInputValue ] = useState<string>();
    const [ mappingHasError, setMappingHasError ] = useState<boolean>();

    useEffect(() => {
        if (editingMode) {
            setMappedInputValue(mapping?.mappedValue);
            setSelectedLocalAttributeInputValue(mapping?.claim.id);
        }
    }, []);

    useEffect(() => {
        if (availableAttributeList) {
            const copy = [ ...availableAttributeList ];

            // When you enter into editing mode the available attribute list
            // will not contain the mapping itself. We need to manually append
            // it to the attrs to make it work.
            if (editingMode && mapping && mapping.mappedValue && mapping.claim) {
                copy.push(mapping.claim);
            }
            setCopyOfAttrs(copy);
        }
    }, [ availableAttributeList ]);

    const getListOfAvailableAttributes = () => {
        return copyOfAttrs.map((claim, index) => ({
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
        // IdentityProviderCommonClaimMappingInterface
        // with the mapping value.
        const newMapping = {
            claim: copyOfAttrs.find(
                (claim) => claim.id === values.localClaimId
            ),
            mappedValue: values.mappedValue
        } as IdentityProviderCommonClaimMappingInterface;

        onSubmit(newMapping);

        if (!editingMode) {
            // Resets the form field values and its fields states.
            form.change("mappedValue", "");
            form.change("localClaimId", "");
            form.resetFieldState("mappedValue");
            form.resetFieldState("localClaimId");
            setMappedInputValue("");
            setSelectedLocalAttributeInputValue("");
        }
    };

    return (
        <Form
            id={ FORM_ID }
            onSubmit={ onFormSub }
            uncontrolledForm={ true }
            initialValues={ mapping && {
                localClaimId: mapping?.claim?.id,
                mappedValue: mapping?.mappedValue
            } }>

            <Grid>
                <Grid.Row columns={ editingMode ? 3 : 2 }>
                    <Grid.Column width={ editingMode ? 7 : 8 }>
                        <Field.Input
                            required
                            name="mappedValue"
                            inputType="identifier"
                            maxLength={ 120 }
                            minLength={ 1 }
                            label={ !editingMode && "External IdP Attribute" }
                            placeholder="Enter external IdP attribute"
                            ariaLabel="External IdP Attribute Mapping Value"
                            validation={ (value) => {
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
                                const mappedValues = new Set(
                                    alreadyMappedAttributesList.map((a) => a.mappedValue)
                                );

                                if (mappedValues.has(value)) {
                                    // This means we have a mapping value like this...
                                    // But we need to make sure that if the current value
                                    // actually differs from the model value if user is in
                                    // editing mode...
                                    if (editingMode && mapping?.mappedValue === value) {
                                        setMappingHasError(false);

                                        return undefined;
                                    }
                                    setMappingHasError(true);

                                    return "There's already a attribute mapped with this name.";
                                }
                                // If there's no errors.
                                setMappingHasError(false);

                                return undefined;
                            } }
                            listen={ (value: string) => setMappedInputValue(value) }
                            width={ 16 }/>
                    </Grid.Column>
                    <Grid.Column width={ editingMode ? 7 : 8 }>
                        <Field.Dropdown
                            required
                            search
                            clearable
                            width={ 16 }
                            value={ editingMode && mapping?.claim?.id }
                            options={ getListOfAvailableAttributes() }
                            label={ !editingMode && "Maps to" }
                            ariaLabel="Local Claim Attribute"
                            name="localClaimId"
                            placeholder="Select mapping attribute"
                            listen={ (value: string) => setSelectedLocalAttributeInputValue(value) }
                            noResultsMessage="Try another attribute search."
                        />
                    </Grid.Column>
                    { /*When in editing mode, submit button is a icon button.*/ }
                    { editingMode && (
                        <React.Fragment>
                            <Grid.Column width={ 1 }>
                                <Field.Button
                                    form={ FORM_ID }
                                    disabled={
                                        mappingHasError ||
                                        !mappedInputValue ||
                                        !selectedLocalAttributeInputValue
                                    }
                                    icon="checkmark"
                                    type="submit"
                                    name="submit-button"
                                    ariaLabel="Attribute Selection Form Submit Button"
                                    buttonType="secondary_btn"/>
                            </Grid.Column>
                        </React.Fragment>
                    ) }
                </Grid.Row>
                { /*Shows only when the component is not in editing mode.*/ }
                { !editingMode && (
                    <Grid.Row columns={ 1 }>
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
                                label="Add Attribute Mapping"
                                ariaLabel="Attribute Selection Form Submit Button"/>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
        </Form>
    );
};
