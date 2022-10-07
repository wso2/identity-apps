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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { useInfiniteScroll } from "@wso2is/react-components";
import React, { ReactElement, SyntheticEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Loader, Ref, Segment } from "semantic-ui-react";
import OrganizationListItem from "./organization-list-item";
import {
    OrganizationInterface,
    OrganizationResponseInterface
} from "../../models";

interface OrganizationSwitcherListPropTypesInterface
    extends IdentifiableComponentInterface {
    parents: (OrganizationInterface | OrganizationResponseInterface)[];
    organizations: OrganizationInterface[];
    hasMore: boolean;
    handleBackButtonClick: (event: SyntheticEvent) => void;
    currentOrganization: OrganizationResponseInterface;
    handleOrgRowClick: (
        organization: OrganizationInterface | OrganizationResponseInterface
    ) => void;
    setShowDropdown: (shouldShow: boolean) => void;
    loadMore: () => void;
}

const OrganizationSwitcherList = (
    props: OrganizationSwitcherListPropTypesInterface
): ReactElement => {
    const {
        parents,
        organizations,
        hasMore,
        handleBackButtonClick,
        currentOrganization,
        handleOrgRowClick,
        setShowDropdown,
        loadMore,
        "data-componentid": componentId
    } = props;
    const { t } = useTranslation();

    const scrollableGrid = useRef();
    const lastItem = useRef();

    useInfiniteScroll(scrollableGrid, lastItem, hasMore, loadMore);

    return (
        <Ref innerRef={ scrollableGrid }>
            <Grid
                data-componentid={ "associated-organizations-container" }
                padded
                className="organization-list-grid"
            >
                { parents?.length > 0 && (
                    <Grid.Row>
                        <Grid.Column>
                            <div
                                className="organization-back-button"
                                data-componentid={ `${ componentId }-back-button` }
                                onClick={ handleBackButtonClick }
                            >
                                <Icon name="arrow left" />
                                { t("console:manage.features.organizations.switching.goBack") }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { organizations.length > 0 ? (
                    <>
                        { organizations.map(
                            (organization: OrganizationInterface) =>
                                organization.id !== currentOrganization?.id ? (
                                    <OrganizationListItem
                                        organization={ organization }
                                        showSwitch={ true }
                                        isClickable={ true }
                                        handleOrgRowClick={ handleOrgRowClick }
                                        setShowDropdown={ setShowDropdown }
                                    />
                                ) : null
                        ) }
                        { hasMore && (
                            <Ref innerRef={ lastItem }>
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        <Segment basic>
                                            <Loader active inline="centered" />
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Ref>
                        ) }
                    </>
                ) : (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column>
                            <div className="message">
                                { t(
                                    "console:manage.features.organizations.switching." +
                                    "emptyList"
                                ) }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                ) }
            </Grid>
        </Ref>
    );
};

export default OrganizationSwitcherList;

OrganizationSwitcherList.defaultProps = {
    "data-componentid": "organization-switcher-list"
};
