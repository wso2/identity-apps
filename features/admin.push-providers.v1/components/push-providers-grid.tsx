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

import useExtensionTemplates from "@wso2is/admin.template-core.v1/hooks/use-extension-templates";
import {
    CategorizedExtensionTemplatesInterface,
    ExtensionTemplateListInterface
} from "@wso2is/admin.template-core.v1/models/templates";
import { IdentifiableComponentInterface, LoadableComponentInterface } from "@wso2is/core/models";
import {
    GridLayout,
    ResourceGrid
} from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect } from "react";
import PushProviderCard from "./push-provider-card";
import "./push-providers-grid.scss";

/**
 * Props for the Push Providers grid component.
 */
export interface PushProvidersGridPropsInterface extends IdentifiableComponentInterface, LoadableComponentInterface {
    /**
     * Callback to be fired when a template is selected.
     */
    onTemplateSelect: (template: ExtensionTemplateListInterface) => void;

    onTemplatesLoad?: (templates: ExtensionTemplateListInterface[]) => void;

    selectedTemplate: ExtensionTemplateListInterface;
}

/**
 * Push Providers grid page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Push Providers grid page.
 */
const PushProvidersGrid: FunctionComponent<PushProvidersGridPropsInterface> = ({
    onTemplateSelect,
    onTemplatesLoad,
    selectedTemplate,
    ["data-componentid"]: componentId = "push-providers-grid"
}: PushProvidersGridPropsInterface): ReactElement => {

    const {
        templates,
        categorizedTemplates,
        isExtensionTemplatesRequestLoading: isPushProviderTemplatesRequestLoading
    } = useExtensionTemplates();

    const handleTemplateSelection = (
        e: MouseEvent<HTMLDivElement>,
        template: ExtensionTemplateListInterface
    ): void => {
        if (!template) {
            return;
        }
        // TODO: event publishing is required.
        onTemplateSelect(template);
    };

    useEffect(() => {
        if (templates && onTemplatesLoad) {
            onTemplatesLoad(templates);
        }
    }, [ templates, onTemplatesLoad ]);


    return (
        <GridLayout
            isLoading={ isPushProviderTemplatesRequestLoading }
            data-componentid={ componentId }
        >
            {
                categorizedTemplates.map((category: CategorizedExtensionTemplatesInterface) => {
                    const templates: ExtensionTemplateListInterface[] = category?.templates;

                    if (templates?.length <= 0) {
                        return null;
                    }

                    return (
                        <div key={ category?.id } className="push-provider-card-group">
                            <ResourceGrid
                                isEmpty={
                                    !Array.isArray(templates)
                                        || templates.length <= 0
                                }
                            >
                                {
                                    templates.map(
                                        (template: ExtensionTemplateListInterface) => {
                                            return (
                                                <PushProviderCard
                                                    key={ template.id }
                                                    template={ template }
                                                    onClick={ (e: MouseEvent<HTMLDivElement>) => {
                                                        handleTemplateSelection(e, template);
                                                    } }
                                                    selected={ selectedTemplate === template }
                                                />
                                            );
                                        })
                                }
                            </ResourceGrid>
                        </div>
                    );
                })
            }
        </GridLayout>
    );
};

export default PushProvidersGrid;
