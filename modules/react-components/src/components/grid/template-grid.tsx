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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { ImageUtils, URLUtils } from "@wso2is/core/utils";
import classNames from "classnames";
import get from "lodash-es/get";
import take from "lodash-es/take";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SVGProps,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { Card, Grid } from "semantic-ui-react";
import { UserAvatar } from "../avatar";
import { LinkButton } from "../button";
import { SelectionCard, TemplateCard, TemplateCardPropsInterface } from "../card";
import { Heading } from "../typography";

/**
 * Proptypes for the template grid component.
 */
export interface TemplateGridPropsInterface<T> extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Empty placeholder
     */
    emptyPlaceholder?: ReactElement;
    /**
     * Heading for the grid.
     */
    heading?: ReactNode;
    /**
     * Size of the icon.
     */
    templateIconSize?: TemplateCardPropsInterface["imageSize"];
    /**
     * Icon options.
     */
    templateIconOptions?: TemplateCardPropsInterface["imageOptions"];
    /**
     * Callback to be fired on template selection.
     */
    onTemplateSelect: (e: SyntheticEvent, { id }: { id: string }) => void;
    /**
     * Callback to be fired on secondary template selection.
     */
    onSecondaryTemplateSelect?: (e: SyntheticEvent, { id }: { id: string }) => void;
    /**
     * Opacity for the overlay.
     */
    overlayOpacity?: TemplateCardPropsInterface["overlayOpacity"];
    /**
     * Enable/ Disable pagination.
     */
    paginate?: boolean;
    /**
     * Pagination limit.
     */
    paginationLimit?: number;
    /**
     * Grid pagination options.
     */
    paginationOptions?: TemplateGridPaginationOptionsInterface;
    /**
     * Display disabled items as grayscale.
     */
    renderDisabledItemsAsGrayscale?: TemplateCardPropsInterface["renderDisabledItemsAsGrayscale"];
    /**
     * Show/Hide tags section.
     */
    showTags?: TemplateCardPropsInterface["showTags"];
    /**
     * Show/Hide tags section.
     */
    showTagIcon?: TemplateCardPropsInterface["showTagIcon"];
    /**
     * Sub heading for the grid.
     */
    subHeading?: ReactNode;
    /**
     * Title for the tags section.
     */
    tagsSectionTitle?: TemplateCardPropsInterface["tagsSectionTitle"];
    /**
     * List of templates.
     */
    templates: T[];
    /**
     * List of secondary templates.
     */
    secondaryTemplates?: T[];
    /**
     * Selected template.
     */
    selectedTemplate?: T;
    /**
     * Template icons.
     */
    templateIcons?: {
        [ key: string ]: string | FunctionComponent<SVGProps<SVGSVGElement>>;
    };
    /**
     * Tag size.
     */
    tagSize?: TemplateCardPropsInterface["tagSize"];
    /**
     * Element to render the tag as.
     */
    tagsAs?: TemplateCardPropsInterface["tagsAs"];
    /**
     * Key to access the tags.
     * ex: `types` if the tags are in `template.types`
     */
    tagsKey?: string;
    /**
     * Grid type.
     */
    type: "application" | "idp" | "userstore";
    /**
     * Use selection card
     */
    useSelectionCard?: boolean;
    /**
     * Use initial as Image
     */
    useNameInitialAsImage?: boolean;
    /**
     * Coming soon ribbon label.
     */
    comingSoonRibbonLabel?: ReactNode;
}

/**
 * Interface for grid pagination options.
 */
export interface TemplateGridPaginationOptionsInterface {
    /**
     * Show more button label.
     */
    showMoreButtonLabel: string;
    /**
     * Show less button label.
     */
    showLessButtonLabel: string;
}

/**
 * Interface to extend the generic `T` interface in-order to access properties.
 */
interface WithPropertiesInterface {
    /**
     * Template description
     */
    description?: TemplateCardPropsInterface["description"];
    /**
     * Template ID.
     */
    id?: TemplateCardPropsInterface["id"];
    /**
     * Template image.
     */
    image?: TemplateCardPropsInterface["image"];
    /**
     * Template Name.
     */
    name: TemplateCardPropsInterface["name"];
    /**
     * Template disabled or not.
     */
    disabled?: TemplateCardPropsInterface["disabled"];
    /**
     * Should resource be listed as coming soon.
     */
    comingSoon?: boolean;
}


/**
 * Initial display limit.
 * TODO: Generate limit dynamically with screen dimensions.
 * @type {number}
 */
const DEFAULT_PAGINATION_LIMIT = 5;

/**
 * Template grid component.
 *
 * @param {TemplateGridPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TemplateGrid = <T extends WithPropertiesInterface>(
    props: TemplateGridPropsInterface<T>
): ReactElement => {

    const {
        className,
        emptyPlaceholder,
        heading,
        onTemplateSelect,
        overlayOpacity,
        paginate,
        paginationLimit,
        paginationOptions,
        renderDisabledItemsAsGrayscale,
        showTags,
        showTagIcon,
        subHeading,
        tagsKey,
        tagsSectionTitle,
        templates,
        selectedTemplate,
        templateIcons,
        tagsAs,
        tagSize,
        useSelectionCard,
        onSecondaryTemplateSelect,
        secondaryTemplates,
        templateIconOptions,
        templateIconSize,
        useNameInitialAsImage,
        comingSoonRibbonLabel,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "template-grid",
        className
    );

    const [ templateList, setTemplateList ] = useState<T[]>([]);
    const [ secondaryTemplateList, setSecondaryTemplateList ] = useState<T[]>([]);
    const [ isShowMoreClicked, setIsShowMoreClicked ] = useState<boolean>(false);

    useEffect(() => {
        if (paginate && !isShowMoreClicked) {
            setTemplateList(take(templates, paginationLimit));

            return;
        }

        setTemplateList(templates);
    }, [ templates ]);

    useEffect(() => {
        if (secondaryTemplates) {
            if (paginate && !isShowMoreClicked) {
                let balanceLimit = (paginationLimit - templates.length);

                balanceLimit = (balanceLimit < 0) ? 0 : balanceLimit;
                setSecondaryTemplateList(take(secondaryTemplates, balanceLimit));

                return;
            }
            setSecondaryTemplateList(secondaryTemplates);
        }
    }, [ secondaryTemplates, templates ]);


    /**
     * Checks if the template image URL is a valid image URL and if not checks if it's
     * available in the passed in icon set.
     *
     * @param image Input image.
     *
     * @return Predefined image if available. If not, return input parameter.
     */
    const resolveTemplateImage = (image: any) => {

        if (image) {
            if (typeof image !== "string") {
                return image;
            }

            if ((URLUtils.isHttpsUrl(image) || URLUtils.isHttpUrl(image)) && ImageUtils.isValidImageExtension(image)) {
                return image;
            }

            if (URLUtils.isDataUrl(image)) {
                return image;
            }

            if (!templateIcons) {
                return image;
            }
        }
        const match = Object.keys(templateIcons).find(key => key.toString() === image);

        return match ? templateIcons[ match ] : templateIcons[ "default" ] ?? image;
    };

    /**
     * Handles the view more button action.
     */
    const viewMoreTemplates = (): void => {
        setIsShowMoreClicked(true);
        setTemplateList(templates);
        if (secondaryTemplates) {
            setSecondaryTemplateList(secondaryTemplates);
        }
    };

    /**
     * Handles the view less button action.
     */
    const viewLessTemplates = (): void => {
        setIsShowMoreClicked(false);
        setTemplateList(take(templates, paginationLimit));
        if (secondaryTemplates) {
            let balanceLimit = (paginationLimit - templates.length);

            balanceLimit = (balanceLimit < 0) ? 0 : balanceLimit;
            setSecondaryTemplateList(take(secondaryTemplates, balanceLimit));
        }
    };

    const resolveCardListing = ((templateList: T[], onClick: any, useNameImage: boolean): ReactElement[] => {
        if (templateList.length > 0) {
            return templateList.map((template, index) => (
                <SelectionCard
                    key={ index }
                    inline
                    id={ template.id }
                    header={ template.name }
                    image={
                        useNameImage
                            ?
                            <UserAvatar name={ template.name } size="tiny"/>
                            : resolveTemplateImage(template.image)
                    }
                    imageOptions={ templateIconOptions }
                    onClick={ onClick }
                    selected={ selectedTemplate?.id === template.id }
                    data-componentid={ `${ componentId }-selection-card` }
                    data-testid={ `${ testId }-selection-card` }
                />
            ));
        }

        return null;
    });

    /**
     * Calculate pagination limit exceeded or not
     */
    const paginationLimitExceed = ((): boolean => {
        let exceeded = false;
        let length = 0;

        if (secondaryTemplates && secondaryTemplates instanceof Array) {
            length += secondaryTemplates.length;
        }
        if (templates && templates instanceof Array) {
            length += templates.length;
        }

        if (length > paginationLimit) {
            exceeded = true;
        }

        return exceeded;
    });

    return (
        <Grid className={ classes } data-testid={ testId } data-componentid={ componentId }>
            {
                (heading || subHeading)
                    ? (
                        <Grid.Row columns={ 2 }>
                            <Grid.Column>
                                {
                                    heading && (
                                        <Heading
                                            as="h4"
                                            compact
                                            data-componentid={ `${ componentId }-heading` }
                                            data-testid={ `${ testId }-heading` }
                                        >
                                            { heading }
                                        </Heading>
                                    )
                                }
                                {
                                    subHeading && (
                                        <Heading
                                            subHeading
                                            ellipsis
                                            as="h6"
                                            data-componentid={ `${ componentId }-sub-heading` }
                                            data-testid={ `${ testId }-sub-heading` }
                                        >
                                            { subHeading }
                                        </Heading>
                                    )
                                }
                            </Grid.Column>
                            {
                                paginate && (
                                    <Grid.Column textAlign="right">
                                        {
                                            (paginationLimitExceed())
                                                ? (
                                                    isShowMoreClicked ? (
                                                        <LinkButton
                                                            onClick={ viewLessTemplates }
                                                            data-componentid={ `${ componentId }-show-less-button` }
                                                            data-testid={ `${ testId }-show-less-button` }
                                                        >
                                                            { paginationOptions.showLessButtonLabel }
                                                        </LinkButton>
                                                    ) : (
                                                        <LinkButton
                                                            onClick={ viewMoreTemplates }
                                                            data-componentid={ `${ componentId }-show-more-button` }
                                                            data-testid={ `${ testId }-show-more-button` }
                                                        >
                                                            { paginationOptions.showMoreButtonLabel }
                                                        </LinkButton>
                                                    )
                                                )
                                                : null
                                        }
                                    </Grid.Column>
                                )
                            }
                        </Grid.Row>
                    )
                    : null
            }
            <Grid.Row>
                <Grid.Column>
                    {
                        useSelectionCard
                            ? (
                                (
                                    (
                                        templateList
                                        && templateList instanceof Array
                                        && templateList.length > 0
                                    )
                                    || (
                                        secondaryTemplateList
                                        && secondaryTemplateList instanceof Array
                                        && secondaryTemplateList.length > 0
                                    )
                                )
                                    ? (
                                        <>
                                            {
                                                resolveCardListing(templateList, onTemplateSelect, false)
                                            }
                                            {
                                                resolveCardListing(
                                                    secondaryTemplateList,
                                                    onSecondaryTemplateSelect,
                                                    useNameInitialAsImage
                                                )
                                            }
                                        </>
                                    )
                                    : emptyPlaceholder && emptyPlaceholder
                            )
                            : (
                                (templateList && templateList instanceof Array && templateList.length > 0)
                                    ? (
                                        <Card.Group>
                                            {
                                                templateList.map((template, index) => (
                                                    <TemplateCard
                                                        key={ index }
                                                        description={ template.description }
                                                        image={ resolveTemplateImage(template.image) }
                                                        imageOptions={ templateIconOptions }
                                                        tagsSectionTitle={ tagsSectionTitle }
                                                        tags={ get(template, tagsKey) }
                                                        tagsAs={ tagsAs }
                                                        showTags={ showTags }
                                                        showTagIcon={ showTagIcon }
                                                        name={ template.name }
                                                        id={ template.id }
                                                        onClick={
                                                            (template.disabled || template.comingSoon)
                                                                ? null
                                                                : onTemplateSelect
                                                        }
                                                        overlayOpacity={ overlayOpacity }
                                                        imageSize={ templateIconSize }
                                                        renderDisabledItemsAsGrayscale={
                                                            renderDisabledItemsAsGrayscale
                                                        }
                                                        tagSize={ tagSize }
                                                        data-componentid={ template.id }
                                                        data-testid={ template.id }
                                                        disabled={ template.disabled || template.comingSoon }
                                                        ribbon={ template.comingSoon ? comingSoonRibbonLabel : null }
                                                    />
                                                ))
                                            }
                                        </Card.Group>
                                    )
                                    : emptyPlaceholder && emptyPlaceholder
                            )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for template grid component.
 */
TemplateGrid.defaultProps = {
    "data-componentid": "template-grid",
    "data-testid": "template-grid",
    iconSize: "tiny",
    paginate: true,
    paginationLimit: DEFAULT_PAGINATION_LIMIT,
    paginationOptions: {
        showLessButtonLabel: "Show less",
        showMoreButtonLabel: "Show more"
    },
    useSelectionCard: false
};
