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

import { TestableComponentInterface } from "@wso2is/core/models";
import { UserAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";

interface AddUserWizardSummaryProps extends TestableComponentInterface {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (application: any) => void;
}

/**
 * Component to create a summary of the role which will be created.
 *
 * @param props props containing summary data for the view.
 */
export const CreateGroupSummary: FunctionComponent<AddUserWizardSummaryProps> = (
    props: AddUserWizardSummaryProps
): ReactElement => {

    const {
        summary,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

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
                <>
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div
                                data-testid={ `${ testId }-domain-label` }
                                className="label"
                            >
                                {
                                   t("console:manage.features.roles.addRoleWizard.summary.labels.domain.group")
                                }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div
                                data-testid={ `${ testId }-domain-value` }
                                className="value url"
                            >
                                { summary.BasicDetails.domain }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div
                                data-testid={ `${ testId }-role-name-label` }
                                className="label"
                            >
                                {
                                    t("console:manage.features.roles.addRoleWizard.summary.labels.roleName",
                                            { type: "Group" })
                                }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div
                                data-testid={ `${ testId }-role-name-value` }
                                className="value url"
                            >
                                { summary.BasicDetails.groupName }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </>
            ) }
            {
                summary?.PermissionList &&
                summary.PermissionList instanceof Array &&
                summary.PermissionList.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div
                                    data-testid={ `${ testId }-permissions-label` }
                                    className="label"
                                >
                                    { t("console:manage.features.roles.addRoleWizard.summary.labels.permissions") }
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.PermissionList
                                            .map((perm, index) => (
                                                <Label
                                                    data-testid={
                                                        `${ testId }-permissions-${ index }-label`
                                                    }
                                                    key={ index }
                                                    basic
                                                    circular
                                                >
                                                    { perm.label }
                                                </Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            {
                summary?.GroupUserList && summary.GroupUserList instanceof Array &&
                summary.GroupUserList.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div
                                    data-testid={ `${ testId }-users-label` }
                                    className="label"
                                >
                                    { t("console:manage.features.roles.addRoleWizard.summary.labels.users") }
                                </div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.GroupUserList
                                            .map((user, index) => (
                                                <div key={ index } className="role-summary-user">
                                                    <UserAvatar
                                                        name={ user.userName }
                                                        size="mini"
                                                        floated="left"
                                                        image={ user.profileUrl }
                                                    />
                                                    { user.userName }
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
    );
};
