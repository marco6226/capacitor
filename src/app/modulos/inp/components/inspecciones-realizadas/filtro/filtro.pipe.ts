import { Programacion } from './../../../entities/programacion';
import { ListaInspeccion } from './../../../entities/lista-inspeccion';
import { Pipe, PipeTransform } from '@angular/core';
import { Inspeccion } from '../../../entities/inspeccion';

@Pipe({
  name: 'filtroProg'
})
export class FiltroPipeInspecciones implements PipeTransform {

  transform(arreglo: Inspeccion[], id: string, usuarioRealiza: string, fechaDesde: Date, fechaHasta: Date, ubicacion: string): any[] {

   try {

    let lista = arreglo;

    if(id != '' && id != undefined){
      lista = lista.filter(item=>{
        return item.id.toString().includes(id)
      })  
      
    }

    if(usuarioRealiza != '' && usuarioRealiza != undefined){
      lista = lista.filter(item=>{
        if(item.usuarioRegistra!=null){
          return item.usuarioRegistra.email.toLowerCase().includes(usuarioRealiza)
        }
      })  
      
    }
    if(fechaDesde<=fechaHasta){
      lista = lista.filter(x=>{return  new Date(x.fechaRealizada) >= new Date(fechaDesde) && new Date(x.fechaRealizada) <= new Date(fechaHasta)});
    }

    if(ubicacion != '' && ubicacion != undefined){
      lista = lista.filter(item=>{
        if(item.area.nombre!=null){
          return item.area.nombre.includes(ubicacion)
        }
      }) 
    }
    return lista;

    
   } catch (error) {
    console.log(error)
   }
  }

}

@Pipe({
  name: 'filtroLista'
})
export class FiltroPipeInspeccionesLista implements PipeTransform {

  transform(arreglo: ListaInspeccion[], codigo: string, nombre: string, descripcion: string): any[] {

   try {

    let lista = arreglo;

    if(codigo != '' && codigo != undefined){
      lista = lista.filter(item=>{
        if(item.codigo!=null){
          return item.codigo.toLowerCase().includes(codigo.toLowerCase())
        }
      })  
      
    }

    if(nombre != '' && nombre != undefined){
      lista = lista.filter(item=>{
        if(item.nombre!=null){
          return item.nombre.toLowerCase().includes(nombre.toLowerCase())
        }
      })  
      
    }

    if(descripcion != '' && descripcion != undefined){
      lista = lista.filter(item=>{
        if(item.descripcion!=null){
          return item.descripcion.toLowerCase().includes(descripcion.toLowerCase())
        }
      })  
      
    }
   

    return lista;

    
   } catch (error) {
    console.log(error)
   }
  }

}

@Pipe({
  name: 'filtroListaProgr'
})
export class FiltroPipeInspeccionesListaProg implements PipeTransform {
  
  transform(arreglo: Programacion[], fechaDesde: Date, fechaHasta: Date, nombre: string, ubicacion: string): any[] {

    try {
 
     let lista = arreglo;
 
     if(nombre != '' && nombre != undefined){
       lista = lista.filter(item=>{
         if(item.listaInspeccion.nombre!=null){
           return item.listaInspeccion.nombre.toLowerCase().includes(nombre)
         }
       })  
       
     }
     if(fechaDesde<=fechaHasta){
       lista = lista.filter(x=>{return  new Date(x.fecha) >= new Date(fechaDesde) && new Date(x.fecha) <= new Date(fechaHasta)});
     }
 
     if(ubicacion != '' && ubicacion != undefined){
       lista = lista.filter(item=>{
         if(item.area.nombre!=null){
           return item.area.nombre.includes(ubicacion)
         }
       }) 
     }
     return lista;
 
     
    } catch (error) {
     console.log(error)
    }
   }
}