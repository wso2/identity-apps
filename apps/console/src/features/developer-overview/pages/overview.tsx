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

import { useSVGPromise } from "@wso2is/core/hooks";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    GenericIcon,
    Jumbotron,
    LabeledCard,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Card, Divider } from "semantic-ui-react";
import { AppConstants, UIConstants, getTechnologyLogos, history } from "../../core";
import { getOverviewPageImages } from "../configs";

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

    const [ jumbotronBGAsDataURL ] = useSVGPromise(getOverviewPageImages().jumbotron.background);

    return (
        <PageLayout contentTopMargin={ false }>
            <div className="developer-portal page overview-page">
                <Jumbotron
                    bordered
                    background="accent1"
                    className="with-animated-background"
                    heading={ t("console:develop.overview.banner.heading") }
                    subHeading={ t("console:develop.overview.banner.subHeading") }
                    textAlign="center"
                    matchedPadding={ false }
                    borderRadius={ 10 }
                    style={ {
                        backgroundImage: `url(${ jumbotronBGAsDataURL })`
                    } }
                    data-testid={ `${ testId }-jumbotron` }
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
                        background="transparent"
                        label={ t("console:develop.technologies.angular") }
                        imageSize="x50"
                        image={ getTechnologyLogos().angular }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                    <LabeledCard
                        basic
                        background="transparent"
                        label={ t("console:develop.technologies.react") }
                        imageSize="x50"
                        image={ getTechnologyLogos().react }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                    <LabeledCard
                        basic
                        background="transparent"
                        label={ t("console:develop.technologies.windows") }
                        imageSize="x50"
                        image={ getTechnologyLogos().windows }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                    <LabeledCard
                        basic
                        background="transparent"
                        label={ t("console:develop.technologies.ios") }
                        imageSize="x50"
                        image={ getTechnologyLogos().ios }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                    <LabeledCard
                        basic
                        background="transparent"
                        label={ t("console:develop.technologies.python") }
                        imageSize="x50"
                        image={ getTechnologyLogos().python }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                    <LabeledCard
                        basic
                        background="transparent"
                        label={ t("console:develop.technologies.java") }
                        imageSize="x50"
                        image={ getTechnologyLogos().java }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                    <LabeledCard
                        basic
                        background="transparent"
                        label={ t("console:develop.technologies.android") }
                        imageSize="x50"
                        image={ getTechnologyLogos().android }
                        imageOptions={ {
                            fill: false
                        } }
                        padding="none"
                        raiseOnHover={ false }
                    />
                </Card.Group>
                <Divider className="x3" hidden />
                <Divider style={ { marginLeft: "15em", marginRight: "15em" } } />
                <Divider className="x3" hidden />
                <Card.Group className="quick-links" centered>
                    <Card
                        className="basic-card"
                        link={ false }
                        as="div"
                        onClick={ () => history.push(AppConstants.getPaths().get("APPLICATIONS")) }
                    >
                        <GenericIcon
                            square
                            fill="default"
                            size="x50"
                            icon={ getOverviewPageImages().quickLinks.applications }
                            relaxed="very"
                            transparent
                        />
                        <Card.Content textAlign="center">
                            <Card.Header>
                                { t("console:develop.overview.quickLinks.cards.applications.heading") }
                            </Card.Header>
                            <Card.Description>
                                { t("console:develop.overview.quickLinks.cards.applications.subHeading") }
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    <Card
                        className="basic-card"
                        link={ false }
                        as="div"
                        onClick={ () => history.push(AppConstants.getPaths().get("IDP")) }
                    >
                        <GenericIcon
                            square
                            fill="default"
                            size="x50"
                            icon={ getOverviewPageImages().quickLinks.idp }
                            relaxed="very"
                            transparent
                        />
                        <Card.Content textAlign="center">
                            <Card.Header>
                                { t("console:develop.overview.quickLinks.cards.idps.heading") }
                            </Card.Header>
                            <Card.Description>
                                { t("console:develop.overview.quickLinks.cards.idps.subHeading") }
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    <Card
                        className="basic-card"
                        link={ false }
                        as="div"
                        onClick={ () => history.push(AppConstants.getPaths().get("REMOTE_REPO_CONFIG")) }
                    >
                        <GenericIcon
                            square
                            fill="default"
                            size="x50"
                            icon={ getOverviewPageImages().quickLinks.remoteFetch }
                            relaxed="very"
                            transparent
                        />
                        <Card.Content textAlign="center">
                            <Card.Header>
                                { t("console:develop.overview.quickLinks.cards.remoteFetch.heading") }
                            </Card.Header>
                            <Card.Description>
                                { t("console:develop.overview.quickLinks.cards.remoteFetch.subHeading") }
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </div>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
OverviewPage.defaultProps = {
    "data-testid": "overview-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default OverviewPage;
