/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

/**
* Form initial values interface.
*/
export interface AnalyticsFormValuesInterface {
   /**
    * Analytics engine host.
    */
   receiver: string;
   /**
    * Is basic authentication enabled.
    */
   basicAuthEnabled: boolean;
   /**
    * Basic auth username value.
    */
   basicAuthUsername: string;
   /**
    * Basic auth password value.
    */
   basicAuthPassword: string;
   /**
    * HTTP Connection Timeout in milliseconds.
    */
   httpConnectionTimeout: number;
   /**
    * HTTP Read Timeout in milliseconds.
    */
   httpReadTimeout: number;
    /**
    * HTTP Connection Request Timeout in milliseconds.
    */
   httpConnectionRequestTimeout: number;
   /**
    * Hostname verification.
    */
   hostNameVerfier: string;
}

/**
* Analytics API Request values interface.
*/
export interface AnalyticsAPIRequestInterface {
    /**
     * Analytics engine host.
     */
    "adaptive_authentication.elastic.receiver": string;
    /**
     * Is basic authentication enabled.
     */
    "adaptive_authentication.elastic.basicAuth.enabled": boolean;
    /**
     * Basic auth username value.
     */
    "adaptive_authentication.elastic.basicAuth.username": string;
    /**
     * Basic auth password value.
     */
    "__secret__adaptive_authentication.elastic.basicAuth.password": string;
    /**
     * HTTP Connection Timeout in milliseconds.
     */
    "adaptive_authentication.elastic.HTTPConnectionTimeout": number;
    /**
     * HTTP Read Timeout in milliseconds.
     */
    "adaptive_authentication.elastic.HTTPReadTimeout": number;
     /**
     * HTTP Connection Request Timeout in milliseconds.
     */
    "adaptive_authentication.elastic.HTTPConnectionRequestTimeout": number;
    /**
     * Hostname verification.
     */
    "adaptive_authentication.elastic.hostnameVerfier": string;
}
