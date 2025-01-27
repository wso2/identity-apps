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
import { deletePushAuthRegisteredDevice, initPushAuthenticatorQRCode } from "../api/multi-factor-push";
import { AlertLevels } from "../models/alert";
import { HttpResponse } from "../models/api";
import { addAlert } from "../store/actions/global";

/**
 * Custom hook to handle the component state and behaviour of {@Link PushAuthenticator} component
 */
const usePushAuthenticator = () => {
    const {
        data: registeredDeviceList,
        isLoading:isRegisteredDeviceListLoading,
        error: registeredDeviceListFetchError,
        mutate: updateRegisteredDeviceList
    } = useGetPushAuthRegisteredDevices();

    const dispatch: Dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isConfigPushAuthenticatorModalOpen, setIsConfigPushAuthenticatorModalOpen ] = useState<boolean>(false);
    const [ qrCode, setQrCode ] = useState<string>(null);

    const { t } = useTranslation();

    const translateKey: string = "myAccount:components.mfa.pushAuthenticatorApp.";

    useEffect(() => {
        if (registeredDeviceListFetchError && !isRegisteredDeviceListLoading) {
            dispatch(addAlert({
                description: t(translateKey +
                    "notifications.deviceListFetchError.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.deviceListFetchError.error.message")
            }));
        }
    }, [ isRegisteredDeviceListLoading, registeredDeviceListFetchError ]);

    /**
     * Initiate the push authenticator configuration flow.
     */
    const initPushAuthenticatorRegFlow = () => {
        setIsLoading(true);

        initPushAuthenticatorQRCode()
            .then((response: any) => {
                const qrCode: string = window.btoa(JSON.stringify(response?.data));

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
        // setIsConfigPushAuthenticatorModalOpen(false);
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
                description: t(translateKey + "notifications.deleteError.genericError.description"),
                level: AlertLevels.ERROR,
                message: t(translateKey + "notifications.deleteError.genericError.message")
            }));
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return {
        deleteRegisteredDevice,
        handlePushAuthenticatorInitCancel,
        handlePushAuthenticatorSetupSubmit,
        initPushAuthenticatorRegFlow,
        isConfigPushAuthenticatorModalOpen,
        isLoading,
        isRegisteredDeviceListLoading,
        qrCode,
        registeredDeviceList,
        setIsConfigPushAuthenticatorModalOpen,
        translateKey
    };
};

export default usePushAuthenticator;
