/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import keyBy from "lodash-es/keyBy";
import values from "lodash-es/values";
import DefaultConnectionTemplateCategory from "../meta/templates-meta/categories/default.json";
import CustomAuthenticationTemplateGroup from "../meta/templates-meta/groups/custom-authentication.json";
import EnterpriseConnetionTemplateGroup from "../meta/templates-meta/groups/enterprise.json";
import { ConnectionTemplatesConfigInterface } from "../models/connection";

export const getConnectionTemplatesConfig = (): ConnectionTemplatesConfigInterface => {

    return {
        categories: values(
            keyBy(
                [
                    {
                        enabled: true,
                        id: DefaultConnectionTemplateCategory.id,
                        resource: DefaultConnectionTemplateCategory
                    }
                ],
                "id"
            )
        ),
        groups: values(
            keyBy(
                [
                    {
                        enabled: EnterpriseConnetionTemplateGroup.enabled,
                        id: EnterpriseConnetionTemplateGroup.id,
                        resource: EnterpriseConnetionTemplateGroup
                    },
                    {
                        enabled: CustomAuthenticationTemplateGroup.enabled,
                        id: CustomAuthenticationTemplateGroup.id,
                        resource: CustomAuthenticationTemplateGroup
                    }
                ],
                "id"
            )
        )
    };
};
