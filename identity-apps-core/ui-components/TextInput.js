/*
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { useEffect, useState } from 'react';

const TextInput = ({ component, formStateHandler }) => {
    const [ value, setValue ] = useState(component.properties.value);
    const [ hasError, setError ] = useState(false);

    useEffect(() => {
        formStateHandler(component.properties.name, value);
    }, [value]);

    return (
        <div className="field">
            <label>{ component.properties.label }</label>
            <div className="ui fluid left icon input">
                <input
                    name={ component.properties.name }
                    type="text"
                    value={value}
                    placeholder={ component.properties.placeholder }
                    onChange={(e) => setValue(e.target.value)}
                />
                <i aria-hidden="true" className="envelope outline icon"></i>
            </div>
            { hasError && (
                <div className="mt-1">
                    <i className="red exclamation circle fitted icon"></i>
                    <span className="validation-error-message">Username cannot be empty.</span>
                </div>
            ) }
        </div>
    );
};

export default TextInput;
