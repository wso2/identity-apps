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

import React, { FunctionComponent, SyntheticEvent } from "react";
import { ApplicationTemplateListItemInterface } from "../../../models";
// Importing the following from the `configs` index causes a circular dependency due to `GlobalConfig` being exported
// from the index as well. TODO: Revert the import after this issue is fixed.
import { EmptyPlaceholderIllustrations } from "../../../configs/ui";
import { ApplicationTemplateCard } from "./application-template-card";
import { EmptyPlaceholder } from "@wso2is/react-components";

/**
 * Proptypes for the quick start templates component.
 */
interface QuickStartApplicationTemplatesPropsInterface {
    /**
     * Callback to be fired on template selection.
     */
    onTemplateSelect: (e: SyntheticEvent, { id }: { id: string }) => void;
    /**
     * List of templates.
     */
    templates: ApplicationTemplateListItemInterface[];
}

/**
 * Quick start application templates component.
 *
 * @param {QuickStartApplicationTemplatesPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const QuickStartApplicationTemplates: FunctionComponent<QuickStartApplicationTemplatesPropsInterface> = (
    props: QuickStartApplicationTemplatesPropsInterface
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
                        <ApplicationTemplateCard
                            key={ index }
                            description={ template.description }
                            image={ template.image }
                            technologyTypes={ template.types }
                            name={ template.name }
                            id={ template.id }
                            onClick={ onTemplateSelect }
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
