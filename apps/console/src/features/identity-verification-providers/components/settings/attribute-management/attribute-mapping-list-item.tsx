/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { FieldConstants } from "@wso2is/form";
import { PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { DropdownProps, Form, Grid, Header, InputOnChangeData } from "semantic-ui-react";
import { IDVPClaimMappingInterface, IDVPLocalClaimInterface } from "../../../models";

/**
 * Props interface of {@link AttributeMappingListItem}
 */
export interface AttributeMappingListItemProps {
    /**
     * This is the list of attributes that the user can pick from.
     * It only contains the non-mapped/selected ones.
     */
    availableAttributeList: Array<IDVPLocalClaimInterface>;
    /**
     * Attributes which are already persisted (in model) or mapped locally.
     * What we mean by locally is that, user can open the modal multiple
     * times and map attributes before saving.
     */
    alreadyMappedAttributesList: Array<IDVPClaimMappingInterface>;
    editingMode?: boolean;
    mapping?: IDVPClaimMappingInterface;
    onSubmit: (mapping: IDVPClaimMappingInterface) => void;
}

const toBits = (bool: boolean): number => bool ? 1 : 0;

const FORM_ID: string = "idvp-attributes-mapping-list-item-form";

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
 * button. If you pass editingMode=`true` it will render checkmark icon button
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

    const [ copyOfAttrs, setCopyOfAttrs ] = useState<Array<IDVPLocalClaimInterface>>([]);
    const [ mappedInputValue, setMappedInputValue ] = useState<string>();
    const [ selectedLocalAttributeInputValue, setSelectedLocalAttributeInputValue ] = useState<string>();
    const [ mappingHasError, setMappingHasError ] = useState<boolean>();
    const [ mappedInputValueError, setMappedInputValueError ] = useState<string>();
    // This is to prevent the error message from showing up when the mapped value input field has not been touched.
    const [ canMappedValueBeEmpty, setCanMappedValueBeEmpty ] = useState<boolean>(true);

    useEffect(() => {
        if (editingMode) {
            setMappedInputValue(mapping?.idvpClaim);
            setSelectedLocalAttributeInputValue(mapping?.localClaim.id);
        }
    }, []);

    useEffect(() => {
        setMappedInputValueError(validateMappedValue());
        //
        if(canMappedValueBeEmpty) {
            setCanMappedValueBeEmpty(false);
        }
    }, [ mappedInputValue ]);

    useEffect(() => {
        if (availableAttributeList) {
            const copy: IDVPLocalClaimInterface[]  = [ ...availableAttributeList ];

            // When you enter into editing mode the available attribute list
            // will not contain the mapping itself. We need to manually append
            // it to the attrs to make it work.
            if (editingMode && mapping?.idvpClaim && mapping?.localClaim) {
                copy.push(mapping.localClaim);
            }
            setCopyOfAttrs(copy);
        }
    }, [ availableAttributeList ]);

    const getListOfAvailableAttributes = () => {
        return copyOfAttrs.map((claim: IDVPLocalClaimInterface, index: number) => ({
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
     * @param event - Form event that triggerred the submission.
     */
    const onFormSub = (event: React.FormEvent ) => {

        event.preventDefault();

        // Find the claim by id and create an instance of
        // IdentityProviderCommonClaimMappingInterface
        // with the mapping value.
        const newAttributeMapping: IDVPClaimMappingInterface = {
            idvpClaim: mappedInputValue,
            localClaim: copyOfAttrs.find(
                (claim: IDVPLocalClaimInterface) => claim.id === selectedLocalAttributeInputValue
            )
        } as IDVPClaimMappingInterface;

        onSubmit(newAttributeMapping);
        if (!editingMode) {
            setMappedInputValue("");
            setSelectedLocalAttributeInputValue("");
            setCanMappedValueBeEmpty(true);
        }
    };

    const validateMappedValue = () => {
        if ((!mappedInputValue || !mappedInputValue?.trim())) {
            if(canMappedValueBeEmpty){
                return;
            }
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
        if (toBits(!FormValidation.url(mappedInputValue)) &
            toBits(!FormValidation.isValidResourceName(mappedInputValue))) {
            setMappingHasError(true);

            return FieldConstants.INVALID_RESOURCE_ERROR;
        }
        // Check whether this attribute external name is already mapped.
        const mappedValues: any = new Set(
            alreadyMappedAttributesList.map((a: IDVPClaimMappingInterface) => a.idvpClaim)
        );

        if (mappedValues.has(mappedInputValue)) {
            // This means we have a mapping value like this...
            // But we need to make sure that if the current value
            // actually differs from the model value if user is in
            // editing mode...
            if (editingMode && mapping?.idvpClaim === mappedInputValue) {
                setMappingHasError(false);

                return undefined;
            }
            setMappingHasError(true);

            return "There's already a attribute mapped with this name.";
        }
        // If there's no errors.
        setMappingHasError(false);

        return undefined;
    };

    return (
        <form
            id={ FORM_ID }
            noValidate={ true }
        >
            <Grid>
                <Grid.Row columns={ editingMode ? 3 : 2 }>
                    <Grid.Column width={ editingMode ? 7 : 8 }>
                        <Form.Input
                            required
                            name="mappedValue"
                            inputType="identifier"
                            maxLength={ 120 }
                            minLength={ 1 }
                            label={ !editingMode && "External IDVP Attribute" }
                            placeholder="Enter external IDVP attribute"
                            aria-label="External IDVP Attribute Mapping Value"
                            value={ mappedInputValue }
                            initialValue={ mappedInputValue }
                            error={ mappedInputValueError }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
                                setMappedInputValue(data.value as string);
                            } }
                            width={ 16 }
                        />
                    </Grid.Column>
                    <Grid.Column width={ editingMode ? 7 : 8 }>
                        <Form.Dropdown
                            required
                            search
                            selection
                            clearable
                            width={ 16 }
                            value={ selectedLocalAttributeInputValue }
                            initialValue={ selectedLocalAttributeInputValue }
                            options={ getListOfAvailableAttributes() }
                            label={ !editingMode && "Maps to" }
                            aria-Label="Local Claim Attribute"
                            name="localClaimId"
                            placeholder="Select mapping attribute"
                            onChange={ (e: React.SyntheticEvent<HTMLInputElement>, data: DropdownProps) => {
                                setSelectedLocalAttributeInputValue(data.value as string);
                            } }
                            noResultsMessage="Try another attribute search."/>
                    </Grid.Column>
                    { /*When in editing mode, submit button is an icon button.*/ }
                    { editingMode && (<React.Fragment>
                        <Grid.Column width={ 1 }>
                            <Form.Button
                                form={ FORM_ID }
                                disabled={ mappingHasError || !mappedInputValue || !selectedLocalAttributeInputValue }
                                icon="checkmark"
                                type="button"
                                onClick={ onFormSub }
                                name="edit-button"
                                ariaLabel="Attribute Selection Form Submit Button"
                                buttonType="secondary_btn"/>
                        </Grid.Column>
                    </React.Fragment>) }
                </Grid.Row>
                { /*Shows only when the component is not in editing mode.*/ }
                { !editingMode && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 } textAlign="right">
                            <PrimaryButton
                                form={ FORM_ID }
                                disabled={ mappingHasError || !mappedInputValue || !selectedLocalAttributeInputValue }
                                onClick={ onFormSub }
                                buttonType="primary_btn"
                                type="button"
                                name="submit-button"
                                ariaLabel="Attribute Selection Form Submit Button"
                            >
                                Add Attribute Mapping
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
        </form>
    );
};
