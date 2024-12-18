/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import TextField from "@oxygen-ui/react/TextField";
import { CommonElementPropertiesPropsInterface } from "@wso2is/admin.flow-builder-core.v1/components/element-property-panel/element-properties";
import { FieldKey, FieldValue } from "@wso2is/admin.flow-builder-core.v1/models/base";
import { Element, ElementCategories } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import ElementPropertyFactory from "./element-property-factory";
import ButtonExtendedProperties from "./extended-properties/button-extended-properties";
import FieldExtendedProperties from "./extended-properties/field-extended-properties";
import { InputVariants } from "@wso2is/admin.flow-builder-core.v1/models/component";

/**
 * Props interface of {@link ElementProperties}
 */
export type ElementPropertiesPropsInterface = CommonElementPropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Factory to generate the property configurator for the given registration flow element.
 *
 * @param props - Props injected to the component.
 * @returns The ElementPropertyConfiguratorFactory component.
 */
const ElementProperties: FunctionComponent<ElementPropertiesPropsInterface> = ({
    properties,
    element,
    onChange,
    onVariantChange
}: ElementPropertiesPropsInterface): ReactElement | null => {
    const selectedVariant: Element = useMemo(() => {
        return element?.variants?.find((_element: Element) => _element.variant === element.variant);
    }, [ element.variants, element.variant ]);

    const renderElementPropertyFactory = () => {
        const hasVariants: boolean = !isEmpty(element?.variants);

        return (
            <>
                { hasVariants && (
                    <Autocomplete
                        disablePortal
                        options={ element?.variants }
                        sx={ { width: 300 } }
                        getOptionLabel={ (variant: Element) => variant.variant }
                        renderInput={ (params: AutocompleteRenderInputParams) => (
                            <TextField { ...params } label="Variant" />
                        ) }
                        value={ selectedVariant }
                        onChange={ (_: ChangeEvent<HTMLInputElement>, variant: Element) => {
                            onVariantChange(variant?.variant);
                        } }
                    />
                ) }
                { Object.entries(properties).map(([ key, value ]: [FieldKey, FieldValue]) => (
                    <ElementPropertyFactory
                        key={ `${element.id}-${key}` }
                        element={ element }
                        propertyKey={ key }
                        propertyValue={ value }
                        data-componentid={ `${element.id}-${key}` }
                        onChange={ onChange }
                    />
                )) }
            </>
        );
    };

    switch (element.category) {
        case ElementCategories.Field:
            if (element.variant === InputVariants.Password) {
                return renderElementPropertyFactory();
            }

            return (
                <>
                    <FieldExtendedProperties
                        element={ element }
                        data-componentid="field-extended-properties"
                        onChange={ onChange }
                    />
                    { renderElementPropertyFactory() }
                </>
            );
        case ElementCategories.Action:
            return (
                <>
                    <ButtonExtendedProperties
                        element={ element }
                        data-componentid="button-extended-properties"
                        onChange={ onChange }
                        onVariantChange={ onVariantChange }
                    />
                    { renderElementPropertyFactory() }
                </>
            );
        default:
            return <>{ renderElementPropertyFactory() }</>;
    }
};

export default ElementProperties;
