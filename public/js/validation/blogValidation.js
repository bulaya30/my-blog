document.addEventListener('DOMContentLoaded', ()=>{
    const categoryRules = {
        title:{
            validator: checkName,
            errorMessage: 'Invalid Blog Title'
        },
        author:{
            validator: checkName,
            errorMessage: 'Invalid Author'
        },
        category:{
            validator: checkName,
            errorMessage: 'Invalid category Name'
        },
        content:{
            validator: checkString,
            errorMessage: 'Invalid Blog contents'
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

    const blogForm = document.querySelector('#new-blog-form')
    if(blogForm) {
        const inputs = blogForm.querySelectorAll('input, select, textarea')
        inputs.forEach((input) =>{
            input.addEventListener('blur', ()=>{
                const errorMessage = validateInput(input)
                const lab = document.querySelector(`label[for="${input.id}"]`)
                const div = document.querySelector(`.${input.id}`)
                if(errorMessage !== true) {
                    input.style.borderBottom = '2px solid red'
                    input.style.color = 'red'
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
                            input.style.color = 'red'
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
            // blogForm.addEventListener('submit', async (e)=>{
                // e.preventDefault()
                // console.log('new blog form')
                // const errors = validateForm(blogForm)
                // if(Object.keys(errors).length === 0) {
                //     const contents = tinymce.get('content').getContent().trim();
                //     if(contents === '') {
                //         tinymce.get('content').getContainer().style.border = '2px solid red'
                //     } else {
                //         tinymce.get('content').getContainer().style.border = ''
                //         const btn = blogForm.querySelector('#new-article-btn')
                //         const loading_btn = blogForm.querySelector('.loading-btn')
                //         btn.style.display = 'none'
                //         loading_btn.style.display = 'block'
                //         let fd = new FormData() 
                //         fd.append('title', blogForm.title.value)
                //         fd.append('author', blogForm.author.value)
                //         fd.append('category', blogForm.category.value)
                //         fd.append('contents', contents)
                //         fd.append('table', 'blog')
                //         fd.append('action', 'add')
                //         // const res = await fetch('/process', {method: 'POST', body: fd})
                //         // const result = await res.json();
                //         btn.style.display = 'block'
                //         loading_btn.style.display = 'none'
                //         // console.log('Okay.....')
                //     }
                //     // console.log(fd)
                // }
            // })
        })
        blogForm.addEventListener('submit', async e => {
            e.preventDefault()
            const errors = validateForm(blogForm)
            if(Object.keys(errors).length === 0) { 
                const contents = tinymce.get('content').getContent().trim();
                  if(contents === '') {
                    tinymce.get('content').getContainer().style.border = '2px solid red'
                } else {
                    tinymce.get('content').getContainer().style.border = ''
                    const btn = blogForm.querySelector('#new-article-btn')
                    const loading_btn = blogForm.querySelector('.loading-btn')
                    btn.style.display = 'none'
                    loading_btn.style.display = 'block'
                    let fd = new FormData() 
                    fd.append('title', blogForm.title.value)
                    fd.append('author', blogForm.author.value)
                    fd.append('category', blogForm.category.value)
                    fd.append('contents', contents)
                    fd.append('table', 'blog')
                    fd.append('action', 'add')
                    const res = await fetch('/process', {method: 'POST', body: fd})
                    const result = await res.json();
                    btn.style.display = 'block'
                    loading_btn.style.display = 'none'
                    if(result.errors) {
                        const errorDiv = blogForm.querySelector('.errors')
                        const successDiv = blogForm.querySelector('.success-container')
                        errorDiv.style.display = 'block'
                        errorDiv.innerText = result.errors
                        successDiv.style.display = 'none'
                    } else {
                        const errorDiv = blogForm.querySelector('.errors')
                        const successDiv = blogForm.querySelector('.success-container')
                        successDiv.style.display = 'block'
                        errorDiv.innerText = 'New blog added successfully'
                        errorDiv.style.display = 'none'
                        blogForm.reset()
                    }
                }
            }
        })
    }
})