
export class Filter {
    field?: string;
    value1?: string;
    value2?: string;
    criteria: Criteria;
    isExpression?:Boolean;
  }
  
  export enum Criteria {
    EQUALS = <any>'eq',
    NOT_EQUALS = <any>"ne",
    CONTAINS = <any>"ct",
    NOT_CONTAINS = <any>"nc",
    GREATER_THAN = <any>"gt",
    LOWER_THAN = <any>"lt",
    LOWER_EQUALS = <any>"le",
    GREATER_EQUALS = <any>"ge",
    BETWEEN = <any>"bt",
    IS_NULL = <any>"isn",
    IS_NOT_NULL = <any>"isnn",
    LIKE = <any>"lk",
  }
  
  export enum LogicOperation {
    AND = <any>'and',
    OR = <any>"or",
  }