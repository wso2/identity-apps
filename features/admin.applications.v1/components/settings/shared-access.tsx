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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { EmphasizedSegment, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { useAsyncOperation } from "../../hooks/use-async-status";
import { ApplicationInterface } from "../../models/application";
import { ApplicationShareForm } from "../forms/share-application-form";

/**
 * Proptypes for the shared access component.
 */
interface SharedAccessPropsInterface extends SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 *  Shared access component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Share access component.
 */
export const SharedAccess: FunctionComponent<SharedAccessPropsInterface> = (
    props: SharedAccessPropsInterface
): ReactElement => {

    const { application, onUpdate, readOnly } = props;

    const { isInProgress } = useAsyncOperation(application);

    return (
        <>
            { isInProgress && (
                <div className="banner-wrapper">
                    <Alert
                        // className={ classes }
                        severity="warning"
                        action={
                            (
                                <Box display="flex">
                                    <Button
                                        className="banner-view-hide-details">
                                        {
                                            "Cancel Update"
                                        }
                                    </Button>
                                    <Button
                                        className="ignore-once-button">
                                        <Icon
                                            link
                                            // onClick={ () => setDisplayBanner(false) }
                                            size="small"
                                            color="grey"
                                            name="close"
                                            // data-componentid={ `${componentId}-close-btn` }
                                        />
                                    </Button>
                                </Box>
                            )
                        }
                    >
                        <AlertTitle className="alert-title">
                            <Trans components={ { strong: <strong/> } } >
                                Update In Progress.
                            </Trans>
                        </AlertTitle>
                        Updating shared access is in progress.
                    </Alert>
                </div>
            ) }
            <EmphasizedSegment className="advanced-configuration-section" padded="very">
                <p>test</p>
                <ApplicationShareForm
                    application={ application }
                    onApplicationSharingCompleted={ () => onUpdate(application?.id)}
                    readOnly={ readOnly }
                />
            </EmphasizedSegment>
        </>
    );
};

/**
 * Default props for the application advanced settings component.
 */
SharedAccess.defaultProps = {
    "data-componentid": "application-shared-access"
};
