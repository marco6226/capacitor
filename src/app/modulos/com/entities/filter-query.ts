import { Filter } from './filter'
import { Criteria } from './filter'

export class FilterQuery {
  offset: number;
  rows: number;
  sortField: string;
  sortOrder: number;
  count: boolean;
  filterList: Filter[];
  fieldList: string[];

  static filtersToArray(filters: any): Array<Filter> {
    let filterArray = [];
    for (var fieldName in filters) {
      let filter = new Filter();
      filter.field = fieldName;
      filter.value1 = filters[fieldName].value;
      switch (filters[fieldName].matchMode) {
        case 'contains':
        default:
          filter.criteria = Criteria.LIKE;
          filter.value1 = '%' + filters[fieldName].value + '%';
          break
      }
      filterArray.push(filter);
    }
    return filterArray;
  }

  static dtoToObject(dto: any) {
    let object: any = {};
    for (var field in dto) {
      this.recursiveObjectBuild(field, object, field, dto);
    }
    return object;
  }

  private static recursiveObjectBuild(field: string, object: any, field_data: string, data: any) {
    if (field.indexOf('_') == -1) {
      object[field] = data[field_data];
    } else {
      let parentField = field.substring(0, field.indexOf('_'));
      let childField = field.substring(field.indexOf('_') + 1, field.length);
      object[parentField] = object[parentField] == null ? {} : object[parentField];
      this.recursiveObjectBuild(childField, object[parentField], field_data, data);
    }
  }
}
