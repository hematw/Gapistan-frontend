
const baseUrl = import.meta.env.VITE_FILES_URL

function getFileURL(filePath) {
    if(filePath && filePath.startsWith("/")) {
        filePath = filePath.slice(1); // Remove leading slash if present
    }   
    return filePath ? baseUrl + filePath : ""
}

export default getFileURL;