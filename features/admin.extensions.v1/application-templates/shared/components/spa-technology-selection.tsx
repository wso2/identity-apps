/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { GenericIconProps, LargeTechnologyCard, Text } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider } from "semantic-ui-react";
import { EventPublisher } from "../../../../admin-core-v1/utils";

/**
 * Prop-types for the Technology Selection component.
 */
interface SPATechnologySelectionPropsInterface<T> extends IdentifiableComponentInterface {
    onSelectedTechnologyChange: (technology: T) => void;
    technologies: TechnologyInterface<T>[];
}

interface TechnologyInterface<T> extends TestableComponentInterface, IdentifiableComponentInterface {
    className?: string;
    type: T;
    logo: FunctionComponent | ReactNode | GenericIconProps;
    displayName: string;
    disabled?: boolean;
    sampleAppURL: string;
}

/**
 * Technology Selection component.
 *
 * @param props - Props injected to the component.
 * @returns Technology selection component.
 */
export const SPATechnologySelection: <T>(
    props: SPATechnologySelectionPropsInterface<T>
) => ReactElement = <T extends unknown>(
    props: SPATechnologySelectionPropsInterface<T>
): ReactElement => {

    const {
        onSelectedTechnologyChange,
        technologies,
        [ "data-componentid" ]: componentId
    } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const { t } = useTranslation();

    return (
        <Card
            fluid
            className="basic-card no-hover quick-start-custom-config-message no-background"
            data-componentid={ componentId }
        >
            <Card.Content textAlign="center">
                <Text muted>
                    { t("extensions:console.application.quickStart.spa.techSelection.heading") }
                </Text>
            </Card.Content>
            <Divider hidden/>
            {
                (!isEmpty(technologies) && Array.isArray(technologies) && technologies.length > 0) && (
                    <Card.Group
                        centered
                        className="tech-selection-cards mt-3"
                        itemsPerRow={ 1 }
                    >
                        {
                            technologies.map((technology: TechnologyInterface<T>, index: number) => (
                                <LargeTechnologyCard
                                    key={ index }
                                    raised={ false }
                                    data-componentid={
                                        technology["data-componentid"]
                                        ?? `technology-card-${ kebabCase(technology.displayName) }`
                                    }
                                    onSampleAppClick={ () => {
                                        window.open(
                                            technology.sampleAppURL,
                                            "_blank",
                                            "noreferrer"
                                        );
                                    } }
                                    onQuickstartClick={ () => {
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
        </Card>
    );
};
