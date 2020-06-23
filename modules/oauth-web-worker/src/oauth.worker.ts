/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import {
	API_CALL,
	API_CALL_ALL,
	AUTH_CODE,
	AUTH_REQUIRED,
	CUSTOM_GRANT,
	INIT,
	LOGOUT,
	REVOKE_TOKEN,
	SIGNED_IN,
	SIGN_IN
} from "./constants";
import { OAuthWorker as OAuthWorkerClass, OAuthWorkerInterface, SignInResponse } from "./models";
import { OAuthWorker } from "./oauth-worker";

const ctx: OAuthWorkerClass<any> = self as any;

let oAuthWorker: OAuthWorkerInterface;

ctx.onmessage = ({ data, ports }) => {
	const port = ports[0];

	switch (data.type) {
		case INIT:
			try {
				oAuthWorker = OAuthWorker.getInstance(data.data);
				port.postMessage({ success: true });
			} catch (error) {
				port.postMessage({
					error: error,
					success: false
				});
			}

			break;
		case SIGN_IN:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});
			} else if (oAuthWorker.doesTokenExist()) {
				port.postMessage({
					data: {
						data: oAuthWorker.getUserInfo(),
						type: SIGNED_IN
					},
					success: true
				});
			} else {
				oAuthWorker
					.initOPConfiguration()
					.then(() => {
						oAuthWorker
							.sendSignInRequest()
							.then((response: SignInResponse) => {
								if (response.type === SIGNED_IN) {
									port.postMessage({
										data: {
											data: response.data,
											type: SIGNED_IN
										},
										success: true
									});
								} else {
									port.postMessage({
										data: {
											code: response.code,
											pkce: response.pkce,
											type: AUTH_REQUIRED
										},
										success: true
									});
								}
							})
							.catch((error) => {
								port.postMessage({
									error: error,
									success: false
								});
							});
					})
					.catch((error) => {
						port.postMessage({
							error: error,
							success: false
						});
					});
			}

			break;
		case AUTH_CODE:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});

				break;
			}

			oAuthWorker.setAuthorizationCode(data.data.code);

			if (data.data.pkce) {
				oAuthWorker.setPkceCodeVerifier(data.data.pkce);
			}
			oAuthWorker
				.initOPConfiguration()
				.then(() => {
					oAuthWorker
						.sendSignInRequest()
						.then((response: SignInResponse) => {
							if (response.type === SIGNED_IN) {
								port.postMessage({
									data: {
										data: response.data,
										type: SIGNED_IN
									},
									success: true
								});
							} else {
								port.postMessage({
									data: {
										code: response.code,
										pkce: response.pkce,
										type: AUTH_REQUIRED
									},
									success: true
								});
							}
						})
						.catch((error) => {
							port.postMessage({
								error: error,
								success: false
							});
						});
				})
				.catch((error) => {
					port.postMessage({
						error: error,
						success: false
					});
				});

			break;
		case API_CALL:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});

				break;
			}

			if (!oAuthWorker.isSignedIn()) {
				port.postMessage({
					error: "You have not signed in yet.",
					success: false
				});
			} else {
				oAuthWorker
					.httpRequest(data.data)
					.then((response) => {
						port.postMessage({
							data: {
								data: response.data,
								headers: response.headers,
								status: response.status,
								statusText: response.statusText
							},
							success: true
						});
					})
					.catch((error) => {
						port.postMessage({
							error: error,
							success: false
						});
					});
			}

			break;
		case API_CALL_ALL:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});

				break;
			}

			if (!oAuthWorker.isSignedIn()) {
				port.postMessage({
					error: "You have not signed in yet.",
					success: false
				});
			} else {
				oAuthWorker
					.httpRequestAll(data.data)
					.then((response) => {
						port.postMessage({
							data: response.map((value) => ({
								data: value.data,
								headers: value.headers,
								status: value.status,
								statusText: value.statusText
							})),
							success: true
						});
					})
					.catch((error) => {
						port.postMessage({
							error: error,
							success: false
						});
					});
			}

			break;
		case LOGOUT:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});

				break;
			}

			if (!oAuthWorker.isSignedIn()) {
				port.postMessage({
					error: "You have not signed in yet.",
					success: false
				});
			} else {
				oAuthWorker
					.signOut()
					.then((response) => {
						if (response) {
							port.postMessage({
								data: response,
								success: true
							});
						} else {
							port.postMessage({
								error: "Received no response",
								success: false
							});
						}
					})
					.catch((error) => {
						port.postMessage({
							error: error,
							success: false
						});
					});
			}

			break;
		case CUSTOM_GRANT:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});

				break;
			}

			if (!oAuthWorker.isSignedIn() && data.data.signInRequired) {
				port.postMessage({
					error: "You have not signed in yet.",
					success: false
				});

				break;
			}

			oAuthWorker
				.customGrant(data.data)
				.then((response) => {
					port.postMessage({
						data: response,
						success: true
					});
				})
				.catch((error) => {
					port.postMessage({
						error: error,
						success: false
					});
				});

			break;
		case REVOKE_TOKEN:
			if (!oAuthWorker) {
				port.postMessage({
					error: "Worker has not been initiated.",
					success: false
				});

				break;
			}

			if (!oAuthWorker.isSignedIn() && data.data.signInRequired) {
				port.postMessage({
					error: "You have not signed in yet.",
					success: false
				});

				break;
			}

			oAuthWorker
				.revokeToken()
				.then((response) => {
					port.postMessage({
						data: response,
						success: true
					});
				})
				.catch((error) => {
					port.postMessage({
						error: error,
						success: false
					});
				});
			break;
		default:
			port.postMessage({ error: `Unknown message type ${data?.type}`, success: false });
	}
};

export default {} as typeof Worker & { new (): Worker };
