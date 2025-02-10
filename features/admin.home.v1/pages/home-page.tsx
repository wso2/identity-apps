/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import {
    Announcement,
    DocumentationLink,
    LinkButton,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import AdvanceUserView from "../components/advance-user-view";

/**
 * Proptypes for the overview page component.
 */
type HomePageInterface = IdentifiableComponentInterface;

/**
 * Overview page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Getting started page.
 */
const HomePage: FunctionComponent<HomePageInterface> = (
    props: HomePageInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId
    } = props;

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const { organizationType } = useGetCurrentOrganizationType();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const featureAnnouncement: boolean = useMemo(() => {
        return organizationType !== OrganizationType.SUBORGANIZATION && false;
    }, [ organizationType ]);

    /**
     * Monitor `profileInfo.id` and publish the event to avoid an event without `UUID`.
     */
    useEffect(() => {

        if (!profileInfo?.id) {
            return;
        }

        eventPublisher.publish("console-click-getting-started-menu-item");
    }, [ profileInfo?.id ]);

    return (
        <PageLayout
            padded={ false }
            pageTitle="Home"
            contentTopMargin={ false }
            data-componentid={ `${componentId}-layout` }
            className="getting-started-page"
        >
            {
                featureAnnouncement && (
                    <Announcement
                        message={ t("console:common.header.featureAnnouncements.organizations.message") }
                        isFeatureAnnouncement={ true }
                        showCloseIcon={ false }
                    >
                        <>
                            <DocumentationLink
                                className="pl-3 pr-0"
                                link={ getLink("manage.organizations.learnMore") }
                                showIcon={ false }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                            <LinkButton
                                className="ml-0"
                                onClick={ () => {
                                    history.push(AppConstants.getPaths().get("ORGANIZATIONS"));
                                } }
                            >
                                { t("console:common.header.featureAnnouncements.organizations.buttons.tryout") }
                                <Icon name="angle right" />
                            </LinkButton>
                        </>
                    </Announcement>
                )
            }
            <AdvanceUserView />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
HomePage.defaultProps = {
    "data-componentid": "getting-started-page"
};

export default HomePage;
