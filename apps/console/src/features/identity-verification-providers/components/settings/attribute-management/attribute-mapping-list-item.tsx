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

import { Button } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    /**
     * In the editing mode, the attribute mapping can be edited inplace.
     */
    editingMode?: boolean;
    /**
     * Stores the current IDVP attribute mapping.
     */
    mapping?: IDVPClaimMappingInterface;
    /**
     * This is the callback that is triggered when the user clicks the button to submits the form.
     * @param mapping - The current attribute mapping.
     */
    onSubmit: (mapping: IDVPClaimMappingInterface) => void;
}

/**
 * Converts a boolean to a bit.
 *
 * @param bool - Boolean to be converted.
 * @returns 1 if true, 0 if false.
 */
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

    const { t } = useTranslation();

    /**
     * If the component is in editing mode, sets the mapping to the input fields at the initial render.
     */
    useEffect(() => {
        if (editingMode) {
            setMappedInputValue(mapping?.idvpClaim);
            setSelectedLocalAttributeInputValue(mapping?.localClaim.id);
        }
    }, []);

    /**
     * Validate the mapped value input field when it's value changes.
     */
    useEffect(() => {
        setMappedInputValueError(validateMappedValue());
        if(canMappedValueBeEmpty) {
            setCanMappedValueBeEmpty(false);
        }
    }, [ mappedInputValue ]);

    /**
     * Updates the local copy of available attributes list when the available attributes list changes.
     */
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

    /**
     * Renders the available attributes as dropdown options.
     *
     * @returns Array of dropdown options.
     */
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
     *
     * @param event - Form event that triggerred the submission.
     * @returns void
     */
    const onFormSubmit = (event: React.FormEvent ): void => {

        // Prevent the submission of outer forms.
        event.preventDefault();

        // Find the claim by id and create an instance of IDVPClaimMappingInterface with the mapping value.
        const newAttributeMapping: IDVPClaimMappingInterface = {
            idvpClaim: mappedInputValue,
            localClaim: copyOfAttrs.find(
                (claim: IDVPLocalClaimInterface) => claim.id === selectedLocalAttributeInputValue
            )
        } as IDVPClaimMappingInterface;

        onSubmit(newAttributeMapping);

        if (!editingMode) {
            // reset input fields.
            setMappedInputValue("");
            setSelectedLocalAttributeInputValue("");
            setCanMappedValueBeEmpty(true);
        }
    };

    /**
     * The method that handles the validation of mapped value input field.
     *
     * @returns Error message if the validation fails.
     */
    const validateMappedValue = (): string => {

        if ((!mappedInputValue || !mappedInputValue?.trim())) {
            if(canMappedValueBeEmpty){
                return;
            }
            setMappingHasError(true);

            return  t(
                "idvp:forms.attributeSettings.attributeMappingListItem.validation.required"
            );
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

            return  t(
                "idvp:forms.attributeSettings.attributeMappingListItem.validation.invalid"
            );
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

            return  t(
                "idvp:forms.attributeSettings.attributeMappingListItem.validation.duplicate"
            );
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
                            label={ !editingMode && t("idvp:forms.attributeSettings" +
                                ".attributeMappingListItem.labels.mappedValue") }
                            placeholder= { t("idvp:forms.attributeSettings" +
                                ".attributeMappingListItem.placeholders.mappedValue") }
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
                            label={ !editingMode && t("idvp:forms.attributeSettings" +
                                ".attributeMappingListItem.labels.localClaim") }
                            aria-Label="Local Claim Attribute"
                            name="localClaimId"
                            placeholder= { t("idvp:forms.attributeSettings" +
                                ".attributeMappingListItem.placeholders.localClaim") }
                            onChange={ (e: React.SyntheticEvent<HTMLInputElement>, data: DropdownProps) => {
                                setSelectedLocalAttributeInputValue(data.value as string);
                            } }
                            noResultsMessage="Try another attribute search."
                        />
                    </Grid.Column>
                    { /*When in editing mode, submit button is an icon button.*/ }
                    { editingMode && (<React.Fragment>
                        <Grid.Column width={ 1 }>
                            <Form.Button
                                form={ FORM_ID }
                                disabled={ mappingHasError || !mappedInputValue || !selectedLocalAttributeInputValue }
                                icon="checkmark"
                                type="button"
                                onClick={ onFormSubmit }
                                name="edit-button"
                                ariaLabel="Attribute Selection Form Submit Button"
                                buttonType="secondary_btn"
                            />
                        </Grid.Column>
                    </React.Fragment>) }
                </Grid.Row>
                { /*Shows only when the component is not in editing mode.*/ }
                { !editingMode && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 } textAlign="right">
                            <Button
                                form={ FORM_ID }
                                disabled={ mappingHasError || !mappedInputValue || !selectedLocalAttributeInputValue }
                                onClick={ onFormSubmit }
                                buttonType="secondary_btn"
                                type="button"
                                name="submit-button"
                                ariaLabel="Attribute Selection Form Submit Button"
                            >
                                { t("idvp:forms.attributeSettings.attributeMapping" +
                                    ".addButton") }
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
        </form>
    );
};
