// const { checkPassword, checkName } = require("../../app/validattion/validation")

document.addEventListener('DOMContentLoaded', ()=>{
    const validateForm = (form)=>{
        const field = form.querySelectorAll('input')
        field.forEach(element => {
            element.addEventListener('blur', ()=>{
                const lab = form.querySelector(`label[for="${element.id}"]:not(.term)`)
                const div = form.querySelector(`.${element.id}`)
                validateInput(element, lab, div)
            })
            element.addEventListener('keyup', (e)=>{
                if(e.key === 'Enter') {
                    if(element.value !== '') {
                        const lab = form.querySelector(`label[for="${element.id}"]:not(.term)`)
                        const div = form.querySelector(`.${element.id}`)
                        validateInput(element, lab, div)
                    }
                }
            })
        })
    }
    const validateInput = (input, label, errorDiv)=>{
        if(input.id === 'email') {
            if(!checkMail(input.value)) {
                input.style.borderBottom = '2px solid red'
                label.style.color = 'red'
                errorDiv.style.display = 'block'
                errorDiv.textContent = 'Invalid email address'
            } else {
                input.style.color = 'green'
                input.style.borderBottom = `2px solid green`
                label.style.color = 'green'
                errorDiv.style.display = 'none'
            }
        } else if(input.id === 'password') {
            if(!checkPassword(input.value)) {
                input.style.borderBottom = '2px solid red'
                label.style.color = 'red'
                errorDiv.style.display = 'block'
                errorDiv.innerText = `Password must be at least 8 characters\nThe password must not be null \nContain at least 1 uppercase`
            } else {
                input.style.color = 'green'
                input.style.borderBottom = `2px solid green`
                label.style.color = 'green'
                errorDiv.style.display = 'none'
            }
        } else if(input.id === 'address'){
            if(!checkString(input.value)) {
                input.style.borderBottom = '2px solid red'
                label.style.color = 'red'
                errorDiv.style.display = 'block'
                errorDiv.innerText = `Invalid Address`
            } else {
                input.style.color = 'green'
                input.style.borderBottom = `2px solid green`
                label.style.color = 'green'
                errorDiv.style.display = 'none'
            }
        } else if(input.id === 'phone'){
            if(!checkPhone(input.value)) {
                input.style.borderBottom = '2px solid red'
                label.style.color = 'red'
                errorDiv.style.display = 'block'
                errorDiv.innerText = `Invalid Phone Number`
            } else {
                input.style.color = 'green'
                input.style.borderBottom = `2px solid green`
                label.style.color = 'green'
                errorDiv.style.display = 'none'
            }
        } else if(input.id === 'twitter' || input.id === 'facebook' || input.id === 'instagram' || input.id === 'linkedin'){
            if(!checkURL(input.value)) {
                input.style.borderBottom = '2px solid red'
                label.style.color = 'red'
                errorDiv.style.display = 'block'
                errorDiv.innerText = `Invalid Url address`
            } else {
                input.style.color = 'green'
                input.style.borderBottom = `2px solid green`
                label.style.color = 'green'
                errorDiv.style.display = 'none'
            }
        } else {
            if(!checkName(input.value)) {
                input.style.borderBottom = '2px solid red'
                label.style.color = 'red'
                errorDiv.style.display = 'block'
                errorDiv.innerText = 'Invalid email address'
            } else {
                input.style.color = 'green'
                input.style.borderBottom = `2px solid green`
                if(label)  label.style.color = 'green'
                errorDiv.style.display = 'none'
            }
        }
    }
    const loginForm = document.querySelector('#login-form')
    if(loginForm) {        
        const field = loginForm.querySelectorAll('input')
        field.forEach(element => {
            element.addEventListener('blur', ()=>{
                const lab = loginForm.querySelector(`label[for="${element.id}"]`)
                const div = loginForm.querySelector(`.${element.id}`)
                validateInput(element, lab, div)
            })
             element.addEventListener('keyup', (e)=>{
                if(e.key === 'Enter') {
                    if(element.value !== '') {
                        const lab = loginForm.querySelector(`label[for="${element.id}"]`)
                        const div = loginForm.querySelector(`.${element.id}`)
                        validateInput(element, lab, div)
                    }
                }
            })
        })
        loginForm.addEventListener('submit',async e=>{
            e.preventDefault();
            const errorDiv = document.querySelector('.errors')
            const loadingBtn = loginForm.querySelector('.loading-btn')
            const loginBtn = loginForm.querySelector('#login-btn')
            if(checkMail(loginForm.email.value) && checkPassword(loginForm.password.value)) {
                loginBtn.style.display = 'none'
                loadingBtn.style.display = 'block'
                await login(loginForm.email, loginForm.password, errorDiv, loginBtn, loadingBtn)
            }
        })
  
    }
    const registrationForm = document.querySelector('#register')
    if(registrationForm) {
        const field = registrationForm.querySelectorAll('input')
        field.forEach(element => {
            element.addEventListener('blur', ()=>{
                const lab = registrationForm.querySelector(`label[for="${element.id}"]:not(.term)`)
                const div = registrationForm.querySelector(`.${element.id}`)
                validateInput(element, lab, div)
            })
            element.addEventListener('keyup', (e)=>{
                if(e.key === 'Enter') {
                    if(element.value !== '') {
                        const lab = registrationForm.querySelector(`label[for="${element.id}"]:not(.term)`)
                        const div = registrationForm.querySelector(`.${element.id}`)
                        validateInput(element, lab, div)
                    }
                }
            })
        })
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const errorDiv = document.querySelector('.errors')
            const loadingBtn = registrationForm.querySelector('.loading-btn')
            const loginBtn = registrationForm.querySelector('#register-btn')
            if(checkName(registrationForm.name.value) && checkMail(registrationForm.email.value) 
                && checkPassword(registrationForm.password.value)) {
                const checkbox = registrationForm.querySelector('#term')
                const label = registrationForm.querySelector(`label[for="${checkbox.id}"]`)
                const a = registrationForm.querySelector(`label[for="${checkbox.id}"] a`)
                label.style.display = 'block'
                if(checkbox.checked) {
                    checkbox.style.border = '1px solid green'
                    label.style.color = 'green'
                    a.style.color = 'green'
                    loginBtn.style.display = 'none'
                    loadingBtn.style.display = 'block'
                    await register(registrationForm.name, registrationForm.email, registrationForm.password, errorDiv, loginBtn, loadingBtn)
                } else {                    
                    checkbox.style.border = '1px solid red'
                    label.style.color = 'red'
                    a.style.color = 'red'
                }
            }
        })
    }
})