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

export default function useGetAgent(id: string) {
    const agentList: any[] = JSON.parse(localStorage.getItem("agents"));

    const agent = agentList.find(agent => agent.id === id)

    if (agent) {
        return {
            data: agent,
            error: null,
            isLoading: false
        };
    } else {
        return {
            data: null,
            error: "Invalid ID",
            isLoading: false
        };
    }

}
