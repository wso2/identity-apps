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
import { aiNS } from "../../../models";

export const ai: aiNS = {

    aiLoginFlow:{
        banner:{
            collapsed:{
                button: "Try Login AI",
                heading: "Configure login flow with Login AI",
                subheading: "Simple and effortless login flow configuration experience."
            },
            full:{
                button: "Try Login AI",
                heading: "Generate your login flow with a single click using Login AI",
                subheading1: "Create your login sequence effortlessly with our intuitive AI.",
                subheading2: "Enjoy simple and hassle-free configuration experience."
            },
            input:{
                button: "Generate Login Flow",
                heading: "Configure login flow with Login AI",
                placeholder: "Example prompt:  Users should be prompted with a username-password login. " +
                "Once they successfully login, I want the system to check if they belong to either the 'manager' " +
                "or 'employee' group. If they're not part of any of these groups, I need them to be redirected to " +
                "an error page with an error message",
                subheading:
                "Simple and effortless login flow configuration experience."
            }
        },
        screens:{
            loading:{
                facts:{
                    0:"WSO2 Adaptive Authentication supports adaptive multi-factor authentication," +
                    " allowing organizations to dynamically adjust the level of authentication required based" +
                    " on risk factors such as user location, device, and behavior.",
                    1:"WSO2 Adaptive Authentication seamlessly integrates with various identity providers,"+
                    " allowing organizations to leverage existing authentication mechanisms while"+
                    " enhancing security with adaptive capabilities.",
                    2:"WSO2 Adaptive Authentication features a flexible policy engine that enables organizations"+
                    " to define custom authentication policies based on their specific security requirements and"+
                    " regulatory compliance needs."
                },
                heading: "Generating your login flow",
                states:{
                    0: "Initalizing.....",
                    1: "Optimizing your input.....",
                    10: "Login Flow Generated Successfully",
                    2: "Optimizing your input.....",
                    3: "Gathering data.....",
                    4: "Gathering data.....",
                    5: "Generating login flow started.....",
                    6: "Generating login flow in progress.....",
                    7: "Generating login flow in progress.....",
                    8: "Generating login flow completed.....",
                    9: "Optimizing final output....."
                }
            }
        }

    }
};
