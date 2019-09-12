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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Form, Grid, Icon, List } from "semantic-ui-react";
import { getProfileInfo, updateProfileInfo } from "../actions";
import { MFAIcons } from "../configs";
import { NotificationActionPayload } from "../models/notifications";
import { EditSection } from "./edit-section";
import { ThemeIcon } from "./icon";

/**
 * Proptypes for the SMS OTP component.
 */
interface SMSOTPProps {
    onNotificationFired: (notification: NotificationActionPayload) => void;
}

/**
 * SMS OTP section.
 *
 * @return {JSX.Element}
 */
export const SmsOtp: React.FunctionComponent<SMSOTPProps> = (props: SMSOTPProps): JSX.Element => {
    const [mobile, setMobile] = useState("");
    const [editedMobile, setEditedMobile] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const {t} = useTranslation();
    const {onNotificationFired} = props;

    const handleUpdate = () => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [
                "urn:ietf:params:scim:api:messages:2.0:PatchOp"
            ]
        };

        const phoneNumbers = {
            type: "mobile",
            value: mobile
        };

        data.Operations[0].value = {
            phoneNumbers: [
                {
                    type: "mobile",
                    value: editedMobile
                }
            ]
        };

        updateProfileInfo(data)
            .then((response) => {
                if (response.status === 200) {
                    onNotificationFired({
                        description: t(
                            "views:securityPage.multiFactor.smsOtp.notification.success.description"
                        ),
                        message: t(
                            "views:securityPage.multiFactor.smsOtp.notification.success.message"
                        ),
                        otherProps: {
                            positive: true
                        },
                        visible: true
                    });
                    getProfileInfo()
                        .then((res) => {
                            setMobileNo(res);
                        });
                    setIsEdit(false);
                } else {
                    onNotificationFired({
                        description: t(
                            "views:userProfile.notification.getProfileInfo.error.description"
                        ),
                        message: t(
                            "views:userProfile.notification.getProfileInfo.error.message"
                        ),
                        otherProps: {
                            negative: true
                        },
                        visible: true
                    });
                }
            });
    };

    /**
     * The following function handles the change of state of the input fields.
     * The id of the event target will be used to set the state.
     * @param event
     */
    const handleFieldChange = (event) => {
        setEditedMobile(event.target.value);
        event.preventDefault();
    };

    const setMobileNo = (resp) => {
        let mobileNumber = "";
        resp.phoneNumbers.map((mobileNo) => {
            mobileNumber = mobileNo.value;
        });
        setMobile(mobileNumber);
        setEditedMobile(mobileNumber);
    };

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleCancel = () => {
        setIsEdit(false);
    };

    const showEditView = () => {
        if (!isEdit) {
            return (<Grid padded>
                    <Grid.Row columns={2}>
                        <Grid.Column width={11} className="first-column">
                            <List.Content floated="left">
                                <ThemeIcon
                                    icon={MFAIcons.sms}
                                    size="mini"
                                    twoTone
                                    transparent
                                    square
                                    rounded
                                    relaxed
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{t("views:securityPage.multiFactor.smsOtp.title")}</List.Header>
                                <List.Description>
                                    {t("views:securityPage.multiFactor.smsOtp.description")}
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={5} className="last-column">
                            <List.Content floated="right">
                                <Icon
                                    link
                                    onClick={handleEdit}
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                />
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        return (
            <EditSection>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <Form>
                                            <Form.Field width={9}>
                                                <label>Mobile Number</label>
                                                <input onChange={handleFieldChange} value={editedMobile}/>
                                                <br /><br />
                                                <p style={{fontSize: "12px"}}>
                                                    <Icon
                                                        color="grey"
                                                        floated="left"
                                                        name="info circle"
                                                    />
                                                    NOTE: This will update the mobile number in your profile
                                                </p>
                                            </Form.Field>
                                        </Form>
                                    </List.Content>
                                </List.Item>
                                <Divider hidden/>
                                <List.Item>
                                    <Button primary onClick={handleUpdate} size="small">
                                        {t("common:update")}
                                    </Button>
                                    <Button className="link-button" onClick={handleCancel} size="small">
                                        {t("common:cancel")}
                                    </Button>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    };

    useEffect(() => {
        if (mobile === "") {
            getProfileInfo()
                .then((response) => {
                    setMobileNo(response);
                });
        }
    });

    return (
        <div>
            {showEditView()}
        </div>
    );
};
