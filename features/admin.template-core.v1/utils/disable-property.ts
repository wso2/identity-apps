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

import unset from "lodash-es/unset";

/**
 * Remove disabled properties from the form values.
 *
 * @param formValues - Object containing initial values for the form.
 * @param fieldName - Path of the field value within the object.
 */
const disableProperty = (formValues:Record<string, unknown>, fieldName: string): void => {
    unset(formValues, fieldName);
};

export default disableProperty;
