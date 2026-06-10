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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetPushAuthRegisteredDevices from "./use-get-push-auth-registered-devices";
import {
    deletePushAuthRegisteredDevice,
    getConfigPreferences,
    initPushAuthenticatorQRCode
} from "../api/multi-factor-push";
import { AlertLevels } from "../models/alert";
import { HttpResponse } from "../models/api";
import { PushAuthenticatorConstants } from "../constants/mfa-constants";
import {
    ConfigPreferenceResponseInterface,
    PushDeviceMgtConfigInterface
} from "../models/push-authenticator";
import { addAlert } from "../store/actions/global";

/**
 * Custom hook to handle the component state and behaviour of {@Link PushAuthenticator} component
 */
const usePushAuthenticator = () => {
    const {
        data: registeredDeviceList,
        isLoading: isRegisteredDeviceListLoading,
        error: registeredDeviceListFetchError,
        mutate: updateRegisteredDeviceList
    } = useGetPushAuthRegisteredDevices();

    const dispatch: Dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isConfigPushAuthenticatorModalOpen, setIsConfigPushAuthenticatorModalOpen ] = useState<boolean>(false);
    const [ qrCode, setQrCode ] = useState<string>(null);
    const [ isPushDeviceMgtConfigLoading, setIsPushDeviceMgtConfigLoading ] = useState<boolean>(false);
    const [ pushDeviceMgtConfig, setPushDeviceMgtConfig ] = useState<PushDeviceMgtConfigInterface>(null);

    const { t } = useTranslation();

    const translateKey: string = "myAccount:components.mfa.pushAuthenticatorApp.";

    const isMultipleDeviceEnrollmentEnabled: boolean =
        pushDeviceMgtConfig?.enableMultipleDeviceEnrollment ?? false;

    const deviceLimit: number = isMultipleDeviceEnrollmentEnabled
        ? (pushDeviceMgtConfig?.maximumDeviceLimit ?? 1)
        : 1;

    const isDeviceLimitReached: boolean = (registeredDeviceList?.length ?? 0) >= deviceLimit;

    useEffect(() => {
        setIsPushDeviceMgtConfigLoading(true);

        getConfigPreferences([
            {
                attributeNames: [
                    PushAuthenticatorConstants.PROPERTY_ENABLE_MULTIPLE_DEVICE_ENROLLMENT,
                    PushAuthenticatorConstants.PROPERTY_MAXIMUM_DEVICE_LIMIT
                ],
                resourceName: PushAuthenticatorConstants.DEVICE_MGT_RESOURCE_NAME,
                resourceType: PushAuthenticatorConstants.RESOURCE_TYPE
            }
        ])
            .then((response: ConfigPreferenceResponseInterface[]) => {
                const resource: ConfigPreferenceResponseInterface | undefined = response?.find(
                    (item: ConfigPreferenceResponseInterface) =>
                        item.resourceType === PushAuthenticatorConstants.RESOURCE_TYPE &&
                        item.resourceName === PushAuthenticatorConstants.DEVICE_MGT_RESOURCE_NAME
                );

                if (resource) {
                    const getValue = (name: string): string | undefined =>
                        resource.attributeNames.find((p) => p.name === name)?.value;

                    setPushDeviceMgtConfig({
                        enableMultipleDeviceEnrollment:
                            getValue(PushAuthenticatorConstants.PROPERTY_ENABLE_MULTIPLE_DEVICE_ENROLLMENT) === "true",
                        maximumDeviceLimit: parseInt(
                            getValue(PushAuthenticatorConstants.PROPERTY_MAXIMUM_DEVICE_LIMIT) ?? "1", 10
                        )
                    });
                }
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t(translateKey + "notifications.configFetchError.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.configFetchError.genericError.message")
                }));
            })
            .finally(() => {
                setIsPushDeviceMgtConfigLoading(false);
            });
    }, []);

    useEffect(() => {
        if (registeredDeviceListFetchError && !isRegisteredDeviceListLoading) {
            dispatch(addAlert({
                description: t(translateKey + "notifications.deviceListFetchError.error.description"),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.deviceListFetchError.error.message")
            }));
        }
    }, [ isRegisteredDeviceListLoading, registeredDeviceListFetchError ]);

    /**
     * Initiate the push authenticator configuration flow.
     */
    const initPushAuthenticatorRegFlow = (): void => {
        if (isDeviceLimitReached) {
            return;
        }

        setIsLoading(true);

        initPushAuthenticatorQRCode()
            .then((response: any) => {
                const qrCode: string = JSON.stringify(response?.data);

                setIsConfigPushAuthenticatorModalOpen(true);
                setQrCode(qrCode);
            })
            .catch((_error: any) => {
                dispatch(addAlert({
                    description: t(translateKey + "notifications.initError.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t(translateKey + "notifications.initError.genericError.message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Handle cancelling push authenticator configuration flow.
     */
    const handlePushAuthenticatorInitCancel = () => {
        setIsConfigPushAuthenticatorModalOpen(false);
        setQrCode(null);
    };

    /**
     * Handle Push Authenticator configuration flow.
     *
     * @param event - Form submit event.
     * @param isRegenerated - Whether the push authenticator QR code is regenerated or not.
     */
    const handlePushAuthenticatorSetupSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        updateRegisteredDeviceList();
        setQrCode(null);
    };

    /**
     * Delete a device registered for push authentication.
     *
     * @param deviceId - unique id of the registered device
     */
    const deleteRegisteredDevice = (deviceId: string): void => {
        setIsLoading(true);
        deletePushAuthRegisteredDevice(deviceId).then(
            (_res: HttpResponse) => {
                updateRegisteredDeviceList();
                dispatch(addAlert({
                    description: t(translateKey + "notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t(translateKey + "notifications.delete.success.message")
                }));
            }
        ).catch((_err: any) => {
            dispatch(addAlert({
                description: t(translateKey + "notifications.delete.genericError.description"),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.delete.genericError.message")
            }));
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return {
        deleteRegisteredDevice,
        deviceLimit,
        handlePushAuthenticatorInitCancel,
        handlePushAuthenticatorSetupSubmit,
        initPushAuthenticatorRegFlow,
        isConfigPushAuthenticatorModalOpen,
        isDeviceLimitReached,
        isLoading,
        isPushDeviceMgtConfigLoading,
        isMultipleDeviceEnrollmentEnabled,
        isRegisteredDeviceListLoading,
        qrCode,
        registeredDeviceList,
        setIsConfigPushAuthenticatorModalOpen,
        translateKey
    };
};

export default usePushAuthenticator;
