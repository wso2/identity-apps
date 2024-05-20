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

import { VerticalStepper, VerticalStepperStepInterface } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import ApplicationSelectionModal
    from "@wso2is/admin.extensions.v1/components/shared/application-selection-modal";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Encode } from "@wso2is/core/utils";
import { GenericIcon, Heading, PageHeader } from "@wso2is/react-components";
import React, { FC, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { ConnectionInterface, ConnectionTemplateInterface } from "../../models/connection";
import { ConnectionsManagementUtils } from "../../utils/connection-utils";

type ConnectionQuickStartStepType = {
    content?: string;
    image?: string;
    title?: string;
    [ key: string ]: any;
}

interface QuickStartContentInterface {
    heading: string;
    subHeading: string;
    steps: ConnectionQuickStartStepType[];
}

/**
 * Prop types of the component.
 */
interface ConnectionQuickStartPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connection object.
     */
    connection: ConnectionInterface;
    /**
     * Connection template object.
     */
    template: ConnectionTemplateInterface;
    /**
     * Content of the quick start steps.
     */
    quickStartContent:  QuickStartContentInterface;
}

/**
 * Quick start content for the Connection template.
 *
 * @param props - Props injected into the component.
 *
 */
const ConnectionQuickStart: FC<ConnectionQuickStartPropsInterface> = (
    props: ConnectionQuickStartPropsInterface
): ReactElement => {

    const {
        quickStartContent,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;
    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    const resolveQuickStartSteps = (): VerticalStepperStepInterface[] => {

        const quickstartSteps: VerticalStepperStepInterface[] = [];

        quickStartContent?.steps?.map((step: ConnectionQuickStartStepType, index: number) => {
            quickstartSteps.push(
                {
                    stepContent: (
                        <>
                            <div
                                key={ index }
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={ { __html: Encode.forHtml(step?.content) } }
                            />
                            {
                                step.image && (
                                    <GenericIcon
                                        inline
                                        transparent
                                        icon={
                                            ConnectionsManagementUtils
                                                .resolveConnectionResourcePath(connectionResourcesUrl, step.image)
                                        }
                                        size="huge"
                                    />
                                )
                            }
                        </>
                    ),
                    stepTitle: step.title
                }
            );
        });

        return quickstartSteps;
    };

    return(
        <>
            <Grid data-componentid={ componentId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            title={ quickStartContent?.heading }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            { quickStartContent?.subHeading }
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <VerticalStepper
                            alwaysOpen
                            isSidePanelOpen
                            stepContent={ resolveQuickStartSteps() }
                            isNextEnabled={ true }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                showApplicationModal && (
                    <ApplicationSelectionModal
                        data-testid={ `${ componentId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={
                            t("extensions:develop.identityProviders.apple.quickStart.addLoginModal.heading")
                        }
                        subHeading={
                            t("extensions:develop.identityProviders.apple.quickStart.addLoginModal.subHeading")
                        }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component
 */
ConnectionQuickStart.defaultProps = {
    "data-componentid": "connector-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionQuickStart;
