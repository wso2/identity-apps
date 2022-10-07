/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { GenericIcon } from "@wso2is/react-components";
import React, { ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Placeholder, Popup } from "semantic-ui-react";
import { AppConstants, getMiscellaneousIcons, history } from "../../../core";
import {
    GenericOrganization
} from "../../models";
import { OrganizationUtils } from "../../utils";

interface OrganizationListItemPropsTypesInterface
    extends IdentifiableComponentInterface {
    organization: GenericOrganization;
    isClickable: boolean;
    showSwitch: boolean;
    handleOrgRowClick: (
        organization: GenericOrganization
    ) => void;
    setShowDropdown: (shouldShow: boolean) => void;
    handleOrganizationSwitch?: (organization: GenericOrganization) => void;
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
        "data-componentid": componentId
    } = props;


    const { t } = useTranslation();

    return (
        <Grid.Row
            columns={ 3 }
            key={ `${ organization?.name }-organization-item` }
            onClick={ () => handleOrgRowClick(organization) }
            className={ isClickable ? "organization-list-row" : "" }
            data-componentid={ `${ componentId }-organization-item` }
        >
            <Grid.Column width={ 3 } verticalAlign="middle">
                <GenericIcon
                    icon={ getMiscellaneousIcons().tenantIcon }
                    size="micro"
                    relaxed="very"
                    fill="white"
                    background={ "grey" }
                    shape="rounded"
                />
            </Grid.Column>
            <Grid.Column
                width={ 9 }
                verticalAlign="middle"
                data-componentid={ `${ componentId }-organization-name` }
            >
                { organization?.name ?? (
                    <Placeholder>
                        <Placeholder.Line />
                    </Placeholder>
                ) }
            </Grid.Column>
            <Grid.Column width={ 2 } verticalAlign="middle">
                { showSwitch && (
                    <Popup
                        trigger={
                            (<Icon
                                link
                                className="list-icon"
                                size="small"
                                color="grey"
                                name="exchange"
                                onClick={
                                    isClickable
                                        ? () => {
                                            handleOrganizationSwitch && handleOrganizationSwitch(
                                                organization
                                            );
                                        }
                                        : null
                                }
                                data-componentid={ `${ componentId }-organization-switch` }
                            />)
                        }
                        position="top center"
                        content={ t("common:switch") }
                        inverted
                    />
                ) }
                { !OrganizationUtils.isRootOrganization(organization) && (
                    <Show when={ AccessControlConstants.ORGANIZATION_EDIT }>
                        <Popup
                            trigger={
                                (<Icon
                                    link
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                    onClick={ (event: SyntheticEvent) => {
                                        history.push({
                                            pathname: AppConstants.getPaths()
                                                .get("ORGANIZATION_UPDATE")
                                                .replace(":id", organization?.id)
                                        });
                                        setShowDropdown(false);
                                        event.stopPropagation();
                                    } }
                                    data-componentid={ `${ componentId }-organization-edit` }
                                />)
                            }
                            position="top center"
                            content={ t("common:edit") }
                            inverted
                        />
                    </Show>
                ) }
            </Grid.Column>
        </Grid.Row>
    );
};

export default OrganizationListItem;

OrganizationListItem.defaultProps = {
    "data-componentid": "organization-switch-list-item",
    showSwitch: true
};
