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
 * under the License.
 */

import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { Grid, Label } from "semantic-ui-react";
import { UserAvatar } from "@wso2is/react-components";

interface AddUserWizardSummaryProps {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (application: any) => void;
}

export const CreateRoleSummary: FunctionComponent<AddUserWizardSummaryProps> = (props: AddUserWizardSummaryProps): ReactElement => {
    
    const {
        summary,
        triggerSubmit,
        onSubmit
    } = props;

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(summary);
    }, [ triggerSubmit ]);

    return (
        <Grid className="wizard-summary">
            { summary?.BasicDetails && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Role Name</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ summary.BasicDetails.roleName }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            {
                summary?.PermissionList &&
                summary.PermissionList instanceof Array &&
                summary.PermissionList.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">Permission(s)</div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.PermissionList
                                            .map((perm, index) => (
                                                <Label key={ index } basic circular>{ perm.name }</Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            {
                summary?.RoleUserList &&
                summary.RoleUserList instanceof Array &&
                summary.RoleUserList.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">Assigned User(s)</div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.RoleUserList
                                            .map((user, index) => (
                                                <div key={ index } className="role-summary-user">
                                                    <UserAvatar
                                                        name={ user.userName }
                                                        size="mini"
                                                        floated="left"
                                                        image={ user.profileUrl }
                                                    />
                                                    {user.userName}
                                                </div>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
        </Grid>
    )
}
