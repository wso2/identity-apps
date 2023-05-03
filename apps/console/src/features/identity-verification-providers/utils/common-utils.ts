import { AxiosError } from "axios";

export const handleIDPDeleteError = (error: AxiosError) => {
    console.log(error);
};
