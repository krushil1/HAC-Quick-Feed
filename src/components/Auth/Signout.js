function Signout() {
    localStorage.clear();
    window.location.href = "/"; 
    return null;
}

export default Signout