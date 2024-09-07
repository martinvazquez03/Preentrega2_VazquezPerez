const carrito = JSON.parse(localStorage.getItem("carrito")) || []

const recomendaciones_carrito = document.querySelector(".recomendaciones-carrito")
const recomendados_carrito = document.querySelector(".recomendados-carrito")
const carrito_vacio = document.querySelector("#carrito-vacio")
const agregados_carrito = document.querySelector("#agregados-carrito")
const total_carrito = document.querySelector(".total-carrito")
const productos_detail = document.querySelector(".contenedor-producto-detail")
const mostrar_cerrar_carrito = document.querySelector(".carrito-blur")
const boton_cerrar = document.querySelector(".boton-cerrar")
const boton_abrir = document.querySelector(".abrir-carrito")
const boton_comprar = document.querySelector(".boton-comprar")

mostrar_cerrar_carrito.classList.remove("mostrar-carrito")

total_carrito.innerHTML = `<h4>Total: $0</h4>`

// ---------------------------------------------------------------------------------------------------------

fetch("Productos.json")
    .then((resp) => resp.json())
    .then((resp) => {
        mostrar_recomendados(resp)
    });
    
function mostrar_recomendados(productos) {
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
}

// ---------------------------------------------------------------------------------------------------------

fetch("Productos-detail.json")
    .then((resp) => resp.json())
    .then((resp) => {
        mostrar_productos_detail(resp)
    });
    
function mostrar_productos_detail(productosDetail) {
    productosDetail.forEach((producto) => {
        let div = document.createElement("div")
        div.classList.add("producto-detail")
        div.innerHTML = `
            <div class="container-remeras">
                <img class="remeras" src="${producto.img}" alt="">
            </div>
            <h4>titulo: ${producto.nombre}</h4>
        
            <div class="producto-detail-footer">
                <span>precio: $${producto.precio}</span>
            </div>
        `
    
        let boton = document.createElement("button")
        boton.classList.add("agregar-sacar")
        boton.innerHTML = `<i class="fa-solid fa-plus"></i>`
        boton.addEventListener("click", () => {
            agregar_al_carrito(producto)
            checkeo_carrito()
        })
    
        div.append(boton)
    
        productos_detail.append(div)
    })
}

// ---------------------------------------------------------------------------------------------------------

const agregar_al_carrito = (producto) => {

    if (producto.stock == 0) {
        Swal.fire({
            title: "Error al agregar a tu carrito.",
            text: "Lo sentimos, no contamos con stock de este producto actualmente.",
            allowEscapeKey : true,
            color: "#222222;",
            icon:"error",
            iconColor : "#a52a2a",
            footer : "<p>Intentelo de nuevo en otro momento.</p>",
            showConfirmButton : false,
            showCloseButton : true,
            position : "center"
        })
    }else {
        Toastify({
            text: "Agregado al carrito",
            className: "tostada",
            duration: 2500,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
            background: "#a52a2a",
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

// ---------------------------------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------------------

function quitar_del_carrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id)
    if (producto.cantidad > 1) {
        producto.cantidad--
    } else {
        carrito.splice(indice,1)
    }
    

    Toastify({
        text: "Eliminado del carrito",
        className: "tostada",
        duration: 2500,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
        background: "#a52a2a",
        color: "#fff",
        },
        onClick: function(){}
    }).showToast();

    checkeo_carrito()
}
// ---------------------------------------------------------------------------------------------------------
function suma_total() {
    const total = carrito.reduce((acc,prod) => acc + (prod.precio * prod.cantidad), 0)
    total_carrito.innerHTML = `<h4>Total: $${total}</h4>` 
}

// ---------------------------------------------------------------------------------------------------------

boton_cerrar.addEventListener("click", () =>{
    mostrar_cerrar_carrito.classList.remove("mostrar-carrito")
})

// ---------------------------------------------------------------------------------------------------------

boton_abrir.addEventListener("click", () =>{
    mostrar_cerrar_carrito.classList.add("mostrar-carrito")
})

boton_comprar.addEventListener("click", () =>{
    if (carrito.length === 0){
        Swal.fire({
            icon: "error",
            title: "Carrito vacio.",
            text: "Tiene que agregar al menos un elemento para proceder con la compra.",
            showCloseButton : true,
            showConfirmButton: false,
        })
    }else{
        Swal.fire({
            title: "Pasar a pagar.",
            text: "Por favor ingrese su informacion de contacto, a la brevedad nos pondremos en contacto con usted para que pueda efectuar el pago.",
            inputLabel: "Numero de celular",
            input: "number",
            inputValidator: (value) => {
                if (!value) {
                return "No puedes dejar este campo vacio!";
                }
            },
            color: "#222222;",
            showConfirmButton : true,
            confirmButtonText: "Comprar",
            showDenyButton: true,
            denyButtonText: "cancelar",
            position : "center"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Perfecto!",
                    text: "Su informacion ha sido ingresada con exito! Nos pondremos en contacto lo antes posible.",
                    icon: "success" ,
                    color: "#222222;",
                    showConfirmButton : false,
                    footer: "Gracias por visitar nuestro sitio!",
                    showCloseButton: true,
                    position : "center"
                })
                carrito.length = 0;
                checkeo_carrito()
            }
        })
    }
})

