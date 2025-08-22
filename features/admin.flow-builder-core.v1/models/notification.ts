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

import { ReactElement } from "react";
import { Resource } from "./resources";

export enum NotificationType {
    WARNING = "warning",
    ERROR = "error",
    INFO = "info",
}

class Notification {
    private id: string;
    private readonly message: string;
    private readonly type: NotificationType;
    private resource: Resource;
    private PanelNotification: ReactElement;
    private resourceFieldNotifications: Map<string, string>;

    constructor(message: string, type: NotificationType) {
        this.message = message;
        this.type = type;
    }

    setId(id: string): void {
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    getMessage(): string {
        return this.message;
    }

    getType(): NotificationType {
        return this.type;
    }

    setResource(resource: Resource): void {
        this.resource = resource;
    }

    getResource(): Resource {
        return this.resource;
    }

    setPanelNotification(notificationEl: ReactElement): void {
        this.PanelNotification = notificationEl;
    }

    getPanelNotification(): ReactElement {
        return this.PanelNotification;
    }

    addResourceFieldNotification(field: string, msg: string): void {
        this.resourceFieldNotifications.set(field, msg);
    }

    getResourceFieldNotification(field: string): string {
        return this.resourceFieldNotifications.get(field) || "";
    }
}

export default Notification;
