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
import { URLInputNS } from "../../../models";

export const urlInput: URLInputNS = {
    withLabel: {
        negative: {
            content:
                "You need to enable CORS for the origin of this URL to make requests" +
                " to {{productName}} from a browser.",
            detailedContent: {
                0: "",
                1: ""
            },
            header: "CORS is not Allowed for",
            leftAction: "Allow"
        },
        positive: {
            content: "The origin of this URL is allowed to make requests to " + "{{productName}} APIs from a browser.",
            detailedContent: {
                0: "",
                1: ""
            },
            header: "CORS is Allowed for"
        }
    }
};
