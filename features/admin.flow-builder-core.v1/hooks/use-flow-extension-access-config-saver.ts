/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Node } from "@xyflow/react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import updateFlowExtensionAccessConfig from "../api/update-flow-extension-access-config";
import { FlowExtensionAccessConfigInterface } from "../models/flow-extension-access";

/**
 * The part of a step's data that names the flow extension it runs.
 */
interface FlowExtensionStepDataInterface {
    action?: {
        executor?: {
            meta?: {
                actionId?: string;
            };
        };
    };
}

/**
 * What {@link useFlowExtensionAccessConfigSaver} gives the flow builder.
 */
export interface UseFlowExtensionAccessConfigSaverReturnInterface {
    /**
     * Access configs of the flow extensions changed in this flow, by extension ID.
     */
    flowExtensionAccessConfigs: Record<string, FlowExtensionAccessConfigInterface>;
    /**
     * Increases each time the flow extensions are saved, so their views reload them.
     */
    flowExtensionsSavedVersion: number;
    /**
     * Whether the access configs are locked, as while the flow and they are being saved.
     */
    isFlowExtensionAccessLocked: boolean;
    setFlowExtensionAccessConfig: (extensionId: string, accessConfig: FlowExtensionAccessConfigInterface) => void;
    setIsFlowExtensionAccessLocked: (locked: boolean) => void;
    /**
     * Saves the changed access configs of the flow extensions the flow still uses.
     *
     * @returns Whether every one was saved.
     */
    saveFlowExtensionAccessConfigs: () => Promise<boolean>;
}

const getFlowExtensionId = (node: Node): string | undefined =>
    (node?.data as FlowExtensionStepDataInterface)?.action?.executor?.meta?.actionId;

/**
 * Hook that keeps the access configs of the flow extensions changed in the flow builder, and saves them after the
 * flow is saved.
 *
 * @param getNodes - Gives the nodes of the flow, to find the flow extensions its steps still use.
 * @returns The changed access configs, and how to change, lock and save them.
 */
const useFlowExtensionAccessConfigSaver = (
    getNodes: () => Node[]
): UseFlowExtensionAccessConfigSaverReturnInterface => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ flowExtensionAccessConfigs, setFlowExtensionAccessConfigs ] = useState<
        Record<string, FlowExtensionAccessConfigInterface>
    >({});
    const [ flowExtensionsSavedVersion, setFlowExtensionsSavedVersion ] = useState<number>(0);
    const [ isFlowExtensionAccessLocked, setIsFlowExtensionAccessLocked ] = useState<boolean>(false);

    const setFlowExtensionAccessConfig: (
        extensionId: string,
        accessConfig: FlowExtensionAccessConfigInterface
    ) => void = useCallback((extensionId: string, accessConfig: FlowExtensionAccessConfigInterface): void => {
        setFlowExtensionAccessConfigs((previous: Record<string, FlowExtensionAccessConfigInterface>) => ({
            ...previous,
            [ extensionId ]: accessConfig
        }));
    }, []);

    /**
     * Save the changed access configs of the flow extensions, after the flow is saved. A flow extension no step of
     * the flow uses any more is skipped, as its change was made for a step that is gone.
     */
    const saveFlowExtensionAccessConfigs: () => Promise<boolean> = useCallback(async (): Promise<boolean> => {
        const usedExtensionIds: Set<string> = new Set((getNodes() ?? []).map(getFlowExtensionId).filter(Boolean));
        const changed: [ string, FlowExtensionAccessConfigInterface ][] = Object.entries(flowExtensionAccessConfigs)
            .filter(([ extensionId ]: [ string, FlowExtensionAccessConfigInterface ]) =>
                usedExtensionIds.has(extensionId));

        if (changed.length === 0) {
            return true;
        }

        const failed: string[] = [];

        await Promise.all(changed.map(
            async ([ extensionId, accessConfig ]: [ string, FlowExtensionAccessConfigInterface ]): Promise<void> => {
                try {
                    await updateFlowExtensionAccessConfig(extensionId, accessConfig);
                } catch (error) {
                    failed.push(extensionId);
                }
            }
        ));

        const sent: Map<string, FlowExtensionAccessConfigInterface> = new Map(changed);

        // Keep the ones that failed, so the next save tries them again, and the ones changed while saving, if the
        // flow still uses them.
        setFlowExtensionAccessConfigs((previous: Record<string, FlowExtensionAccessConfigInterface>) =>
            Object.fromEntries(Object.entries(previous).filter(
                ([ extensionId, accessConfig ]: [ string, FlowExtensionAccessConfigInterface ]) =>
                    failed.includes(extensionId)
                    || (usedExtensionIds.has(extensionId) && sent.get(extensionId) !== accessConfig)
            )));
        setFlowExtensionsSavedVersion((version: number) => version + 1);

        if (failed.length > 0) {
            dispatch(
                addAlert({
                    description: t("flowExtension:properties.accessConfig.notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:properties.accessConfig.notifications.updateError.message")
                })
            );
        }

        return failed.length === 0;
    }, [ flowExtensionAccessConfigs, getNodes, dispatch, t ]);

    return {
        flowExtensionAccessConfigs,
        flowExtensionsSavedVersion,
        isFlowExtensionAccessLocked,
        saveFlowExtensionAccessConfigs,
        setFlowExtensionAccessConfig,
        setIsFlowExtensionAccessLocked
    };
};

export default useFlowExtensionAccessConfigSaver;
