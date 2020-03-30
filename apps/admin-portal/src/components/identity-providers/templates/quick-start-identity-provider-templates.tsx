/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { EmptyPlaceholder, IdentityProviderTemplateCard } from "@wso2is/react-components";
import React, { FunctionComponent, SyntheticEvent } from "react";
import { IdentityProviderTemplateListItemInterface } from "../../../models";
import { EmptyPlaceholderIllustrations, IdPIcons } from "../../../configs";

/**
 * Proptypes for the quick start templates component.
 */
interface QuickStartIdentityProviderTemplatesPropsInterface {
    /**
     * Callback to be fired on template selection.
     */
    onTemplateSelect: (e: SyntheticEvent, { id }: { id: string }) => void;
    /**
     * List of templates.
     */
    templates: IdentityProviderTemplateListItemInterface[];
}

/**
 * Get the corresponding image if it matches to a predefined IdP icon.
 * @param image Input image.
 * @return Predefined image if available. If not, return input parameter.
 */
const getPredefinedIdpImage = (image) => {
    const match = Object.keys(IdPIcons).find(key => key.toString() === image);
    return match ? IdPIcons[match] : image;
};

/**
 * Quick start application templates component.
 *
 * @param {QuickStartApplicationTemplatesPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const QuickStartIdentityProviderTemplates: FunctionComponent<QuickStartIdentityProviderTemplatesPropsInterface> = (
    props: QuickStartIdentityProviderTemplatesPropsInterface
): JSX.Element => {

    const {
        onTemplateSelect,
        templates
    } = props;

    return (
        <>
            {
                (templates && templates instanceof Array && templates.length > 0)
                    ? templates.map((template, index) => (
                        <IdentityProviderTemplateCard
                            key={ index }
                            description={ template.description }
                            image={ getPredefinedIdpImage(template.image) }
                            services={ template.services }
                            name={ template.name }
                            id={ template.id }
                            onClick={ onTemplateSelect }
                            imageSize={ "tiny" }
                        />
                    ))
                    :
                    <EmptyPlaceholder
                        image={ EmptyPlaceholderIllustrations.newList }
                        imageSize="tiny"
                        title={ "No Templates Available" }
                        subtitle={ ["Please add templates to display"] }
                    />
            }
        </>
    );
};
