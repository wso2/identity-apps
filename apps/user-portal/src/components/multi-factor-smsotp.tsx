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
import { useTranslation } from "react-i18next";
import { Button, Divider, Form, Grid, List } from "semantic-ui-react";
import { getProfileInfo, updateProfileInfo } from "../actions";
import { MFAIcons } from "../configs";
import { EditSection } from "./edit-section";
import { ThemeIcon } from "./icon";

export const SmsOtp: React.FunctionComponent<any> = (): JSX.Element => {
    const [mobile, setMobile] = React.useState("");
    const [isEdit, setIsEdit] = React.useState(false);
    const {t} = useTranslation();

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
                    value: mobile
                }
            ]
        };
        updateProfileInfo(data)
            .then((response) => {
                if (response.status === 200) {
                    getProfileInfo()
                        .then((res) => {
                            setMobileNo(res);
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
        setMobile(event.target.value);
        event.preventDefault();
    };

    const setMobileNo = (resp) => {
        let mobileNumber = "";
        resp.phoneNumbers.map((mobileNo) => {
            mobileNumber = mobileNo.value;
        });
        setMobile(mobileNumber);
    };

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleCancel = () => {
        setIsEdit(false);
    };

    const showEditView = () => {
        if (!isEdit) {
            return (<>
                    <List.Content floated="left">
                        <ThemeIcon
                            icon={ MFAIcons.sms }
                            size="mini"
                            twoTone
                            transparent
                            square
                            rounded
                            relaxed
                        />
                    </List.Content>
                    <List.Content>
                        <List.Header>{ t("views:securityPage.multiFactor.smsOtp.title") }</List.Header>
                        <Button primary floated="right" size="mini" onClick={handleEdit}>
                            { t("common:update") }
                        </Button>
                        <List.Description>
                            { t("views:securityPage.multiFactor.smsOtp.description") }
                        </List.Description>
                    </List.Content>
                </>
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
                                            <Form.Field>
                                                <label>Mobile Number</label><br/>
                                                <input onChange={handleFieldChange} value={mobile}/>
                                            </Form.Field>
                                        </Form>
                                    </List.Content>
                                </List.Item>
                                <Divider hidden/>
                                <List.Item>
                                    <Button primary onClick={handleUpdate} size="mini">
                                        { t("common:update") }
                                    </Button>
                                    <Button default onClick={handleCancel} size="mini">
                                        { t("common:cancel") }
                                    </Button>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    };

    React.useEffect(() => {
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
            <Divider hidden/>
        </div>
    );
};
