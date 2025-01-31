import { API } from "./config";

async function postApi(path,body){
        const response = await fetch(`${API}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response}`);
        // }
        const result = await response;
        // console.log('Data posted successfully:', result);
        return result; // Return the parsed result
}
export default postApi;

