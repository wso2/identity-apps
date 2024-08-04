/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { analyticsConfig } from "@wso2is/admin.extensions.v1/configs/analytics";

/**
 * A event publisher to perform event logging.
 *
 * @example
 * Example usage.
 * ```
 * const eventPublisher = EventPublisher.getInstance();
 *
 * eventPublisher.publish("sample-event");
 * ```
 */
export class EventPublisher {

    private static publisherInstance: EventPublisher;

    /**
     * Private constructor to avoid object initialization from
     * outside the class.
     */
    private constructor() { }

    /**
     * Returns an instance of the event publisher.
     *
     * @returns EventPublisher
     */
    public static getInstance(): EventPublisher {

        if (!this.publisherInstance) {
            this.publisherInstance = new EventPublisher();
        }

        return this.publisherInstance;
    }

    /**
     * Function to perform event publisher related computations.
     *
     * @param computation - Computation to perform.
     */
    public compute = (computation: () => void): void => {

        analyticsConfig.EventPublisherExtension.compute &&
            analyticsConfig.EventPublisherExtension.compute(computation);
    }

    /**
     * Function to publish event logs.
     *
     * @param eventId - Publishing event identifier.
     * @param customProperties - Any custom properties to be published (optional).
    */
    public publish(eventId: string, customProperties?: { [key: string]: string | Record<string, unknown> |
            number }): void {

        if (customProperties) {
            /**
             * If you want to do any event logging, do it here.
             * custom properties are passed here.
             */
            analyticsConfig.EventPublisherExtension.publish &&
                analyticsConfig.EventPublisherExtension.publish(eventId, customProperties);

            return;
        }

        /**
         * If you want to do any event logging, do it here.
         * custom properties are not passed.
         */
        analyticsConfig.EventPublisherExtension.publish &&
            analyticsConfig.EventPublisherExtension.publish(eventId);
    }

    public record(
        pathname: string, startTimeInMs: number, duration: number, responseCode: number, isSuccess: boolean,
        customProperties?: {
            [key: string]: string | Record<string, unknown> |
            number
        }): void {

        /**
         * If you want to do any event logging, do it here.
         * custom properties are passed here.
         */
        if (customProperties) {
            analyticsConfig.EventPublisherExtension.record &&
                analyticsConfig.EventPublisherExtension.record(
                    pathname, startTimeInMs, duration, responseCode, isSuccess,
                    customProperties
                );
        }

        analyticsConfig.EventPublisherExtension.record &&
            analyticsConfig.EventPublisherExtension.record(
                pathname, startTimeInMs, duration, responseCode, isSuccess
            );

        return;

    }

    /**
     * Function to initialize event publisher.
     */
    public init(): void {

        /**
         * If you want to do any event publisher initialization logic,
         * you can do it here.
         */
        analyticsConfig.EventPublisherExtension.init && analyticsConfig.EventPublisherExtension.init();
    }
}
