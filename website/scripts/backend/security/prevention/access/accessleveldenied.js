function accessLevelDenied(req, res) {
    console.log("[Prevention Module]: Preventing access to due to insufficient access level. CLIENT ERROR 0403.1");
    window.location.href = "pages/errors/0 Error Class/0403.1.html";
}

export { accessLevelDenied };