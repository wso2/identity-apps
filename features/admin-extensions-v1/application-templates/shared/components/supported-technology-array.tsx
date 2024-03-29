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

import {
    DocumentationLink,
    GenericIcon,
    GenericIconProps,
    Heading,
    Popup,
    Text
} from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Card } from "semantic-ui-react";
import { EventPublisher } from "../../../../admin-core-v1";

type TechnologyArrayPropsInterface = {
    techIcon: GenericIconProps;
    techIconTitle?: string;
}

export type SupportedTechnologyArrayPropsInterface = {
    icons: Array<GenericIconProps["icon"]> | TechnologyArrayPropsInterface[];
    documentationLink: string;
    onTriggerTabUpdate: (tabIndex: number) => void;
    infoTabIndex: number;
    isMobileAppQuickstart?: boolean;
};

export const SupportedTechnologyArray: FC<SupportedTechnologyArrayPropsInterface> = (
    props: SupportedTechnologyArrayPropsInterface
): ReactElement => {

    const {
        icons,
        onTriggerTabUpdate,
        documentationLink,
        infoTabIndex,
        isMobileAppQuickstart
    } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const onServerEndpointConfigTabClick = (): void => {
        eventPublisher.publish(
            "application-quick-start-visit-info-section"
        );
        onTriggerTabUpdate(infoTabIndex);
    };

    const { t } = useTranslation();

    return (
        <Card
            fluid
            className={
                isMobileAppQuickstart
                    ? "basic-card no-hover mobile-app-quick-start-custom-config-message no-background"
                    : "basic-card no-hover quick-start-custom-config-message no-background" 
            }
        >
            <Card.Content>
                <div className="tech-array">
                    { icons.map((icon: TechnologyArrayPropsInterface, index: number) => (
                        <Popup
                            basic
                            inverted
                            position="top center"
                            key={ `extended-tech-icon-popup-${ index }` }
                            content={ icon.techIconTitle }
                            trigger={ (
                                <div>
                                    <GenericIcon
                                        key={ `extended-tech-icon-${ index }` }
                                        transparent
                                        size="x30"
                                        icon={ icon.techIcon }
                                    />
                                </div>
                            ) }
                        />
                    )) }
                    { isMobileAppQuickstart
                    && (
                        <Text className="mt-2">
                            {
                                t("extensions:console.application.quickStart" +
                                ".technologySelectionWrapper.otherTechnology")
                            }
                        </Text>
                    ) }
                </div>
            </Card.Content>
            <Card.Content className="custom-config-message">
                <Heading as="h6" textAlign="center" compact className={ isMobileAppQuickstart ? "mt-3" : "mt-0" }>
                    <Trans
                        i18nKey={
                            "extensions:console.application.quickStart" +
                            ".technologySelectionWrapper.subHeading"
                        }
                    >
                        Use the <a
                            className="link pointing"
                            onClick={ onServerEndpointConfigTabClick }
                        >server endpoint details</a> and start integrating your
                        own app or read through our <DocumentationLink
                            link={ documentationLink }
                        >documentation</DocumentationLink> to learn more.
                    </Trans>
                </Heading>
            </Card.Content>
        </Card>
    );

};
