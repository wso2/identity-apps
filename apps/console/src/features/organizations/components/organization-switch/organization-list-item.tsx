/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentifiableComponentInterface } from "@wso2is/core/src/models";
import { GenericIcon, Popup } from "@wso2is/react-components";
import React, { ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Placeholder } from "semantic-ui-react";
import { organizationConfigs } from "../../../../extensions";
import { AppConstants, getMiscellaneousIcons, history } from "../../../core";
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
                        icon={ getMiscellaneousIcons().tenantIcon }
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
            { !OrganizationUtils.isRootOrganization(organization) && showEdit && (
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
