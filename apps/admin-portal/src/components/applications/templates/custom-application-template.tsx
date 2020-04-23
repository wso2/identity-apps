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

import { EmptyPlaceholder, Heading, LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { Grid } from "semantic-ui-react";
import { ApplicationTemplateCard } from "./application-template-card";
import { EmptyPlaceholderIllustrations } from "../../../configs";
import { ApplicationTemplateListItemInterface } from "../../../models";

/**
 * Proptypes for the custom application template component.
 */
interface CustomApplicationTemplatesPropsInterface {
    /**
     * Callback to be fired on template selection.
     */
    onTemplateSelect: (e: SyntheticEvent, { id }: { id: string }) => void;
    /**
     * List of templates.
     */
    template: ApplicationTemplateListItemInterface;
}

/**
 * Custom application templates component.
 *
 * @param {CustomApplicationTemplatesPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const CustomApplicationTemplates: FunctionComponent<CustomApplicationTemplatesPropsInterface> = (
    props: CustomApplicationTemplatesPropsInterface
): ReactElement => {

    const {
        onTemplateSelect,
        template
    } = props;

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Heading as="h4">
                        Manual Setup
                            <Heading subHeading ellipsis as="h6">
                                Create an applications with custom configurations.
                            </Heading>
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {
                            template ?
                                (
                                    <ApplicationTemplateCard
                                        key={ 1 }
                                        description={ template.description }
                                        image={ template.image }
                                        technologyTypes={ template.types }
                                        name={ template.name }
                                        id={ template.id }
                                        onClick={ onTemplateSelect }
                                    />
                                )
                                :
                                (
                                    <EmptyPlaceholder
                                        image={ EmptyPlaceholderIllustrations.newList }
                                        imageSize="tiny"
                                        title={ "No custom app template Available" }
                                        subtitle={ ["Please add a template to display"] }
                                    />
                                )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};
