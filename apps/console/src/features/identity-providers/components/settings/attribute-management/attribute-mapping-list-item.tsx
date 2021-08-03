/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { FormApi } from "final-form";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Field as FinalField, Form as FinalForm, FormRenderProps } from "react-final-form";
import { Form as SemanticForm, Grid, Header, Input, Select } from "semantic-ui-react";
import { IdentityProviderClaimInterface, IdentityProviderCommonClaimMappingInterface } from "../../../models";

/**
 * Props interface of {@link AttributeMappingListItem}
 */
export interface AttributeMappingListItemProps {
    availableAttributeList: Array<IdentityProviderClaimInterface>;
    editingMode?: boolean;
    mapping?: IdentityProviderCommonClaimMappingInterface;
    onSubmit: (mapping: IdentityProviderCommonClaimMappingInterface) => void;
}

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
 * button. If you pass editingMode={true} it will render plus icon button
 * inline and hide button with text "Add Mapping Button" below it
 * and input labels.
 *
 * @param props {AttributeMappingListIt emProps}
 * @constructor
 */
export const AttributeMappingListItem: FunctionComponent<AttributeMappingListItemProps> = (
    props: AttributeMappingListItemProps
): ReactElement => {

    const {
        onSubmit,
        availableAttributeList,
        mapping,
        editingMode
    } = props;

    const [ copyOfAttrs, setCopyOfAttrs ] = useState<Array<IdentityProviderClaimInterface>>([]);

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
     * @param values {Record<string, any>}
     * @param form {FormApi<Record<string, any>>}
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
        }
    };

    return (
        <FinalForm
            onSubmit={ onFormSub }
            initialValues={ mapping && {
                localClaimId: mapping?.claim?.id,
                mappedValue: mapping?.mappedValue
            } }
            render={ ({ handleSubmit, values, initialValues }: FormRenderProps): ReactNode => (
                <SemanticForm onSubmit={ handleSubmit }>
                    <Grid>
                        <Grid.Row columns={ editingMode ? 3 : 2 }>
                            <Grid.Column width={ editingMode ? 7 : 8 }>
                                <FinalField
                                    name="mappedValue"
                                    type="input"
                                    component={ InputAdapter }
                                    required
                                    label={ !editingMode && "External IdP Attribute" }
                                    width={ 16 }
                                    initialValue={ initialValues?.mappedValue }
                                    aria-label="External IdP Attribute Mapping Value"
                                    placeholder="Enter external IdP attribute"
                                />
                            </Grid.Column>
                            <Grid.Column width={ editingMode ? 7 : 8 }>
                                <FinalField
                                    search
                                    clearable
                                    name="localClaimId"
                                    type="select"
                                    component={ SelectAdapter }
                                    required
                                    width={ 16 }
                                    options={ getListOfAvailableAttributes() }
                                    label={ !editingMode && "Maps to" }
                                    placeholder="Select mapping attribute"
                                    aria-label="Local Claim Attribute"
                                    noResultsMessage="Try another attribute search."
                                />
                            </Grid.Column>
                            { /*When in editing mode, submit button is a icon button.*/ }
                            { editingMode && (
                                <Grid.Column width={ 1 }>
                                    <SemanticForm.Button
                                        disabled={ !values.mappedValue || !values.localClaimId }
                                        icon="checkmark"
                                        type="submit"
                                        name="submit-button"
                                        aria-label="Attribute Selection Form Submit Button"/>
                                </Grid.Column>
                            ) }
                        </Grid.Row>
                        { /*Shows only when the component is not in editing mode.*/ }
                        { !editingMode && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 } textAlign="right">
                                    <SemanticForm.Button
                                        disabled={ !values.mappedValue || !values.localClaimId }
                                        primary
                                        type="submit"
                                        name="submit-button"
                                        children="Add Attribute Mapping"
                                        aria-label="Attribute Selection Form Submit Button"/>
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                    </Grid>
                </SemanticForm>
            ) }
        />
    );

};

/**
 * Simple adapter. This component will be removed in near future.
 * @param input
 * @param meta
 * @param rest
 * @constructor
 */
const SelectAdapter = ({ input, meta, ...rest }: any) => {
    return (
        <SemanticForm.Dropdown
            { ...input }
            { ...rest }
            defaultValue={ input?.value }
            control={ Select }
            onChange={ (event, { value }) => input.onChange(value) }
            onBlur={ (event, { value }) => input.onChange(value) }
            error={ ((meta?.touched || meta.modified)
                && !!meta?.error) ? meta.error : undefined
            }
        />
    );
};

/**
 * Simple adapter. This component will be removed in near future.
 * @param input
 * @param meta
 * @param rest
 * @constructor
 */
const InputAdapter = ({ input, meta, ...rest }: any) => (
    <SemanticForm.Input
        { ...input }
        { ...rest }
        control={ Input }
        onChange={ (event, { value }) => input.onChange(value) }
        error={ ((meta?.touched || meta.modified)
            && !!meta?.error) ? meta.error : undefined
        }
    />
);
