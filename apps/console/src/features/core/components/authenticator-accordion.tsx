/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    GenericIcon,
    GenericIconProps,
    SegmentedAccordion,
    SegmentedAccordionTitlePropsInterface
} from "@wso2is/react-components";
import classNames from "classnames";
import sortBy from "lodash-es/sortBy";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement
} from "react";

/**
 * Proptypes for the Authenticator Accordion component.
 */
export interface AuthenticatorAccordionPropsInterface extends TestableComponentInterface {
    /**
     * Set of authenticators.
     */
    authenticators: AuthenticatorAccordionItemInterface[];
    /**
     * Accordion actions.
     */
    globalActions?: SegmentedAccordionTitlePropsInterface["actions"];
    /**
     * Hides the chevron icon.
     */
    hideChevron?: SegmentedAccordionTitlePropsInterface["hideChevron"];
    /**
     * Attribute to sort the array.
     */
    orderBy?: string;
    /**
     * List of active accordion indexes.
     */
    accordionActiveIndexes?: number[];
    /**
     * Accordion index.
     */
    accordionIndex?: number;
    /**
     * Handle accordion on click method.
     */
    handleAccordionOnClick?: SegmentedAccordionTitlePropsInterface["handleAccordionOnClick"];
}

/**
 * Authenticator interface.
 */
export interface AuthenticatorAccordionItemInterface {
    /**
     * Accordion actions.
     */
    actions?: SegmentedAccordionTitlePropsInterface["actions"];
    /**
     * Custom Classname for the authenticator title.
     */
    className?: string;
    /**
     * Unique id for the authenticator.
     */
    id: string;
    /**
     * Flag to show/hide the authenticator inside the accordion.
     */
    hidden?: boolean;
    /**
     * Hides the chevron icon.
     */
    hideChevron?: SegmentedAccordionTitlePropsInterface["hideChevron"];
    /**
     * Title of the authenticator.
     */
    title: string;
    /**
     * Additional Options for the title.
     */
    titleOptions?: {
        /**
         * Flag to determine if the accordion title should be flex.
         */
        flex?: boolean;
    };
    /**
     * Icon for the authenticator
     */
    icon?: GenericIconProps;
    /**
     * Authenticator form.
     */
    content?: ReactElement;
}

/**
 * Authenticator accordion component.
 *
 * @param props - Props injected to the component.
 * @returns Authenticator accordion component.
 */
export const AuthenticatorAccordion: FunctionComponent<AuthenticatorAccordionPropsInterface> = (
    props: AuthenticatorAccordionPropsInterface
): ReactElement => {

    const {
        accordionIndex,
        handleAccordionOnClick,
        globalActions,
        authenticators,
        accordionActiveIndexes,
        hideChevron,
        orderBy,
        [ "data-testid" ]: testId
    } = props;

    return (
        authenticators
            ? (
                <SegmentedAccordion
                    fluid
                    data-testid={ testId }
                >
                    {
                        sortBy(authenticators, orderBy).map((authenticator: AuthenticatorAccordionItemInterface) => (
                            !authenticator.hidden
                                ? (
                                    <Fragment key={ accordionIndex }>
                                        <SegmentedAccordion.Title
                                            id={ authenticator.id }
                                            data-testid={ `${ testId }-${ authenticator.id }-title` }
                                            active={ accordionActiveIndexes?.includes(accordionIndex) || false }
                                            accordionIndex={ accordionIndex }
                                            onClick={ !authenticator.hideChevron && handleAccordionOnClick }
                                            content={ (
                                                <div
                                                    className={
                                                        classNames(
                                                            "segmented-accordion-title-content",
                                                            authenticator.className,
                                                            { flex: authenticator.titleOptions?.flex }
                                                        )
                                                    }
                                                >
                                                    <GenericIcon
                                                        floated="left"
                                                        size="micro"
                                                        spaced="right"
                                                        data-testid={ `${ testId }-${ authenticator.id }-title-icon` }
                                                        transparent
                                                        { ...authenticator.icon }
                                                    />
                                                    { authenticator.title }
                                                </div>
                                            ) }
                                            actions={
                                                (authenticator?.actions && globalActions)
                                                    ? [ ...authenticator?.actions, ...globalActions ]
                                                    : authenticator.actions || globalActions
                                            }
                                            hideChevron={ hideChevron || authenticator.hideChevron }
                                        />
                                        <SegmentedAccordion.Content
                                            className="padded"
                                            active={ accordionActiveIndexes?.includes(accordionIndex) || false }
                                            data-testid={ `${ testId }-${ authenticator.id }-content` }
                                        >
                                            { authenticator.content }
                                        </SegmentedAccordion.Content>
                                    </Fragment>
                                )
                                : null
                        ))
                    }
                </SegmentedAccordion>
            )
            : <ContentLoader/>
    );
};

/**
 * Default props for the authenticator accordion component.
 */
AuthenticatorAccordion.defaultProps = {
    "data-testid": "authenticator-accordion",
    hideChevron: false,
    orderBy: undefined
};
