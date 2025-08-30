document.addEventListener('DOMContentLoaded', ()=>{
    const file = document.querySelector('#file')
    if(file) {
        file.addEventListener('change', function(){
            if(this.files[0]) {
                const img = document.querySelector('.img-preview')
                const url = URL.createObjectURL(this.files[0])
                img.src = url
            }
        })
    }
})