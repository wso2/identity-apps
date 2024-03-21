/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { NotificationsNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const notifications: NotificationsNS = {
    invalidPEMFile: {
        error: {
            description: "{{ description }}",
            message: "Decoding Error"
        },
        genericError: {
            description: "An error occurred while decoding the certificate.",
            message: "Decoding Error"
        },
        success: {
            description: "Successfully decoded the certificate file.",
            message: "Decoding Successful"
        }
    },
    endSession: {
        error: {
            description: "{{description}}",
            message: "Termination error"
        },
        genericError: {
            description: "Couldn't terminate the current session.",
            message: "Something went wrong"
        },
        success: {
            description: "Successfully terminated the current session.",
            message: "Termination successful"
        }
    },
    getProfileInfo: {
        error: {
            description: "{{description}}",
            message: "Retrieval error"
        },
        genericError: {
            description: "Couldn't retrieve user profile details.",
            message: "Something went wrong"
        },
        success: {
            description: "Successfully retrieved user profile details.",
            message: "Retrieval successful"
        }
    },
    getProfileSchema: {
        error: {
            description: "{{description}}",
            message: "Retrieval error"
        },
        genericError: {
            description: "Couldn't retrieve user profile schemas.",
            message: "Something went wrong"
        },
        success: {
            description: "Successfully retrieved user profile schemas.",
            message: "Retrieval successful"
        }
    }
};
