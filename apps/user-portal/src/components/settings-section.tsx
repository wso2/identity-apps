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

import * as React from "react";
import { Button, Card } from "semantic-ui-react";

/**
 * Proptypes for the settings section component.
 */
interface ComponentProps {
    header: string;
    description: string;
    actionTitle: string;
    isEdit: boolean;
    onClick: any;
}

/**
 * Settings section component.
 *
 * @param {React.PropsWithChildren<any>} props
 * @return {any}
 */
export const SettingsSection: React.FunctionComponent<ComponentProps> = (props): JSX.Element => {
    const { header, description, onClick, actionTitle, isEdit } = props;

    const cardExtraContent = () => {
        if (actionTitle !== "" && !isEdit) {
            return (
                <Card.Content className="content padding-x2" extra>
                    <Button primary size="small" onClick={onClick}>{actionTitle}</Button>
                </Card.Content>
            );
        } else {
            return null;
        }
    }
    return (
        <Card fluid padded="very">
            <Card.Content className="content padding-x2">
                <Card.Header>{header}</Card.Header>
                <Card.Meta>{description}</Card.Meta>
                {props.children}
            </Card.Content>
            {cardExtraContent()}
        </Card>
    );
};

/**
 * Default proptypes for the settings section component.
 */
SettingsSection.defaultProps = {
    actionTitle: "",
    description: "",
    header: "",
    isEdit: false
}
