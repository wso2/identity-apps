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

import React, { FunctionComponent, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Icon, Label, List, SemanticCOLORS } from "semantic-ui-react";
import { ApprovalStatus, ApprovalTaskSummary } from "../../models";
import { ApprovalsEdit } from "./approvals-edit";

/**
 * Prop types for the approvals list component.
 */
interface ApprovalsListProps {
    approvals: ApprovalTaskSummary[];
    approvalsListActiveIndexes: string[];
    onApprovalDetailClick: (e: MouseEvent<HTMLButtonElement>) => void;
    resolveApprovalTagColor: (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED
    ) => SemanticCOLORS;
    updateApprovalStatus: (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ) => void;
}

/**
 * Approvals list component.
 *
 * @param {ApprovalsListProps} props - Props injected to the approvals list component.
 * @return {JSX.Element}]
 */
export const ApprovalsList: FunctionComponent<ApprovalsListProps> = (
    props: ApprovalsListProps
): JSX.Element => {
    const {
        approvals,
        approvalsListActiveIndexes,
        onApprovalDetailClick,
        resolveApprovalTagColor,
        updateApprovalStatus
    } = props;
    const { t } = useTranslation();

    return (
        <List divided verticalAlign="middle" className="main-content-inner">
            {
                (approvals && approvals.length && approvals.length > 0)
                    ? approvals.map((approval) => (
                        <List.Item className="inner-list-item" key={ approval.id }>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 11 } className="first-column">
                                        <List.Content>
                                            <List.Header>
                                                { approval.id + " " + approval.presentationSubject + " " }
                                                <Label circular size="mini">
                                                     { approval.presentationName }
                                                </Label>
                                            </List.Header>
                                            <List.Description>
                                                <p style={ { fontSize: "11px" } }>
                                                    <Icon
                                                        name="tag"
                                                        color={ resolveApprovalTagColor(approval.status) }
                                                    />
                                                    { approval.status }
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </Grid.Column>
                                    <Grid.Column width={ 5 } className="last-column">
                                        <List.Content floated="right">
                                            <Button
                                                icon
                                                basic
                                                id={ approval.id }
                                                labelPosition="right"
                                                size="mini"
                                                onClick={ onApprovalDetailClick }
                                            >
                                                {
                                                    approvalsListActiveIndexes.includes(approval.id) ?
                                                        (
                                                            <>
                                                                { t("common:showLess") }
                                                                <Icon name="arrow down" flipped="vertically" />
                                                            </>
                                                        )
                                                        :
                                                        (
                                                            <>
                                                                { t("common:showMore") }
                                                                <Icon name="arrow down" />
                                                            </>
                                                        )
                                                }
                                            </Button>
                                        </List.Content>
                                    </Grid.Column>
                                </Grid.Row>
                                {
                                    approvalsListActiveIndexes.includes(approval.id) && approval.details
                                        ? (
                                            <Grid.Row columns={ 1 } className="no-padding">
                                                <Grid.Column width={ 16 } className="no-padding">
                                                    <ApprovalsEdit
                                                        approval={ approval }
                                                        updateApprovalStatus={ updateApprovalStatus }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        )
                                        : null
                                }
                            </Grid>
                        </List.Item>
                    ))
                    : null
            }
        </List>
    );
};
