/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { useCallback, useEffect, useState } from "react";
import { getDiagnosticLogs } from "../api";
import { InterfaceDiagnosticLogsRequest, InterfaceDiagnosticLogsResponse } from "../models";

/**
 * Custom hook for fetching logs
 * @param requestPayload - logs search API endpoint POST request payload
 * @returns error, list, loading, next, previous
 */
function useFetch(requestPayload: InterfaceDiagnosticLogsRequest): any {
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);
    const [ list, setList ] = useState([]);
    const [ next, setNext ] = useState(null);
    const [ previous, setPrevious ] = useState(null);

    const sendQuery: () => Promise<void> = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const data: InterfaceDiagnosticLogsResponse = await getDiagnosticLogs(requestPayload);

            setList(data.logs);
            setNext(data.nextToken);
            setPrevious(data.previousToken);
            setLoading(false);
        } catch (err) {
            setError(err);
        }
    }, [ requestPayload ]);

    useEffect(() => {
        if(!requestPayload ||
            (!requestPayload.endTime && !requestPayload.nextToken && !requestPayload.previousToken) ||
            (!requestPayload.startTime&& !requestPayload.nextToken && !requestPayload.previousToken)
        )
        {
            return;
        }
        sendQuery();
    }, [ requestPayload ]);

    return { error, list, loading, next, previous };
}

export default useFetch;
