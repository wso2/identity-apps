/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmptyPlaceholder,
    TemplateGrid, TemplateGridPropsInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import {
    getEmptyPlaceholderIllustrations
} from "../../core";
import { getIdPIcons } from "../configs";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface
} from "../models";

/**
 * Proptypes for the IDP template grid component.
 */
interface IdentityProviderTemplateGridPropsInterface extends TestableComponentInterface, LoadableComponentInterface {

    /**
     * Categorized IDP templates.
     */
    categorizedTemplates: IdentityProviderTemplateCategoryInterface[];
    /**
     *
     */
    onTemplateSelect: TemplateGridPropsInterface<IdentityProviderTemplateItemInterface>[ "onTemplateSelect" ]
}

/**
 * IDP template selection grid.
 *
 * @param {IdentityProviderTemplateGridPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const IdentityProviderTemplateGrid: FunctionComponent<IdentityProviderTemplateGridPropsInterface> = (
    props: IdentityProviderTemplateGridPropsInterface
): ReactElement => {

    const {
        categorizedTemplates,
        isLoading,
        onTemplateSelect,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Generic function to render the template grid.
     *
     * @param {IdentityProviderTemplateInterface[]} templates - Set of templates to be displayed.
     * @param {object} additionalProps - Additional props for the `TemplateGrid` component.
     * @param {React.ReactElement} placeholder - Empty placeholder for the grid.
     * @param {IdentityProviderTemplateInterface[]} templatesOverrides - Template array which will get precedence.
     * @return {React.ReactElement}
     */
    const renderTemplateGrid = (templates: IdentityProviderTemplateInterface[],
                                additionalProps: object,
                                placeholder?: ReactElement,
                                templatesOverrides?: IdentityProviderTemplateInterface[]): ReactElement => {

        return (
            <TemplateGrid<any>
                className="idp-template-grid"
                type="idp"
                templates={
                    templatesOverrides
                        ? templatesOverrides
                        : templates
                }
                templateIcons={ getIdPIcons() }
                templateIconOptions={ {
                    as: "data-url",
                    fill: "primary"
                } }
                templateIconSize="x60"
                onTemplateSelect={ onTemplateSelect }
                paginate={ true }
                paginationLimit={ 5 }
                paginationOptions={ {
                    showLessButtonLabel: t("common:showLess"),
                    showMoreButtonLabel: t("common:showMore")
                } }
                overlayOpacity={ 0.6 }
                renderDisabledItemsAsGrayscale={ false }
                emptyPlaceholder={ placeholder }
                { ...additionalProps }
            />
        );
    };

    return (!isLoading)
        ? (
            <>
                {
                    categorizedTemplates
                        .map((category: IdentityProviderTemplateCategoryInterface, index: number) => (
                            <div key={ index } className="templates quick-start-templates">
                                {
                                    renderTemplateGrid(
                                        category.templates,
                                        {
                                            "data-testid": `${ category.id }-template-grid`,
                                            heading: category.displayName,
                                            showTagIcon: category.viewConfigs?.tags?.showTagIcon,
                                            showTags: category.viewConfigs?.tags?.showTags,
                                            subHeading: category.description,
                                            tagsAs: category.viewConfigs?.tags?.as,
                                            tagsKey: category.viewConfigs?.tags?.tagsKey,
                                            tagsSectionTitle: category.viewConfigs?.tags?.sectionTitle
                                        },
                                        <EmptyPlaceholder
                                            image={ getEmptyPlaceholderIllustrations().newList }
                                            imageSize="tiny"
                                            title={ t("console:develop.features.templates.emptyPlaceholder.title") }
                                            subtitle={
                                                [ t("console:develop.features.templates.emptyPlaceholder." +
                                                    "subtitles") ]
                                            }
                                            data-testid="idp-templates-quick-start-template-grid-empty-placeholder"
                                        />
                                    )
                                }
                                <Divider hidden/>
                            </div>
                        ))
                }
            </>
        )
        : <ContentLoader dimmer/>;
};

/**
 * Default props for the component.
 */
IdentityProviderTemplateGrid.defaultProps = {
    "data-testid": "idp-template-grid"
};
