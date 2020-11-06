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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    GenericIcon,
    GenericIconProps,
    SegmentedAccordion,
    SegmentedAccordionTitlePropsInterface
} from "@wso2is/react-components";
import _ from "lodash";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
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
     * Initial activeIndexes value.
     */
    defaultActiveIndexes?: number[];
    /**
     * Expand the accordion if only single item is present.
     */
    defaultExpandSingleItemAccordion?: boolean;
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
     * Unique id for the authenticator.
     */
    id: string;
    /**
     * Flag to show/hide the authenticator inside the accordion.
     */
    hidden?: boolean;
    /**
     * Title of the authenticator.
     */
    title: string;
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
 * @param {AuthenticatorAccordionPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AuthenticatorAccordion: FunctionComponent<AuthenticatorAccordionPropsInterface> = (
    props: AuthenticatorAccordionPropsInterface
): ReactElement => {

    const {
        globalActions,
        authenticators,
        defaultActiveIndexes,
        defaultExpandSingleItemAccordion,
        hideChevron,
        orderBy,
        [ "data-testid" ]: testId
    } = props;

    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);

    /**
     * If the authenticator count is 1, always open the authenticator panel.
     */
    useEffect(() => {
        if (!defaultExpandSingleItemAccordion) {
            return;
        }

        if (!(authenticators && Array.isArray(authenticators) && authenticators.length === 1)) {
            return;
        }

        setAccordionActiveIndexes([ 0 ]);
    }, [ authenticators ]);

    /**
     * Handles accordion title click.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {number} index - Clicked on index.
     */
    const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {
        const newIndexes = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(index)) {
            const removingIndex = newIndexes.indexOf(index);
            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(index);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    return (authenticators
            ?
            <SegmentedAccordion
                fluid
                data-testid={ testId }
            >
                {
                    _.sortBy(authenticators, orderBy).map((authenticator, index) => (
                        !authenticator.hidden
                            ? (
                                <Fragment key={ index }>
                                    <SegmentedAccordion.Title
                                        id={ authenticator.id }
                                        data-testid={ `${ testId }-${ authenticator.id }-title` }
                                        active={ accordionActiveIndexes.includes(index) }
                                        index={ index }
                                        onClick={ handleAccordionOnClick }
                                        content={ (
                                            <>
                                                <GenericIcon
                                                    floated="left"
                                                    size="micro"
                                                    spaced="right"
                                                    data-testid={ `${ testId }-${ authenticator.id }-title-icon` }
                                                    transparent
                                                    { ...authenticator.icon }
                                                />
                                                { authenticator.title }
                                            </>
                                        ) }
                                        actions={
                                            (authenticator?.actions && globalActions)
                                                ? [ ...authenticator?.actions, ...globalActions ]
                                                : authenticator.actions || globalActions
                                        }
                                        hideChevron={ hideChevron }
                                    />
                                    <SegmentedAccordion.Content
                                        active={ accordionActiveIndexes.includes(index) }
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
            : <ContentLoader/>
    );
};

/**
 * Default props for the authenticator accordion component.
 */
AuthenticatorAccordion.defaultProps = {
    "data-testid": "authenticator-accordion",
    defaultActiveIndexes: [ -1 ],
    defaultExpandSingleItemAccordion: true,
    hideChevron: false,
    orderBy: undefined
};
