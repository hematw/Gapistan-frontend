
const baseUrl = import.meta.env.VITE_FILES_URL

function getFileURL(filePath) {
    return filePath ? baseUrl + filePath : ""
}

export default getFileURL;