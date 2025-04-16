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

import { useEffect, useState } from "react";
import { ApplicationInterface } from "../models/application";

/**
 * Custom hook to track if an async operation is in progress for a given application.
 *
 * @param application - The application to check status for.
 * @returns Object with `isInProgress` boolean state.
 */
export const useAsyncOperation = (application: ApplicationInterface) => {

    // Main status
    const [ isInProgress, setIsInProgress ] = useState<boolean>(false);

    // Polling mechanism

    useEffect(() => {
        // if (!application) {
        //     setIsInProgress(false);
        //     return;
        // }

        // // Example condition to determine if the operation is in progress
        // const status: string = application.status ?? application.metadata?.status;
        // const inProgress = status === "UPDATING" || status === "IN_PROGRESS";

        setIsInProgress(true);

        // Optionally, you can poll or subscribe to changes here

    }, [ application ]);

    return { isInProgress };
};
