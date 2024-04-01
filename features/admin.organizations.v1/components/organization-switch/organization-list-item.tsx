/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentifiableComponentInterface } from "@wso2is/core/src/models";
import { GenericIcon, Popup } from "@wso2is/react-components";
import React, { ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Placeholder } from "semantic-ui-react";
import { organizationConfigs } from "../../../admin-extensions-v1";
import { AppConstants, getMiscellaneousIcons, history } from "../../../admin.core.v1";
import { GenericOrganization } from "../../models";
import { OrganizationUtils } from "../../utils";

interface OrganizationListItemPropsTypesInterface
    extends IdentifiableComponentInterface {
    organization: GenericOrganization;
    isClickable: boolean;
    showSwitch: boolean;
    handleOrgRowClick?: (organization: GenericOrganization) => void;
    setShowDropdown: (shouldShow: boolean) => void;
    handleOrganizationSwitch?: (organization: GenericOrganization) => void;
    showGravatar?: boolean;
    showEdit?: boolean;
}

const OrganizationListItem = (
    props: OrganizationListItemPropsTypesInterface
): ReactElement => {
    const {
        organization,
        isClickable,
        showSwitch,
        handleOrgRowClick,
        setShowDropdown,
        handleOrganizationSwitch,
        showGravatar,
        showEdit,
        "data-componentid": componentId
    } = props;

    const { t } = useTranslation();

    return (
        <Grid.Row
            columns={ showGravatar ? 3 : 2 }
            key={ `${ organization?.name }-organization-item` }
            onClick={ () =>
                organizationConfigs.allowNavigationInDropdown &&
                handleOrgRowClick &&
                handleOrgRowClick(organization)
            }
            className={
                isClickable && organizationConfigs.allowNavigationInDropdown
                    ? "organization-list-row"
                    : ""
            }
            data-componentid={ `${ componentId }-organization-item` }
        >
            { showGravatar && (
                <Grid.Column width={ 3 } verticalAlign="middle" textAlign="left">
                    <GenericIcon
                        icon={ getMiscellaneousIcons().tenantLegacyIcon }
                        size="micro"
                        relaxed="very"
                        fill="white"
                        background={ "grey" }
                        shape="rounded"
                    />
                </Grid.Column>
            ) }
            <Grid.Column
                width={ showGravatar ? 9 : 12 }
                verticalAlign="middle"
                data-componentid={ `${ componentId }-organization-name` }
                className="ellipsis organization-name"
            >
                { organization?.name ?? (
                    <Placeholder>
                        <Placeholder.Line />
                    </Placeholder>
                ) }
            </Grid.Column>
            { showSwitch && (
                <Grid.Column width={ 2 } verticalAlign="middle" textAlign="right">
                    <Popup
                        trigger={
                            (<Icon
                                link
                                className="list-icon"
                                size="small"
                                color="grey"
                                name="exchange"
                                onClick={ (event: SyntheticEvent) => {
                                    event.stopPropagation();
                                    handleOrganizationSwitch &&
                                        handleOrganizationSwitch(organization);
                                } }
                                data-componentid={ `${ componentId }-organization-switch` }
                            />)
                        }
                        position="top center"
                        content={ t("common:switch") }
                        inverted
                    />
                </Grid.Column>
            ) }
            { !OrganizationUtils.isSuperOrganization(organization) && showEdit && (
                <Show when={ AccessControlConstants.ORGANIZATION_EDIT }>
                    <Grid.Column
                        width={ 2 }
                        verticalAlign="middle"
                        textAlign="right"
                    >
                        <Popup
                            trigger={
                                (<Icon
                                    link
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                    onClick={ (event: SyntheticEvent) => {
                                        event.stopPropagation();
                                        history.push({
                                            pathname: AppConstants.getPaths()
                                                .get("ORGANIZATION_UPDATE")
                                                .replace(
                                                    ":id",
                                                    organization?.id
                                                )
                                        });
                                        setShowDropdown(false);
                                    } }
                                    data-componentid={ `${ componentId }-organization-edit` }
                                />)
                            }
                            position="top center"
                            content={ t("common:edit") }
                            inverted
                        />
                    </Grid.Column>
                </Show>
            ) }
        </Grid.Row>
    );
};

export default OrganizationListItem;

OrganizationListItem.defaultProps = {
    "data-componentid": "organization-switch-list-item",
    showEdit: true,
    showGravatar: true,
    showSwitch: true
};
