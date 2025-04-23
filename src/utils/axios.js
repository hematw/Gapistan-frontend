import axios from "axios";

const axiosIns = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
    },
    withCredentials: true,
});

axiosIns.interceptors.response.use((response) => {
    if (response.status === 401) {
        localStorage.removeItem("token")
        window.location.href = "/login"
        return response
    }
    return response
}, (err) => {
    return Promise.reject(err)
})

export default axiosIns;