/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { store } from "../../../features/core";
import { InterfaceAppLogRequest } from "./app-log-models";

/**
 * Initialize an axios Http client.
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get Application logs for the given time period.
 * @param data - Object containing parameters for log request.
 */
export const getAppLogs = (data?: InterfaceAppLogRequest): Promise<any> => {

    /**
     * TODO: These are set of sample logs. Will be removed after API is implemented.
     */
    const sampleLog = {
        "logs": [
            {
                "logMessage": " [23ff108f-7ed3-488e-83a4-31259fdfdd92] 10.0.3.47 - - [2020-06-24 04:50:02 +0000] GET /t/sample.com/oauth2/oidcdiscovery/.well-known/openid-configuration HTTP/1.1 200 2486 \\\"-\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.028\\n",
                "timestamp": "2020-06-24T04:50:02Z"
            },
            {
                "logMessage": " [e11e0035-7b1c-4687-92f9-027e06716754] 10.0.3.47 - - [2020-06-24 04:50:02 +0000] GET /t/sample.com/oidc/logout?id_token_hint=eyJ4NXQiOiJNbVJqTldFeVkyWTBPRGRsT0dRNU5XUmhZV00wTnpjeVlURTVPR1ZoTWpNMFl6TXhNRFZoWWpCa1l6TTFOV0ZpTm1FNVl6UTBaVE01WkdZeFkyRTFZdyIsImtpZCI6Ik1tUmpOV0V5WTJZME9EZGxPR1E1TldSaFlXTTBOemN5WVRFNU9HVmhNak0wWXpNeE1EVmhZakJrWXpNMU5XRmlObUU1WXpRMFpUTTVaR1l4WTJFMVl3X1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoibVpnV3BUZW0tR0U0OURLZWk0WEV6ZyIsImF1ZCI6IkRFVkVMT1BFUl9QT1JUQUxfdGFrYXMuY29tIiwiY19oYXNoIjoiVzBSSTI4LUZCa3FSWDJZM281UXJVZyIsInN1YiI6ImFkbWluQHRha2FzLmNvbSIsIm5iZiI6MTU5Mjk3MjQ5OCwiYXpwIjoiREVWRUxPUEVSX1BPUlRBTF90YWthcy5jb20iLCJhbXIiOlsiQmFzaWNBdXRoZW50aWNhdG9yIl0sImlzcyI6Imh0dHBzOlwvXC9kZXZjbG91ZC5rdWJlc2IuY29tXC90XC90YWthcy5jb21cL29hdXRoMlwvdG9rZW4iLCJleHAiOjE1OTI5NzYwOTgsImlhdCI6MTU5Mjk3MjQ5OCwiZW1haWwiOiJpYW10ZXN0d3NvMkBnbWFpbC5jb20iLCJzaWQiOiI4M2Q3ZmE5OS00N2ZhLTRjODMtOTE2Mi0xMzBiYTM2YzhmNTMifQ.jt_9tEQ1kZ5M4h0SAarzxRJXIqmVdIeAm74N6MzdUe-rqfchvac-pVdjGHI02iVmCUWrqSSxSiei3ihMl5OADZhTBynJkKvtNt3ph0NUovh7Vib67mHUlMdTq6Ti7tkuagH2ncYUM4tfLlLCK47u1aYh3JTn2ZSQPExYPExHWOMIm9lygjMw7HzC3oHahL0M6x77RH7qaU4d-_0cjtuPimNuxmAYDAt5GrrdY9CEHsemIpsPl9ick-rUptQMO7-BZtVIUrIis9R_joCR_BrqTnwFDSXLNvlZlZrq_j15_gfjV6vCIOomFgNZp-2M80YU_Kv_8fEhskOI5M3wZXLJEA&post_logout_redirect_uri=https://devcloud.kubesb.com/t/sample.com/developer-portal/login HTTP/1.1 302 - \\\"-\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.131\\n",
                "timestamp": "2020-06-24T04:50:02Z"
            },
            {
                "logMessage": " [ff6c2fef-2926-4a97-9382-08236a202b04] 10.0.3.47 - - [2020-06-24 04:50:02 +0000] POST /t/sample.com/oauth2/token HTTP/1.1 400 113 \\\"-\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.071\\n",
                "timestamp": "2020-06-24T04:50:02Z"
            },
            {
                "logMessage": " [be559d29-54cc-4cb5-bdd4-1b7a7a532354] 10.0.3.47 - - [2020-06-24 04:50:02 +0000] GET /t/sample.com/developer-portal/login?sp=Developer+Portal&tenantDomain=sample.com HTTP/1.1 200 2433 \\\"-\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.001\\n",
                "timestamp": "2020-06-24T04:50:02Z"
            },
            {
                "logMessage": " [5856d4ec-ab98-4c7d-91b2-f1c568e4b16f] 10.0.3.47 - - [2020-06-24 04:50:00 +0000] GET /t/sample.com/developer-portal/logout HTTP/1.1 200 2433 \\\"-\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.002\\n",
                "timestamp": "2020-06-24T04:50:00Z"
            },
            {
                "logMessage": " [6e0c2f75-25ec-479a-be36-b2aa1e922e37] 10.0.3.47 - - [2020-06-24 04:49:59 +0000] GET /t/sample.com/developer-portal/logout HTTP/1.1 200 2433 \\\"-\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.003\\n",
                "timestamp": "2020-06-24T04:49:59Z"
            },
            {
                "logMessage": " [060d3048-d826-44a6-9149-d569dc33c908] 10.0.2.109 - - [2020-06-24 04:41:43 +0000] GET /t/sample.com/oauth2/authorize?response_type=code&client_id=DEVELOPER_PORTAL_sample.com&scope=openid&redirect_uri=https://devcloud.kubesb.com/t/sample.com/developer-portal/login&state=Y2hlY2tTZXNzaW9u&prompt=none&code_challenge_method=S256&code_challenge=9yfl-u5z_GZxS6wNeFCdhK5rFFPXWm86e0hNcuiEiIB HTTP/1.1 302 - \\\"https://devcloud.kubesb.com/developer-portal/rpIFrame.html\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.189\\n",
                "timestamp": "2020-06-24T04:41:43Z"
            },
            {
                "logMessage": " [d01b414f-477f-46ce-a090-1a642080754f] 10.0.2.109 - - [2020-06-24 04:41:43 +0000] GET /t/sample.com/developer-portal/login?code=685d8b5b-bb60-346c-b150-b8a389228af4&state=Y2hlY2tTZXNzaW9u&session_state=de2a620e4a720677c43acd6402359e77ee91a5d83c799ac54bcbdd85f98ed07b.RehxuogIm_cn0Gbww33V7Q HTTP/1.1 200 2542 \\\"https://devcloud.kubesb.com/developer-portal/rpIFrame.html\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.002\\n",
                "timestamp": "2020-06-24T04:41:43Z"
            },
            {
                "logMessage": " [ff2c1bc2-c154-4d0a-9898-d8de9d44ce50] 10.0.3.47 - - [2020-06-24 04:36:43 +0000] GET /t/sample.com/developer-portal/login?code=e48809e8-1b50-3492-b35c-5bb545a1723e&state=Y2hlY2tTZXNzaW9u&session_state=df441aa51327bfc410c02ecd7eb35658e6f074249506e6ae81d1e138dd5f3122.JX0Zah8i90aMfYwApwmF-g HTTP/1.1 200 2545 \\\"https://devcloud.kubesb.com/developer-portal/rpIFrame.html\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 0.012\\n",
                "timestamp": "2020-06-24T04:36:43Z"
            },
            {
                "logMessage": " [1ac545a7-999a-4530-bebc-490e75cf4ce6] 10.0.3.47 - - [2020-06-24 04:36:42 +0000] GET /t/sample.com/oauth2/authorize?response_type=code&client_id=DEVELOPER_PORTAL_sample.com&scope=openid&redirect_uri=https://devcloud.kubesb.com/t/sample.com/developer-portal/login&state=Y2hlY2tTZXNzaW9u&prompt=none&code_challenge_method=S256&code_challenge=4I5T2Qle4u3AzIcrZF07hhChN_cUNMaqnAxi9OWIMBZ HTTP/1.1 302 - \\\"https://devcloud.kubesb.com/developer-portal/rpIFrame.html\\\" \\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36\\\" 1.536\\n",
                "timestamp": "2020-06-24T04:36:42Z"
            }
        ]
    };

    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: "http://localhost:8080/api/cloud/v1/feedback"
    };

    return Promise.resolve(sampleLog);
};
