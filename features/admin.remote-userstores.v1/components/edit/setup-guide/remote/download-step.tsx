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
import Code from "@oxygen-ui/react/Code";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { DownloadIcon } from "@oxygen-ui/react-icons";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CodeEditor, Heading } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetCheckSum from "../../../../api/use-get-sha-file";

/**
 * Interface for download URLs prop of the DownloadAgentStep component.
 */
export interface AgentDownloadInfoInterface {
    /**
     * The download URL of the user store agent.
     */
    file: string;
    /**
     * The checksum file URL of the user store agent file.
     */
    checkSum: string;
}

/**
 * Interface for agent download options shown it the UI.
 */
interface AgentDownloadOptionInterface extends AgentDownloadInfoInterface {
    /**
     * The operating system of the user store agent.
     */
    os: OperatingSystem;
}

/**
 * Download agent step component props.
 */
interface DownloadAgentStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * Download URLs of the user store agent for different operating systems.
     */
    downloadURLs: {
        linux: AgentDownloadInfoInterface;
        linuxArm: AgentDownloadInfoInterface;
        mac: AgentDownloadInfoInterface;
        windows: AgentDownloadInfoInterface;
    }
}

/**
 * User store agent available operating systems.
 */
enum OperatingSystem {
    Linux = "Linux",
    LinuxArm = "Linux (ARM)",
    Mac = "Mac OS",
    Windows = "Windows"
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
    const dispatch: Dispatch = useDispatch();

    const [ downloadedOS, setDownloadedOS ] = useState<OperatingSystem>();

    const availableOptions: AgentDownloadOptionInterface[] = [
        {
            checkSum: downloadURLs?.linux?.checkSum ?? "",
            file: downloadURLs?.linux?.file ?? "",
            os: OperatingSystem.Linux
        },
        {
            checkSum: downloadURLs?.linuxArm?.checkSum ?? "",
            file: downloadURLs?.linuxArm?.file ?? "",
            os: OperatingSystem.LinuxArm
        },
        {
            checkSum: downloadURLs?.mac?.checkSum ?? "",
            file: downloadURLs?.mac?.file ?? "",
            os: OperatingSystem.Mac
        },
        {
            checkSum: downloadURLs?.windows?.checkSum ?? "",
            file: downloadURLs?.windows?.file ?? "",
            os: OperatingSystem.Windows
        }
    ];

    /**
     * Resolves the selected check sum path based on the downloaded agent's OS.
     */
    const selectedCheckSumPath: string = useMemo(() => {
        return availableOptions.find(
            (option: (AgentDownloadInfoInterface & { os: OperatingSystem })) => option.os === downloadedOS)?.checkSum;
    }, [ downloadedOS ]);

    const {
        data: fetchedCheckSumContent,
        error: checkSumFetchRequestError,
        isLoading: isCheckSumFetchRequestLoading,
        isValidating: isCheckSumFetchRequestValidating
    } = useGetCheckSum(selectedCheckSumPath, !!downloadedOS);

    const checkSum: string = fetchedCheckSumContent?.split(" ")[0] ?? "";

    /**
     * Handles the check sum fetch error.
     */
    useEffect(() => {
        if (checkSumFetchRequestError) {
            dispatch(addAlert({
                description: t("remoteUserStores:notifications.checkSumError.description"),
                level: AlertLevels.SUCCESS,
                message: t("remoteUserStores:notifications.checkSumError.message")
            }));
        }
    }, [ checkSumFetchRequestError ]);

    const onDownloadClicked = (os: OperatingSystem, downloadURL: string) => {
        window.open(downloadURL, "_blank", "noopener, noreferrer");
        setDownloadedOS(os);
    };

    const renderLoadingPlaceholder = () => {
        return (
            <div data-componentid={ `${componentId}-validation-loading-placeholder` }>
                <Skeleton width="50%" />
                <Skeleton />
                <Skeleton />
            </div>
        );
    };

    /**
     * Resolves the verification command based on the downloaded agent's OS.
     * @returns The verification command.
     */
    const getVerificationCommand = () => {
        switch(downloadedOS) {
            case OperatingSystem.Linux:
            case OperatingSystem.LinuxArm:
                return "sha256sum <FILE_PATH>";
            case OperatingSystem.Mac:
                return "shasum -a 256 <FILE_PATH>";
            case OperatingSystem.Windows:
                return "certutil -hashFile <FILE_PATH> SHA256";
            default:
                return "";
        }
    };

    return (
        <div className="download-agent-step">
            <Typography component="p" marginBottom={ 2 }>
                { t("remoteUserStores:pages.edit.guide.steps.download.remote.description") }
            </Typography>
            <Stack direction="row" spacing={ 1 }>
                { availableOptions.map((option: AgentDownloadOptionInterface) => {
                    return (
                        <Button
                            key={ option.os }
                            data-componentid={ `${componentId}-${option.os}-button` }
                            size="small"
                            variant="outlined"
                            startIcon={ <DownloadIcon /> }
                            onClick={ () => onDownloadClicked(option.os, option.file) }
                        >
                            { option.os }
                        </Button>
                    );
                }) }
            </Stack>
            { (isCheckSumFetchRequestLoading || isCheckSumFetchRequestValidating) && renderLoadingPlaceholder() }
            {
                !(isCheckSumFetchRequestLoading || isCheckSumFetchRequestValidating)
                    && !isEmpty(checkSum)
                    && (
                        <>
                            <Heading as="h4">
                                { t("remoteUserStores:pages.edit.guide.steps.download.remote.verification.heading") }
                            </Heading>
                            <Typography component="p" marginBottom={ 1 }>
                                { t("remoteUserStores:pages.edit.guide.steps"
                                    + ".download.remote.verification.description") }
                            </Typography>
                            <List className="verification-steps-list">
                                <ListItem>
                                    <Typography component="p" marginBottom={ 1 }>
                                        <Trans
                                            i18nKey={ "remoteUserStores:pages.edit.guide.steps"
                                                + ".download.remote.verification.step1" }
                                        >
                                            Execute the following command in the command line. Replace the <Code>
                                                FILE_PATH</Code> with the path of the downloaded agent zip file.
                                        </Trans>
                                    </Typography>
                                    <CodeEditor
                                        oneLiner
                                        readOnly
                                        withClipboardCopy
                                        language="shell"
                                        sourceCode={ getVerificationCommand() }
                                    />
                                </ListItem>
                                <ListItem>
                                    <Typography component="p" marginBottom={ 1 }>
                                        { t("remoteUserStores:pages.edit.guide.steps"
                                            + ".download.remote.verification.step2") }
                                    </Typography>
                                    <CodeEditor
                                        oneLiner
                                        readOnly
                                        withClipboardCopy
                                        language="shell"
                                        sourceCode={ checkSum }
                                    />
                                </ListItem>
                            </List>
                        </>
                    )
            }
        </div>
    );
};

export default DownloadAgentStep;
