/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { PadlockAsteriskIcon } from "@oxygen-ui/react-icons";
import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Grid from "@oxygen-ui/react/Grid";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import "./add-user-type.scss";
import { AdminAccountTypes } from "../../../constants/user-management-constants";

/**
 * Interface for the AddUserType component.
 */
interface AddUserTypeProps extends IdentifiableComponentInterface {
    userTypeSelection: string;
    setUserTypeSelection: (userType: string) => void;
}

/**
 * User type component.
 *
 * @returns Add User Type component.
 */
export const AddUserType: FunctionComponent<AddUserTypeProps> = (props: AddUserTypeProps): ReactElement => {

    const {
        setUserTypeSelection,
        userTypeSelection
    } = props;

    const { t } = useTranslation();

    return (
        <>
            <Grid container spacing={ 4 } padding={ 2 } alignContent="center" height="100%">
                <Grid xs={ 6 }>
                    <Card
                        key="external-user-selection"
                        onClick={ () => setUserTypeSelection(AdminAccountTypes.EXTERNAL) }
                        selected={ true }
                        className={ userTypeSelection === AdminAccountTypes.EXTERNAL
                            ? "user-type-card selected-card"
                            : "user-type-card"
                        }
                    >
                        <CardContent>
                            <Grid container padding={ 0 } justifyContent="center" className="mb-5">
                                <Avatar variant="rounded" >
                                    <PadlockAsteriskIcon />
                                </Avatar>
                            </Grid>
                            <Grid padding={ 1 } textAlign="center">
                                <Typography variant="h6">
                                    { t("users:addUserType.createUser.title") }
                                </Typography>
                            </Grid>
                            <Grid padding={ 1 } textAlign="center">
                                <Typography variant="body2" color="text.secondary">
                                    { t("users:addUserType.createUser.description") }
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={ 6 }>
                    <Card
                        key="internal-user-selection"
                        onClick={ () => setUserTypeSelection(AdminAccountTypes.INTERNAL) }
                        className={ userTypeSelection === AdminAccountTypes.INTERNAL
                            ? "user-type-card selected-card"
                            : "user-type-card"
                        }
                    >
                        <CardContent>
                            <Grid container padding={ 0 } justifyContent="center" className="mb-5">
                                <Avatar variant="rounded" className="user-type-avatar">
                                    <PadlockAsteriskIcon />
                                </Avatar>
                            </Grid>
                            <Grid padding={ 1 } textAlign="center">
                                <Typography variant="h6">
                                    { t("users:addUserType.inviteParentUser.title") }
                                </Typography>
                            </Grid>
                            <Grid padding={ 1 } textAlign="center">
                                <Typography variant="body2" color="text.secondary">
                                    { t("users:addUserType.inviteParentUser.description") }
                                </Typography>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};
