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

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { AlertLevels, ProfileInfoInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Button, Heading,
    Jumbotron, LabeledCard,
    PageLayout, PrimaryButton, SelectionCard,
    StatsInsightsWidget,
    StatsOverviewWidget,
    GenericIcon
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Icon, Card } from "semantic-ui-react";
import { getApplicationList, getIdentityProviderList } from "../api";
import { ApplicationList, IdentityProviderList, handleGetIDPListCallError } from "../components";
import { OverviewPageImages, TechnologyLogos } from "../configs";
import { AppConstants, UIConstants } from "../constants";
import { history } from "../helpers";
import {
    ApplicationListInterface,
    FeatureConfigInterface,
    IdentityProviderListResponseInterface
} from "../models";
import { AppState } from "../store";

/**
 * Proptypes for the overview page component.
 */
type OverviewPageInterface = TestableComponentInterface;

/**
 * Overview page.
 *
 * @param {OverviewPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const OverviewPage: FunctionComponent<OverviewPageInterface> = (
    props: OverviewPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);

    const [ appList, setAppList ] = useState<ApplicationListInterface>({});
    const [ appCount, setAppCount ] = useState<number>(0);
    const [ idpList, setIdPList ] = useState<IdentityProviderListResponseInterface>({});
    const [ idpCount, setIdPCount ] = useState<number>(0);
    const [ isApplicationListRequestLoading, setApplicationListRequestLoading ] = useState<boolean>(false);
    const [ isIdPListRequestLoading, setIdPListRequestLoading ] = useState<boolean>(false);

    useEffect(() => {
        getAppLists(UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT , null, null);
        getIdPList(UIConstants.DEFAULT_STATS_LIST_ITEM_LIMIT , null, null);
    }, []);

    /**
     * Retrieves the list of applications.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getAppLists = (limit: number, offset: number, filter: string): void => {
        setApplicationListRequestLoading(true);

        getApplicationList(limit, offset, filter)
            .then((response) => {
                setAppList(response);
                setAppCount(response?.totalResults);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.fetchApplications.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.fetchApplications.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setApplicationListRequestLoading(false);
            });
    };

    /**
     * Retrieves the list of identity providers.
     *
     * @param {number} limit - List limit.
     * @param {number} offset - List offset.
     * @param {string} filter - Search query.
     */
    const getIdPList = (limit: number, offset: number, filter: string): void => {
        setIdPListRequestLoading(true);

        getIdentityProviderList(limit, offset, filter)
            .then((response) => {
                setIdPList(response);
                setIdPCount(response?.totalResults);
            })
            .catch((error) => {
                handleGetIDPListCallError(error);
            })
            .finally(() => {
                setIdPListRequestLoading(false);
            });
    };

    return (
        <div className="developer-portal page overview-page">
            <Jumbotron
                bordered
                background="accent1"
                className="with-animated-background"
                heading={ t("devPortal:components.overview.banner.heading") }
                subHeading={ t("devPortal:components.overview.banner.subHeading") }
                textAlign="center"
                matchedPadding={ false }
                borderRadius={ 10 }
                style={ {
                    backgroundImage: `url(${ OverviewPageImages.jumbotron.background })`
                } }
            >
                <PrimaryButton
                    basic
                    onClick={ () => window.open(UIConstants.IS_DOC_URLS.get("5.11.0"), "_blank") }
                >
                    { t("common:documentation") }
                </PrimaryButton>
            </Jumbotron>
            <Divider className="x3" hidden />
            <Card.Group className="technology-showcase" centered>
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.angular") }
                    imageSize="x50"
                    image={ TechnologyLogos.angular }
                    padding="none"
                    raiseOnHover={ false }
                />
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.react") }
                    imageSize="x50"
                    image={ TechnologyLogos.react }
                    padding="none"
                    raiseOnHover={ false }
                />
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.windows") }
                    imageSize="x50"
                    image={ TechnologyLogos.windows }
                    padding="none"
                    raiseOnHover={ false }
                />
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.ios") }
                    imageSize="x50"
                    image={ TechnologyLogos.ios }
                    padding="none"
                    raiseOnHover={ false }
                />
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.python") }
                    imageSize="x50"
                    image={ TechnologyLogos.python }
                    padding="none"
                    raiseOnHover={ false }
                />
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.java") }
                    imageSize="x50"
                    image={ TechnologyLogos.java }
                    padding="none"
                    raiseOnHover={ false }
                />
                <LabeledCard
                    basic
                    label={ t("devPortal:technologies.android") }
                    imageSize="x50"
                    image={ TechnologyLogos.android }
                    padding="none"
                    raiseOnHover={ false }
                />
            </Card.Group>
            <Divider className="x3" hidden />
            <Divider />
            <Divider className="x3" hidden />
            <Card.Group className="quick-links" centered>
                <Card
                    className="basic-card"
                    link={ false }
                    as="div"
                    onClick={ () => history.push(AppConstants.PATHS.get("APPLICATIONS")) }
                >
                    <GenericIcon
                        size="x50"
                        icon={ OverviewPageImages.quickLinks.applications }
                        square
                        relaxed="very"
                        transparent
                    />
                    <Card.Content textAlign="center">
                        <Card.Header>
                            { t("devPortal:components.overview.quickLinks.cards.applications.heading") }
                        </Card.Header>
                        <Card.Description>
                            { t("devPortal:components.overview.quickLinks.cards.applications.subHeading") }
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card
                    className="basic-card"
                    link={ false }
                    as="div"
                    onClick={ () => history.push(AppConstants.PATHS.get("IDP")) }
                >
                    <GenericIcon
                        size="x50"
                        icon={ OverviewPageImages.quickLinks.idp }
                        square
                        relaxed="very"
                        transparent
                    />
                    <Card.Content textAlign="center">
                        <Card.Header>
                            { t("devPortal:components.overview.quickLinks.cards.idps.heading") }
                        </Card.Header>
                        <Card.Description>
                            { t("devPortal:components.overview.quickLinks.cards.idps.subHeading") }
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card
                    className="basic-card"
                    link={ false }
                    as="div"
                    onClick={ () => history.push(AppConstants.PATHS.get("REMOTE_REPO_CONFIG")) }
                >
                    <GenericIcon
                        size="x50"
                        icon={ OverviewPageImages.quickLinks.remoteFetch }
                        square
                        relaxed="very"
                        transparent
                    />
                    <Card.Content textAlign="center">
                        <Card.Header>
                            { t("devPortal:components.overview.quickLinks.cards.remoteFetch.heading") }
                        </Card.Header>
                        <Card.Description>
                            { t("devPortal:components.overview.quickLinks.cards.remoteFetch.subHeading") }
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Card.Group>
            <PageLayout
                contentTopMargin={ false }
                data-testid={ `${ testId }-page-layout` }
            >

            </PageLayout>
        </div>
    );
};

/**
 * Default props for the component.
 */
OverviewPage.defaultProps = {
    "data-testid": "overview"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OverviewPage;
