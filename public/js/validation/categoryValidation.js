document.addEventListener('DOMContentLoaded', ()=>{
    const categoryRules = {
        name:{
            validator: checkName,
            errorMessage: 'Invalid Name'
        }
    }
    

    function validateForm(form) {
        const errors = {}
        const field = form.querySelectorAll('input')
        field.forEach(input=>{
            const errorMessage = validateInput(input)
            if(errorMessage !== true) {
                errors[input.id] = errorMessage
            }
        })
        return errors
    }

    function validateInput(field) {

        const rule = categoryRules[field.id]
        if(rule && rule.optional) {return true}
        if(field.value.trim() === '') {return 'This field cannot be empty';}
        if(rule && rule.validator(field.value)) {
            return true;
        }
        return rule ? rule.errorMessage : 'Unkown input field'
    }

    const categoryForm = document.querySelector('#new-category-form')
    if(categoryForm) {
        const field = categoryForm.querySelectorAll('input')
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
            categoryForm.addEventListener('submit', async e=>{
                e.preventDefault()
                const errors = validateForm(categoryForm)
                if(Object.keys(errors).length === 0) {
                    const btn = categoryForm.querySelector('#new-category-btn')
                    const loading_btn = categoryForm.querySelector('.loading-btn')
                    btn.style.display = 'none'
                    loading_btn.style.display = 'block'
                    let fd = new FormData(categoryForm) 
                    fd.append('table', 'category')
                    fd.append('action', 'add')
                     const res = await fetch('/process', {method: 'POST', body: fd})
                    const result = await res.json();
                    btn.style.display = 'block'
                    loading_btn.style.display = 'none'
                    if(result.errors) {
                        const errorDiv = categoryForm.querySelector('.errors')
                        const successDiv = categoryForm.querySelector('.success-container')
                        errorDiv.style.display = 'block'
                        errorDiv.innerText = result.errors
                        successDiv.style.display = 'none'
                    } else {
                        const errorDiv = categoryForm.querySelector('.errors')
                        const successDiv = categoryForm.querySelector('.success-container')
                        successDiv.style.display = 'block'
                        successDiv.innerText = 'New category added successfully'
                        errorDiv.style.display = 'none'
                        categoryForm.reset()
                    }
                }
            })
        })
    }


})