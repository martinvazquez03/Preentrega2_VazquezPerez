const carrito = []

const productos = [
    {
        id : "Vin-Crüe",
        nombre : "Vinilo 'Motley Crüe'",
        precio : 15000,
        stock : 117
    },
    {
        id : "Vin-Floyd",
        nombre : "Vinilo 'Pink Floyd'",
        precio : 17000,
        stock : 0
    },
    {
        id : "Vin-Pant",
        nombre : "Vinilo 'Pantera'",
        precio : 14000,
        stock : 53
    }
]

const recomendaciones_carrito = document.querySelector(".recomendaciones-carrito")
const recomendados_carrito = document.querySelector(".recomendados-carrito")
const carrito_vacio = document.querySelector("#carrito-vacio")
const agregados_carrito = document.querySelector("#agregados-carrito")
const total_carrito = document.querySelector(".total-carrito")

total_carrito.innerHTML = `<h4>Total: $0</h4>`


productos.forEach((producto) => {
    let div = document.createElement("div")
    div.classList.add("producto")
    div.innerHTML = `
    <span>${producto.nombre}</span> <p> $${producto.precio}</p>
    `

    let boton = document.createElement("button")
    boton.classList.add("agregar-sacar")
    boton.innerHTML = `<i class="fa-solid fa-plus"></i>`
    boton.addEventListener("click", () => {
        agregar_al_carrito(producto)
        checkeo_carrito()
    })

    div.append(boton)

    recomendaciones_carrito.append(div)
})

const agregar_al_carrito = (producto) => {
    if (producto.stock == 0) {
        alert("Sin disponibilidad de producto debido a falta de stock.")
    }else {
        carrito.push(producto)
    }
}


function checkeo_carrito() {
    if (carrito.length === 0){
        agregados_carrito.classList.add("d-none")
        carrito_vacio.classList.remove("d-none")
        agregados_carrito.innerHTML = ""
    }else {
        agregados_carrito.classList.remove("d-none")
        carrito_vacio.classList.add("d-none")


        agregados_carrito.innerHTML = ""
        carrito.forEach((producto) => {
            let div = document.createElement("div")
            div.classList.add("producto")
            div.innerHTML = `
            <span>${producto.nombre}</span> <p> $${producto.precio}</p>
            `
        
            let boton = document.createElement("button")
            boton.classList.add("agregar-sacar")
            boton.innerHTML = `<i class="fa-solid fa-minus"></i>`
            boton.addEventListener("click", () => {
                quitar_del_carrito(producto)
            })
        
            div.append(boton)
        
            agregados_carrito.append(div)
        })
    }
    suma_total()
}

function quitar_del_carrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id)
    carrito.splice(indice,1)
    checkeo_carrito()
}


function suma_total() {
    const total = carrito.reduce((acc,prod) => acc + prod.precio, 0)
    total_carrito.innerHTML = `<h4>Total: $${total}</h4>` 
}