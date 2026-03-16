function validate() {
    const username = document.concept.username.value;
    const mobile = document.concept.mobile.value;

    const nameerror = document.getElementById("nameerror")
    const mobileerror = document.getElementById("mobileerror")

    const alphaexp = /^[a-zA-Z]+$/
    const numexp = /^[0-9]+$/

    let namestatus = false
    let mobilestatus = false

    if (username === "") {
        nameerror.textContent = ("please enter name")
    }
    else {
        if (username.match(alphaexp)) {
            nameerror.textContent = ""
            namestatus = true;
        }
        else {
            nameerror.textContent = "only charaters"
        }
    }

    if (mobile === "") {
        mobileerror.textContent = ("please enter mobile number")
    }
    else {
        if (mobile.match(numexp)) {
            if (mobile.length === 10) {
                mobileerror.textContent = "plese entry 10 digits"
                mobilestatus = true;

                mobileerror.textContent = ""
                mobilestatus = true;
            }
        }
        else {
            mobileerror.textContent = "mobile number should be only numbers"
        }
    }

    if (namestatus && mobilestatus) {
        return true
    }
    else {
        return false
    }
}

export default validate;