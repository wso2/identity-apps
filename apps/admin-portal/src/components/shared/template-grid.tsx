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

import { URLUtils } from "@wso2is/core/utils";
import { EmptyPlaceholder, Heading, LinkButton, TemplateCard } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { EmptyPlaceholderIllustrations } from "../../configs";

/**
 * Proptypes for the template grid component.
 */
interface TemplateGridPropsInterface {
    /**
     * Heading for the grid.
     */
    heading?: ReactNode;
    /**
     * Callback to be fired on template selection.
     */
    onTemplateSelect: (e: SyntheticEvent, { id }: { id: string }) => void;
    /**
     * Sub heading for the grid.
     */
    subHeading?: ReactNode;
    /**
     * List of templates.
     */
    templates: any;
    /**
     * Template icons.
     */
    templateIcons?: object;
    /**
     * Grid type.
     */
    type: "application" | "idp";
}

/**
 * Initial display limit.
 * @type {number}
 */
const GRID_INITIAL_LIMIT = 5;

/**
 * Template grid component.
 *
 * @param {TemplateGridPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const TemplateGrid: FunctionComponent<TemplateGridPropsInterface> = (
    props: TemplateGridPropsInterface
): ReactElement => {

    const {
        heading,
        onTemplateSelect,
        subHeading,
        templates,
        templateIcons,
        type
    } = props;

    const { t } = useTranslation();

    const [ templateList, setTemplateList ] = useState<any>([]);
    const [ isShowMoreClicked, setIsShowMoreClicked ] = useState<boolean>(false);

    useEffect(() => {
        setTemplateList(_.take(templates, GRID_INITIAL_LIMIT));
    }, [ templates ]);

    /**
     * Checks if the template image URL is a valid image URL and if not checks if it's
     * available in the passed in icon set.
     *
     * @param image Input image.
     *
     * @return Predefined image if available. If not, return input parameter.
     */
    const resolveTemplateImage = (image: any) => {
        if (typeof image !== "string") {
            return image;
        }

        if (URLUtils.isHttpsUrl(image) || URLUtils.isHttpUrl(image) || URLUtils.isDataUrl(image)) {
            return image;
        }

        if (!templateIcons) {
            return image;
        }

        const match = Object.keys(templateIcons).find(key => key.toString() === image);

        return match ? templateIcons[ match ] : image;
    };

    /**
     * Handles the view more button action.
     */
    const viewMoreTemplates = (): void => {
        setIsShowMoreClicked(true);
        setTemplateList(templates);
    };

    /**
     * Handles the view less button action.
     */
    const viewLessTemplates = (): void => {
        setIsShowMoreClicked(false);
        setTemplateList(_.take(templates, GRID_INITIAL_LIMIT));
    };

    return (
        <Grid>
            {
                (heading || subHeading)
                    ? (
                        <Grid.Row columns={ 2 }>
                            <Grid.Column>
                                <Heading as="h4">
                                    { heading }
                                    {
                                        subHeading && (
                                            <Heading subHeading ellipsis as="h6">{ subHeading }</Heading>
                                        )
                                    }
                                </Heading>
                            </Grid.Column>
                            <Grid.Column textAlign="right">
                                {
                                    (templates && templates instanceof Array && templates.length >= GRID_INITIAL_LIMIT)
                                        ? (
                                            isShowMoreClicked ? (
                                                <LinkButton onClick={ viewLessTemplates }>
                                                    { t("common:showLess" ) }
                                                </LinkButton>
                                            ) : (
                                                <LinkButton onClick={ viewMoreTemplates }>
                                                    { t("common:showMore" ) }
                                                </LinkButton>
                                            )
                                        )
                                        : null
                                }
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            <Grid.Row>
                <Grid.Column>
                    {
                        (templateList && templateList instanceof Array && templateList.length > 0)
                            ? templateList.map((template, index) => (
                                <TemplateCard
                                    key={ index }
                                    description={ template.description }
                                    image={ resolveTemplateImage(template.image) }
                                    tagsSectionTitle={
                                        type === "application"
                                            ? t("common:technologies")
                                            : t("common:services")
                                    }
                                    tags={
                                        type === "application"
                                            ? template.types
                                            : template.services
                                    }
                                    name={ template.name }
                                    id={ template.id }
                                    onClick={ onTemplateSelect }
                                    imageSize="tiny"
                                />
                            ))
                            :
                            <EmptyPlaceholder
                                image={ EmptyPlaceholderIllustrations.newList }
                                imageSize="tiny"
                                title={ t("devPortal:components.templates.emptyPlaceholder.title") }
                                subtitle={ [ t("devPortal:components.templates.emptyPlaceholder.subtitles") ] }
                            />
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};
