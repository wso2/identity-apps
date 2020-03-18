/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * under the License
 */

import React, { FunctionComponent, ReactElement } from "react"
import { AddRoleUsers } from "../create-role-wizard/role-user-assign"
import { Forms } from "@wso2is/forms"
import { Grid, Button } from "semantic-ui-react"

export const RoleUserDetails: FunctionComponent<any> = (): ReactElement => {
    return (
        <>
            <AddRoleUsers/>
            <Forms onSubmit={() => {
                //TODO handle form submit
            } } >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Button primary type="submit" size="small" className="form-button">
                                Update
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </>
    )
}
