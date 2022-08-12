import { Component, OnInit, Input, NgModule, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sm-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input("parent") _parent: any;
  @Input("nodes") _nodes: any[];
  @Input("field") field: string;
  @Input("label") label: string;
  @Input("expanded") expanded: boolean;

  @Input("single") single: boolean;

  /**
   * Para saber cual es el nodo raiz se carga por defecto isRoot como true, y 
   * en la plantilla, el componente hijo (tree) se marca con atributo isRoot = false
   */
  @Input("isRoot") isRoot = true;

  /**
   * El evento permite notificar recursivamente al componente raiz en que momento
   * se debe realizar limpieza de los items seleccionados
   */
  @Output("onClear") onClear = new EventEmitter();

  constructor() { }

  ngOnInit() {

    if (this._nodes != null) {
      this._nodes.forEach(
        node => {
          node['parent'] = this._parent;
          //node['expanded'] = this.expanded === true;
        }
      );
    }

  }

  toggle(node: any) {
    node['expanded'] = !node['expanded'];
  }

  toggleSelect(node: any) {
    if (node['selected'] == null) {
      node['selected'] = false
    }
    if (this.single == true) {
      this.clearSelect();
    }
    node['selected'] = !node['selected'];
  }

  clearSelect() {
    if (this.isRoot == true) {
      this.clearNodes(this._nodes);
    }
    this.onClear.emit();
  }

  clearNodes(nodes: any[]) {
    nodes.forEach(node => {
      node['selected'] = false;
      if (node[this.field] != null)
        this.clearNodes(node[this.field]);
    });
  }

  get nodes() {
    return this._nodes;
  }
  set nodes(nodes: any[]) {
    this._nodes = nodes;
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [TreeComponent],
  declarations: [TreeComponent]
})
export class TreeModule { }