document.addEventListener('DOMContentLoaded', ()=>{
    const userValidationRules = {
        firstName:{
            validator: checkName,
            errorMessage: 'Invalid Name'
        },
        lastName:{
            validator: checkName,
            errorMessage: 'Invalid Name'
        },
        company:{
            validator: checkName,
            errorMessage: 'Invalid Company Name'
        },
        function:{
            validator: checkName,
            errorMessage: 'Invalid title Name'
        },
        country:{
            validator: checkName,
            errorMessage: 'Invalid country Name'
        },
        address:{
            validator: checkString,
            errorMessage: 'Invalid Address'
        },
        about:{
            validator: checkString,
            errorMessage: 'Invalid Address'
        },
        phone:{
            validator: checkPhone,
            errorMessage: 'Invalid Phone Number'
        },
        twitter:{
            validator: checkURL,
            errorMessage: 'Unkown Twitter URL Address'
        },
        facebook:{
            validator: checkURL,
            errorMessage: 'Unkown Facebook Address'
        },
        instagram:{
            validator: checkURL,
            errorMessage: 'Unkown Instagram URL Address'
        },
        linkedin:{
            validator: checkURL,
            errorMessage: 'Unkown Linkedin URL Address'
        },
        file : {
            validator: (file) => checkImage(file),
            errorMessage: 'Invalid image file',
            optional: true
        },
        id:{
            validator: checkString,
        }
    }

    function validateForm(form) {
        const errors = {}
        const field = form.querySelectorAll('input, textarea')
        field.forEach(input=>{
            const errorMessage = validateInput(input)
            if(errorMessage !== true) {
                errors[input.id] = errorMessage
            }
        })
        return errors
    }

    function validateInput(field) {

        const rule = userValidationRules[field.id]
        if(rule && rule.optional) {return true}
        if(field.value.trim() === '') {return 'This field cannot be empty';}
        if(field.id === 'file') {
            return rule.validator(field.files[0])
        } else {
            if(rule && rule.validator(field.value)) {
                return true;
            }
        }
        return rule ? rule.errorMessage : 'Unkown input field'
    }
    const userInfo_form = document.querySelector('#profile-edit-form')
    if(userInfo_form) {
        const field = userInfo_form.querySelectorAll('input, textarea')
        field.forEach((input) => {
            input.addEventListener('blur', ()=>{
                const errorMessage = validateInput(input)
                const lab = document.querySelector(`label[for="${input.id}"]`)
                const div = document.querySelector(`.${input.id}`)
                if(errorMessage !== true) {
                    input.style.borderBottom = '2px solid red'
                    lab.style.color = 'red'
                    div.style.display = 'block'
                    div.textContent = errorMessage
                } else {
                    input.style.color = 'green'
                    input.style.borderBottom = `2px solid green`
                    lab.style.color = 'green'
                    div.style.display = 'none'
                }
            })
            input.addEventListener('keyup', (e)=>{
                if(e.key === 'Enter') {
                    if(input.value !== '') {
                        const errorMessage = validateInput(input)
                        const lab = document.querySelector(`label[for="${input.id}"]`)
                        const div = document.querySelector(`.${input.id}`)
                        if(errorMessage !== true) {
                            input.style.borderBottom = '2px solid red'
                            lab.style.color = 'red'
                            div.style.display = 'block'
                            div.textContent = errorMessage
                        } else {
                            input.style.color = 'green'
                            input.style.borderBottom = `2px solid green`
                            lab.style.color = 'green'
                            div.style.display = 'none'
                        }
                    }
                }
            })
        })
        userInfo_form.addEventListener('submit', async e=>{
            e.preventDefault()
            const errors = validateForm(userInfo_form)
            if(Object.keys(errors).length === 0) {
                const btn = userInfo_form.querySelector('.save-btn')
                const loading_btn = userInfo_form.querySelector('.loading-btn')
                btn.style.display = 'none'
                loading_btn.style.display = 'block'
                let fd = new FormData(userInfo_form) 
                const fileInput = userInfo_form.querySelector('input[type="file"]')
                fd.append('file', fileInput.files[0])
                fd.append('table', 'user')
                fd.append('action', 'Update')
                const res = await fetch('/process', {method: 'POST', body: fd})
                const result = await res.json();
                btn.style.display = 'block'
                loading_btn.style.display = 'none'
                if(result.errors) {
                        const errorDiv = userInfo_form.querySelector('.errors')
                        const successDiv = userInfo_form.querySelector('.success-container')
                        errorDiv.style.display = 'block'
                        errorDiv.innerText = result.errors
                        successDiv.style.display = 'none'
                    } else {
                        const errorDiv = userInfo_form.querySelector('.errors')
                        const successDiv = userInfo_form.querySelector('.success-container')
                        successDiv.style.display = 'block'
                        errorDiv.innerText = 'User information updated successfully'
                        errorDiv.style.display = 'none'
                    }
            }
        })
    }
})