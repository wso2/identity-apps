/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import {
    DocumentationLink,
    GenericIcon,
    GenericIconProps,
    Heading
} from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import { Trans } from "react-i18next";
import { Card } from "semantic-ui-react";
import { EventPublisher } from "../../../../features/core";

export type SupportedTechnologyArrayPropsInterface = {
    icons: Array<GenericIconProps["icon"]>;
    documentationLink: string;
    onTriggerTabUpdate: (tabIndex: number) => void;
    infoTabIndex: number;
};

export const SupportedTechnologyArray: FC<SupportedTechnologyArrayPropsInterface> = (
    props: SupportedTechnologyArrayPropsInterface
): ReactElement => {

    const {
        icons,
        onTriggerTabUpdate,
        documentationLink,
        infoTabIndex
    } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const onServerEndpointConfigTabClick = (): void => {
        eventPublisher.publish(
            "application-quick-start-visit-info-section"
        );
        onTriggerTabUpdate(infoTabIndex);
    };

    return (
        <Card
            fluid
            className="basic-card no-hover quick-start-custom-config-message no-background">
            <Card.Content>
                <div className="tech-array">
                    { icons.map((icon, index) => (
                        <GenericIcon
                            key={ `extended-tech-icon-${ index }` }
                            transparent
                            size="x30"
                            icon={ icon }
                        />
                    )) }
                </div>
            </Card.Content>
            <Card.Content className="custom-config-message">
                <Heading as="h6" textAlign="center" compact>
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
