/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { DownloadIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";

/**
 * Download agent step component props.
 */
interface DownloadAgentStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * Download URLs of the user store agent for different operating systems.
     */
    downloadURLs: {
        mac: string;
        linux: string;
        linuxArm: string;
        windows: string;
    };
}

/**
 * Download agent step component for the Remote User Store manager.
 *
 * @param props - Props injected to the component.
 * @returns The download agent step component.
 */
const DownloadAgentStep: FunctionComponent<DownloadAgentStepPropsInterface> = ({
    downloadURLs,
    ["data-componentid"]: componentId = "download-agent-step"
}: DownloadAgentStepPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const availableOptions: { os: string; link: string }[] = [
        {
            link: downloadURLs?.mac ?? "",
            os: "Mac OS"
        },
        {
            link: downloadURLs?.linux ?? "",
            os: "Linux"
        },
        {
            link: downloadURLs?.linuxArm ?? "",
            os: "Linux (ARM)"
        },
        {
            link: downloadURLs?.windows ?? "",
            os: "Windows"
        }
    ];

    const onDownloadClicked = (downloadURL: string) => {
        window.open(downloadURL, "_blank", "noopener, noreferrer");
    };

    return (
        <>
            <Typography component="p" marginBottom={ 2 }>
                { t("remoteUserStores:pages.edit.guide.steps.download.remote.description") }
            </Typography>
            <Stack direction="row" spacing={ 1 }>
                { availableOptions.map((option: { os: string; link: string }) => {
                    return (
                        <Button
                            key={ option.os }
                            data-componentid={ `${componentId}-${option.os}-button` }
                            size="small"
                            variant="outlined"
                            startIcon={ <DownloadIcon /> }
                            onClick={ () => onDownloadClicked(option.link) }
                        >
                            { option.os }
                        </Button>
                    );
                }) }
            </Stack>
        </>
    );
};

export default DownloadAgentStep;
