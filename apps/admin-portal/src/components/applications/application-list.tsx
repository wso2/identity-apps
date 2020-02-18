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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AppAvatar, ResourceList } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { history } from "../../helpers";
// TODO: Importing `deleteApplication` before `history` import throws `appBaseName` undefined error.
// tslint:disable-next-line:ordered-imports
import { deleteApplication } from "../../api";
import { ApplicationListInterface } from "../../models";

/**
 *
 * Proptypes for the applications list component.
 */
interface ApplicationListPropsInterface {
    list: ApplicationListInterface;
    onApplicationDelete: () => void;
}

/**
 * Application list component.
 *
 * @param {ApplicationListPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ApplicationList: FunctionComponent<ApplicationListPropsInterface> = (
    props: ApplicationListPropsInterface
): JSX.Element => {

    const {
        list,
        onApplicationDelete
    } = props;

    const dispatch = useDispatch();

    const handleApplicationEdit = (appId: string) => {
        history.push(`applications/${ appId }`);
    };

    const handleApplicationDelete = (appId: string) => {
        deleteApplication(appId)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully deleted the application",
                    level: AlertLevels.SUCCESS,
                    message: "Delete successful"
                }));

                onApplicationDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Delete Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while deleting the application",
                    level: AlertLevels.ERROR,
                    message: "Application Delete Error"
                }));
            });
    };

    return (
        <ResourceList className="applications-list">
            {
                (list.applications && list.applications.length && list.applications.length > 0)
                    ? list.applications.map((app, index) => {
                        // TODO Remove this check and move the logic to backend.
                        if ("wso2carbon-local-sp" !== app.name) {
                            return (
                                <ResourceList.Item
                                    key={ index }
                                    actions={ [
                                        {
                                            icon: "pencil alternate",
                                            onClick: () => handleApplicationEdit(app.id),
                                            popupText: "edit",
                                            type: "button"
                                        },
                                        {
                                            icon: "trash alternate",
                                            onClick: () => handleApplicationDelete(app.id),
                                            popupText: "delete",
                                            type: "dropdown"
                                        }
                                    ] }
                                    avatar={ (
                                        <AppAvatar
                                            name={ app.name }
                                            image={ app.image }
                                            size="mini"
                                            floated="left"
                                        />
                                    ) }
                                    itemHeader={ app.name }
                                    itemDescription={ app.description }
                                />
                            );
                        }
                    })
                    : null
            }
        </ResourceList>
    );
};
