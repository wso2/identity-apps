/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {AxiosHttpClient} from "@wso2is/http";
import {GlobalConfig, ServiceResourcesEndpoint} from "../configs";
import {HttpMethods} from "../models";
import {any} from "prop-types";
import enumerate = Reflect.enumerate;



/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve data to generate the QR code
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const getDiscoveryData = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.biometricDiscoveryData
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed get data for the QR Code: ${ServiceResourcesEndpoint.biometricDiscoveryData}`)
                );
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            console.log(error)
            return Promise.reject(`Failed to retrieve Data for the QR Code - ${error}`);
        });
};


/**
 * Function to poll the server to retrieve the newly registered device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getRegisteredDevice = (id): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.biometricDeviceManagement}/${id}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed get the new device : ${id}`)
                );
            }
            console.log(response.data);
            return Promise.resolve(response);
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(`Device has not been registered yet - ${error}`);
        });

};


/**
* changes the device name of a device
*
* @return {Promise<any>} a promise containing the response.
*/
export const editDevicename = (id: string, newName: string): Promise<any> => {

    const requestConfig = {
        data: {
            operation: "REPLACE",
            value: newName
        },
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ServiceResourcesEndpoint.biometricDeviceManagement}/${id}`
    };
    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`The device name was not changed`)
                );
            }
            console.log(response.data);
            return Promise.resolve(response);
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(`The device name was not changed - ${error}`);
        });
};

/**
 * Lists all available devices
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getAllDevices = (): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.biometricDeviceManagement}/devices`
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`The Registered devices were not loaded`)
                );
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(`Could not load registered devices- ${error}`);
        });
};

/**
 * Removes a specified device
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const deleteDeviceData = (id: string): Promise<any> => {

    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.biometricDeviceManagement}/${id}`
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            console.log(response);
            if (response.status !== 204) {
                return Promise.reject(
                    new Error(`The device was not removed`)
                );
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(`Could not remove device- ${error}`);
        });
};





