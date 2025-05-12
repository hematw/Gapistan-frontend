function getTimeAgo(inputDate) {
    const date = new Date(inputDate);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (isNaN(diff)) return 'Invalid date';

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 29030400) return `${Math.floor(diff / 2419200)} months ago`;

    return `${Math.floor(diff / 29030400)} years ago`;
}

export default getTimeAgo;