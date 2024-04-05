import { aiNS } from "../../../models";

export const ai: aiNS = {

    banner:{
        full:{
            heading: "Configure your login flow with ease, try our new Login AI",
            subheading1: "Create your login sequence effortlessly wiht our intuitive AI.",
            subheading2: "Enjoy simple and hassle-free configuration experience.",
            button: "Try Login AI"
        },
        input:{
            heading: "Generate your login flow with a single click using Login AI",
            subheading: "Generating tailored login flows is now easier than ever with AI powered login flow generation. ",
            placeholder: "Enter your required login flow here",
            button: "Generate Login Flow"
        },
        collapsed:{
            heading: "Craft your login flow effortlessly with Login AI",
            subheading: "Simple and effortless login flow configuration experience.",
            button: "Try Login AI"
        }

    },
    screens:{
        loading:{
            heading: "Generating your login flow",
            facts:{
                0:"Fact 1",
                1:"Fact 2",
                2:"Fact 3"
            },
            states:{
                0: "Initalizing.....",
                1: "Optimizing your input.....",
                2: "Optimization complete.....",
                3: "Retrieving data from vector database.....",
                4: "Data retrieval complete.....",
                5: "Generating login flow script.....",
                6: "Login flow script generation complete.....",
                7: "Generating login flow authentication steps.....",
                8: "Login flow authentication steps generation complete.....",
                9: "Optimizing final output.....",
                10: "Login flow generation complete.....",
            }
        }
    }
}
