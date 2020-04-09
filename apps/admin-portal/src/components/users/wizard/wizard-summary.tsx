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

import { Heading, UserAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { Grid, Label } from "semantic-ui-react";

interface AddUserWizardSummaryProps {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (application: any) => void;
}

/**
 * Add user wizard summary page.
 *
 * @param props
 */
export const AddUserWizardSummary: FunctionComponent<AddUserWizardSummaryProps> = (
    props: AddUserWizardSummaryProps
): ReactElement => {

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
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <UserAvatar
                            name={ summary?.firstName }
                            image={ summary?.imageUrl }
                            size="tiny"
                        />
                        { summary?.firstName && (
                            <Heading size="small" className="name">{ summary.firstName }</Heading>
                        ) }
                        { summary?.email && (
                            <div className="description">{ summary.email }</div>
                        ) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            { summary?.firstName && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Name</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ summary.firstName + " " + summary.lastName }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            {
                summary?.groups &&
                summary.groups instanceof Array &&
                summary.groups.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">Group(s)</div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.groups
                                            .map((group, index) => (
                                                <Label key={ index } basic circular>{ group.displayName }</Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            {
                summary?.roles &&
                summary.roles instanceof Array &&
                summary.roles.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">Role(s)</div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.roles
                                            .map((role, index) => (
                                                <Label key={ index } basic circular>{ role.displayName }</Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            { summary?.userName && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Username</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ summary.userName }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            { summary?.domain && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">User Store</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ summary.domain }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            { summary?.email && summary?.passwordOption && summary?.passwordOption === "askPw" ? (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Password option</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ "An email will be sent to" + " " + summary.email + " " +
                        "with the link to set the password." }</div>
                    </Grid.Column>
                </Grid.Row>
            ) : (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Password option</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ "The password was set by the administrator." }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
        </Grid>
    );
};
