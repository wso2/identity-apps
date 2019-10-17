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
import { Divider, Header } from "semantic-ui-react";

/**
 * Page header component Prop types.
 */
interface PageHeaderProps {
    title: string;
    description?: string;
    titleTextAlign?: "left" | "center" | "right" | "justified";
}

/**
 * Page header component.
 *
 * @param {PageHeaderProps} props - Props injected to the page header component.
 * @return {JSX.Element}
 */
export const PageHeader: React.FunctionComponent<PageHeaderProps> = (props: PageHeaderProps): JSX.Element => {
    const { title, description, titleTextAlign } = props;
    return (
        <>
            { (title || description) &&
                <>
                <Header className="page-header" as="h1" textAlign={ titleTextAlign }>
                    { title &&
                        title
                    }
                    { description &&
                        <Header.Subheader className="sub-header">{ description }</Header.Subheader>
                    }
                </Header>
                <Divider hidden />
                </>
            }
        </>
    );
};
