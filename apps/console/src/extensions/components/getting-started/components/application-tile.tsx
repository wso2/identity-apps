/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon } from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useRef, useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import { DynamicTile, DynamicTilePropsInterface } from "./dynamic-tile";
import { ApplicationListItemInterface } from "../../../../features/applications";
import { AppConstants, EventPublisher, getSidePanelIcons, history } from "../../../../features/core";

export type ApplicationTilePropsInterface = {
    application?: ApplicationListItemInterface;
} & DynamicTilePropsInterface & IdentifiableComponentInterface;

export const ApplicationTile: FC<ApplicationTilePropsInterface> = (
    props: ApplicationTilePropsInterface
): ReactElement => {

    const {
        application,
        ["data-componentid"]: testId,
        ...rest
    } = props;

    const appNameElement = useRef<HTMLHeadingElement>(null);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const [ isPlaceholder, setIsPlaceholder ] = useState<boolean>(false);
    const [ isTruncated, setIsTruncated ] = useState<boolean>(false);

    useEffect(() => {
        if (appNameElement) {
            const ne = appNameElement.current;
            
            if (ne && ne.offsetWidth < ne.scrollWidth) {
                setIsTruncated(true);
            }
        }
    }, []);

    useEffect(() => {
        /**
         * If there's no application object, we consider it as
         * a placeholder object without any behaviour.
         */
        setIsPlaceholder(!application);
    }, [ application ]);

    /**
     * Redirects to the applications edit page when
     * the edit button is clicked.
     */
    const handleApplicationEdit = (): void => {
        eventPublisher.publish("console-getting-started-view-application-quick-access", {
            accessType: application.access,
            id: application.id,
            templateId: application.templateId
        });
        history.push({
            pathname: AppConstants.getPaths()
                .get("APPLICATION_EDIT")
                .replace(":id", application?.id)
        });
    };

    return (
        <DynamicTile
            { ...rest }
            data-componentid={ testId }
            onClick={ isPlaceholder ? () => void 0 : handleApplicationEdit }
            outlined={ isPlaceholder }
            reduceOpacity={ isPlaceholder }
            header={
                isPlaceholder
                    ? null
                    : (
                        application?.description
                            ? (
                                <Popup
                                    disabled={ !isTruncated }
                                    content={ application?.name }
                                    trigger={ (
                                        <h1 ref={ appNameElement }>
                                            { application?.name }
                                        </h1>
                                    ) } />
                            )
                            : null
                    )
            }
            bodyAlignment={
                isPlaceholder ? "center" : "start"
            }
            body={
                isPlaceholder
                    ? (
                        <GenericIcon
                            transparent
                            size="mini"
                            icon={ getSidePanelIcons().applications }
                            fill="secondary" />
                    )
                    : (
                        application?.description
                            ? (
                                <p className="content">
                                    { application?.description }
                                </p>
                            )
                            : (
                                <Popup
                                    content={ application?.name }
                                    trigger={ (
                                        <h1>{ application?.name }</h1>
                                    ) } />
                            )
                    )
            }
            justifyFooter="end"
            footer={
                isPlaceholder
                    ? null
                    : (
                        <Icon
                            name="angle right"
                            size="large"
                            className="p-0 m-0" />
                    )
            }
        />
    );

};

/**
 * Default props of {@link ApplicationTile}.
 */
ApplicationTile.defaultProps = {
    application: null,
    "data-componentid": "application-tile"
};
