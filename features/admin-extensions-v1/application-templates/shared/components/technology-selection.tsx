/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { GenericIconProps, Heading, TechnologyCard, Text } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider } from "semantic-ui-react";
import { EventPublisher } from "../../../../features/core/utils";

/**
 * Prop-types for the Technology Selection component.
 */
interface TechnologySelectionPropsInterface<T> extends TestableComponentInterface {
    onSelectedTechnologyChange: (technology: T) => void;
    technologies: TechnologyInterface<T>[];
}

interface TechnologyInterface<T> extends TestableComponentInterface, IdentifiableComponentInterface {
    className?: string;
    type: T;
    logo: FunctionComponent | ReactNode | GenericIconProps;
    displayName: string;
    disabled?: boolean;
}

/**
 * Technology Selection component.
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @param props - Props injected to the component.
 * @returns Technology selection component.
 */
export const TechnologySelection: <T>(
    props: TechnologySelectionPropsInterface<T>
) => ReactElement = <T extends unknown>(
    props: TechnologySelectionPropsInterface<T>
): ReactElement => {

    const {
        onSelectedTechnologyChange,
        technologies,
        [ "data-testid" ]: testId
    } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const { t } = useTranslation();

    return (
        <div data-testid={ testId }>
            <Heading as="h1" className="mb-1" compact>Which technology are you using?</Heading>
            <Text muted>
                We will guide you through setting up login for an application step by step.
            </Text>
            <Divider hidden className="x2"/>
            {
                (!isEmpty(technologies) && Array.isArray(technologies) && technologies.length > 0) && (
                    <Card.Group
                        centered
                        className="tech-selection-cards mt-3"
                        itemsPerRow={ 9 }
                    >
                        {
                            technologies.map((technology: TechnologyInterface<T>, index: number) => (
                                <TechnologyCard
                                    key={ index }
                                    raised={ false }
                                    data-testid={
                                        technology["data-testid"]
                                        ?? `technology-card-${ kebabCase(technology.displayName) }`
                                    }
                                    onClick={ () => {
                                        eventPublisher.publish("application-select-technology", {
                                            type: technology["data-componentid"]
                                        });
                                        onSelectedTechnologyChange(technology.type);
                                    } }
                                    displayName={ technology.displayName }
                                    disabled={ technology.disabled }
                                    overlayOpacity={ 0.6 }
                                    image={ technology.logo }
                                    featureAvailable={ t("common:featureAvailable") }
                                />
                            ))
                        }
                    </Card.Group>
                )
            }
        </div>
    );
};
