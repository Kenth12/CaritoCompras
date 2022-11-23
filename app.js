const productos = document.getElementById('productos');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const fragment  = document.createDocumentFragment();
const templateProducto = document.getElementById('template-producto').content;
const templateItem = document.getElementById('template-items').content;
const templateFooter = document.getElementById('template-footer').content;

let Carrito={};

document.addEventListener('DOMContentLoaded', e=>{fetchData()});

productos.addEventListener('click',e=>{
    AgregarCarrito(e)
});

items.addEventListener('click',e=>{
    BtnAgregarYBorras(e)
});



const fetchData = async () => {
    const res = await fetch('api.json');
    const results = await res.json();
    PintarCards(results);
}

const PintarCards = results =>{
//console.log(results);
    results.forEach(result => {
    templateProducto.querySelector('h5').textContent=result.name;
    templateProducto.getElementById('status').textContent=result.status;
    templateProducto.getElementById('species').textContent=result.species;
    templateProducto.getElementById('type').textContent=result.type;
    templateProducto.getElementById('gender').textContent=result.gender;
    templateProducto.getElementById('episodios').textContent=result.episodios;
    templateProducto.getElementById('temporadas').textContent=result.temporadas;
    templateProducto.getElementById('span').textContent=result.precio;
    templateProducto.querySelector('img').setAttribute("src", result.image);
    templateProducto.querySelector('#button').dataset.id=result.id;
    //templateProducto.querySelector('#button2').dataset.id=result.id;
    const clone = templateProducto.cloneNode(true);
    fragment.appendChild(clone);

});
productos.appendChild(fragment);
}

const AgregarCarrito = e => {
    if(e.target.classList.contains("btn-dark")){
        llenarCarrito(e.target.parentElement);
    }else{
        e.stopPropagation();
    }
    //console.log(e.target.parentElement);
    //llenarCarrito(e.target.parentElement);
}

const llenarCarrito = item => {
    //console.log(item);
    const producto = {
        id: item.querySelector('#button').dataset.id,
        titulo: item.querySelector('h5').textContent,
        status: item.querySelector('#status').textContent,
        species: item.querySelector('#species').textContent,
        type: item.querySelector('#type').textContent,
        gender: item.querySelector('#gender').textContent,
        episodios: item.querySelector('#episodios').textContent,
        temporadas: item.querySelector('#temporadas').textContent,
        precio: item.querySelector('#span').textContent,
        cantidad: 1
    }
    if(Carrito.hasOwnProperty(producto.id)){
        producto.cantidad = Carrito[producto.id].cantidad + 1;
    }
        console.log(producto);
        Carrito[producto.id] = {...producto};
        console.log(Carrito);
        pintarCarrito();
}

const pintarCarrito = () =>{
   items.innerHTML='';
    Object.values(Carrito).forEach(producto =>{
        templateItem.querySelector('th').textContent=producto.id;
        templateItem.querySelectorAll('td')[0].textContent=producto.titulo;
        templateItem.querySelectorAll('td')[1].textContent=producto.status;
        templateItem.querySelectorAll('td')[2].textContent=producto.species;
        templateItem.querySelectorAll('td')[3].textContent=producto.type;
        templateItem.querySelectorAll('td')[4].textContent=producto.gender;
        templateItem.querySelectorAll('td')[5].textContent=producto.episodios;
        templateItem.querySelectorAll('td')[6].textContent=producto.temporadas;
        templateItem.querySelectorAll('td')[7].textContent=producto.cantidad;
        templateItem.querySelectorAll("span")[0].textContent=(producto.precio * producto.cantidad);
        templateItem.querySelector('.btn-info').dataset.id=producto.id;
        templateItem.querySelector('.btn-danger').dataset.id=producto.id;

        const clone = templateItem.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
}

const pintarFooter = ()=>{
    footer.innerHTML='';
    if (Object.values(Carrito).length === 0) {
        footer.innerHTML=`<th scope="row" colspan="5">No hay elementos en la compra</th>`;
        return;
    }
    const CantidadItem = Object.values(Carrito).reduce((acc,{cantidad})=> acc + cantidad,0);
    const ValorTotal = Object.values(Carrito).reduce((acc,{cantidad,precio})=> acc + cantidad*precio,0);
    console.log(ValorTotal);
    templateFooter.querySelectorAll('td')[0].textContent=CantidadItem;
    templateFooter.querySelectorAll("span")[0].textContent=ValorTotal;
    
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const boton = document.getElementById('vaciar');
    boton.addEventListener('click', () => {
        Carrito={};
        pintarCarrito();
    });

}

const BtnAgregarYBorras = e=>{
    if(e.target.classList.contains('btn-info')){
        console.log(e.target);
        //[Carrito.target.dataset.id];
        const producto = Carrito[e.target.dataset.id];
        producto.cantidad = Carrito[e.target.dataset.id].cantidad + 1;
        Carrito[e.target.dataset.id] = {...producto};
        pintarCarrito();
    }
    if(e.target.classList.contains('btn-danger')){
        console.log(e.target);
        //[Carrito.target.dataset.id];
        const producto = Carrito[e.target.dataset.id];
        producto.cantidad = Carrito[e.target.dataset.id].cantidad - 1;
        if(producto.cantidad<=0){
            delete Carrito[e.target.dataset.id];
            pintarCarrito();
        }else{
            Carrito[e.target.dataset.id] = {...producto};
            pintarCarrito();
        }
    }
}