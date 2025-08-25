/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useMemo, useState } from "react";
import useValidationStatus from "../../hooks/use-validation-status";
import { NotificationType } from "../../models/notification";
import { Resource } from "../../models/resources";
import "./validation-error-boundary.scss";

/**
 * Props interface of {@link ValidationErrorBoundary}
 */
export interface ValidationErrorBoundaryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The resource to check for validation errors.
     */
    resource: Resource;
    /**
     * Whether to disable the error boundary on hover.
     */
    disableErrorBoundaryOnHover?: boolean;
}

/**
 * Exclamation icon component for validation errors.
 *
 * @param size - Icon size.
 * @returns Exclamation icon component.
 */
const ExclamationIcon = ({ size = 16 }: { size?: number }): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ size }
        height={ size }
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="circle-alert-icon"
    >
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" x2="12" y1="8" y2="12"/>
        <line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
);

/**
 * Validation error boundary component that wraps components and shows error indicators.
 *
 * @param props - Props injected to the component.
 * @returns ValidationErrorBoundary component.
 */
export const ValidationErrorBoundary: FunctionComponent<PropsWithChildren<ValidationErrorBoundaryPropsInterface>> = ({
    resource,
    children,
    disableErrorBoundaryOnHover = true,
    "data-componentid": componentId = "validation-error-boundary"
}: PropsWithChildren<ValidationErrorBoundaryPropsInterface>): ReactElement => {
    const { selectedNotification } = useValidationStatus();
    const [ active, setActive ] = useState<boolean>(false);

    /**
     * Checks if the resource has any notifications.
     */
    const hasNotification: boolean = useMemo(() => {
        if (selectedNotification?.hasResource(resource.id)) {
            return true;
        }

        return false;
    }, [ resource, selectedNotification ]);

    /**
     * Gets the notification type for styling.
     */
    const notificationType: NotificationType = useMemo(() => {
        if (hasNotification) {
            return selectedNotification?.getType() || null;
        }

        return null;
    }, [ hasNotification, selectedNotification ]);

    return (
        <div
            className={ classNames(
                {
                    active: hasNotification && active && disableErrorBoundaryOnHover,
                    [ notificationType ]: hasNotification && !!notificationType,
                    padded: hasNotification && !disableErrorBoundaryOnHover,
                    "validation-error-boundary": hasNotification
                }
            ) }
            data-componentid={ componentId }
            onMouseOver={ () => hasNotification && disableErrorBoundaryOnHover && setActive(true) }
            onMouseOut={ () => hasNotification && disableErrorBoundaryOnHover && setActive(false) }
        >
            { hasNotification && !(active && disableErrorBoundaryOnHover) && (
                <ExclamationIcon size={ 24 } />
            ) }
            { children }
        </div>
    );
};

export default ValidationErrorBoundary;
