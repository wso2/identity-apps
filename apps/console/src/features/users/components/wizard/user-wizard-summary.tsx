/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import { ContentLoader, CopyInputField, Message, Popup } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid, Icon } from "semantic-ui-react";
import { AppState } from "../../../core/store";
import { OrganizationType } from "../../../organizations/constants";
import { OrganizationResponseInterface } from "../../../organizations/models";
import { generateInviteLink } from "../../api";

interface AddUserWizardSummaryProps extends IdentifiableComponentInterface {
    triggerSubmit: boolean;
    selectedUserStore: string;
    onSubmit?: (application: any) => void;
    username: string;
    password: string;
    isPasswordBased: boolean;
}

/**
 * Add consumer user wizard summary page.
 *
 * @param props - props required for new tenant form component.
 */
export const AddUserWizardSummary: FunctionComponent<AddUserWizardSummaryProps> = (
    props: AddUserWizardSummaryProps
): ReactElement => {

    const {
        selectedUserStore,
        username,
        password,
        isPasswordBased,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const orgType: OrganizationType = useSelector((state: AppState) => state?.organization?.organizationType);
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state?.organization?.organization);

    const [ inviteLink, setInviteLink ] = useState<string>("");
    const [ isSummaryLoading, setIsSummaryLoading ] = useState<boolean>(true);

    const tenantname: string = useMemo(() => {
        if (orgType === OrganizationType.SUBORGANIZATION) {
            return currentOrganization?.name;
        }

        return tenantDomain;
    }, [ tenantDomain, currentOrganization ]);

    useEffect(() => {
        !isPasswordBased && generateInvitationLink();
    }, []);

    const generateInvitationLink = ():void => {
        generateInviteLink(username, selectedUserStore)
            .then((response: string) => {
                setInviteLink(response);
            })
            .catch((error: AxiosError) => {
                // Axios throws a generic `Network Error` for 401 status.
                // As a temporary solution, a check to see if a response
                // is available has be used.
                if (!error.response || error.response.status === 401) {
                    dispatch(addAlert({
                        description: t(
                            "extensions:manage.features.user.addUser.inviteLink.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.features.user.addUser.inviteLink.error.message"
                        )
                    }));
                } else if (error?.response?.data?.detail) {
                    dispatch(addAlert({
                        description: t(
                            "extensions:manage.features.user.addUser.inviteLink.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.features.user.addUser.inviteLink.error.message"
                        )
                    }));
                } else {
                    // Generic error message
                    dispatch(addAlert({
                        description: t(
                            "extensions:manage.features.user.addUser.inviteLink.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.features.user.addUser.inviteLink.genericError.message"
                        )
                    }));
                }
            })
            .finally(() => {
                setIsSummaryLoading(false);
            });
    };

    const copyInvitation = () => {
        if (isPasswordBased) {
            const invitationBody:string = t("extensions:manage.features.user.addUser.summary.invitationBody.hi")
                + "\n\n" +
                t("extensions:manage.features.user.addUser.summary.invitationPasswordBodyCopy.accountHasBeenCreated")
                    .replace("$tenantname", tenantname) + "\n\n" +
                t("extensions:manage.features.user.addUser.summary.username") + `: ${username}\n` +
                t("extensions:manage.features.user.addUser.summary.password") + `: ${password}\n\n` +
                t("extensions:manage.features.user.addUser.summary.invitationBody.thanks") + ",\n" +
                t("extensions:manage.features.user.addUser.summary.invitationBodyCopy.team")
                    .replace("$tenantname", tenantname);

            CommonUtils.copyTextToClipboard(invitationBody);
        } else {
            const invitationBody:string = t("extensions:manage.features.user.addUser.summary.invitationBody.hi")
                + "\n\n" +
                t("extensions:manage.features.user.addUser.summary.invitationBodyCopy.accountHasBeenCreated")
                    .replace("$username", username).replace("$tenantname", tenantname) + "\n\n" +
                t("extensions:manage.features.user.addUser.summary.invitationBody.pleaseFollowTheLink") + "\n\n" +
                t("extensions:manage.features.user.addUser.summary.invitationLink") + ":\n" +
                `${inviteLink}\n\n` +
                t("extensions:manage.features.user.addUser.summary.invitationBody.thanks") + ",\n" +
                t("extensions:manage.features.user.addUser.summary.invitationBodyCopy.team")
                    .replace("$tenantname", tenantname);

            CommonUtils.copyTextToClipboard(invitationBody);
        }
    };

    return (
        isPasswordBased
            ? (
                <Grid className="wizard-summary">
                    <Grid.Row>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Message className="mb-5" warning>
                                <Grid>
                                    <Grid.Column width={ 1 } className="pt-0 pb-0">
                                        <Icon name="info circle" size="large"/>
                                    </Grid.Column>
                                    <Grid.Column width={ 15 } className="pt-0 pb-0">
                                        { t("extensions:manage.features.user.addUser.summary.passwordWarningMessage") }
                                    </Grid.Column>
                                </Grid>
                            </Message>
                            <label>{ t("extensions:manage.features.user.addUser.summary.password") }</label>
                            <CopyInputField
                                className="mt-2"
                                value={ password }
                                data-componentid={ `${ componentId }-user-password-field` }
                                secret={ true }
                            />
                            <Divider horizontal section>
                                Or
                            </Divider>
                            <label>{ t("extensions:manage.features.user.addUser.summary.invitation") }</label>
                            <Grid className="segment mt-2">
                                <Grid.Column width={ 14 }>
                                    { t("extensions:manage.features.user.addUser.summary.invitationBody.hi") }
                                    <br/>
                                    <br/>
                                    <Trans
                                        i18nKey={
                                            "extensions:manage.features.user.addUser.summary.invitationPasswordBody." +
                                            "accountHasBeenCreated"
                                        }
                                        tOptions={ {
                                            tenantname
                                        } }
                                    >
                                        An account has been created for you in the { tenantname } organization.
                                        Your credentials are as follows.
                                    </Trans>
                                    <br/>
                                    <br/>
                                    { t("extensions:manage.features.user.addUser.summary.username") }: { username }
                                    <br/>
                                    { t("extensions:manage.features.user.addUser.summary.password") }: { password }
                                    <br/>
                                    <br/>
                                    { t("extensions:manage.features.user.addUser.summary.invitationBody.thanks") },
                                    <br/>
                                    <Trans
                                        i18nKey={
                                            "extensions:manage.features.user.addUser.summary.invitationBody." +
                                            "team"
                                        }
                                        tOptions={ {
                                            tenantname
                                        } }
                                    >
                                        { tenantname } team
                                    </Trans>
                                </Grid.Column>
                                <Grid.Column width={ 2 }>
                                    <Popup
                                        content="Copy to clipboard"
                                        position="top center"
                                        trigger={
                                            <Button icon="copy" floated="right" onClick={ () => copyInvitation() }/>
                                        }
                                        inverted
                                        popper={ <div style={ { filter: "none" } }/> }
                                    />
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
            : !isSummaryLoading
                ? (
                    <Grid className="wizard-summary">
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Message className="mb-5" warning>
                                    <Grid>
                                        <Grid.Column width={ 1 } className="pt-0 pb-0">
                                            <Icon name="info circle" size="large"/>
                                        </Grid.Column>
                                        <Grid.Column width={ 15 } className="pt-0 pb-0">
                                            { t("extensions:manage.features.user.addUser.summary." +
                                                "inviteWarningMessage") }
                                        </Grid.Column>
                                    </Grid>
                                </Message>
                                <label>{ t("extensions:manage.features.user.addUser.summary.invitationLink") }</label>
                                <CopyInputField
                                    className="mt-2"
                                    value={ inviteLink }
                                    data-componentid={ `${ componentId }-invitation-link` }

                                />
                                <Divider horizontal section>
                                    Or
                                </Divider>
                                <label>{ t("extensions:manage.features.user.addUser.summary.invitation") }</label>
                                <Grid className="segment mt-2">
                                    <Grid.Column width={ 14 }>
                                        { t("extensions:manage.features.user.addUser.summary.invitationBody.hi") }
                                        <br/>
                                        <br/>
                                        <Trans
                                            i18nKey={
                                                "extensions:manage.features.user.addUser.summary.invitationBody." +
                                                "accountHasBeenCreated"
                                            }
                                            tOptions={ {
                                                tenantname,
                                                username
                                            } }
                                        >
                                            An account has been created for the username,
                                            { username } in the { tenantname } organization.
                                        </Trans>
                                        <br/>
                                        <br/>
                                        { t("extensions:manage.features.user.addUser.summary.invitationBody." +
                                            "pleaseFollowTheLink") }
                                        <br/>
                                        <br/>
                                        { t("extensions:manage.features.user.addUser.summary.invitationLink") }:
                                        <br/>
                                        <p className="line-break-anywhere">{ inviteLink }</p>
                                        <br/>
                                        <br/>
                                        { t("extensions:manage.features.user.addUser.summary.invitationBody.thanks") },
                                        <br/>
                                        <Trans
                                            i18nKey={
                                                "extensions:manage.features.user.addUser.summary.invitationBody." +
                                                "team"
                                            }
                                            tOptions={ {
                                                tenantname
                                            } }
                                        >
                                            { tenantname } team
                                        </Trans>
                                    </Grid.Column>
                                    <Grid.Column width={ 2 }>
                                        <Popup
                                            content="Copy to clipboard"
                                            position="top center"
                                            trigger={
                                                <Button icon="copy" floated="right" onClick={ () => copyInvitation() }/>
                                            }
                                            inverted
                                            popper={ <div style={ { filter: "none" } }/> }
                                        />
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
                : <ContentLoader />
    );
};

AddUserWizardSummary.defaultProps = {
    [ "data-componentid" ]: "add-user-wizard-summary",
    isPasswordBased: false
};
