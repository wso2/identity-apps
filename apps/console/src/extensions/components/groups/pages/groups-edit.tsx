/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { GenericIcon, TabPageLayout } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Label } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getSidePanelIcons,
    history
} from "../../../../features/core";
import { getGroupById } from "../../../../features/groups/api";
import { GroupsInterface } from "../../../../features/groups/models";
import { EditGroup } from "../edit-group";

const GroupEditPage: FunctionComponent<any> = (): ReactElement => {

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ roleId, setGroupId ] = useState<string>(undefined);
    const [ group, setGroup ] = useState<GroupsInterface>();
    const [ isGroupDetailsRequestLoading, setIsGroupDetailsRequestLoading ] = useState<boolean>(true);

    const excludeMembers: string = "members";

    /**
     * Get Group data from URL id
     */
    useEffect(() => {
        const path: string[] = history.location.pathname.split("/");
        const roleId: string = path[ path.length - 1 ];

        setGroupId(roleId);
        getGroupDetails(roleId, excludeMembers);
    }, []);

    const getGroupDetails = (roleId: string, excludedAttributes?: string): void => {
        setIsGroupDetailsRequestLoading(true);

        getGroupById(roleId, excludedAttributes)
            .then((response: AxiosResponse) => {
                if (response.status === 200) {
                    setGroup(response.data);
                }
            }).catch(() => {
            // TODO: handle error
            })
            .finally(() => {
                setIsGroupDetailsRequestLoading(false);
            });
    };

    const onGroupUpdate = (): void => {
        getGroupDetails(roleId, excludeMembers);
    };

    const handleBackButtonClick = () => {
        history.push(AppConstants.getPaths().get("GROUPS"));
    };

    return (
        <TabPageLayout
            isLoading={ isGroupDetailsRequestLoading }
            title={
                group && group?.displayName ?
                    group?.displayName?.split("/")[1] :
                    t("console:manage.pages.rolesEdit.title")
            }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("console:manage.pages.rolesEdit.backButton", { type: "Groups" })
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            description={ (
                <div>
                    {
                        <Label className="group-source-label">
                            <GenericIcon
                                className="mt-1 mb-0"
                                square
                                inline
                                size="default"
                                transparent
                                icon={ getSidePanelIcons().userStore }
                                verticalAlign="middle"
                            />
                            <Label.Detail className="mt-1 ml-0 mb-1">
                                { group?.displayName?.split("/")[0] }
                            </Label.Detail>
                        </Label>  
                    }
                </div>
            ) }
        >
            <EditGroup
                isGroupDetailsRequestLoading={ isGroupDetailsRequestLoading }
                group={ group }
                groupId={ roleId }
                onGroupUpdate={ onGroupUpdate }
                featureConfig={ featureConfig }
            />
        </TabPageLayout>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GroupEditPage;
