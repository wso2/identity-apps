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

import PageHead from './PageHead';
import TextInput from './TextInput';
import Button from './Button';
import Form from './Form';

const RenderComponent = (component, actionHandler, formStateHandler) => {
    switch (component.type) {
        case 'pageHead':
            return (
                <>
                    <PageHead component={ component } />
                    <div className="ui divider hidden"></div>
                </>
            );
        case 'input':
        case 'password':
            return (
                <>
                    <TextInput component={ component } formStateHandler={ formStateHandler } />
                    <div className="ui divider hidden"></div>
                </>
            );
        case 'button':
            return <Button component={ component } actionHandler={ actionHandler } />;
        default:
            return null;
    }
};

export { RenderComponent, PageHead, Form, TextInput, Button };
