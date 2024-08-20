const carrito = JSON.parse(localStorage.getItem("carrito")) || []

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
    <span>${producto.nombre}</span> <strong>|</strong> <p> $${producto.precio}</p>
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
        Swal.fire({
            title: "Error al agregar a tu carrito.",
            text: "Lo sentimos, no contamos con stock de este producto actualmente.",
            color: "#38598b",
            icon:"error",
            iconColor : "#add8e6",
            footer : "<p>Intentelo de nuevo en otro momento.</p>",
            showConfirmButton : false,
            showCloseButton : true,
            position : "center"
        })
    }else {
        Toastify({
            text: "Agregado al carrito",
            duration: 1500,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
            background: "#38598b",
            color: "#fff",
            },
            onClick: function(){}
        }).showToast();

        let agregadoAlCarrito = carrito.find((item) => item.id === producto.id)
        if (agregadoAlCarrito){
            agregadoAlCarrito.cantidad++
        } else {
            carrito.push({...producto, cantidad: 1})
        }
    }
    checkeo_carrito()
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
            <span>${producto.nombre}</span> 
            <strong>|</strong> 
            <span> Cantidad: ${producto.cantidad}</span> 
            <strong>|</strong>
            <p> $${producto.precio}</p>
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

    localStorage.setItem("carrito", JSON.stringify(carrito))
}
checkeo_carrito()

function quitar_del_carrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id)
    if (producto.cantidad > 1) {
        producto.cantidad--
    } else {
        carrito.splice(indice,1)
    }
    

    Toastify({
        text: "Eliminado del carrito",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
        background: "#38598b",
        color: "#fff",
        },
        onClick: function(){}
    }).showToast();

    checkeo_carrito()
}


function suma_total() {
    const total = carrito.reduce((acc,prod) => acc + (prod.precio * prod.cantidad), 0)
    total_carrito.innerHTML = `<h4>Total: $${total}</h4>` 
}