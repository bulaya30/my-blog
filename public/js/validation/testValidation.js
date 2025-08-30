document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.querySelector('#test-form')
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            let fd = new FormData(form) 
            fd.append('id', '00001')
            fd.append('action', 'Update')
            const res = await fetch('/test', {method: 'POST', body: fd})
            const result = await res.json();
            console.log(result)
        })
    }
})