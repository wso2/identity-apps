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

import { Field, FieldConstants, Form, FormPropsInterface } from "@wso2is/form";
import { Code, Popup } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { 
    ConnectionClaimInterface,
    ConnectionCommonClaimMappingInterface 
} from "../../../../models/connection";

/**
 * Props interface of {@link AttributeMappingListItem}
 */
export interface AttributeMappingListItemProps {
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
    mapping?: ConnectionCommonClaimMappingInterface;
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
export const AttributeMappingListItem: FunctionComponent<AttributeMappingListItemProps> = (
    props: AttributeMappingListItemProps
): ReactElement => {

    const {
        onSubmit,
        availableAttributeList,
        alreadyMappedAttributesList,
        mapping
    } = props;

    const { t } = useTranslation();

    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const [ copyOfAttrs, setCopyOfAttrs ] = useState<Array<ConnectionClaimInterface>>([]);
    const [ mappedInputValue, setMappedInputValue ] = useState<string>();
    const [ selectedLocalAttributeInputValue, setSelectedLocalAttributeInputValue ] = useState<string>();
    const [ mappingHasError, setMappingHasError ] = useState<boolean>();

    useEffect(() => {
        setMappedInputValue(mapping?.mappedValue);
        setSelectedLocalAttributeInputValue(mapping?.claim.id);
    }, []);

    useEffect(() => {
        if (availableAttributeList) {
            const copy: ConnectionClaimInterface[] = [ ...availableAttributeList ];

            // The available attribute list will not contain the mapping itself.
            // We need to manually append it to the attrs to make it work.
            if (mapping && mapping.mappedValue && mapping.claim) {
                copy.push(mapping.claim);
            }
            setCopyOfAttrs(copy);
        }
    }, [ availableAttributeList ]);

    /**
     * Form submission handler.
     * @param values - Form values.
     * @param form - Form.
     */
    const onFormSub = (values: Record<string, any>) => {
        // Find the claim by id and create a instance of
        // ConnectionCommonClaimMappingInterface
        // with the mapping value.
        const newMapping: ConnectionCommonClaimMappingInterface = {
            claim: copyOfAttrs.find(
                (claim: ConnectionClaimInterface) => claim.id === values.localClaimId
            ),
            mappedValue: values.mappedValue
        } as ConnectionCommonClaimMappingInterface;

        onSubmit(newMapping);
    };

    return (
        <Form
            id={ FORM_ID }
            ref={ formRef }
            onSubmit={ onFormSub }
            uncontrolledForm={ true }
            initialValues={ mapping && {
                localClaimId: mapping?.claim?.id,
                mappedValue: mapping?.mappedValue
            } }
        >
            <Grid>
                <Grid.Row columns={ 3 }>
                    <Grid.Column width={ 7 }>
                        <Field.Input
                            required
                            name="mappedValue"
                            inputType="identifier"
                            maxLength={ 120 }
                            minLength={ 1 }
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
                                    if (mapping?.mappedValue === value) {
                                        setMappingHasError(false);

                                        return undefined;
                                    }
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
                    <Grid.Column width={ 7 }>
                        <div>{ mapping?.claim?.displayName }</div>
                        <Popup
                            content={ mapping?.claim?.uri }
                            inverted
                            trigger={ <Code>{ mapping?.claim?.uri }</Code> }
                            position="bottom left"
                        />
                    </Grid.Column>
                    <Grid.Column width={ 2 } textAlign="right">
                        <Field.Button
                            form={ FORM_ID }
                            disabled={
                                mappingHasError ||
                                !mappedInputValue ||
                                !selectedLocalAttributeInputValue
                            }
                            icon="checkmark"
                            name="submit-button"
                            size="small"
                            ariaLabel="Attribute Selection Form Submit Button"
                            buttonType="secondary_btn"
                            onClick={ () => formRef?.current?.triggerSubmit() }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    );
};
