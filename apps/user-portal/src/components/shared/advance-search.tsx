/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent } from "react";
import { Button, Icon, Input } from "semantic-ui-react";

/**
 *
 * Proptypes for the advance search component
 */
interface AdvanceSearchProps {
}

/**
 * Advance search component.
 *
 * @param {React.PropsWithChildren<AdvanceSearchProps>} props
 * @return {JSX.Element}
 */
export const AdvanceSearch: FunctionComponent<React.PropsWithChildren<AdvanceSearchProps>> = (
    props: React.PropsWithChildren<AdvanceSearchProps>
): JSX.Element => {
    const { children } = props;
    return (
        <Input
            action={
                <Button basic compact className="input-add-on"><Icon name="angle down" /></Button>
            }
            className="advance-search with-add-on"
            size="large"
            icon="search"
            iconPosition="left"
            placeholder="Search..."
        />
    );
};
