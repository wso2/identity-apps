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
                heading: "Craft your login flow effortlessly with Login AI",
                subheading: "Simple and effortless login flow configuration experience."
            },
            full:{
                button: "Try Login AI",
                heading: "Configure your login flow with ease, try our new Login AI",
                subheading1: "Create your login sequence effortlessly wiht our intuitive AI.",
                subheading2: "Enjoy simple and hassle-free configuration experience."
            },
            input:{
                button: "Generate Login Flow",
                heading: "Generate your login flow with a single click using Login AI",
                placeholder: "Enter your required login flow here",
                subheading:
                "Generating tailored login flows is now easier than ever with AI powered login flow generation. "
            }
        },
        screens:{
            loading:{
                facts:{
                    0:"Fact 1",
                    1:"Fact 2",
                    2:"Fact 3"
                },
                heading: "Generating your login flow",
                states:{
                    0: "Initalizing.....",
                    1: "Optimizing your input.....",
                    10: "Login flow generation complete.....",
                    2: "Optimization complete.....",
                    3: "Retrieving data from vector database.....",
                    4: "Data retrieval complete.....",
                    5: "Generating login flow script.....",
                    6: "Login flow script generation complete.....",
                    7: "Generating login flow authentication steps.....",
                    8: "Login flow authentication steps generation complete.....",
                    9: "Optimizing final output....."
                }
            }
        }

    }
};
