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

import Joi from "@hapi/joi";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List } from "semantic-ui-react";
import { getProfileInformation } from "../../../../src/store/actions";
import { updateProfileInfo } from "../../../api";
import { MFAIcons } from "../../../configs";
import { BasicProfileInterface, Notification, Validation } from "../../../models";
import { EditSection, FormWrapper, ThemeIcon } from "../../shared";

/**
 * Prop types for the SMS OTP component.
 */
interface SMSOTPProps {
    onNotificationFired: (notification: Notification) => void;
}

/**
 * SMS OTP section.
 *
 * @return {JSX.Element}
 */
export const SMSOTPAuthenticator: React.FunctionComponent<SMSOTPProps> = (props: SMSOTPProps): JSX.Element => {
    const [mobile, setMobile] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const { t } = useTranslation();
    const { onNotificationFired } = props;
    const dispatch = useDispatch();
    const profileInfo: BasicProfileInterface = useSelector(
        (state: any) => state.authenticationInformation.profileInfo
    );

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            setMobileNo(profileInfo);
        }
    }, [profileInfo]);

    const handleUpdate = (mobileNumber) => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        data.Operations[0].value = {
            phoneNumbers: [
                {
                    type: "mobile",
                    value: mobileNumber
                }
            ]
        };

        updateProfileInfo(data).then((response) => {
            onNotificationFired({
                description: t("views:components.mfa.smsOtp.notifications.updateMobile.success.description"),
                message: t("views:components.mfa.smsOtp.notifications.updateMobile.success.message"),
                otherProps: {
                    positive: true
                },
                visible: true
            });
            dispatch(getProfileInformation());
            setIsEdit(false);

        })
        .catch((error) => {
            onNotificationFired({
                description: error && error.data && error.data.details
                    ? t("views:components.mfa.smsOtp.notifications.updateMobile.error.description",
                        {
                            description: error.data.details
                        }
                    )
                    : t("views:components.mfa.smsOtp.notifications.updateMobile.genericError.description"),
                message: error && error.data && error.data.details
                    ? t("views:components.mfa.smsOtp.notifications.updateMobile.error.message")
                    : t("views:components.mfa.smsOtp.notifications.updateMobile.genericError.message"),
                otherProps: {
                    negative: true
                },
                visible: true
            });
        });
    };

    const setMobileNo = (response) => {
        let mobileNumber = "";
        response.phoneNumbers.map((mobileNo) => {
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
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <ThemeIcon
                                    icon={ MFAIcons.sms }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    square={ true }
                                    rounded={ true }
                                    relaxed={ true }
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{ t("views:components.mfa.smsOtp.heading") }</List.Header>
                                <List.Description>
                                    { t("views:components.mfa.smsOtp.descriptions.hint") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                <Icon
                                    link={ true }
                                    onClick={ handleEdit }
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
                                        <FormWrapper
                                            formFields={ [
                                                {
                                                    label: t(
                                                        "views:components.profile.forms.mobileChangeForm.inputs" +
                                                        ".mobile.label"
                                                    ),
                                                    name: "mobileNumber",
                                                    placeholder: t(
                                                        "views:components.profile.forms.mobileChangeForm" +
                                                        ".inputs.mobile.placeholder"
                                                    ),
                                                    required: true,
                                                    requiredErrorMessage: t(
                                                        "views:components.profile.forms." +
                                                        "mobileChangeForm.inputs.mobile.validations.empty"
                                                    ),
                                                    type: "text",
                                                    validation: (value: string, validation: Validation) => {
                                                        const error = Joi.number()
                                                            .integer()
                                                            .validate(value).error;

                                                        if (error) {
                                                            validation.isValid = false;
                                                            validation.errorMessages.push(error.message);
                                                        }
                                                    },
                                                    value: mobile
                                                },
                                                {
                                                    element: (
                                                        <p style={ { fontSize: "12px" } }>
                                                            <Icon color="grey" floated="left" name="info circle" />
                                                            { t(
                                                                "views:components.profile.forms.mobileChangeForm" +
                                                                ".inputs.mobile.note"
                                                            ) }
                                                        </p>
                                                    ),
                                                    type: "custom"
                                                },
                                                {
                                                    hidden: true,
                                                    type: "divider"
                                                },
                                                {
                                                    size: "small",
                                                    type: "submit",
                                                    value: t("common:update").toString()
                                                },
                                                {
                                                    className: "link-button",
                                                    onClick: handleCancel,
                                                    size: "small",
                                                    type: "button",
                                                    value: t("common:cancel").toString()
                                                }
                                            ] }
                                            groups={ [
                                                {
                                                    endIndex: 5,
                                                    startIndex: 3,
                                                    wrapper: Form.Group,
                                                    wrapperProps: {
                                                        inline: true
                                                    }
                                                }
                                            ] }
                                            onSubmit={ (values: Map<string, string>) => {
                                                handleUpdate(values.get("mobileNumber"));
                                            } }
                                        />
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    };

    return <div>{ showEditView() }</div>;
};
