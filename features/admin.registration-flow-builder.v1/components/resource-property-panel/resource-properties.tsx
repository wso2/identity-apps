/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { FieldKey, FieldValue } from "@wso2is/admin.flow-builder-core.v1/models/base";
import { Element, ElementCategories } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { Resource } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { StepCategories, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import ButtonExtendedProperties from "./extended-properties/button-extended-properties";
import FieldExtendedProperties from "./extended-properties/field-extended-properties";
import RulesProperties from "./nodes/rules-properties";
import ResourcePropertyFactory from "./resource-property-factory";
import FederationProperties from "./steps/execution/federation-properties";
import RegistrationFlowBuilderConstants from "../../constants/registration-flow-builder-constants";

/**
 * Props interface of {@link ResourceProperties}
 */
export type ResourcePropertiesPropsInterface = CommonResourcePropertiesPropsInterface & IdentifiableComponentInterface;

/**
 * Factory to generate the property configurator for the given registration flow resource.
 *
 * @param props - Props injected to the component.
 * @returns The ResourceProperties component.
 */
const ResourceProperties: FunctionComponent<ResourcePropertiesPropsInterface> = ({
    properties,
    resource,
    onChange,
    onVariantChange
}: ResourcePropertiesPropsInterface): ReactElement | null => {
    const selectedVariant: Element = useMemo(() => {
        return resource?.variants?.find((_element: Element) => _element.variant === resource.variant);
    }, [ resource.variants, resource.variant ]);

    const renderElementId = (): ReactElement => {
        return (
            <ResourcePropertyFactory
                // TODO: Fix the flow issue with the `id` property change and remove this.
                InputProps={ { readOnly: true } }
                key={ `${resource.id}-$id` }
                resource={ resource }
                propertyKey="id"
                propertyValue={ resource.id }
                data-componentid={ `${resource.id}-id` }
                onChange={ (_: string, newValue: any, resource: Resource) => {
                    onChange("id", newValue, resource);
                } }
            />
        );
    };

    const renderElementPropertyFactory = () => {
        const hasVariants: boolean = !isEmpty(resource?.variants);

        return (
            <>
                { hasVariants && (
                    <Autocomplete
                        disablePortal
                        options={ resource?.variants }
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
                { properties && Object.entries(properties)?.map(([ key, value ]: [FieldKey, FieldValue]) => (
                    <ResourcePropertyFactory
                        key={ `${resource.id}-${key}` }
                        resource={ resource }
                        propertyKey={ key }
                        propertyValue={ value }
                        data-componentid={ `${resource.id}-${key}` }
                        onChange={ onChange }
                    />
                )) }
            </>
        );
    };

    switch (resource.category) {
        case ElementCategories.Field:
            return (
                <>
                    { renderElementId() }
                    <FieldExtendedProperties
                        resource={ resource }
                        data-componentid="field-extended-properties"
                        onChange={ onChange }
                    />
                    { renderElementPropertyFactory() }
                </>
            );
        case ElementCategories.Action:
            return (
                <>
                    { renderElementId() }
                    <ButtonExtendedProperties
                        resource={ resource }
                        data-componentid="button-extended-properties"
                        onChange={ onChange }
                        onVariantChange={ onVariantChange }
                    />
                    { renderElementPropertyFactory() }
                </>
            );
        case StepCategories.Decision:
            if (resource.type === StepTypes.Rule) {
                return (
                    <>
                        { renderElementId() }
                        <RulesProperties />
                    </>
                );
            }

            break;
        case StepCategories.Workflow:
            return (
                <>
                    { renderElementId() }
                    {
                        !RegistrationFlowBuilderConstants.FEDERATION_CONFIG_SKIPPED_EXECUTORS.includes(
                            resource?.data?.action?.executor?.name) && (
                            <FederationProperties
                                resource={ resource }
                                data-componentid="federation-properties"
                                onChange={ onChange }
                            />
                        )
                    }
                    { renderElementPropertyFactory() }
                </>
            );
        default:
            return (
                <>
                    { renderElementId() }
                    { renderElementPropertyFactory() }
                </>
            );
    }
};

export default ResourceProperties;
