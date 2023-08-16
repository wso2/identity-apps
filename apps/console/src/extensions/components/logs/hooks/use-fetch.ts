/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
