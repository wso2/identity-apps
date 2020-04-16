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

import { GenericIcon, GenericIconProps } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useState
} from "react";
import { SegmentedAccordion, SegmentedAccordionTitlePropsInterface } from "@wso2is/react-components";
import _ from "lodash";

/**
 * Proptypes for the Authenticator Accordion component.
 */
export interface AuthenticatorAccordionPropsInterface {
    /**
     * Set of authenticators.
     */
    authenticators: AuthenticatorAccordionItemInterface[];
    /**
     * Accordion actions.
     */
    actions: SegmentedAccordionTitlePropsInterface["actions"];
    /**
     * Initial activeIndexes value.
     */
    defaultActiveIndexes?: number[];
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
     * Unique id for the authenticator.
     */
    id: string;
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
    content: ReactElement;
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
        actions,
        authenticators,
        defaultActiveIndexes,
        orderBy
    } = props;

    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);

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

    return (
        <SegmentedAccordion
            fluid
        >
            {
                _.sortBy(authenticators, orderBy).map((authenticator, index) => (
                    <>
                        <SegmentedAccordion.Title
                            id={ authenticator.id }
                            active={ accordionActiveIndexes.includes(index) }
                            index={ index }
                            onClick={ handleAccordionOnClick }
                            content={ (
                                <>
                                    <GenericIcon
                                        floated="left"
                                        size="micro"
                                        spaced="right"
                                        transparent
                                        { ...authenticator.icon }
                                    />
                                    { authenticator.title }
                                </>
                            ) }
                            actions={ actions }
                        />
                        <SegmentedAccordion.Content
                            active={ accordionActiveIndexes.includes(index) }
                        >
                            { authenticator.content }
                        </SegmentedAccordion.Content>
                    </>
                ))
            }
        </SegmentedAccordion>
    );
};

/**
 * Default props for the authenticator accordion component.
 */
AuthenticatorAccordion.defaultProps = {
    defaultActiveIndexes: [ -1 ],
    orderBy: undefined
};
