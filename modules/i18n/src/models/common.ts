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

/**
 * Model for danger zones.
 */
export interface DangerZone {
    actionTitle: string;
    header: string;
    subheader: string;
}

/**
 * Model for pages
 */
export interface Page {
    title: string;
    subTitle: string;
}

/**
 * Model for notification set
 */
export interface Notification {
    error: NotificationItem;
    genericError: NotificationItem;
    success: NotificationItem;
}

/**
 * Model for notification
 */
interface NotificationItem {
    message: string;
    description: string;
}

/**
 * Model for placeholder.
 */
export interface Placeholder {
    action?: string;
    title: string;
    subtitles: string | PlaceholderSubtitle;
}

/**
 * Model for placeholder subtitle.
 */
interface PlaceholderSubtitle {
    [key: number]: string;
}
