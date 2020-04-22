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

import React, { FunctionComponent, SyntheticEvent, useState } from "react";
import { ApplicationTemplateListItemInterface } from "../../../models";
import { EmptyPlaceholderIllustrations } from "../../../configs";
import { ApplicationTemplateCard } from "./application-template-card";
import { EmptyPlaceholder, Heading, LinkButton } from "@wso2is/react-components";
import { Grid } from "semantic-ui-react";
import _ from "lodash";

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

    const [ templateList, setTemplateList ] = useState<ApplicationTemplateListItemInterface[]>(_.take(templates, 6));
    const [ isShowMoreClicked, setIsShowMoreClicked ] = useState<boolean>(false);

    /**
     * Handles the view more button action
     */
    const viewMoreTemplates = (): void => {
        setIsShowMoreClicked(true);
        setTemplateList(templates);
    };

    /**
     * Handles the view less button action
     */
    const viewLessTemplates = (): void => {
        setIsShowMoreClicked(false);
        setTemplateList(_.take(templates, 6));
    };

    return (
        <>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column><Heading as="h4">
                        Quick Setup
                        <Heading subHeading ellipsis as="h6">
                            Predefined set of application templates to speed up your application creation.
                        </Heading>
                    </Heading></Grid.Column>
                    <Grid.Column>
                        {
                            (templates && templates instanceof Array && templates.length > 5) ? (
                                isShowMoreClicked ? (
                                    <LinkButton
                                        className="show-more-templates-button"
                                        floated="right"
                                        onClick={ viewLessTemplates }
                                    >
                                        Show Less
                                    </LinkButton>
                                ) : (
                                    <LinkButton
                                        className="show-more-templates-button"
                                        floated="right"
                                        onClick={ viewMoreTemplates }
                                    >
                                        Show More
                                    </LinkButton>
                                )
                            )
                            : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {
                            (templateList && templateList instanceof Array && templateList.length > 0)
                                ? templateList.map((template, index) => (
                                    template.id !== "custom-application" && (
                                        <ApplicationTemplateCard
                                            key={ index }
                                            description={ template.description }
                                            image={ template.image }
                                            technologyTypes={ template.types }
                                            name={ template.name }
                                            id={ template.id }
                                            onClick={ onTemplateSelect }
                                        />
                                    )
                                ))
                                :
                                <EmptyPlaceholder
                                    image={ EmptyPlaceholderIllustrations.newList }
                                    imageSize="tiny"
                                    title={ "No Templates Available" }
                                    subtitle={ ["Please add templates to display"] }
                                />
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    );
};
